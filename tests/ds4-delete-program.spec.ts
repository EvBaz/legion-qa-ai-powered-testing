import { test, expect } from '../fixtures/cleanup.fixture';
import { ProgramsPage } from '../pages';

function uniqueName(base: string): string {
  return `${base} ${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

async function createProgramOnList(programs: ProgramsPage, name: string): Promise<void> {
  await programs.goto();
  await programs.createProgram(name, 'Program created for delete tests');
  await expect(programs.programRow(name)).toHaveCount(1);
}

test.describe('DS-4: Delete Program with Confirmation', () => {
  test.describe('# Happy paths', () => {
    test('TC-001: Delete program with confirmation', async ({ page }) => {
      const programs = new ProgramsPage(page);
      const name = uniqueName('Test Program');
      await createProgramOnList(programs, name);

      const dialog = await programs.openDeleteDialog(name);
      expect(dialog.type()).toBe('confirm');
      await dialog.accept();

      await expect(programs.programRow(name)).toBeHidden();
      await expect(programs.programNameText(name)).toBeHidden();
    });

    test('TC-002: Cancel program deletion', async ({ page }) => {
      const programs = new ProgramsPage(page);
      const name = uniqueName('Test Program');
      await createProgramOnList(programs, name);

      await programs.deleteProgram(name, { confirm: false });

      await expect(programs.programRow(name)).toBeVisible();
      await expect(programs.programNameText(name)).toBeVisible();
    });
  });

  test.describe('# Negative', () => {
    test('TC-003: Dismissing the confirmation dialog keeps the program', async ({ page }) => {
      const programs = new ProgramsPage(page);
      const name = uniqueName('Test Program');
      await createProgramOnList(programs, name);

      const dialog = await programs.openDeleteDialog(name);
      expect(dialog.type()).toBe('confirm');
      await dialog.dismiss();

      await expect(programs.programRow(name)).toBeVisible();
    });

    test.skip('TC-004: Non-admin users do not see the delete action', async () => {
      // Blocked: non-admin credentials unavailable — see features/DS-4.feature.md ambiguities.
    });
  });

  test.describe('# Edge cases', () => {
    test('TC-005: Confirmed deletion persists after a full page reload', async ({ page }) => {
      const programs = new ProgramsPage(page);
      const name = uniqueName('Test Program');
      await createProgramOnList(programs, name);

      await programs.deleteProgram(name, { confirm: true });
      await expect(programs.programRow(name)).toBeHidden();

      await programs.reload();
      await programs.goto();
      await expect(programs.programRow(name)).toBeHidden();
    });

    test('TC-006: Deleting one program does not remove other programs', async ({ page }) => {
      const programs = new ProgramsPage(page);
      const toDelete = uniqueName('Delete Me');
      const toKeep = uniqueName('Keep Me');

      await createProgramOnList(programs, toDelete);
      await programs.createProgram(toKeep, 'Second program for isolation check');
      await expect(programs.programRow(toKeep)).toBeVisible();

      await programs.deleteProgram(toDelete, { confirm: true });

      await expect(programs.programRow(toDelete)).toBeHidden();
      await expect(programs.programRow(toKeep)).toBeVisible();
    });

    test('TC-007: Confirmation dialog references the program being deleted', async ({ page }) => {
      const programs = new ProgramsPage(page);
      const name = uniqueName('Test Program');
      await createProgramOnList(programs, name);

      const dialog = await programs.openDeleteDialog(name);
      expect(dialog.message()).toContain(name);
      await dialog.dismiss();

      await expect(programs.programRow(name)).toBeVisible();
    });

    test('TC-008: Cancelled deletion can be retried and then confirmed', async ({ page }) => {
      const programs = new ProgramsPage(page);
      const name = uniqueName('Test Program');
      await createProgramOnList(programs, name);

      await programs.deleteProgram(name, { confirm: false });
      await expect(programs.programRow(name)).toHaveCount(1);

      await programs.deleteProgram(name, { confirm: true });
      await expect(programs.programRow(name)).toBeHidden();
    });
  });
});
