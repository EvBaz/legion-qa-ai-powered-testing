import { test, expect } from '../fixtures/cleanup.fixture';
import { ProgramsPage } from '../pages';

function uniqueName(base: string): string {
  return `${base} ${Date.now()}`;
}

async function createProgramWithDescription(
  programs: ProgramsPage,
  name: string,
  description: string,
): Promise<void> {
  await programs.goto();
  await programs.createProgram(name, description);
  await expect(programs.programNameText(name)).toBeVisible();
}

test.describe('DS-2: Edit Existing Program Details', () => {
  test.describe('# Positive flows', () => {
    test('TC-001: Edit form displays current program name and description', async ({ page }) => {
      const programs = new ProgramsPage(page);
      const name = uniqueName('Web Development 2026');
      const description = 'Full-stack web development program';
      await createProgramWithDescription(programs, name, description);

      await programs.openEditModal(name);

      const modal = programs.editProgramModal;
      await expect(modal.dialog).toBeVisible();
      await expect(modal.programNameInput).toHaveValue(name);
      await expect(modal.descriptionInput).toHaveValue(description);
    });

    test('TC-002: Updated program name is saved and reflected in the list immediately', async ({
      page,
    }) => {
      const programs = new ProgramsPage(page);
      const originalName = uniqueName('Web Development 2026');
      const updatedName = uniqueName('Web Development 2026 - Updated');
      await createProgramWithDescription(
        programs,
        originalName,
        'Full-stack web development program',
      );

      await programs.openEditModal(originalName);
      await programs.editProgramModal.fillProgramName(updatedName);
      await programs.editProgramModal.save();

      await expect(programs.editProgramModal.dialog).not.toBeVisible();
      await expect(programs.programNameText(updatedName)).toBeVisible();
      await expect(programs.programNameText(originalName)).not.toBeVisible();
    });

    test('TC-003: Updated description is saved while program name remains unchanged', async ({
      page,
    }) => {
      const programs = new ProgramsPage(page);
      const name = uniqueName('Data Science 101');
      const originalDescription = 'Intro to data science';
      const updatedDescription = 'Advanced data science and machine learning program';
      await createProgramWithDescription(programs, name, originalDescription);

      await programs.openEditModal(name);
      await programs.editProgramModal.fillDescription(updatedDescription);
      await programs.editProgramModal.save();

      await expect(programs.editProgramModal.dialog).not.toBeVisible();
      await expect(programs.programNameText(name)).toBeVisible();
      await expect(programs.programRow(name)).toContainText(updatedDescription);
    });

    test('TC-004: Unchanged description field is preserved after editing only the name', async ({
      page,
    }) => {
      const programs = new ProgramsPage(page);
      const originalName = uniqueName('UX Design');
      const updatedName = uniqueName('UX/UI Design');
      const description = 'User experience design fundamentals';
      await createProgramWithDescription(programs, originalName, description);

      await programs.openEditModal(originalName);
      await programs.editProgramModal.fillProgramName(updatedName);
      await programs.editProgramModal.save();

      await expect(programs.programNameText(updatedName)).toBeVisible();
      await expect(programs.programRow(updatedName)).toContainText(description);
    });

    test('TC-005: Edited program data persists across browser refresh', async ({ page }) => {
      const programs = new ProgramsPage(page);
      const originalName = uniqueName('Web Development 2026');
      const updatedName = uniqueName('Web Development 2026 - Updated');
      await createProgramWithDescription(
        programs,
        originalName,
        'Full-stack web development program',
      );

      await programs.openEditModal(originalName);
      await programs.editProgramModal.fillProgramName(updatedName);
      await programs.editProgramModal.save();
      await expect(programs.programNameText(updatedName)).toBeVisible();

      await programs.reload();
      await programs.goto();
      await expect(programs.programNameText(updatedName)).toBeVisible();
    });

    test('TC-006: Both name and description can be updated in a single save action', async ({
      page,
    }) => {
      const programs = new ProgramsPage(page);
      const originalName = uniqueName('Old Program');
      const updatedName = uniqueName('New Program');
      const updatedDescription = 'New description';
      await createProgramWithDescription(programs, originalName, 'Old description');

      await programs.openEditModal(originalName);
      const modal = programs.editProgramModal;
      await modal.fillProgramName(updatedName);
      await modal.fillDescription(updatedDescription);
      await modal.save();

      await expect(modal.dialog).not.toBeVisible();
      await expect(programs.programNameText(updatedName)).toBeVisible();
      await expect(programs.programRow(updatedName)).toContainText(updatedDescription);
    });
  });

  test.describe('# Negative flows', () => {
    test('TC-007: Editing a program name to empty is prevented', async ({ page }) => {
      const programs = new ProgramsPage(page);
      const name = uniqueName('Web Development 2026');
      await createProgramWithDescription(programs, name, 'Full-stack web development program');

      await programs.openEditModal(name);
      const modal = programs.editProgramModal;
      await modal.programNameInput.clear();

      const saveDisabled = await modal.saveButton.isDisabled();
      if (saveDisabled) {
        await expect(modal.saveButton).toBeDisabled();
      } else {
        await modal.save();
        await expect(modal.dialog).toBeVisible();
        await expect(programs.programNameText(name)).toBeVisible();
      }
    });

    test('TC-008: Unsaved edits are discarded when the modal is dismissed', async ({ page }) => {
      const programs = new ProgramsPage(page);
      const name = uniqueName('Web Development 2026');
      await createProgramWithDescription(programs, name, 'Full-stack web development program');

      await programs.openEditModal(name);
      const modal = programs.editProgramModal;
      await modal.fillProgramName(uniqueName('Changed Name'));
      await page.keyboard.press('Escape');

      await expect(modal.dialog).not.toBeVisible();
      await expect(programs.programNameText(name)).toBeVisible();
    });

    test.skip('TC-009: Non-admin users do not see the edit icon on programs', async () => {
      // Non-admin role / session not available in this test environment.
    });

    test('TC-010: Clicking Save without modifications does not alter program data', async ({
      page,
    }) => {
      const programs = new ProgramsPage(page);
      const name = uniqueName('Web Development 2026');
      const description = 'Full-stack web development program';
      await createProgramWithDescription(programs, name, description);

      await programs.openEditModal(name);
      const modal = programs.editProgramModal;
      await modal.save();

      await expect(modal.dialog).not.toBeVisible();
      await expect(programs.programNameText(name)).toBeVisible();
      await expect(programs.programRow(name)).toContainText(description);

      await programs.openEditModal(name);
      await expect(modal.programNameInput).toHaveValue(name);
      await expect(modal.descriptionInput).toHaveValue(description);
    });
  });

  test.describe('# Edge cases', () => {
    test('TC-011: Program name can be updated to the maximum character limit', async ({ page }) => {
      const programs = new ProgramsPage(page);
      const name = uniqueName('Max Length Program');
      const maxName = 'A'.repeat(255);
      await createProgramWithDescription(programs, name, 'Program for max-length name test');

      await programs.openEditModal(name);
      await programs.editProgramModal.fillProgramName(maxName);
      await programs.editProgramModal.save();

      await expect(programs.programNameText(maxName)).toBeVisible();
    });

    test('TC-012: Leading/trailing whitespace is trimmed on save during edit', async ({ page }) => {
      const programs = new ProgramsPage(page);
      const name = uniqueName('Web Development 2026');
      const trimmedName = uniqueName('Web Development 2026 - Trimmed');
      await createProgramWithDescription(programs, name, 'Full-stack web development program');

      await programs.openEditModal(name);
      await programs.editProgramModal.fillProgramName(`  ${trimmedName}  `);
      await programs.editProgramModal.save();

      await expect(programs.programNameText(trimmedName)).toBeVisible();
      await expect(programs.programNameText(`  ${trimmedName}  `)).not.toBeVisible();
    });

    test.fail(
      'TC-013: Renaming a program to an existing name is rejected',
      async ({ page }) => {
        // Known demo bug — duplicate program names are allowed on rename.
        const programs = new ProgramsPage(page);
        const existingName = uniqueName('Web Development 2026');
        const otherName = uniqueName('Data Science 101');
        await createProgramWithDescription(programs, existingName, 'First program description');
        await createProgramWithDescription(programs, otherName, 'Second program description');

        await programs.openEditModal(otherName);
        await programs.editProgramModal.fillProgramName(existingName);
        await programs.editProgramModal.save();

        await expect(programs.editProgramModal.validationError).toBeVisible();
        await expect(programs.programNameText(otherName)).toBeVisible();
      },
    );

    test('TC-014: Double-clicking Save does not produce errors or inconsistent state', async ({
      page,
    }) => {
      const programs = new ProgramsPage(page);
      const originalName = uniqueName('Double Save Program');
      const updatedName = uniqueName('Double Save Program - Updated');
      await createProgramWithDescription(programs, originalName, 'Description for double-save test');

      await programs.openEditModal(originalName);
      await programs.editProgramModal.fillProgramName(updatedName);
      await programs.editProgramModal.doubleClickSave();

      await expect(programs.editProgramModal.dialog).not.toBeVisible();
      await expect(programs.programNameText(updatedName)).toHaveCount(1);
      await expect(programs.programNameText(originalName)).not.toBeVisible();
    });

    test.skip('TC-015: Concurrent edits to the same program do not cause data loss', async () => {
      // Concurrent admin sessions not available in this test environment.
    });

    test('TC-016: Description can be cleared during edit', async ({ page }) => {
      const programs = new ProgramsPage(page);
      const name = uniqueName('Web Development 2026');
      await createProgramWithDescription(programs, name, 'Full-stack web development program');

      await programs.openEditModal(name);
      const modal = programs.editProgramModal;
      await modal.clearDescription();
      await modal.save();

      await expect(modal.dialog).not.toBeVisible();
      await expect(programs.programNameText(name)).toBeVisible();

      await programs.openEditModal(name);
      await expect(modal.descriptionInput).toHaveValue('');
    });
  });
});
