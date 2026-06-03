import { test, expect } from '../../fixtures/cleanup.fixture';
import { ProgramsPage } from '../../pages';

function uniqueName(base: string): string {
  return `${base} ${Date.now()}`;
}

const KNOWN_DUP_CREATE =
  'Known demo bug — duplicate program names are allowed on create.';
const KNOWN_DUP_RENAME =
  'Known demo bug — duplicate program names are allowed on rename.';

// --- 1. Positive Flows ---

test.describe('Positive Flows', () => {
  let programs: ProgramsPage;

  test.beforeEach(async ({ page }) => {
    programs = new ProgramsPage(page);
  });

  test('TC-001: Special characters in program name are accepted and stored correctly', async () => {
    const programName = uniqueName('Informatique & IA - Niveau 2');
    const modal = programs.newProgramModal;

    await programs.gotoAndOpenNewProgramModal();
    await modal.create(programName, 'French CS program');

    await expect(modal.dialog).toBeHidden({ timeout: 10000 });
    await expect(programs.programNameText(programName)).toBeVisible({ timeout: 10000 });
  });

  test('TC-002: Accented and diacritical characters are accepted in program names', async () => {
    const programName = uniqueName('Développement Réseau Avancé');
    const modal = programs.newProgramModal;

    await programs.gotoAndOpenNewProgramModal();
    await modal.create(programName);

    await expect(modal.dialog).toBeHidden({ timeout: 10000 });
    await expect(programs.programNameText(programName)).toBeVisible({ timeout: 10000 });
  });

  test('TC-003: Parentheses, slashes, and common punctuation are valid in program names', async () => {
    const programName = uniqueName('AI/ML (Advanced) - Fall/Winter 2026');
    const modal = programs.newProgramModal;

    await programs.gotoAndOpenNewProgramModal();
    await modal.create(programName);

    await expect(modal.dialog).toBeHidden({ timeout: 10000 });
    await expect(programs.programNameText(programName)).toBeVisible({ timeout: 10000 });
  });

  test('TC-004: Numeric values and hyphens are valid in program names', async () => {
    const programName = uniqueName('CS-101: Intro to Programming 2026-2027');
    const modal = programs.newProgramModal;

    await programs.gotoAndOpenNewProgramModal();
    await modal.create(programName);

    await expect(modal.dialog).toBeHidden({ timeout: 10000 });
    await expect(programs.programNameText(programName)).toBeVisible({ timeout: 10000 });
  });

  test('TC-005: A completely unique program name passes validation', async () => {
    const programName = uniqueName('Quantum Computing 2026');
    const modal = programs.newProgramModal;

    await programs.gotoAndOpenNewProgramModal();
    await modal.create(programName);

    await expect(modal.dialog).toBeHidden({ timeout: 10000 });
    await expect(programs.programRow(programName)).toBeVisible({ timeout: 10000 });
  });
});

// --- 2. Negative Flows ---

test.describe('Negative Flows', () => {
  let programs: ProgramsPage;

  test.beforeEach(async ({ page }) => {
    programs = new ProgramsPage(page);
  });

  test('TC-006: Whitespace-only program name is treated as empty and rejected', async () => {
    const modal = programs.newProgramModal;

    await programs.gotoAndOpenNewProgramModal();
    await modal.fillProgramName('   ');
    await expect(modal.createButton).toBeDisabled();
  });

  test('TC-007: Creating a program with an exact duplicate name shows an error', async () => {
    test.fail(true, KNOWN_DUP_CREATE);

    const existingName = uniqueName('Web Development 2026');
    const modal = programs.newProgramModal;

    await programs.createProgram(existingName);
    await programs.gotoAndOpenNewProgramModal();
    await modal.create(existingName);

    await expect(modal.dialog).toBeVisible();
    await expect(modal.validationError).toBeVisible();
    await expect(programs.programRow(existingName)).toHaveCount(1);
  });

  test('TC-008: Case-insensitive duplicate detection prevents lowercase variant', async () => {
    test.fail(true, KNOWN_DUP_CREATE);

    const existingName = uniqueName('Web Development 2026');
    const modal = programs.newProgramModal;

    await programs.createProgram(existingName);
    await programs.gotoAndOpenNewProgramModal();
    await modal.create(existingName.toLowerCase());

    await expect(modal.dialog).toBeVisible();
    await expect(modal.validationError).toBeVisible();
  });

  test('TC-009: Duplicate detection catches names that match after trimming whitespace', async () => {
    test.fail(true, KNOWN_DUP_CREATE);

    const existingName = uniqueName('Web Development 2026');
    const modal = programs.newProgramModal;

    await programs.createProgram(existingName);
    await programs.gotoAndOpenNewProgramModal();
    await modal.create(`  ${existingName}  `);

    await expect(modal.dialog).toBeVisible();
    await expect(modal.validationError).toBeVisible();
    await expect(programs.programRow(existingName)).toHaveCount(1);
  });

  test('TC-010: Tab characters in the program name are treated as whitespace', async () => {
    const modal = programs.newProgramModal;

    await programs.gotoAndOpenNewProgramModal();
    await modal.fillProgramName('\t\t\t');
    await expect(modal.createButton).toBeDisabled();
  });

  test('TC-011: HTML and script tags in program name are stored as plain text', async () => {
    const programName = `<script>alert('XSS')</script> ${Date.now()}`;
    const modal = programs.newProgramModal;

    await programs.gotoAndOpenNewProgramModal();
    await modal.create(programName);

    await expect(modal.dialog).toBeHidden({ timeout: 10000 });
    await expect(programs.programNameText(programName)).toBeVisible({ timeout: 10000 });
  });

  test('TC-012: SQL injection strings in program name are handled safely', async () => {
    const programName = `'; DROP TABLE programs; -- ${Date.now()}`;
    const modal = programs.newProgramModal;

    await programs.gotoAndOpenNewProgramModal();
    await modal.create(programName);

    await expect(modal.dialog).toBeHidden({ timeout: 10000 });
    await expect(programs.programNameText(programName)).toBeVisible({ timeout: 10000 });
  });
});

// --- 3. Edge Cases ---

test.describe('Edge Cases', () => {
  let programs: ProgramsPage;

  test.beforeEach(async ({ page }) => {
    programs = new ProgramsPage(page);
  });

  test('TC-013: A name that is a partial match of an existing name is not treated as duplicate', async () => {
    const suffix = Date.now();
    const fullName = `Web Development 2026 ${suffix}`;
    const partialName = `Web Development ${suffix}`;
    const modal = programs.newProgramModal;

    await programs.createProgram(fullName);
    await programs.gotoAndOpenNewProgramModal();
    await modal.create(partialName);

    await expect(modal.dialog).toBeHidden({ timeout: 10000 });
    await expect(programs.programRow(partialName)).toBeVisible({ timeout: 10000 });
  });

  test('TC-014: A purely numeric program name is accepted', async () => {
    const programName = String(Date.now());
    const modal = programs.newProgramModal;

    await programs.gotoAndOpenNewProgramModal();
    await modal.create(programName);

    await expect(modal.dialog).toBeHidden({ timeout: 10000 });
    await expect(programs.programNameText(programName)).toBeVisible({ timeout: 10000 });
  });

  test('TC-015: Internal multiple spaces in program name are preserved', async () => {
    const programName = uniqueName('Web    Development    2026');
    const modal = programs.newProgramModal;

    await programs.gotoAndOpenNewProgramModal();
    await modal.create(programName);

    await expect(modal.dialog).toBeHidden({ timeout: 10000 });
    await expect(programs.programNameText(programName)).toBeVisible({ timeout: 10000 });
  });

  test('TC-016: Duplicate validation applies when renaming an existing program', async () => {
    test.fail(true, KNOWN_DUP_RENAME);

    const programA = uniqueName('Program A');
    const programB = uniqueName('Program B');
    const editModal = programs.editProgramModal;

    await programs.createProgram(programA);
    await programs.createProgram(programB);
    await programs.openEditModal(programB);
    await editModal.fillProgramName(programA);
    await editModal.save();

    await expect(editModal.dialog).toBeVisible();
    await expect(editModal.validationError).toBeVisible();
    await expect(programs.programRow(programB)).toBeVisible();
  });

  test('TC-017: Emoji characters in program name are handled correctly', async () => {
    const programName = uniqueName('🎓 Graduate Studies 2026');
    const modal = programs.newProgramModal;

    await programs.gotoAndOpenNewProgramModal();
    await modal.create(programName);

    await expect(modal.dialog).toBeHidden({ timeout: 10000 });
    await expect(programs.programNameText(programName)).toBeVisible({ timeout: 10000 });
  });

  test('TC-018: A single-character program name passes validation', async () => {
    const programName = 'Z';
    const modal = programs.newProgramModal;

    await programs.gotoAndOpenNewProgramModal();
    await modal.create(programName);

    await expect(modal.dialog).toBeHidden({ timeout: 10000 });
    await expect(programs.programNameText(programName)).toBeVisible({ timeout: 10000 });
  });

  test('TC-019: Names that differ only by punctuation are not treated as duplicates', async () => {
    const baseName = uniqueName('Web Development 2026');
    const punctuatedName = baseName.replace('2026', ', 2026');
    const modal = programs.newProgramModal;

    await programs.createProgram(baseName);
    await programs.gotoAndOpenNewProgramModal();
    await modal.create(punctuatedName);

    await expect(modal.dialog).toBeHidden({ timeout: 10000 });
    await expect(programs.programRow(punctuatedName)).toBeVisible({ timeout: 10000 });
  });
});
