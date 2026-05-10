import { test, expect } from '@playwright/test';

const APP_URL = 'https://demo.playwright.dev/todomvc/#/';

test.describe('Positive Flows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(APP_URL);
  });

  test('TC-001: New todo list is empty on first load', async ({ page }) => {
    await expect(page.getByRole('heading', { name: 'todos' })).toBeVisible();
    await expect(page.getByPlaceholder('What needs to be done?')).toBeVisible();
    await expect(page.locator('.todo-list li')).toHaveCount(0);
    await expect(page.locator('.footer')).toBeHidden();
  });

  test('TC-002: Single todo item is added successfully', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Buy groceries');
    await input.press('Enter');

    await expect(page.locator('.todo-list li')).toHaveCount(1);
    await expect(page.locator('.todo-list li').first()).toHaveText('Buy groceries');
    await expect(page.locator('.todo-count')).toContainText('1 item left');
    await expect(input).toHaveValue('');
  });

  test('TC-003: Multiple todo items are added in sequence', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    const items = ['Buy groceries', 'Clean the house', 'Walk the dog'];

    for (const item of items) {
      await input.fill(item);
      await input.press('Enter');
    }

    const todos = page.locator('.todo-list li');
    await expect(todos).toHaveCount(3);
    await expect(todos.nth(0)).toHaveText('Buy groceries');
    await expect(todos.nth(1)).toHaveText('Clean the house');
    await expect(todos.nth(2)).toHaveText('Walk the dog');
    await expect(page.locator('.todo-count')).toContainText('3 items left');
  });

  test('TC-004: Todo item is marked as completed', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Buy groceries');
    await input.press('Enter');

    const todoItem = page.locator('.todo-list li').first();
    await todoItem.locator('.toggle').check();

    await expect(todoItem).toHaveClass(/completed/);
    await expect(page.locator('.todo-count')).toContainText('0 items left');
  });

  test('TC-005: Completed item can be unchecked to become active again', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Buy groceries');
    await input.press('Enter');

    const todoItem = page.locator('.todo-list li').first();
    await todoItem.locator('.toggle').check();
    await expect(todoItem).toHaveClass(/completed/);

    await todoItem.locator('.toggle').uncheck();
    await expect(todoItem).not.toHaveClass(/completed/);
    await expect(page.locator('.todo-count')).toContainText('1 item left');
  });

  test('TC-006: Completed items appear under the Completed filter', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Buy groceries');
    await input.press('Enter');
    await input.fill('Walk the dog');
    await input.press('Enter');

    await page.locator('.todo-list li').first().locator('.toggle').check();
    await page.getByRole('link', { name: 'Completed' }).click();

    const visibleTodos = page.locator('.todo-list li');
    await expect(visibleTodos).toHaveCount(1);
    await expect(visibleTodos.first()).toHaveText('Buy groceries');
  });

  test('TC-007: Active items appear under the Active filter', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Buy groceries');
    await input.press('Enter');
    await input.fill('Walk the dog');
    await input.press('Enter');

    await page.locator('.todo-list li').first().locator('.toggle').check();
    await page.getByRole('link', { name: 'Active' }).click();

    const visibleTodos = page.locator('.todo-list li');
    await expect(visibleTodos).toHaveCount(1);
    await expect(visibleTodos.first()).toHaveText('Walk the dog');
  });

  test('TC-008: Toggle-all marks every item as completed', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    for (const item of ['Item A', 'Item B', 'Item C']) {
      await input.fill(item);
      await input.press('Enter');
    }

    await page.locator('.toggle-all').check({ force: true });

    const todos = page.locator('.todo-list li');
    for (let i = 0; i < 3; i++) {
      await expect(todos.nth(i)).toHaveClass(/completed/);
    }
    await expect(page.locator('.todo-count')).toContainText('0 items left');
  });

  test('TC-009: Single todo item is removed via the destroy button', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    await input.fill('Buy groceries');
    await input.press('Enter');

    const todoItem = page.locator('.todo-list li').first();
    await todoItem.hover();
    await todoItem.locator('.destroy').click();

    await expect(page.locator('.todo-list li')).toHaveCount(0);
    await expect(page.locator('.footer')).toBeHidden();
  });

  test('TC-010: "Clear completed" removes all finished items', async ({ page }) => {
    const input = page.getByPlaceholder('What needs to be done?');
    for (const item of ['Item A', 'Item B', 'Item C']) {
      await input.fill(item);
      await input.press('Enter');
    }

    await page.locator('.todo-list li').nth(0).locator('.toggle').check();
    await page.locator('.todo-list li').nth(1).locator('.toggle').check();

    await page.getByRole('button', { name: 'Clear completed' }).click();

    const todos = page.locator('.todo-list li');
    await expect(todos).toHaveCount(1);
    await expect(todos.first()).toHaveText('Item C');
    await expect(page.getByRole('button', { name: 'Clear completed' })).toBeHidden();
  });
});
