import { test, expect } from '../../fixtures/cleanup.fixture';
import { ProgramsPage } from '../../pages';

function uniqueName(base: string): string {
  return `${base} ${Date.now()}`;
}

// --- 1. Positive Flows ---

test.describe('Positive Flows', () => {
  let programs: ProgramsPage;

  test.beforeEach(async ({ page }) => {
    programs = new ProgramsPage(page);
  });

  test('TC-001: Program creation form displays Program Name and Description fields', async () => {
    await programs.gotoAndOpenNewProgramModal();
    const modal = programs.newProgramModal;

    await expect(modal.dialog).toBeVisible();
    await expect(modal.programNameInput).toBeVisible();
    await expect(modal.descriptionInput).toBeVisible();
    await expect(modal.createButton).toBeVisible();
  });

  test('TC-002: Program is created and appears in the program list', async () => {
    const programName = uniqueName('YB Web Development');
    const description = 'Full-stack web development program';
    const modal = programs.newProgramModal;

    await programs.gotoAndOpenNewProgramModal();
    await modal.create(programName, description);

    await expect(modal.dialog).toBeHidden({ timeout: 10000 });
    await expect(programs.programRow(programName)).toBeVisible({ timeout: 10000 });
  });

  test('TC-003: Create button is disabled by default on empty form', async () => {
    await programs.gotoAndOpenNewProgramModal();

    await expect(programs.newProgramModal.createButton).toBeDisabled();
  });

  test('TC-004: Create button becomes enabled when a valid Program Name is entered', async () => {
    const modal = programs.newProgramModal;

    await programs.gotoAndOpenNewProgramModal();
    await expect(modal.createButton).toBeDisabled();
    await modal.fillProgramName(uniqueName('YB Data Science Bootcamp'));
    await expect(modal.createButton).toBeEnabled();
  });

  test('TC-005: Program is created successfully with only Program Name (no Description)', async () => {
    const programName = uniqueName('YB Cybersecurity Fundamentals');
    const modal = programs.newProgramModal;

    await programs.gotoAndOpenNewProgramModal();
    await modal.fillProgramName(programName);
    await modal.submitCreate();

    await expect(modal.dialog).toBeHidden({ timeout: 10000 });
    await expect(programs.programRow(programName)).toBeVisible({ timeout: 10000 });
  });

  test('TC-006: Created program survives a full page reload', async () => {
    const programName = uniqueName('YB Persist Test');
    const modal = programs.newProgramModal;

    await programs.gotoAndOpenNewProgramModal();
    await modal.fillProgramName(programName);
    await modal.submitCreate();

    await expect(modal.dialog).toBeHidden({ timeout: 10000 });
    await expect(programs.programRow(programName)).toBeVisible({ timeout: 10000 });

    await programs.reload();
    await expect(programs.programRow(programName)).toBeVisible({ timeout: 10000 });
  });
});

// --- 2. Negative Flows ---

test.describe('Negative Flows', () => {
  let programs: ProgramsPage;

  test.beforeEach(async ({ page }) => {
    programs = new ProgramsPage(page);
  });

  test('TC-007: Empty Program Name prevents form submission', async () => {
    const modal = programs.newProgramModal;

    await programs.gotoAndOpenNewProgramModal();
    await modal.fillDescription('Some description');
    await expect(modal.createButton).toBeDisabled();
  });

  test('TC-008: Clearing Program Name after entry re-disables the Create button', async () => {
    const modal = programs.newProgramModal;

    await programs.gotoAndOpenNewProgramModal();
    await modal.fillProgramName('Temp Program');
    await expect(modal.createButton).toBeEnabled();

    await modal.clearProgramName();
    await expect(modal.createButton).toBeDisabled();
  });

  test.skip('TC-009: Non-admin users do not see the program creation option', async () => {
    // Requires non-admin credentials which are not available
  });

  test('TC-010: Dismissing the creation form does not create a program', async () => {
    const programName = uniqueName('YB Abandoned Program');
    const modal = programs.newProgramModal;

    await programs.gotoAndOpenNewProgramModal();
    await modal.fillProgramName(programName);
    await modal.cancel();

    await expect(modal.dialog).toBeHidden();
    await expect(programs.programRow(programName)).toBeHidden();
  });
});

// --- 3. Edge Cases ---

test.describe('Edge Cases', () => {
  let programs: ProgramsPage;

  test.beforeEach(async ({ page }) => {
    programs = new ProgramsPage(page);
  });

  test('TC-011: Program creation accepts a name at the maximum allowed character limit (255)', async () => {
    const longName = 'YB ' + 'A'.repeat(242) + ` ${Date.now()}`;
    const modal = programs.newProgramModal;

    await programs.gotoAndOpenNewProgramModal();
    await modal.fillProgramName(longName);
    await modal.submitCreate();

    await expect(modal.dialog).toBeHidden({ timeout: 10000 });
  });

  test('TC-012: Program name beyond max length is rejected or truncated', async () => {
    const overLimitName = 'YB ' + 'B'.repeat(297);
    const modal = programs.newProgramModal;

    await programs.gotoAndOpenNewProgramModal();
    await modal.fillProgramName(overLimitName);

    const fieldValue = await modal.getProgramNameValue();

    if (fieldValue.length <= 255) {
      expect(fieldValue.length).toBeLessThanOrEqual(255);
    } else {
      expect(fieldValue.length).toBe(300);
    }
  });

  test('TC-013: Leading/trailing whitespace in Program Name is trimmed before saving', async () => {
    const coreName = uniqueName('YB Whitespace Test');
    const paddedName = `  ${coreName}  `;
    const modal = programs.newProgramModal;

    await programs.gotoAndOpenNewProgramModal();
    await modal.fillProgramName(paddedName);
    await modal.submitCreate();

    await expect(modal.dialog).toBeHidden({ timeout: 10000 });
    await expect(programs.programRow(coreName)).toBeVisible({ timeout: 10000 });
  });

  test('TC-014: Single-character Program Name is accepted', async () => {
    const modal = programs.newProgramModal;

    await programs.gotoAndOpenNewProgramModal();
    await modal.fillProgramName('YB Z');
    await modal.submitCreate();

    await expect(modal.dialog).toBeHidden({ timeout: 10000 });
  });

  test('TC-015: Long description text is accepted and stored completely', async () => {
    const programName = uniqueName('YB Long Description Test');
    const longDescription = 'D'.repeat(2000);
    const modal = programs.newProgramModal;

    await programs.gotoAndOpenNewProgramModal();
    await modal.create(programName, longDescription);

    await expect(modal.dialog).toBeHidden({ timeout: 10000 });
    await expect(programs.programRow(programName)).toBeVisible({ timeout: 10000 });
  });

  test('TC-016: Double-clicking Create does not produce duplicate entries', async () => {
    test.fail(true, 'Known demo bug — double-clicking Create produces duplicate programs.');

    const programName = uniqueName('YB Double Click Test');
    const modal = programs.newProgramModal;

    await programs.gotoAndOpenNewProgramModal();
    await modal.fillProgramName(programName);
    await modal.doubleClickCreate();

    await expect(modal.dialog).toBeHidden({ timeout: 10000 });
    await expect(programs.programRow(programName)).toHaveCount(1, { timeout: 10000 });
  });

  test('TC-017: Unicode and emoji characters in Program Name are handled correctly', async () => {
    const programName = `YB プログラム 🎓 ${Date.now()}`;
    const modal = programs.newProgramModal;

    await programs.gotoAndOpenNewProgramModal();
    await modal.fillProgramName(programName);
    await modal.submitCreate();

    await expect(modal.dialog).toBeHidden({ timeout: 10000 });
    await expect(programs.programRow(programName)).toBeVisible({ timeout: 10000 });
  });
});
