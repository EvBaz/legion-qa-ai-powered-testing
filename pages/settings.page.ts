import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class SettingsPage extends BasePage {
  readonly path = '/settings';
  readonly heading: Locator;
  readonly calendarViewHeading: Locator;
  readonly accountHeading: Locator;
  readonly usersHeading: Locator;
  readonly apiTokensHeading: Locator;
  readonly addUserButton: Locator;
  readonly createTokenButton: Locator;
  readonly updatePasswordButton: Locator;
  readonly currentPasswordInput: Locator;
  readonly newPasswordInput: Locator;
  readonly usersTable: Locator;
  readonly apiTokensTable: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Settings', level: 2 });
    this.calendarViewHeading = page.getByRole('heading', { name: 'Calendar View', level: 4 });
    this.accountHeading = page.getByRole('heading', { name: 'Account', level: 4 });
    this.usersHeading = page.getByRole('heading', { name: 'Users', level: 4 });
    this.apiTokensHeading = page.getByRole('heading', { name: 'API Tokens', level: 4 });
    this.addUserButton = page.getByRole('button', { name: 'Add User' });
    this.createTokenButton = page.getByRole('button', { name: 'Create Token' });
    this.updatePasswordButton = page.getByRole('button', { name: 'Update Password' });
    this.currentPasswordInput = page.getByLabel('Current Password');
    this.newPasswordInput = page.getByLabel('New Password');
    this.usersTable = page.getByRole('table').filter({ has: page.getByRole('columnheader', { name: 'Role' }) });
    this.apiTokensTable = page.getByRole('table').filter({ has: page.getByRole('columnheader', { name: 'Last Used' }) });
  }

  dayCheckbox(day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun'): Locator {
    return this.page.getByRole('checkbox', { name: day });
  }

  async goto() {
    await this.page.goto(this.path);
  }
}
