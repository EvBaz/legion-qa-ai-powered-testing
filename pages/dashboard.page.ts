import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class DashboardPage extends BasePage {
  readonly heading: Locator;
  readonly welcomeText: Locator;
  readonly connectedBadge: Locator;
  readonly programsCard: Locator;
  readonly calendarCard: Locator;
  readonly validationCard: Locator;
  readonly aiAssistCard: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Dashboard', level: 2 });
    this.welcomeText = page.getByText('Welcome to Didaxis Studio');
    this.connectedBadge = page.getByText('Connected');
    this.programsCard = page.getByText('Manage academic programs');
    this.calendarCard = page.getByText('Schedule & drag-drop');
    this.validationCard = page.getByText('Check for conflicts');
    this.aiAssistCard = page.getByText('AI-powered editing');
  }

  async goto() {
    await this.page.goto('/');
  }
}
