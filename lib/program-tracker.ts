import type { Page } from '@playwright/test';
import { recordCreatedProgram } from './created-programs';

const PROGRAMS_CREATE_URL = /\/api\/programs\/?$/;

export function attachProgramCreationTracker(page: Page, workerIndex: number): void {
  page.on('response', async (response) => {
    if (response.request().method() !== 'POST') {
      return;
    }
    if (!PROGRAMS_CREATE_URL.test(new URL(response.url()).pathname)) {
      return;
    }
    if (response.status() !== 201) {
      return;
    }

    try {
      const body = await response.json();
      const id = body?.data?.id;
      if (typeof id === 'string') {
        recordCreatedProgram(id, workerIndex);
      }
    } catch {
      // Response body may be unavailable or not JSON.
    }
  });
}
