import { test as setup } from '@playwright/test';
import { loginAndSaveSession } from '../lib/didaxis-auth';

setup('authenticate', async ({ page }) => {
  await loginAndSaveSession(page);
});
