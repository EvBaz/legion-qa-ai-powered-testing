import { test, expect } from '../fixtures/cleanup.fixture';
import { ProgramsPage } from '../pages';

function uniqueName(base: string): string {
  return `${base} ${Date.now()}`;
}

async function createProgramOnList(programs: ProgramsPage, name: string): Promise<void> {
  await programs.goto();
  await programs.createProgram(name, 'Program for semester panel tests');
  await expect(programs.programRow(name)).toHaveCount(1);
}

test.describe('Program semester panel selection (discovered)', () => {
  test.describe('# Positive flows', () => {
    test('TC-001: Selecting a program reveals the semester management panel', async ({ page }) => {
      const programs = new ProgramsPage(page);
      const name = uniqueName('Semester Panel Program');
      await createProgramOnList(programs, name);

      await programs.reload();
      await expect(programs.addSemesterButton).toBeHidden();
      await expect(programs.programDetailHeading(name)).toBeHidden();

      await programs.selectProgram(name);

      await expect(programs.programDetailHeading(name)).toBeVisible();
      await expect(programs.semestersSectionHeading).toBeVisible();
      await expect(programs.addSemesterButton).toBeVisible();
      await expect(programs.manageCoursesButton).toBeVisible();
      await expect(programs.detailPanel(name)).toBeVisible();
    });
  });

  test.describe('# Edge cases', () => {
    test('TC-002: Switching program selection updates the semester panel context', async ({
      page,
    }) => {
      const programs = new ProgramsPage(page);
      const alpha = uniqueName('Semester Panel Alpha');
      const beta = uniqueName('Semester Panel Beta');

      await createProgramOnList(programs, alpha);
      await programs.createProgram(beta, 'Second program for panel switch test');
      await expect(programs.programRow(beta)).toHaveCount(1);

      await programs.selectProgram(alpha);
      await expect(programs.programDetailHeading(alpha)).toBeVisible();
      await expect(programs.programDetailHeading(beta)).toBeHidden();

      await programs.selectProgram(beta);
      await expect(programs.programDetailHeading(beta)).toBeVisible();
      await expect(programs.programDetailHeading(alpha)).toBeHidden();
      await expect(programs.detailPanel(beta)).toBeVisible();
    });
  });
});
