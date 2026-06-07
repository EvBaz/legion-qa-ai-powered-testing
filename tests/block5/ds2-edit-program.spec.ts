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

  test('TC-001: Edit form displays current program name and description', async () => {
    const programName = uniqueName('YB Web Development 2026');
    const description = 'Full-stack web development program';
    const editModal = programs.editProgramModal;

    await programs.createProgram(programName, description);
    await programs.openEditModal(programName);

    await expect(editModal.dialog).toBeVisible();
    await expect(editModal.programNameInput).toHaveValue(programName);
    await expect(editModal.descriptionInput).toHaveValue(description);
    await expect(editModal.saveButton).toBeVisible();
  });

  test('TC-002: Updated program name is saved and reflected in the list immediately', async () => {
    const programName = uniqueName('YB Web Development 2026');
    const updatedName = `${programName} - Updated`;
    const editModal = programs.editProgramModal;

    await programs.createProgram(programName, 'Full-stack web development program');
    await programs.openEditModal(programName);
    await editModal.fillProgramName(updatedName);
    await editModal.save();

    await expect(editModal.dialog).toBeHidden({ timeout: 10000 });
    await expect(programs.programRow(updatedName)).toBeVisible({ timeout: 10000 });
    await expect(programs.programRow(programName)).toBeHidden();
  });

  test('TC-003: Updated description is saved while program name remains unchanged', async () => {
    const programName = uniqueName('YB Data Science 101');
    const originalDescription = 'Intro to data science';
    const updatedDescription = 'Advanced data science and machine learning program';
    const editModal = programs.editProgramModal;

    await programs.createProgram(programName, originalDescription);
    await programs.openEditModal(programName);
    await editModal.fillDescription(updatedDescription);
    await editModal.save();

    await expect(editModal.dialog).toBeHidden({ timeout: 10000 });
    const row = programs.programRow(programName);
    await expect(row).toBeVisible({ timeout: 10000 });
    await expect(row).toContainText(updatedDescription);
  });

  test('TC-004: Unchanged description field is preserved after editing only the name', async () => {
    const programName = uniqueName('YB UX Design');
    const description = 'User experience design fundamentals';
    const updatedName = programName.replace('YB UX Design', 'YB UX/UI Design');
    const editModal = programs.editProgramModal;

    await programs.createProgram(programName, description);
    await programs.openEditModal(programName);
    await editModal.fillProgramName(updatedName);
    await editModal.save();

    await expect(editModal.dialog).toBeHidden({ timeout: 10000 });
    const row = programs.programRow(updatedName);
    await expect(row).toBeVisible({ timeout: 10000 });
    await expect(row).toContainText(description);
  });

  test('TC-005: Edited program data persists across browser refresh', async () => {
    const programName = uniqueName('YB Web Development 2026');
    const updatedName = `${programName} - Updated`;
    const editModal = programs.editProgramModal;

    await programs.createProgram(programName, 'Full-stack web development program');
    await programs.openEditModal(programName);
    await editModal.fillProgramName(updatedName);
    await editModal.save();

    await expect(editModal.dialog).toBeHidden({ timeout: 10000 });
    await expect(programs.programRow(updatedName)).toBeVisible({ timeout: 10000 });

    await programs.reload();
    await expect(programs.programRow(updatedName)).toBeVisible({ timeout: 10000 });
  });

  test('TC-006: Both name and description can be updated in a single save action', async () => {
    const programName = uniqueName('YB Old Program');
    const newName = uniqueName('YB New Program');
    const newDescription = 'New description';
    const editModal = programs.editProgramModal;

    await programs.createProgram(programName, 'Old description');
    await programs.openEditModal(programName);
    await editModal.fillProgramName(newName);
    await editModal.fillDescription(newDescription);
    await editModal.save();

    await expect(editModal.dialog).toBeHidden({ timeout: 10000 });
    const row = programs.programRow(newName);
    await expect(row).toBeVisible({ timeout: 10000 });
    await expect(row).toContainText(newDescription);
  });
});

// --- 2. Negative Flows ---

test.describe('Negative Flows', () => {
  let programs: ProgramsPage;

  test.beforeEach(async ({ page }) => {
    programs = new ProgramsPage(page);
  });

  test('TC-007: Editing a program name to empty is prevented', async () => {
    const programName = uniqueName('YB Web Development 2026');
    const editModal = programs.editProgramModal;

    await programs.createProgram(programName, 'Full-stack web development program');
    await programs.openEditModal(programName);
    await editModal.programNameInput.clear();

    await expect(editModal.saveButton).toBeDisabled();
  });

  test('TC-008: Unsaved edits are discarded when the modal is dismissed', async () => {
    const programName = uniqueName('YB Web Development 2026');
    const changedName = uniqueName('YB Changed Name');
    const editModal = programs.editProgramModal;

    await programs.createProgram(programName, 'Full-stack web development program');
    await programs.openEditModal(programName);
    await editModal.fillProgramName(changedName);
    await editModal.cancel();

    await expect(editModal.dialog).toBeHidden();
    await expect(programs.programRow(programName)).toBeVisible();
    await expect(programs.programRow(changedName)).toBeHidden();
  });

  test.skip('TC-009: Non-admin users do not see the edit icon on programs', async () => {
    // Requires non-admin credentials which are not available
  });

  test('TC-010: Clicking Save without modifications does not alter program data', async () => {
    const programName = uniqueName('YB Web Development 2026');
    const description = 'Full-stack web development program';
    const editModal = programs.editProgramModal;

    await programs.createProgram(programName, description);
    await programs.openEditModal(programName);
    await editModal.save();

    await expect(editModal.dialog).toBeHidden({ timeout: 10000 });
    const row = programs.programRow(programName);
    await expect(row).toBeVisible({ timeout: 10000 });
    await expect(row).toContainText(description);
  });
});

// --- 3. Edge Cases ---

test.describe('Edge Cases', () => {
  let programs: ProgramsPage;

  test.beforeEach(async ({ page }) => {
    programs = new ProgramsPage(page);
  });

  test('TC-011: Program name can be updated to the maximum character limit (255)', async () => {
    const programName = uniqueName('YB Max Length Edit');
    const longName = ('YB ' + 'A'.repeat(252)).slice(0, 255);
    const editModal = programs.editProgramModal;

    await programs.createProgram(programName, 'Initial description');
    await programs.openEditModal(programName);
    await editModal.fillProgramName(longName);
    await editModal.save();

    await expect(editModal.dialog).toBeHidden({ timeout: 10000 });
    await expect(programs.programRow(longName)).toBeVisible({ timeout: 10000 });
  });

  test('TC-012: Leading/trailing whitespace is trimmed on save during edit', async () => {
    const programName = uniqueName('YB Web Development 2026');
    const trimmedName = `${programName} - Trimmed`;
    const paddedName = `  ${trimmedName}  `;
    const editModal = programs.editProgramModal;

    await programs.createProgram(programName, 'Full-stack web development program');
    await programs.openEditModal(programName);
    await editModal.fillProgramName(paddedName);
    await editModal.save();

    await expect(editModal.dialog).toBeHidden({ timeout: 10000 });
    await expect(programs.programRow(trimmedName)).toBeVisible({ timeout: 10000 });
  });

  test('TC-013: Renaming a program to an existing name is rejected', async () => {
    const existingName = uniqueName('YB Web Development 2026');
    const otherName = uniqueName('YB Data Science 101');
    const editModal = programs.editProgramModal;

    await programs.createProgram(existingName, 'Existing program');
    await programs.createProgram(otherName, 'Other program');
    await programs.openEditModal(otherName);
    await editModal.fillProgramName(existingName);
    await editModal.save();

    await expect(editModal.dialog).toBeVisible();
    await expect(editModal.validationError).toBeVisible();
    await expect(programs.programRow(otherName)).toBeVisible();
  });

  test('TC-014: Double-clicking Save does not produce errors or inconsistent state', async () => {
    const programName = uniqueName('YB Double Save Test');
    const updatedName = `${programName} - Updated`;
    const editModal = programs.editProgramModal;

    await programs.createProgram(programName, 'Initial description');
    await programs.openEditModal(programName);
    await editModal.fillProgramName(updatedName);
    await editModal.doubleClickSave();

    await expect(editModal.dialog).toBeHidden({ timeout: 10000 });
    await expect(programs.programRow(updatedName)).toHaveCount(1, { timeout: 10000 });
  });

  test.skip('TC-015: Concurrent edits to the same program do not cause data loss', async () => {
    // Requires two authenticated sessions editing the same program simultaneously
  });

  test('TC-016: Description can be cleared during edit', async () => {
    const programName = uniqueName('YB Web Development 2026');
    const description = 'Full-stack web development program';
    const editModal = programs.editProgramModal;

    await programs.createProgram(programName, description);
    await programs.openEditModal(programName);
    await editModal.clearDescription();
    await editModal.save();

    await expect(editModal.dialog).toBeHidden({ timeout: 10000 });
    const row = programs.programRow(programName);
    await expect(row).toBeVisible({ timeout: 10000 });
    await expect(row).not.toContainText(description);
  });
});
