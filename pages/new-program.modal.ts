import { type Locator, type Page } from '@playwright/test';

export class NewProgramModal {
  readonly page: Page;
  readonly dialog: Locator;
  readonly programNameInput: Locator;
  readonly descriptionInput: Locator;
  readonly createButton: Locator;
  readonly cancelButton: Locator;
  readonly showAiConfigButton: Locator;
  readonly validationError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dialog = page.getByRole('dialog', { name: 'New Programs' });
    this.programNameInput = this.dialog.getByLabel('Program Name');
    this.descriptionInput = this.dialog.getByLabel('Description');
    this.createButton = this.dialog.getByRole('button', { name: 'Create', exact: true });
    this.cancelButton = this.dialog.getByRole('button', { name: 'Cancel' });
    this.showAiConfigButton = this.dialog.getByRole('button', { name: /Show AI Generation Config/ });
    this.validationError = this.dialog.getByText(/already exists|duplicate/i);
  }

  async fillProgramName(name: string) {
    await this.programNameInput.fill(name);
  }

  async clearProgramName() {
    await this.programNameInput.clear();
  }

  async fillDescription(description: string) {
    await this.descriptionInput.fill(description);
  }

  async getProgramNameValue(): Promise<string> {
    return this.programNameInput.inputValue();
  }

  async submitCreate() {
    await this.createButton.click();
  }

  async doubleClickCreate() {
    await this.createButton.dblclick();
  }

  async create(name: string, description?: string) {
    await this.fillProgramName(name);
    if (description) {
      await this.fillDescription(description);
    }
    await this.submitCreate();
  }

  async cancel() {
    await this.cancelButton.click();
  }
}
