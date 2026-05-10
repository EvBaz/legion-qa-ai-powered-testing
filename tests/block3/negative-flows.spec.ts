import { test, expect } from '@playwright/test';

const APP_URL = 'https://demo.playwright.dev/todomvc/#/';

test.describe('Negative Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(APP_URL);
  });

  test('TC-011: Empty input does not create a todo', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.press('Enter');

    await expect(page.locator('.todo-list li')).toHaveCount(0);
    await expect(page.locator('.footer')).toBeHidden();
  });

  test('TC-012: Whitespace-only input does not create a todo', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('     ');
    await input.press('Enter');

    await expect(page.locator('.todo-list li')).toHaveCount(0);
  });

  test('TC-013: Destroy button does not appear without hover', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Buy groceries');
    await input.press('Enter');

    const destroyButton = page.locator('.todo-list li').first().locator('.destroy');
    await expect(destroyButton).toBeHidden();
  });

  test('TC-014: Editing a todo to empty text removes the item', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Buy groceries');
    await input.press('Enter');

    const todoItem = page.locator('.todo-list li').first();
    await todoItem.dblclick();

    const editInput = todoItem.locator('.edit');
    await editInput.fill('');
    await editInput.press('Enter');

    await expect(page.locator('.todo-list li')).toHaveCount(0);
  });

  test('TC-015: Pressing Escape during edit cancels the change', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Buy groceries');
    await input.press('Enter');

    const todoItem = page.locator('.todo-list li').first();
    await todoItem.dblclick();

    const editInput = todoItem.locator('.edit');
    await editInput.fill('Buy milk');
    await editInput.press('Escape');

    await expect(page.locator('.todo-list li').first()).toHaveText('Buy groceries');
  });
});
