import { test as base, expect } from '@playwright/test';
import { attachProgramCreationTracker } from '../lib/program-tracker';

export const test = base.extend({
  page: async ({ page }, use, testInfo) => {
    attachProgramCreationTracker(page, testInfo.workerIndex);
    await use(page);
  },
});

export { expect };
