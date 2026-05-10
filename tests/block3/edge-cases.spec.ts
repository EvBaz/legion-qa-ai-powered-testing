import { test, expect } from '@playwright/test';

const APP_URL = 'https://demo.playwright.dev/todomvc/#/';

test.describe('Edge Cases', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(APP_URL);
  });

  test('TC-016: Todo with special characters is added correctly', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    const specialText = 'Buy <milk> & "eggs" @store #1';
    await input.fill(specialText);
    await input.press('Enter');

    await expect(page.locator('.todo-list li').first()).toHaveText(specialText);
  });

  test('TC-017: Duplicate todo items are allowed', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Buy groceries');
    await input.press('Enter');
    await input.fill('Buy groceries');
    await input.press('Enter');

    const todos = page.locator('.todo-list li');
    await expect(todos).toHaveCount(2);
    await expect(todos.nth(0)).toHaveText('Buy groceries');
    await expect(todos.nth(1)).toHaveText('Buy groceries');
    await expect(page.locator('.todo-count')).toContainText('2 items left');
  });

  test('TC-018: Very long todo text is handled gracefully', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    const longText = 'a'.repeat(500);
    await input.fill(longText);
    await input.press('Enter');

    const todoItem = page.locator('.todo-list li').first();
    await expect(todoItem).toHaveCount(1);
    await expect(todoItem).toContainText(longText);
  });

  test('TC-019: Leading and trailing whitespace is trimmed from new items', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('   Buy groceries   ');
    await input.press('Enter');

    await expect(page.locator('.todo-list li').first()).toHaveText('Buy groceries');
  });

  test('TC-020: Todo item can be edited via double-click', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Buy groceries');
    await input.press('Enter');

    const todoItem = page.locator('.todo-list li').first();
    await todoItem.dblclick();

    const editInput = todoItem.locator('.edit');
    await editInput.fill('Buy milk');
    await editInput.press('Enter');

    await expect(page.locator('.todo-list li').first()).toHaveText('Buy milk');
  });

  test('TC-021: Item count updates correctly as items are added and removed', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');

    await input.fill('Item A');
    await input.press('Enter');
    await expect(page.locator('.todo-count')).toContainText('1 item left');

    await input.fill('Item B');
    await input.press('Enter');
    await expect(page.locator('.todo-count')).toContainText('2 items left');

    await page.locator('.todo-list li').first().locator('.toggle').check();
    await expect(page.locator('.todo-count')).toContainText('1 item left');

    const secondItem = page.locator('.todo-list li').nth(1);
    await secondItem.hover();
    await secondItem.locator('.destroy').click();
    await expect(page.locator('.todo-count')).toContainText('0 items left');
  });

  test('TC-022: Todos persist after page reload (local storage)', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Buy groceries');
    await input.press('Enter');
    await input.fill('Walk the dog');
    await input.press('Enter');

    await page.locator('.todo-list li').nth(1).locator('.toggle').check();

    await page.reload();

    const todos = page.locator('.todo-list li');
    await expect(todos).toHaveCount(2);
    await expect(todos.nth(0)).toHaveText('Buy groceries');
    await expect(todos.nth(0)).not.toHaveClass(/completed/);
    await expect(todos.nth(1)).toHaveText('Walk the dog');
    await expect(todos.nth(1)).toHaveClass(/completed/);
  });

  test('TC-023: Filter state is preserved via URL hash routing', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Active task');
    await input.press('Enter');
    await input.fill('Done task');
    await input.press('Enter');

    await page.locator('.todo-list li').nth(1).locator('.toggle').check();

    await page.getByRole('link', { name: 'Active' }).click();
    await expect(page).toHaveURL(/\/#\/active/);
    await expect(page.locator('.todo-list li')).toHaveCount(1);
    await expect(page.locator('.todo-list li').first()).toHaveText('Active task');

    await page.goto('https://demo.playwright.dev/todomvc/#/completed');
    await expect(page.locator('.todo-list li')).toHaveCount(1);
    await expect(page.locator('.todo-list li').first()).toHaveText('Done task');
    await expect(page.getByRole('link', { name: 'Completed' })).toHaveClass(/selected/);
  });

  test('TC-024: Single item uses singular "item left" text', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Only item');
    await input.press('Enter');

    await expect(page.locator('.todo-count')).toContainText('1 item left');
    await expect(page.locator('.todo-count')).not.toContainText('items');
  });

  test('TC-025: Multiple items use plural "items left" text', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Item A');
    await input.press('Enter');
    await input.fill('Item B');
    await input.press('Enter');

    await expect(page.locator('.todo-count')).toContainText('2 items left');
  });
});
