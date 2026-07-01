/**
 * Refresh Playwright storageState (session cookies + localStorage) for Didaxis.
 * Writes playwright/.auth/user.json — shared by Playwright tests and Browser MCP explore.
 *
 * Usage: npm run auth:refresh
 */
require('./set-playwright-browsers-path');

import dotenv from 'dotenv';
import { chromium } from '@playwright/test';
import {
  getBaseUrl,
  isSessionValid,
  loadSession,
  loginAndSaveSession,
  SESSION_FILE,
  sessionExpiresAt,
} from '../lib/didaxis-auth';

dotenv.config();

async function main(): Promise<void> {
  const force = process.argv.includes('--force');
  const existing = loadSession();

  if (!force && existing && isSessionValid()) {
    const expires = sessionExpiresAt(existing)?.toISOString() ?? 'unknown';
    console.log(`Session still valid until ${expires}`);
    console.log(`File: ${SESSION_FILE}`);
    return;
  }

  const baseURL = getBaseUrl();
  console.log(`Refreshing Didaxis session at ${baseURL}...`);

  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({ baseURL });
    const page = await context.newPage();
    await loginAndSaveSession(page);
    console.log(`Session saved to ${SESSION_FILE}`);
    const expires = sessionExpiresAt()?.toISOString() ?? 'unknown';
    console.log(`Refresh token valid until ${expires}`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
