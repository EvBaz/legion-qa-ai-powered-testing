import { type Locator, type Page } from '@playwright/test';

export class BasePage {
  readonly page: Page;
  readonly navigation: Locator;
  readonly signOutButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navigation = page.getByRole('navigation');
    this.signOutButton = page.getByRole('button', { name: 'Sign out' });
  }

  async gotoDashboard() {
    await this.page.getByRole('button', { name: '📊 Dashboard' }).click();
  }

  async gotoPrograms() {
    await this.page.getByRole('button', { name: '🎓 Programs' }).click();
  }

  async gotoCalendar() {
    await this.page.getByRole('button', { name: '📅 Calendar' }).click();
  }

  async gotoValidation() {
    await this.page.getByRole('button', { name: '✅ Validation' }).click();
  }

  async gotoScheduler() {
    await this.page.getByRole('button', { name: '⚡ Scheduler' }).click();
  }

  async gotoExport() {
    await this.page.getByRole('button', { name: '📤 Export' }).click();
  }

  async gotoSettings() {
    await this.page.getByRole('button', { name: '⚙️ Settings' }).click();
  }

  async signOut() {
    await this.signOutButton.click();
  }
}
