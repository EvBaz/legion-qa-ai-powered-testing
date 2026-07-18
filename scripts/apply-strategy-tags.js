#!/usr/bin/env node
'use strict';

const fs = require('fs');
const path = require('path');

const SPEC_DIR = path.join(__dirname, '..', 'tests');

/**
 * Risk-based slice tags. Every test always includes @regression.
 * See .cursor/rules/playwright-convention.mdc § "Smoke & sanity scope".
 */
const SMOKE_TCS = {
  'ds1-create-program.spec.ts': new Set(['TC-002']),
  'ds2-edit-program.spec.ts': new Set(['TC-002']),
  'ds4-delete-program.spec.ts': new Set(['TC-001']),
  'ds5-program-list-display.spec.ts': new Set(['TC-001']),
};

const SANITY_TCS = {
  'ds1-create-program.spec.ts': new Set(['TC-001', 'TC-002', 'TC-005']),
  'ds2-edit-program.spec.ts': new Set(['TC-001', 'TC-002', 'TC-003']),
  'ds3-program-name-validation.spec.ts': new Set(['TC-005']),
  'ds4-delete-program.spec.ts': new Set(['TC-001', 'TC-002']),
  'ds5-program-list-display.spec.ts': new Set(['TC-001', 'TC-002', 'TC-004', 'TC-007', 'TC-010']),
};

const API_TCS = {
  'cleanup-programs.spec.ts': new Set(['Cleanup']),
};

const TEST_HEAD =
  /(\btest(?:\.skip)?\s*\(\s*(['"`])([\s\S]*?)\2)\s*(?:,\s*\{\s*tag\s*:\s*(?:'[^']*'|\[[^\]]*\])\s*\})?\s*,\s*/g;

function tcId(title) {
  const match = title.match(/^(TC-\d+|Cleanup):/);
  return match ? match[1] : null;
}

function lookupKey(title) {
  return title.startsWith('Cleanup:') ? 'Cleanup' : tcId(title);
}

function tagsForTitle(basename, title) {
  const tags = ['@regression'];
  const key = lookupKey(title);
  if (!key) {
    return tags;
  }

  if (SMOKE_TCS[basename]?.has(key)) {
    tags.push('@smoke');
  }
  if (SANITY_TCS[basename]?.has(key)) {
    tags.push('@sanity');
  }
  if (API_TCS[basename]?.has(key)) {
    tags.push('@api');
  }

  return tags;
}

function formatTagOption(tags) {
  if (tags.length === 1) {
    return `{ tag: '${tags[0]}' }`;
  }
  return `{ tag: [${tags.map((tag) => `'${tag}'`).join(', ')}] }`;
}

function retagContent(content, basename) {
  return content.replace(TEST_HEAD, (full, head, quote, title) => {
    const tags = tagsForTitle(basename, title);
    return `${head}, ${formatTagOption(tags)}, `;
  });
}

for (const file of fs.readdirSync(SPEC_DIR)) {
  if (!file.endsWith('.spec.ts')) {
    continue;
  }

  const filePath = path.join(SPEC_DIR, file);
  const original = fs.readFileSync(filePath, 'utf8');
  const updated = retagContent(original, file);

  if (updated !== original) {
    fs.writeFileSync(filePath, updated);
    console.log(`Retagged ${file}`);
  }
}
