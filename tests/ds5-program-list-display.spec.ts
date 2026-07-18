import type { Page } from '@playwright/test';
import { test, expect } from '../fixtures/cleanup.fixture';
import { LoginPage, ProgramsPage } from '../pages';

function uniqueName(base: string): string {
  return `${base} ${Date.now()}`;
}

function longName255(): string {
  const suffix = ` ${Date.now()}`;
  return `${'A'.repeat(255 - suffix.length)}${suffix}`;
}

async function mockEmptyProgramsList(page: Page): Promise<void> {
  await page.route('**/api/programs', async (route) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ data: [] }),
      });
      return;
    }
    await route.continue();
  });
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

async function assertRowWithinViewport(
  programs: ProgramsPage,
  name: string,
  page: Page,
): Promise<void> {
  const rowBox = await programs.programRow(name).boundingBox();
  const viewport = page.viewportSize();
  expect(rowBox).not.toBeNull();
  expect(viewport).not.toBeNull();
  expect(rowBox!.x + rowBox!.width).toBeLessThanOrEqual(viewport!.width + 1);
}

test.describe('DS-5: Program List Filtering and Display', () => {
  test.describe('# Happy paths', () => {
    test('TC-001: Display program list with key details', { tag: ['@regression', '@smoke', '@sanity'] }, async ({ page }) => {
      const programs = new ProgramsPage(page);
      const name1 = uniqueName('Web Development 2026');
      const name2 = uniqueName('Data Science 101');
      const desc1 = 'Full-stack web development program';
      const desc2 = 'Intro to data science and analytics';

      await createProgramWithDescription(programs, name1, desc1);
      await programs.createProgram(name2, desc2);
      await programs.goto();

      await expect(programs.programRow(name1)).toBeVisible();
      await expect(programs.programRow(name2)).toBeVisible();
      await expect(programs.programRow(name1)).toContainText(desc1);
      await expect(programs.programRow(name2)).toContainText(desc2);
    });

    test('TC-002: Empty state when no programs exist', { tag: ['@regression', '@sanity'] }, async ({ page }) => {
      const programs = new ProgramsPage(page);
      await mockEmptyProgramsList(page);
      await programs.goto();

      await expect(programs.emptyStateMessage).toBeVisible();
      await expect(programs.createProgramButton).toBeVisible();
    });

    test('TC-003: Empty state create prompt opens program creation', { tag: '@regression' }, async ({ page }) => {
      const programs = new ProgramsPage(page);
      await mockEmptyProgramsList(page);
      await programs.goto();

      await programs.createProgramButton.click();

      await expect(programs.newProgramModal.dialog).toBeVisible();
      await expect(programs.newProgramModal.programNameInput).toBeVisible();
      await expect(programs.newProgramModal.descriptionInput).toBeVisible();
    });

    test('TC-004: Program list updates immediately after creating a program', { tag: ['@regression', '@sanity'] }, async ({ page }) => {
      const programs = new ProgramsPage(page);
      const existingName = uniqueName('Existing Program');
      const newName = uniqueName('New Program 2026');

      await programs.goto();
      await programs.openNewProgramModal();
      await programs.newProgramModal.create(existingName, 'Existing program for list update test');
      await expect(programs.programRow(existingName)).toBeVisible();

      await programs.openNewProgramModal();
      await programs.newProgramModal.create(newName, 'Newly created program');

      await expect(programs.newProgramModal.dialog).toBeHidden({ timeout: 10000 });
      await expect(programs.programRow(newName)).toBeVisible({ timeout: 10000 });
    });

    test('TC-005: Program list updates immediately after editing a program', { tag: '@regression' }, async ({ page }) => {
      const programs = new ProgramsPage(page);
      const oldName = uniqueName('Old Name');
      const updatedName = uniqueName('Updated Name');
      await createProgramWithDescription(programs, oldName, 'Program pending rename');

      await programs.openEditModal(oldName);
      await programs.editProgramModal.fillProgramName(updatedName);
      await programs.editProgramModal.save();

      await expect(programs.editProgramModal.dialog).not.toBeVisible();
      await expect(programs.programNameText(updatedName)).toBeVisible();
      await expect(programs.programNameText(oldName)).not.toBeVisible();
    });

    test('TC-006: Program list updates immediately after deleting a program', { tag: '@regression' }, async ({ page }) => {
      const programs = new ProgramsPage(page);
      const toDelete = uniqueName('Deleted Program');
      const toKeep = uniqueName('Remaining Program');

      await createProgramWithDescription(programs, toDelete, 'Program marked for deletion');
      await programs.createProgram(toKeep, 'Program that should remain visible');
      await expect(programs.programRow(toKeep)).toBeVisible();

      await programs.deleteProgram(toDelete, { confirm: true });

      await expect(programs.programRow(toDelete)).toBeHidden();
      await expect(programs.programRow(toKeep)).toBeVisible();
    });

    test('TC-007: Program with empty description displays correctly', { tag: ['@regression', '@sanity'] }, async ({ page }) => {
      const programs = new ProgramsPage(page);
      const name = uniqueName('No Desc Program');

      await programs.goto();
      await programs.openNewProgramModal();
      await programs.newProgramModal.fillProgramName(name);
      await programs.newProgramModal.submitCreate();

      await expect(programs.newProgramModal.dialog).toBeHidden({ timeout: 10000 });
      await expect(programs.programNameText(name)).toBeVisible();
    });

    test('TC-008: Empty state is replaced after the first program is created', { tag: '@regression' }, async ({ page }) => {
      const programs = new ProgramsPage(page);
      const name = uniqueName('First Program');

      await mockEmptyProgramsList(page);
      await programs.goto();
      await expect(programs.emptyStateMessage).toBeVisible();

      await programs.createProgramButton.click();
      await expect(programs.newProgramModal.dialog).toBeVisible();
      await page.unroute('**/api/programs');
      await programs.newProgramModal.create(name, 'First program in empty state flow');

      await expect(programs.emptyStateMessage).toBeHidden();
      await expect(programs.programRow(name)).toBeVisible();
    });
  });

  test.describe('# Negative', () => {
    test.skip('TC-009: Non-admin user sees the list but not management controls', { tag: '@regression' }, async () => {
      // Blocked: non-admin credentials unavailable — see features/DS-5.feature.md ambiguities.
    });

    test.use({ storageState: { cookies: [], origins: [] } });

    test('TC-010: Unauthenticated user cannot access the Programs page', { tag: ['@regression', '@sanity'] }, async ({ page }) => {
      const programs = new ProgramsPage(page);
      const login = new LoginPage(page);

      await programs.goto();

      await expect(login.heading).toBeVisible();
      await expect(page).toHaveURL(/\/login/);
    });
  });

  test.describe('# Edge cases', () => {
    test('TC-011: Program with a 255-character name displays without breaking layout', { tag: '@regression' }, async ({
      page,
    }) => {
      const programs = new ProgramsPage(page);
      const name = longName255();

      await createProgramWithDescription(programs, name, 'Long name layout test');
      await programs.goto();

      await assertRowWithinViewport(programs, name, page);
    });

    test('TC-012: Program with special characters displays correctly in the list', { tag: '@regression' }, async ({
      page,
    }) => {
      const programs = new ProgramsPage(page);
      const names = [
        uniqueName('Informatique & IA - Niveau 2'),
        uniqueName('Développement Réseau'),
        uniqueName('🎓 Graduate Studies'),
      ];

      await createProgramWithDescription(programs, names[0], 'French CS program');
      await programs.createProgram(names[1], 'Network development track');
      await programs.createProgram(names[2], 'Graduate studies program');
      await programs.goto();

      for (const name of names) {
        await expect(programs.programNameText(name)).toBeVisible();
      }
    });

    test('TC-013: Rapid create-then-delete does not leave ghost entries', { tag: '@regression' }, async ({ page }) => {
      const programs = new ProgramsPage(page);
      const name = uniqueName('Temp Program');

      await programs.goto();
      await programs.createProgram(name, 'Temporary program for rapid delete');
      await expect(programs.programRow(name)).toBeVisible();

      await programs.deleteProgram(name, { confirm: true });

      await expect(programs.programRow(name)).toBeHidden();
      await expect(programs.programNameText(name)).toBeHidden();
    });

    test('TC-014: Program list is consistent after a full page refresh', { tag: '@regression' }, async ({ page }) => {
      const programs = new ProgramsPage(page);
      const name1 = uniqueName('Refresh Alpha');
      const name2 = uniqueName('Refresh Beta');

      await createProgramWithDescription(programs, name1, 'First program for refresh check');
      await programs.createProgram(name2, 'Second program for refresh check');
      await programs.goto();

      await expect(programs.programRow(name1)).toBeVisible();
      await expect(programs.programRow(name2)).toBeVisible();

      await programs.reload();
      await programs.goto();

      await expect(programs.programRow(name1)).toBeVisible();
      await expect(programs.programRow(name2)).toBeVisible();
      await expect(programs.programRow(name1)).toContainText('First program for refresh check');
      await expect(programs.programRow(name2)).toContainText('Second program for refresh check');
    });
  });
});
