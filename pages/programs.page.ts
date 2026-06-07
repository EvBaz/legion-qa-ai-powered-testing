import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';
import { EditProgramModal } from './edit-program.modal';
import { NewProgramModal } from './new-program.modal';

export class ProgramsPage extends BasePage {
  readonly path = '/programs';
  readonly heading: Locator;
  readonly subtitle: Locator;
  readonly newProgramButton: Locator;
  readonly programsTable: Locator;
  readonly selectProgramHint: Locator;
  readonly newProgramModal: NewProgramModal;
  readonly editProgramModal: EditProgramModal;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Programs', level: 2 });
    this.subtitle = page.getByText('Manage academic programs and semesters');
    this.newProgramButton = page.getByRole('button', { name: '+ New Program' });
    this.programsTable = page.getByRole('table');
    this.selectProgramHint = page.getByText('Select a program to manage semesters');
    this.newProgramModal = new NewProgramModal(page);
    this.editProgramModal = new EditProgramModal(page);
  }

  async goto() {
    await this.page.goto(this.path);
  }

  async reload() {
    await this.page.reload();
  }

  async gotoAndOpenNewProgramModal() {
    await this.goto();
    await this.openNewProgramModal();
  }

  programNameText(name: string): Locator {
    return this.page.getByText(name, { exact: true });
  }

  programRow(name: string): Locator {
    return this.page.getByRole('row').filter({
      has: this.page.getByText(name, { exact: true }),
    });
  }

  editButton(programName: string): Locator {
    return this.programRow(programName).getByRole('button', { name: new RegExp(`^Edit ${this.escapeRegex(programName)}`) });
  }

  deleteButton(programName: string): Locator {
    return this.programRow(programName).getByRole('button', { name: new RegExp(`^Delete ${this.escapeRegex(programName)}`) });
  }

  detailPanel(programName: string): Locator {
    return this.page.locator('main').filter({ has: this.page.getByRole('heading', { name: programName, level: 4 }) });
  }

  async openNewProgramModal() {
    await this.newProgramButton.click();
  }

  async selectProgram(name: string) {
    await this.programRow(name).click();
  }

  async openEditModal(programName: string) {
    await this.editButton(programName).click();
  }

  async deleteProgram(programName: string, { confirm = true }: { confirm?: boolean } = {}) {
    this.page.once('dialog', (dialog) => {
      if (confirm) {
        void dialog.accept();
      } else {
        void dialog.dismiss();
      }
    });
    await this.deleteButton(programName).click();
  }

  async createProgram(name: string, description?: string) {
    await this.gotoAndOpenNewProgramModal();
    await this.newProgramModal.create(name, description);
  }

  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
