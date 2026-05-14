import { test, Page } from '@playwright/test';

const LOGIN_URL = '/login';
const PROGRAMS_URL = '/programs';
const TEST_PREFIXES = [
  'YB ',
];

async function login(page: Page) {
  await page.goto(LOGIN_URL);
  await page.getByLabel('Email').fill(process.env.DIDAXIS_EMAIL!);
  await page.getByLabel('Password').fill(process.env.DIDAXIS_PASSWORD!);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15000 });
}

test('Cleanup: delete all test programs matching prefixes', async ({ page }) => {
  test.setTimeout(600_000);

  await login(page);
  await page.goto(PROGRAMS_URL);
  await page.getByRole('table').waitFor({ state: 'visible', timeout: 30000 });

  let totalDeleted = 0;

  for (const prefix of TEST_PREFIXES) {
    let prefixDeleted = 0;

    while (true) {
      await page.getByRole('table').waitFor({ state: 'visible', timeout: 10000 }).catch(() => {});

      const matchingRows = page.getByRole('row').filter({ hasText: prefix });
      const count = await matchingRows.count();
      if (count === 0) break;

      const targetText = await matchingRows.first().textContent();
      page.once('dialog', (dialog) => dialog.accept());
      await matchingRows.first().getByRole('button', { name: '🗑' }).click();

      if (targetText) {
        await page.getByText(targetText).waitFor({ state: 'detached', timeout: 10000 }).catch(() => {});
      }
      prefixDeleted++;
    }

    if (prefixDeleted > 0) {
      console.log(`"${prefix}": deleted ${prefixDeleted}`);
    }
    totalDeleted += prefixDeleted;
  }

  console.log(`Cleanup complete: deleted ${totalDeleted} test program(s).`);
});
