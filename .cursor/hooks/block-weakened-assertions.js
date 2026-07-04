#!/usr/bin/env node
'use strict';

const fs = require('fs');

const REFUSAL =
  'Per @playwright-convention Refusals and @qa-mission: do not weaken or delete assertions to pass. Heal locators in POMs only.';

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

function isTestFile(filePath) {
  return /(?:^|[/\\])tests[/\\]/.test(filePath) && /\.(spec|test)\.[jt]sx?$/.test(filePath);
}

function stripBlockComments(content) {
  return content.replace(/\/\*[\s\S]*?\*\//g, '');
}

function countActiveExpectCalls(content) {
  let count = 0;
  const stripped = stripBlockComments(content);

  for (const line of stripped.split('\n')) {
    if (/^\s*\/\//.test(line.trim())) {
      continue;
    }

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

function main() {
  let input;

  try {
    input = JSON.parse(readStdin());
  } catch {
    deny(
      'Assertion guard hook failed: invalid JSON on stdin.',
      'block-weakened-assertions: invalid stdin JSON (failClosed)',
    );
  }

  const filePath = input.file_path;
  if (!filePath || typeof filePath !== 'string') {
    deny(
      'Assertion guard hook failed: missing file_path in payload.',
      'block-weakened-assertions: missing file_path (failClosed)',
    );
  }

  if (!isTestFile(filePath)) {
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
      `Assertion guard hook failed: cannot read ${filePath}.`,
      `block-weakened-assertions: unreadable file (failClosed)`,
    );
  }

  const before = reconstructBefore(after, edits);
  if (before === null) {
    deny(
      'Assertion guard blocked the edit: could not reconstruct pre-edit test content.',
      'block-weakened-assertions: reconstruction failed under failClosed policy',
    );
  }

  const beforeCount = countActiveExpectCalls(before);
  const afterCount = countActiveExpectCalls(after);

  if (afterCount < beforeCount) {
    deny(
      `Refusal: edit weakened the test — active expect() count dropped (${beforeCount} → ${afterCount}) in ${filePath}. ${REFUSAL}`,
      `Assertion guard blocked save: expect() count ${beforeCount} → ${afterCount}.`,
    );
  }

  if (expectWasCommentedOut(before, after)) {
    deny(
      `Refusal: edit commented out an expect() in ${filePath}. ${REFUSAL}`,
      'Assertion guard blocked save: an expect() was commented out.',
    );
  }

  allow();
}

main();
