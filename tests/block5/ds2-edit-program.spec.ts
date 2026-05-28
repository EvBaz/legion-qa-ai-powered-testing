import { test, expect } from '../../fixtures/cleanup.fixture';
import type { Page } from '@playwright/test';

const LOGIN_URL = '/login';
const PROGRAMS_URL = '/programs';

async function login(page: Page) {
  await page.goto(LOGIN_URL);
  await page.getByLabel('Email').fill(process.env.DIDAXIS_EMAIL!);
  await page.getByLabel('Password').fill(process.env.DIDAXIS_PASSWORD!);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15000 });
}

function getEditDialog(page: Page) {
  return page.getByRole('dialog', { name: 'Edit Program' });
}

function getNewProgramDialog(page: Page) {
  return page.getByRole('dialog', { name: 'New Program' });
}

function uniqueName(base: string): string {
  return `${base} ${Date.now()}`;
}

function programRow(page: Page, name: string) {
  return page.getByRole('row', { name: new RegExp(name) });
}

async function createProgram(page: Page, name: string, description: string) {
  await page.goto(PROGRAMS_URL);
  await page.getByRole('button', { name: '+ New Program' }).click();
  const dialog = getNewProgramDialog(page);
  await dialog.getByLabel('Program Name').fill(name);
  if (description) {
    await dialog.getByLabel('Description').fill(description);
  }
  await dialog.getByRole('button', { name: 'Create' }).click();
  await expect(dialog).toBeHidden({ timeout: 10000 });
  await expect(programRow(page, name)).toBeVisible({ timeout: 10000 });
}

async function openEditModal(page: Page, programName: string) {
  await page.goto(PROGRAMS_URL);
  const row = programRow(page, programName);
  await expect(row).toBeVisible({ timeout: 10000 });
  await row.getByRole('button', { name: '✏️' }).click();
  await expect(getEditDialog(page)).toBeVisible();
}

// --- 1. Positive Flows ---

test.describe('Positive Flows', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('TC-001: Edit form displays current program name and description', async ({ page }) => {
    const programName = uniqueName('YB Web Development 2026');
    const description = 'Full-stack web development program';

    await createProgram(page, programName, description);
    await openEditModal(page, programName);

    const dialog = getEditDialog(page);
    await expect(dialog.getByLabel('Program Name')).toHaveValue(programName);
    await expect(dialog.getByLabel('Description')).toHaveValue(description);
    await expect(dialog.getByRole('button', { name: 'Save' })).toBeVisible();
  });

  test('TC-002: Updated program name is saved and reflected in the list immediately', async ({ page }) => {
    const programName = uniqueName('YB Web Development 2026');
    const updatedName = `${programName} - Updated`;

    await createProgram(page, programName, 'Full-stack web development program');
    await openEditModal(page, programName);

    const dialog = getEditDialog(page);
    await dialog.getByLabel('Program Name').clear();
    await dialog.getByLabel('Program Name').fill(updatedName);
    await dialog.getByRole('button', { name: 'Save' }).click();

    await expect(dialog).toBeHidden({ timeout: 10000 });
    await expect(programRow(page, updatedName)).toBeVisible({ timeout: 10000 });
    await expect(programRow(page, programName)).toBeHidden();
  });

  test('TC-003: Updated description is saved while program name remains unchanged', async ({ page }) => {
    const programName = uniqueName('YB Data Science 101');
    const originalDescription = 'Intro to data science';
    const updatedDescription = 'Advanced data science and machine learning program';

    await createProgram(page, programName, originalDescription);
    await openEditModal(page, programName);

    const dialog = getEditDialog(page);
    await dialog.getByLabel('Description').clear();
    await dialog.getByLabel('Description').fill(updatedDescription);
    await dialog.getByRole('button', { name: 'Save' }).click();

    await expect(dialog).toBeHidden({ timeout: 10000 });
    const row = programRow(page, programName);
    await expect(row).toBeVisible({ timeout: 10000 });
    await expect(row).toContainText(updatedDescription);
  });

  test('TC-004: Unchanged description field is preserved after editing only the name', async ({ page }) => {
    const programName = uniqueName('YB UX Design');
    const description = 'User experience design fundamentals';
    const updatedName = programName.replace('YB UX Design', 'YB UX/UI Design');

    await createProgram(page, programName, description);
    await openEditModal(page, programName);

    const dialog = getEditDialog(page);
    await dialog.getByLabel('Program Name').clear();
    await dialog.getByLabel('Program Name').fill(updatedName);
    await dialog.getByRole('button', { name: 'Save' }).click();

    await expect(dialog).toBeHidden({ timeout: 10000 });
    const row = programRow(page, updatedName);
    await expect(row).toBeVisible({ timeout: 10000 });
    await expect(row).toContainText(description);
  });

  test('TC-005: Edited program data persists across browser refresh', async ({ page }) => {
    const programName = uniqueName('YB Web Development 2026');
    const updatedName = `${programName} - Updated`;

    await createProgram(page, programName, 'Full-stack web development program');
    await openEditModal(page, programName);

    const dialog = getEditDialog(page);
    await dialog.getByLabel('Program Name').clear();
    await dialog.getByLabel('Program Name').fill(updatedName);
    await dialog.getByRole('button', { name: 'Save' }).click();

    await expect(dialog).toBeHidden({ timeout: 10000 });
    await expect(programRow(page, updatedName)).toBeVisible({ timeout: 10000 });

    await page.reload();
    await expect(programRow(page, updatedName)).toBeVisible({ timeout: 10000 });
  });

  test('TC-006: Both name and description can be updated in a single save action', async ({ page }) => {
    const programName = uniqueName('YB Old Program');
    const newName = uniqueName('YB New Program');
    const newDescription = 'New description';

    await createProgram(page, programName, 'Old description');
    await openEditModal(page, programName);

    const dialog = getEditDialog(page);
    await dialog.getByLabel('Program Name').clear();
    await dialog.getByLabel('Program Name').fill(newName);
    await dialog.getByLabel('Description').clear();
    await dialog.getByLabel('Description').fill(newDescription);
    await dialog.getByRole('button', { name: 'Save' }).click();

    await expect(dialog).toBeHidden({ timeout: 10000 });
    const row = programRow(page, newName);
    await expect(row).toBeVisible({ timeout: 10000 });
    await expect(row).toContainText(newDescription);
  });
});

// --- 2. Negative Flows ---

test.describe('Negative Flows', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('TC-007: Editing a program name to empty is prevented', async ({ page }) => {
    const programName = uniqueName('YB Web Development 2026');

    await createProgram(page, programName, 'Full-stack web development program');
    await openEditModal(page, programName);

    const dialog = getEditDialog(page);
    await dialog.getByLabel('Program Name').clear();
    await expect(dialog.getByRole('button', { name: 'Save' })).toBeDisabled();
  });

  test('TC-008: Unsaved edits are discarded when the modal is dismissed', async ({ page }) => {
    const programName = uniqueName('YB Web Development 2026');
    const changedName = uniqueName('YB Changed Name');

    await createProgram(page, programName, 'Full-stack web development program');
    await openEditModal(page, programName);

    const dialog = getEditDialog(page);
    await dialog.getByLabel('Program Name').clear();
    await dialog.getByLabel('Program Name').fill(changedName);
    await dialog.getByRole('button', { name: 'Cancel' }).click();

    await expect(dialog).toBeHidden();
    await expect(programRow(page, programName)).toBeVisible();
    await expect(programRow(page, changedName)).toBeHidden();
  });

  test.skip('TC-009: Non-admin users do not see the edit icon on programs', async () => {
    // Requires non-admin credentials which are not available
  });

  test('TC-010: Clicking Save without modifications does not alter program data', async ({ page }) => {
    const programName = uniqueName('YB Web Development 2026');
    const description = 'Full-stack web development program';

    await createProgram(page, programName, description);
    await openEditModal(page, programName);

    const dialog = getEditDialog(page);
    await dialog.getByRole('button', { name: 'Save' }).click();

    await expect(dialog).toBeHidden({ timeout: 10000 });
    const row = programRow(page, programName);
    await expect(row).toBeVisible({ timeout: 10000 });
    await expect(row).toContainText(description);
  });
});

// --- 3. Edge Cases ---

test.describe('Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('TC-011: Program name can be updated to the maximum character limit (255)', async ({ page }) => {
    const programName = uniqueName('YB Max Length Edit');
    const longName = ('YB ' + 'A'.repeat(252)).slice(0, 255);

    await createProgram(page, programName, 'Initial description');
    await openEditModal(page, programName);

    const dialog = getEditDialog(page);
    await dialog.getByLabel('Program Name').clear();
    await dialog.getByLabel('Program Name').fill(longName);
    await dialog.getByRole('button', { name: 'Save' }).click();

    await expect(dialog).toBeHidden({ timeout: 10000 });
    await expect(programRow(page, longName)).toBeVisible({ timeout: 10000 });
  });

  test('TC-012: Leading/trailing whitespace is trimmed on save during edit', async ({ page }) => {
    const programName = uniqueName('YB Web Development 2026');
    const trimmedName = `${programName} - Trimmed`;
    const paddedName = `  ${trimmedName}  `;

    await createProgram(page, programName, 'Full-stack web development program');
    await openEditModal(page, programName);

    const dialog = getEditDialog(page);
    await dialog.getByLabel('Program Name').clear();
    await dialog.getByLabel('Program Name').fill(paddedName);
    await dialog.getByRole('button', { name: 'Save' }).click();

    await expect(dialog).toBeHidden({ timeout: 10000 });
    await expect(programRow(page, trimmedName)).toBeVisible({ timeout: 10000 });
  });

  test('TC-013: Renaming a program to an existing name is rejected', async ({ page }) => {
    const existingName = uniqueName('YB Web Development 2026');
    const otherName = uniqueName('YB Data Science 101');

    await createProgram(page, existingName, 'Existing program');
    await createProgram(page, otherName, 'Other program');
    await openEditModal(page, otherName);

    const dialog = getEditDialog(page);
    await dialog.getByLabel('Program Name').clear();
    await dialog.getByLabel('Program Name').fill(existingName);
    await dialog.getByRole('button', { name: 'Save' }).click();

    await expect(programRow(page, otherName)).toBeVisible({ timeout: 10000 });
    await expect(page.getByRole('row', { name: new RegExp(existingName) })).toHaveCount(1);
  });

  test('TC-014: Double-clicking Save does not produce errors or inconsistent state', async ({ page }) => {
    const programName = uniqueName('YB Double Save Test');
    const updatedName = `${programName} - Updated`;

    await createProgram(page, programName, 'Initial description');
    await openEditModal(page, programName);

    const dialog = getEditDialog(page);
    await dialog.getByLabel('Program Name').clear();
    await dialog.getByLabel('Program Name').fill(updatedName);
    await dialog.getByRole('button', { name: 'Save' }).dblclick();

    await expect(dialog).toBeHidden({ timeout: 10000 });

    const rows = page.getByRole('row', { name: new RegExp(updatedName) });
    await expect(rows).toHaveCount(1, { timeout: 10000 });
  });

  test.skip('TC-015: Concurrent edits to the same program do not cause data loss', async () => {
    // Requires two authenticated sessions editing the same program simultaneously
  });

  test('TC-016: Description can be cleared during edit', async ({ page }) => {
    const programName = uniqueName('YB Web Development 2026');
    const description = 'Full-stack web development program';

    await createProgram(page, programName, description);
    await openEditModal(page, programName);

    const dialog = getEditDialog(page);
    await dialog.getByLabel('Description').clear();
    await dialog.getByRole('button', { name: 'Save' }).click();

    await expect(dialog).toBeHidden({ timeout: 10000 });
    const row = programRow(page, programName);
    await expect(row).toBeVisible({ timeout: 10000 });
    await expect(row).not.toContainText(description);
  });
});
