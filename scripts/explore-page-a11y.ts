/**
 * Read-only Programs page exploration using Playwright storageState session.
 * Usage: npx tsx scripts/explore-page-a11y.ts [/programs]
 */
require('./set-playwright-browsers-path');

import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { chromium } from '@playwright/test';
import { getBaseUrl, isSessionValid, SESSION_FILE } from '../lib/didaxis-auth';

dotenv.config();

async function main(): Promise<void> {
  const route = process.argv[2] ?? '/programs';
  if (!fs.existsSync(SESSION_FILE) || !isSessionValid()) {
    throw new Error('Session missing or expired. Run: npm run auth:refresh');
  }

  const baseURL = getBaseUrl();
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await browser.newContext({
      baseURL,
      storageState: SESSION_FILE,
    });
    const page = await context.newPage();
    await page.goto(route);
    await page.waitForLoadState('networkidle');

    const url = page.url();
    if (url.includes('/login')) {
      throw new Error('Session not accepted by app — run: npm run auth:refresh -- --force');
    }

    const snapshot = await page.locator('body').ariaSnapshot();
    const buttons = await page.getByRole('button').allTextContents();
    const headings = await page.getByRole('heading').allTextContents();
    const links = await page.getByRole('link').allTextContents();
    const rowCount = await page.getByRole('row').count();

    let selection: Record<string, unknown> | undefined;
    if (process.argv.includes('--select-first-row')) {
      const firstRow = page.getByRole('row').filter({ hasNot: page.getByRole('columnheader') }).first();
      const programName = (await firstRow.getByRole('cell').first().innerText()).trim();
      await firstRow.click();
      await page.getByText('Select a program to manage semesters').waitFor({ state: 'hidden', timeout: 10_000 }).catch(() => undefined);
      selection = {
        programName,
        detailHeadings: (await page.getByRole('heading', { level: 4 }).allTextContents()).map((t) => t.trim()).filter(Boolean),
        semesterPanelVisible: await page.getByText('Semesters & scheduling config').isVisible().catch(() => false),
        semesterButtons: (await page.getByRole('button').allTextContents())
          .map((t) => t.trim())
          .filter((t) => /semester|manage courses/i.test(t)),
      };
    }

    const fullSnapshot = process.argv.includes('--full');
    const output = {
      url,
      route,
      sessionFile: path.relative(process.cwd(), SESSION_FILE),
      headings: headings.map((t) => t.trim()).filter(Boolean),
      buttons: buttons.map((t) => t.trim()).filter(Boolean),
      links: links.map((t) => t.trim()).filter(Boolean).slice(0, 30),
      tableRowCount: rowCount,
      ...(selection ? { selection } : {}),
      ...(fullSnapshot ? { ariaSnapshot: snapshot } : {}),
    };

    process.stdout.write(`${JSON.stringify(output, null, 2)}\n`);
  } finally {
    await browser.close();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
