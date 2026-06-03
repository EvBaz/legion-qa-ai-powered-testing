import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class ValidationPage extends BasePage {
  readonly path = '/validation';
  readonly heading: Locator;
  readonly subtitle: Locator;
  readonly programSelect: Locator;
  readonly semesterSelect: Locator;
  readonly revalidateButton: Locator;
  readonly emptyStateHeading: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Validation', level: 2 });
    this.subtitle = page.getByText('Check schedule for conflicts and constraint violations');
    this.programSelect = page.getByRole('textbox', { name: 'Program' });
    this.semesterSelect = page.getByRole('textbox', { name: 'Semester' });
    this.revalidateButton = page.getByRole('button', { name: 'Re-validate' });
    this.emptyStateHeading = page.getByText('No semester selected');
  }

  async goto() {
    await this.page.goto(this.path);
  }
}
