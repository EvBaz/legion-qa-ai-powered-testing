#!/usr/bin/env node
'use strict';

const fs = require('fs');

const REFUSAL =
  'Per @constitution WON\'T rules: fix the violation or ask the human before overriding.';

function readStdin() {
  return fs.readFileSync(0, 'utf8');
}

function deny(userMessage, agentMessage) {
  console.log(
    JSON.stringify({
      permission: 'deny',
      user_message: userMessage,
      agent_message: agentMessage ?? userMessage,
    }),
  );
  process.exit(2);
}

function allow() {
  process.exit(0);
}

function isGuardedFile(filePath) {
  return (
    (/(?:^|[/\\])tests[/\\]/.test(filePath) || /(?:^|[/\\])pages[/\\]/.test(filePath)) &&
    /\.(spec|test|setup)?\.?[jt]sx?$/.test(filePath)
  );
}

function stripBlockComments(content) {
  return content.replace(/\/\*[\s\S]*?\*\//g, '');
}

function activeLines(content) {
  return stripBlockComments(content)
    .split('\n')
    .filter((line) => !/^\s*\/\//.test(line.trim()));
}

function countMatches(content, pattern) {
  const matches = content.match(pattern);
  return matches ? matches.length : 0;
}

function countActiveExpectCalls(content) {
  let count = 0;
  for (const line of activeLines(content)) {
    const matches = line.match(/\bexpect\s*\(/g);
    if (matches) {
      count += matches.length;
    }
  }
  return count;
}

function expectWasCommentedOut(before, after) {
  const beforeLines = before.split('\n');
  const afterLines = after.split('\n');
  const lineCount = Math.max(beforeLines.length, afterLines.length);

  for (let i = 0; i < lineCount; i += 1) {
    const beforeLine = beforeLines[i] ?? '';
    const afterLine = afterLines[i] ?? '';

    const beforeActive =
      /\bexpect\s*\(/.test(beforeLine) &&
      !/^\s*\/\//.test(beforeLine.trim()) &&
      !/^\s*\/\*/.test(beforeLine.trim());

    const afterCommented =
      /^\s*\/\/\s*.*\bexpect\s*\(/.test(afterLine) ||
      /^\s*\/\*\s*.*\bexpect\s*\(/.test(afterLine);

    if (beforeActive && afterCommented) {
      return true;
    }
  }

  return false;
}

function reconstructBefore(after, edits) {
  let before = after;

  for (let i = edits.length - 1; i >= 0; i -= 1) {
    const { old_string: oldStr, new_string: newStr } = edits[i];
    if (oldStr === newStr) {
      continue;
    }

    const idx = before.indexOf(newStr);
    if (idx === -1) {
      return null;
    }

    before = before.slice(0, idx) + oldStr + before.slice(idx + newStr.length);
  }

  return before;
}

function editsText(edits) {
  return edits.map((edit) => edit.new_string ?? '').join('\n');
}

function introducedByCount(before, after, pattern) {
  return countMatches(after, pattern) > countMatches(before, pattern);
}

function introducedInEdits(edits, pattern) {
  return edits.some((edit) => pattern.test(edit.new_string ?? ''));
}

function introducedMechanical(before, after, edits, pattern) {
  return introducedByCount(before, after, pattern) || introducedInEdits(edits, pattern);
}

function findWaitForTimeoutViolation(before, after, edits) {
  const pattern = /\b(?:page\.)?waitForTimeout\s*\(/g;
  if (!introducedMechanical(before, after, edits, pattern)) {
    return null;
  }
  return 'waitForTimeout — use web-first expect() or action auto-waiting';
}

function findXPathViolation(before, after, edits) {
  const patterns = [
    /locator\s*\(\s*['"`]xpath=/gi,
    /locator\s*\(\s*['"`]\/{2}/g,
    /locator\s*\(\s*['"`]\(\/{2}/g,
  ];

  for (const pattern of patterns) {
    if (introducedMechanical(before, after, edits, pattern)) {
      return 'XPath locator — use getByRole/label/text/testid';
    }
  }

  return null;
}

function findAnyTypeViolation(before, after, edits) {
  const patterns = [
    /:\s*any\b/g,
    /\bas\s+any\b/g,
    /<\s*any\s*>/g,
    /Array<\s*any\s*>/g,
  ];

  for (const pattern of patterns) {
    if (introducedMechanical(before, after, edits, pattern)) {
      return 'TypeScript any — use proper types or unknown + narrowing';
    }
  }

  return null;
}

function isCredentialLineAllowed(line) {
  const trimmed = line.trim();
  if (!trimmed || /^\s*\/\//.test(trimmed) || /^\s*\/\*/.test(trimmed)) {
    return true;
  }
  if (/process\.env/.test(line)) {
    return true;
  }
  if (/getCredentials\s*\(/.test(line)) {
    return true;
  }
  if (/getByLabel\s*\(\s*['"]Password['"]/.test(line)) {
    return true;
  }
  if (/credentials unavailable/i.test(line)) {
    return true;
  }
  if (/DIDAXIS_(EMAIL|PASSWORD|API_TOKEN)/.test(line) && !/[:=]\s*['"][^'"]+['"]/.test(line)) {
    return true;
  }
  return false;
}

const CREDENTIAL_PATTERNS = [
  { re: /(?:password|passwd|pwd)\s*[:=]\s*['"][^'"\s]{3,}['"]/i, label: 'hardcoded password' },
  {
    re: /(?:api[_-]?key|api[_-]?token|access[_-]?token|secret|auth[_-]?token)\s*[:=]\s*['"][^'"\s]+['"]/i,
    label: 'hardcoded token/secret',
  },
  { re: /['"]Bearer\s+[A-Za-z0-9\-_]+\.[A-Za-z0-9\-_]+\./, label: 'hardcoded bearer token' },
  {
    re: /(?:email|username|user)\s*[:=]\s*['"][^'"\s]+@[^'"\s]+['"]/i,
    label: 'hardcoded email/username',
  },
];

function credentialViolations(content) {
  const hits = [];
  for (const line of activeLines(content)) {
    if (isCredentialLineAllowed(line)) {
      continue;
    }
    for (const { re, label } of CREDENTIAL_PATTERNS) {
      if (re.test(line)) {
        hits.push(label);
      }
    }
  }
  return hits;
}

function findCredentialViolation(before, after, edits) {
  const beforeHits = new Set(credentialViolations(before));
  const afterHits = credentialViolations(after);
  const editHits = credentialViolations(editsText(edits));

  const introduced = [
    ...afterHits.filter((hit) => !beforeHits.has(hit)),
    ...editHits.filter((hit) => !beforeHits.has(hit)),
  ];

  if (introduced.length === 0) {
    return null;
  }

  return `hardcoded credential (${[...new Set(introduced)].join(', ')}) — use process.env + storageState auth`;
}

function hasDescribeTag(content) {
  const re = /test\.describe\s*\(/g;
  let match;

  while ((match = re.exec(content)) !== null) {
    const chunk = content.slice(match.index, match.index + 800);
    if (/test\.describe\s*\([\s\S]*?\{[\s\S]*?\btag\s*:/.test(chunk)) {
      return true;
    }
  }

  return false;
}

function findDescribeTagViolation(before, after, edits) {
  const beforeHas = hasDescribeTag(before);
  const afterHas = hasDescribeTag(after) || hasDescribeTag(editsText(edits));

  if (!beforeHas && afterHas) {
    return 'tag on test.describe() — tag individual test() blocks only';
  }

  return null;
}

const STRATEGY_TAG_NAMES = ['smoke', 'sanity', 'regression', 'api', 'destructive'];
const STRATEGY_TAG_OPTION = /tag\s*:\s*(?:\[(.*?)\]|['"]([^'"]+)['"])/s;

function stripStringsAndComments(content) {
  return stripBlockComments(content).replace(/\/\/[^\n]*/g, '');
}

function findTestBlocks(content) {
  const blocks = [];
  const re = /\btest(?:\.(?:skip|fixme|fail))?\s*\(/g;
  let match;

  while ((match = re.exec(content)) !== null) {
    const start = match.index;
    let i = match.index + match[0].length;

    while (i < content.length && /\s/.test(content[i])) {
      i += 1;
    }

    const quote = content[i];
    if (quote !== "'" && quote !== '"' && quote !== '`') {
      continue;
    }

    i += 1;
    while (i < content.length) {
      if (content[i] === '\\') {
        i += 2;
        continue;
      }
      if (content[i] === quote) {
        i += 1;
        break;
      }
      i += 1;
    }

    let depth = 0;
    let started = false;
    const bodyStart = i;
    while (i < content.length) {
      const ch = content[i];
      if (ch === '(') {
        depth += 1;
        started = true;
      } else if (ch === ')') {
        depth -= 1;
        if (started && depth === 0) {
          i += 1;
          break;
        }
      }
      i += 1;
    }

    blocks.push(content.slice(start, i));
  }

  return blocks;
}

function strategyTagsInBlock(block) {
  const tags = new Set();
  const match = block.match(STRATEGY_TAG_OPTION);
  if (!match) {
    return [];
  }

  const tagSource = match[1] ?? match[2] ?? '';
  for (const name of STRATEGY_TAG_NAMES) {
    if (new RegExp(`@${name}\\b`).test(tagSource)) {
      tags.add(`@${name}`);
    }
  }

  if (/@e2e\b/.test(tagSource)) {
    tags.add('@e2e');
  }

  return [...tags];
}

function hasRevertHook(content) {
  const cleaned = stripStringsAndComments(content);
  return (
    /\btest\.(?:afterEach|afterAll)\s*\(/.test(cleaned) &&
    /\brevert[A-Za-z]*\s*\(/.test(cleaned)
  );
}

function findStrategyTagViolations(content) {
  const violations = [];
  const blocks = findTestBlocks(content);

  for (const block of blocks) {
    const tags = strategyTagsInBlock(block);
    if (tags.length === 0) {
      violations.push('missing strategy tag — include @regression on every test()');
    } else if (!tags.includes('@regression')) {
      violations.push('missing @regression — every test belongs to the regression suite');
    } else if (tags.includes('@e2e')) {
      violations.push('@e2e is removed — use @regression plus @smoke or @sanity when needed');
    }
  }

  if (blocks.some((block) => strategyTagsInBlock(block).includes('@destructive')) && !hasRevertHook(content)) {
    violations.push('@destructive test requires test.afterEach/afterAll revert hook');
  }

  return violations;
}

function findStrategyTagViolation(before, after, edits) {
  const beforeViolations = new Set(findStrategyTagViolations(before));
  const afterViolations = findStrategyTagViolations(after);
  const editViolations = findStrategyTagViolations(editsText(edits));

  const introduced = [
    ...afterViolations.filter((v) => !beforeViolations.has(v)),
    ...editViolations.filter((v) => !beforeViolations.has(v)),
  ];

  if (introduced.length === 0) {
    return null;
  }

  return [...new Set(introduced)].join('; ');
}

function findWeakenedExpectViolation(before, after) {
  const beforeCount = countActiveExpectCalls(before);
  const afterCount = countActiveExpectCalls(after);

  if (afterCount < beforeCount) {
    return `weakened expect() — active count dropped (${beforeCount} → ${afterCount})`;
  }

  if (expectWasCommentedOut(before, after)) {
    return 'weakened expect() — an expect() was commented out';
  }

  return null;
}

function scanViolations(before, after, edits) {
  const checks = [
    findWaitForTimeoutViolation,
    findXPathViolation,
    findAnyTypeViolation,
    findCredentialViolation,
    findDescribeTagViolation,
    findStrategyTagViolation,
  ];

  const violations = [];
  for (const check of checks) {
    const result = check(before, after, edits);
    if (result) {
      violations.push(result);
    }
  }

  const weakened = findWeakenedExpectViolation(before, after);
  if (weakened) {
    violations.push(weakened);
  }

  return violations;
}

function main() {
  let input;

  try {
    input = JSON.parse(readStdin());
  } catch {
    deny(
      'Constitution guard failed: invalid JSON on stdin.',
      'guard-constitution: invalid stdin JSON (failClosed)',
    );
  }

  const filePath = input.file_path;
  if (!filePath || typeof filePath !== 'string') {
    deny(
      'Constitution guard failed: missing file_path in payload.',
      'guard-constitution: missing file_path (failClosed)',
    );
  }

  if (!isGuardedFile(filePath)) {
    allow();
  }

  const edits = Array.isArray(input.edits) ? input.edits : [];
  if (edits.length === 0) {
    allow();
  }

  let after;
  try {
    after = fs.readFileSync(filePath, 'utf8');
  } catch {
    deny(
      `Constitution guard failed: cannot read ${filePath}.`,
      'guard-constitution: unreadable file (failClosed)',
    );
  }

  const before = reconstructBefore(after, edits);
  if (before === null) {
    deny(
      'Constitution guard blocked the edit: could not reconstruct pre-edit content.',
      'guard-constitution: reconstruction failed under failClosed policy',
    );
  }

  const violations = scanViolations(before, after, edits);
  if (violations.length > 0) {
    deny(
      `Refusal: edit violates @constitution WON'T rules in ${filePath}: ${violations.join('; ')}. ${REFUSAL}`,
      `Constitution guard blocked save: ${violations.join('; ')}`,
    );
  }

  allow();
}

main();
