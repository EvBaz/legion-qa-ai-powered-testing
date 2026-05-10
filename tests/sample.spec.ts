import { test, expect } from '@playwright/test';

test('homepage has Playwright in title', async ({ page }) => {
  await page.goto('/');

  await expect(page).toHaveTitle(/Playwright/);
});

test('get started link navigates to intro page', async ({ page }) => {
  await page.goto('/');

  await page.getByRole('link', { name: 'Get started' }).click();

  await expect(page.getByRole('heading', { name: 'Installation' })).toBeVisible();
});
