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

  test('TC-001: Clicking delete icon shows a confirmation dialog before deletion', async () => {
    const programName = uniqueName('YB Test Program');
    await programs.createProgram(programName, 'To be deleted');
    await programs.goto();

    const dialog = await programs.openDeleteDialog(programName);

    expect(dialog.type()).toBe('confirm');
    await dialog.dismiss();
    await expect(programs.programRow(programName)).toBeVisible();
  });

  test('TC-002: Confirming deletion removes the program from the list', async () => {
    const programName = uniqueName('YB Test Program');
    await programs.createProgram(programName, 'To be deleted');
    await programs.goto();

    await programs.deleteProgram(programName, { confirm: true });

    await expect(programs.programRow(programName)).toBeHidden({ timeout: 10000 });
  });

  test('TC-003: Cancelling the confirmation dialog preserves the program', async () => {
    const programName = uniqueName('YB Test Program');
    await programs.createProgram(programName, 'Keep me');
    await programs.goto();

    await programs.deleteProgram(programName, { confirm: false });

    await expect(programs.programRow(programName)).toBeVisible();
  });

  test('TC-004: Deletion persists across browser refresh', async () => {
    const programName = uniqueName('YB Test Program');
    await programs.createProgram(programName, 'Delete and refresh');
    await programs.goto();

    await programs.deleteProgram(programName, { confirm: true });
    await expect(programs.programRow(programName)).toBeHidden({ timeout: 10000 });

    await programs.reload();
    await expect(programs.programRow(programName)).toBeHidden();
  });

  test('TC-005: Confirmation dialog identifies the specific program to be deleted', async () => {
    const programName = uniqueName('YB Test Program');
    const otherName = uniqueName('YB Other Program');
    await programs.createProgram(programName, 'Target');
    await programs.createProgram(otherName, 'Other');
    await programs.goto();

    const dialog = await programs.openDeleteDialog(programName);

    expect(dialog.message()).toContain(programName);
    await dialog.dismiss();
  });
});

// --- 2. Negative Flows ---

test.describe('Negative Flows', () => {
  let programs: ProgramsPage;

  test.beforeEach(async ({ page }) => {
    programs = new ProgramsPage(page);
  });

  test.skip('TC-007: Non-admin users do not have access to the delete action', async () => {
    // Requires non-admin credentials which are not available
  });

  test('TC-008: Pressing Escape on the confirmation dialog does not delete the program', async () => {
    const programName = uniqueName('YB Test Program');
    await programs.createProgram(programName, 'Escape test');
    await programs.goto();

    await programs.dismissDeleteDialogWithEscape(programName);

    await expect(programs.programRow(programName)).toBeVisible();
  });
});

// --- 3. Edge Cases ---

test.describe('Edge Cases', () => {
  let programs: ProgramsPage;

  test.beforeEach(async ({ page }) => {
    programs = new ProgramsPage(page);
  });

  test('TC-011: Double-clicking the delete icon shows only one confirmation dialog', async () => {
    const programName = uniqueName('YB Test Program');
    await programs.createProgram(programName, 'Double-click delete');
    await programs.goto();

    const dialogs: string[] = [];
    programs.page.on('dialog', (dialog) => {
      dialogs.push(dialog.message());
      void dialog.dismiss();
    });

    await programs.deleteButton(programName).dblclick();
    await programs.page.waitForTimeout(1000);

    expect(dialogs.length).toBeLessThanOrEqual(1);
    await expect(programs.programRow(programName)).toBeVisible();
  });

  test('TC-014: Multiple programs can be deleted in sequence without errors', async () => {
    const nameA = uniqueName('YB Program A');
    const nameB = uniqueName('YB Program B');
    const nameC = uniqueName('YB Program C');
    await programs.createProgram(nameA, 'A');
    await programs.createProgram(nameB, 'B');
    await programs.createProgram(nameC, 'C');
    await programs.goto();

    await programs.deleteProgram(nameA, { confirm: true });
    await programs.deleteProgram(nameB, { confirm: true });
    await programs.deleteProgram(nameC, { confirm: true });

    await expect(programs.programRow(nameA)).toBeHidden();
    await expect(programs.programRow(nameB)).toBeHidden();
    await expect(programs.programRow(nameC)).toBeHidden();
  });

  test('TC-015: Special characters in program name are displayed correctly in the confirmation dialog', async () => {
    const programName = uniqueName('Informatique & IA - Niveau 2');
    await programs.createProgram(programName, 'French CS');
    await programs.goto();

    const dialog = await programs.openDeleteDialog(programName);

    expect(dialog.message()).toContain('Informatique & IA - Niveau 2');
    await dialog.dismiss();
  });

  test('TC-016: Program list count updates immediately after deletion', async () => {
    const programName = uniqueName('YB Count Test');
    await programs.createProgram(programName, 'Count check');
    await programs.goto();

    await expect(programs.programRow(programName)).toBeVisible();
    const beforeCount = await programs.programDataRows().count();

    await programs.deleteProgram(programName, { confirm: true });

    await expect(programs.programRow(programName)).toBeHidden({ timeout: 10000 });
    await expect(programs.programDataRows()).toHaveCount(beforeCount - 1);
  });
});
