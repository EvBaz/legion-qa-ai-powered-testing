import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class SchedulerPage extends BasePage {
  readonly path = '/scheduler';
  readonly heading: Locator;
  readonly subtitle: Locator;
  readonly programSelect: Locator;
  readonly semesterSelect: Locator;
  readonly emptyStateHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Auto Scheduler', level: 2 });
    this.subtitle = page.getByText(
      'Generate a deterministic session schedule from course session plans. Preview before applying.',
    );
    this.programSelect = page.getByRole('textbox', { name: 'Program' });
    this.semesterSelect = page.getByRole('textbox', { name: 'Semester' });
    this.emptyStateHeading = page.getByText('Select a program and semester to begin');
  }

  async goto() {
    await this.page.goto(this.path);
  }
}
