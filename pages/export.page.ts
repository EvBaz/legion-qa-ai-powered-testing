import { type Locator, type Page } from '@playwright/test';
import { BasePage } from './base.page';

export class ExportPage extends BasePage {
  readonly path = '/export';
  readonly heading: Locator;
  readonly subtitle: Locator;
  readonly programSelect: Locator;
  readonly semesterSelect: Locator;
  readonly jsonFormatCard: Locator;
  readonly csvFormatCard: Locator;
  readonly pdfFormatCard: Locator;
  readonly excelFormatCard: Locator;
  readonly exportButton: Locator;

  constructor(page: Page) {
    super(page);
    this.heading = page.getByRole('heading', { name: 'Export Schedule', level: 2 });
    this.subtitle = page.getByText('Export your semester schedule as JSON, CSV, PDF, or Excel');
    this.programSelect = page.getByRole('textbox', { name: 'Program' });
    this.semesterSelect = page.getByRole('textbox', { name: 'Semester' });
    this.jsonFormatCard = page.getByText('Full semester data in JSON format');
    this.csvFormatCard = page.getByText('Spreadsheet-compatible format');
    this.pdfFormatCard = page.getByText('Formatted schedule document');
    this.excelFormatCard = page.getByText('Multi-sheet workbook with course summary');
    this.exportButton = page.getByRole('button', { name: 'Export' });
  }

  async goto() {
    await this.page.goto(this.path);
  }
}
