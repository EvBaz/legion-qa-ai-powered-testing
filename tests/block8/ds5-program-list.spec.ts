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

  test('TC-001: Each program\'s name and description are visible in the list', async () => {
    const nameOne = uniqueName('YB Web Development 2026');
    const descOne = 'Full-stack web development program';
    const nameTwo = uniqueName('YB Data Science 101');
    const descTwo = 'Intro to data science and analytics';

    await programs.createProgram(nameOne, descOne);
    await programs.createProgram(nameTwo, descTwo);
    await programs.goto();

    const rowOne = programs.programRow(nameOne);
    const rowTwo = programs.programRow(nameTwo);
    await expect(rowOne).toBeVisible();
    await expect(rowOne).toContainText(descOne);
    await expect(rowTwo).toBeVisible();
    await expect(rowTwo).toContainText(descTwo);
  });

  test('TC-004: Newly created program appears in the list immediately', async () => {
    const programName = uniqueName('YB New Program 2026');
    await programs.goto();

    await programs.openNewProgramModal();
    await programs.newProgramModal.create(programName, 'Fresh entry');

    await expect(programs.programRow(programName)).toBeVisible({ timeout: 10000 });
  });

  test('TC-005: Edited program data is reflected in the list immediately', async () => {
    const programName = uniqueName('YB Old Name');
    const updatedName = `${programName} Updated`;
    const updatedDescription = 'Updated description text';
    await programs.createProgram(programName, 'Original description');
    await programs.goto();

    await programs.openEditModal(programName);
    await programs.editProgramModal.fillProgramName(updatedName);
    await programs.editProgramModal.fillDescription(updatedDescription);
    await programs.editProgramModal.save();

    const row = programs.programRow(updatedName);
    await expect(row).toBeVisible({ timeout: 10000 });
    await expect(row).toContainText(updatedDescription);
    await expect(programs.programRow(programName)).toBeHidden();
  });

  test('TC-006: Deleted program is removed from the list immediately', async () => {
    const keepName = uniqueName('YB Keep Program');
    const deleteName = uniqueName('YB Deleted Program');
    await programs.createProgram(keepName, 'Stays');
    await programs.createProgram(deleteName, 'Goes');
    await programs.goto();

    await programs.deleteProgram(deleteName, { confirm: true });

    await expect(programs.programRow(deleteName)).toBeHidden({ timeout: 10000 });
    await expect(programs.programRow(keepName)).toBeVisible();
  });

  test('TC-007: A program with no description is displayed without layout issues', async () => {
    const programName = uniqueName('YB No Desc Program');
    await programs.createProgram(programName);
    await programs.goto();

    const row = programs.programRow(programName);
    await expect(row).toBeVisible();
    await expect(row).toContainText(programName);
  });
});

// --- 2. Negative Flows ---

test.describe('Negative Flows', () => {
  let programs: ProgramsPage;

  test.beforeEach(async ({ page }) => {
    programs = new ProgramsPage(page);
  });

  test.skip('TC-008: Non-admin users can view the list but cannot see management controls', async () => {
    // Requires non-admin credentials which are not available
  });
});

// --- 3. Edge Cases ---

test.describe('Edge Cases', () => {
  let programs: ProgramsPage;

  test.beforeEach(async ({ page }) => {
    programs = new ProgramsPage(page);
  });

  test('TC-013: A program with a very long description is displayed cleanly', async () => {
    const programName = uniqueName('YB Long Desc Display');
    const longDescription = 'L'.repeat(500);
    await programs.createProgram(programName, longDescription);
    await programs.goto();

    const row = programs.programRow(programName);
    await expect(row).toBeVisible();
    await expect(row).toContainText(longDescription.slice(0, 50));
  });

  test('TC-014: Special characters, accents, and emojis in program names render correctly in the list', async () => {
    const specialName = uniqueName('Informatique & IA - Niveau 2');
    const accentedName = uniqueName('Développement Réseau');
    const emojiName = uniqueName('🎓 Graduate Studies');
    await programs.createProgram(specialName, 'Special chars');
    await programs.createProgram(accentedName, 'Accents');
    await programs.createProgram(emojiName, 'Emoji');
    await programs.goto();

    await expect(programs.programNameText(specialName)).toBeVisible();
    await expect(programs.programNameText(accentedName)).toBeVisible();
    await expect(programs.programNameText(emojiName)).toBeVisible();
  });

  test('TC-016: Rapid creation and deletion does not leave ghost entries in the list', async () => {
    const programName = uniqueName('YB Temp Program');
    await programs.goto();

    await programs.openNewProgramModal();
    await programs.newProgramModal.create(programName, 'Temporary');
    await expect(programs.programRow(programName)).toBeVisible({ timeout: 10000 });

    await programs.deleteProgram(programName, { confirm: true });
    await expect(programs.programRow(programName)).toBeHidden({ timeout: 10000 });
  });

  test('TC-017: Program list data is consistent after a full page refresh', async () => {
    const nameOne = uniqueName('YB Refresh A');
    const nameTwo = uniqueName('YB Refresh B');
    const descOne = 'First program description';
    const descTwo = 'Second program description';
    await programs.createProgram(nameOne, descOne);
    await programs.createProgram(nameTwo, descTwo);
    await programs.goto();

    await programs.reload();

    await expect(programs.programRow(nameOne)).toBeVisible();
    await expect(programs.programRow(nameOne)).toContainText(descOne);
    await expect(programs.programRow(nameTwo)).toBeVisible();
    await expect(programs.programRow(nameTwo)).toContainText(descTwo);
  });
});
