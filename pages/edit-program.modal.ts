import { type Locator, type Page } from '@playwright/test';

export class EditProgramModal {
  readonly page: Page;
  readonly dialog: Locator;
  readonly programNameInput: Locator;
  readonly descriptionInput: Locator;
  readonly saveButton: Locator;
  readonly cancelButton: Locator;
  readonly showAiConfigButton: Locator;
  readonly validationError: Locator;

  constructor(page: Page) {
    this.page = page;
    this.dialog = page.getByRole('dialog', { name: 'Edit Program' });
    this.programNameInput = this.dialog.getByLabel('Program Name');
    this.descriptionInput = this.dialog.getByLabel('Description');
    this.saveButton = this.dialog.getByRole('button', { name: 'Save' });
    this.cancelButton = this.dialog.getByRole('button', { name: 'Cancel' });
    this.showAiConfigButton = this.dialog.getByRole('button', { name: /Show AI Generation Config/ });
    this.validationError = this.dialog.getByText(/already exists|duplicate/i);
  }

  async fillProgramName(name: string) {
    await this.programNameInput.clear();
    await this.programNameInput.fill(name);
  }

  async fillDescription(description: string) {
    await this.descriptionInput.clear();
    await this.descriptionInput.fill(description);
  }

  async clearDescription() {
    await this.descriptionInput.clear();
  }

  async save() {
    await this.saveButton.click();
  }

  async cancel() {
    await this.cancelButton.click();
  }
}
