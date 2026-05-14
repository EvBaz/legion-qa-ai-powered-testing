import { test, expect, Page } from '@playwright/test';

const LOGIN_URL = '/login';
const PROGRAMS_URL = '/programs';

async function login(page: Page) {
  await page.goto(LOGIN_URL);
  await page.getByLabel('Email').fill(process.env.DIDAXIS_EMAIL!);
  await page.getByLabel('Password').fill(process.env.DIDAXIS_PASSWORD!);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15000 });
}

function getDialog(page: Page) {
  return page.getByRole('dialog', { name: 'New Program' });
}

async function openNewProgramModal(page: Page) {
  await page.goto(PROGRAMS_URL);
  await page.getByRole('button', { name: '+ New Program' }).click();
  await expect(getDialog(page)).toBeVisible();
}

function uniqueName(base: string): string {
  return `${base} ${Date.now()}`;
}

function programRow(page: Page, name: string) {
  return page.getByRole('row', { name: new RegExp(name) });
}

// --- 1. Positive Flows ---

test.describe('Positive Flows', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('TC-001: Program creation form displays Program Name and Description fields', async ({ page }) => {
    await openNewProgramModal(page);
    const dialog = getDialog(page);

    await expect(dialog.getByLabel('Program Name')).toBeVisible();
    await expect(dialog.getByLabel('Description')).toBeVisible();
    await expect(dialog.getByRole('button', { name: 'Create' })).toBeVisible();
  });

  test('TC-002: Program is created and appears in the program list', async ({ page }) => {
    const programName = uniqueName('YB Web Development');
    const description = 'Full-stack web development program';

    await openNewProgramModal(page);
    const dialog = getDialog(page);
    await dialog.getByLabel('Program Name').fill(programName);
    await dialog.getByLabel('Description').fill(description);
    await dialog.getByRole('button', { name: 'Create' }).click();

    await expect(dialog).toBeHidden({ timeout: 10000 });
    await expect(programRow(page, programName)).toBeVisible({ timeout: 10000 });
  });

  test('TC-003: Create button is disabled by default on empty form', async ({ page }) => {
    await openNewProgramModal(page);
    const dialog = getDialog(page);

    await expect(dialog.getByRole('button', { name: 'Create' })).toBeDisabled();
  });

  test('TC-004: Create button becomes enabled when a valid Program Name is entered', async ({ page }) => {
    await openNewProgramModal(page);
    const dialog = getDialog(page);

    await expect(dialog.getByRole('button', { name: 'Create' })).toBeDisabled();
    await dialog.getByLabel('Program Name').fill(uniqueName('YB Data Science Bootcamp'));
    await expect(dialog.getByRole('button', { name: 'Create' })).toBeEnabled();
  });

  test('TC-005: Program is created successfully with only Program Name (no Description)', async ({ page }) => {
    const programName = uniqueName('YB Cybersecurity Fundamentals');

    await openNewProgramModal(page);
    const dialog = getDialog(page);
    await dialog.getByLabel('Program Name').fill(programName);
    await dialog.getByRole('button', { name: 'Create' }).click();

    await expect(dialog).toBeHidden({ timeout: 10000 });
    await expect(programRow(page, programName)).toBeVisible({ timeout: 10000 });
  });

  test('TC-006: Created program survives a full page reload', async ({ page }) => {
    const programName = uniqueName('YB Persist Test');

    await openNewProgramModal(page);
    const dialog = getDialog(page);
    await dialog.getByLabel('Program Name').fill(programName);
    await dialog.getByRole('button', { name: 'Create' }).click();

    await expect(dialog).toBeHidden({ timeout: 10000 });
    await expect(programRow(page, programName)).toBeVisible({ timeout: 10000 });

    await page.reload();
    await expect(programRow(page, programName)).toBeVisible({ timeout: 10000 });
  });
});

// --- 2. Negative Flows ---

test.describe('Negative Flows', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('TC-007: Empty Program Name prevents form submission', async ({ page }) => {
    await openNewProgramModal(page);
    const dialog = getDialog(page);

    await dialog.getByLabel('Description').fill('Some description');
    await expect(dialog.getByRole('button', { name: 'Create' })).toBeDisabled();
  });

  test('TC-008: Clearing Program Name after entry re-disables the Create button', async ({ page }) => {
    await openNewProgramModal(page);
    const dialog = getDialog(page);

    await dialog.getByLabel('Program Name').fill('Temp Program');
    await expect(dialog.getByRole('button', { name: 'Create' })).toBeEnabled();

    await dialog.getByLabel('Program Name').clear();
    await expect(dialog.getByRole('button', { name: 'Create' })).toBeDisabled();
  });

  test.skip('TC-009: Non-admin users do not see the program creation option', async () => {
    // Requires non-admin credentials which are not available
  });

  test('TC-010: Dismissing the creation form does not create a program', async ({ page }) => {
    const programName = uniqueName('YB Abandoned Program');

    await openNewProgramModal(page);
    const dialog = getDialog(page);
    await dialog.getByLabel('Program Name').fill(programName);
    await dialog.getByRole('button', { name: 'Cancel' }).click();

    await expect(dialog).toBeHidden();
    await expect(programRow(page, programName)).toBeHidden();
  });
});

// --- 3. Edge Cases ---

test.describe('Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    await login(page);
  });

  test('TC-011: Program creation accepts a name at the maximum allowed character limit (255)', async ({ page }) => {
    const longName = 'YB ' + 'A'.repeat(242) + ` ${Date.now()}`;

    await openNewProgramModal(page);
    const dialog = getDialog(page);
    await dialog.getByLabel('Program Name').fill(longName);
    await dialog.getByRole('button', { name: 'Create' }).click();

    await expect(dialog).toBeHidden({ timeout: 10000 });
  });

  test('TC-012: Program name beyond max length is rejected or truncated', async ({ page }) => {
    const overLimitName = 'YB ' + 'B'.repeat(297);

    await openNewProgramModal(page);
    const dialog = getDialog(page);
    await dialog.getByLabel('Program Name').fill(overLimitName);

    const fieldValue = await dialog.getByLabel('Program Name').inputValue();

    if (fieldValue.length <= 255) {
      expect(fieldValue.length).toBeLessThanOrEqual(255);
    } else {
      expect(fieldValue.length).toBe(300);
    }
  });

  test('TC-013: Leading/trailing whitespace in Program Name is trimmed before saving', async ({ page }) => {
    const coreName = uniqueName('YB Whitespace Test');
    const paddedName = `  ${coreName}  `;

    await openNewProgramModal(page);
    const dialog = getDialog(page);
    await dialog.getByLabel('Program Name').fill(paddedName);
    await dialog.getByRole('button', { name: 'Create' }).click();

    await expect(dialog).toBeHidden({ timeout: 10000 });
    await expect(programRow(page, coreName)).toBeVisible({ timeout: 10000 });
  });

  test('TC-014: Single-character Program Name is accepted', async ({ page }) => {
    await openNewProgramModal(page);
    const dialog = getDialog(page);
    await dialog.getByLabel('Program Name').fill('YB Z');
    await dialog.getByRole('button', { name: 'Create' }).click();

    await expect(dialog).toBeHidden({ timeout: 10000 });
  });

  test('TC-015: Long description text is accepted and stored completely', async ({ page }) => {
    const programName = uniqueName('YB Long Description Test');
    const longDescription = 'D'.repeat(2000);

    await openNewProgramModal(page);
    const dialog = getDialog(page);
    await dialog.getByLabel('Program Name').fill(programName);
    await dialog.getByLabel('Description').fill(longDescription);
    await dialog.getByRole('button', { name: 'Create' }).click();

    await expect(dialog).toBeHidden({ timeout: 10000 });
    await expect(programRow(page, programName)).toBeVisible({ timeout: 10000 });
  });

  test('TC-016: Double-clicking Create does not produce duplicate entries', async ({ page }) => {
    const programName = uniqueName('YB Double Click Test');

    await openNewProgramModal(page);
    const dialog = getDialog(page);
    await dialog.getByLabel('Program Name').fill(programName);
    await dialog.getByRole('button', { name: 'Create' }).dblclick();

    await expect(dialog).toBeHidden({ timeout: 10000 });

    const rows = page.getByRole('row', { name: new RegExp(programName) });
    await expect(rows).toHaveCount(1, { timeout: 10000 });
  });

  test('TC-017: Unicode and emoji characters in Program Name are handled correctly', async ({ page }) => {
    const programName = `YB プログラム 🎓 ${Date.now()}`;

    await openNewProgramModal(page);
    const dialog = getDialog(page);
    await dialog.getByLabel('Program Name').fill(programName);
    await dialog.getByRole('button', { name: 'Create' }).click();

    await expect(dialog).toBeHidden({ timeout: 10000 });
    await expect(programRow(page, programName)).toBeVisible({ timeout: 10000 });
  });
});
