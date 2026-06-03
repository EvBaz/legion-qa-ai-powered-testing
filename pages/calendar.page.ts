import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class CalendarPage extends BasePage {
  readonly path = '/calendar';
  readonly heading: Locator;
  readonly subtitle: Locator;
  readonly programSelect: Locator;
  readonly semesterSelect: Locator;
  readonly emptyStateHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Calendar', level: 2 });
    this.subtitle = page.getByText('Schedule sessions with drag-and-drop across month, week, and day views');
    this.programSelect = page.getByRole('textbox', { name: 'Program' });
    this.semesterSelect = page.getByRole('textbox', { name: 'Semester' });
    this.emptyStateHeading = page.getByText('Select a program and semester to view the calendar');
  }

  async goto() {
    await this.page.goto(this.path);
  }
}
