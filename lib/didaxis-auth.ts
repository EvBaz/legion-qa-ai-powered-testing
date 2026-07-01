import fs from 'fs';
import path from 'path';
import type { Page } from '@playwright/test';

export const SESSION_FILE = path.resolve(__dirname, '../playwright/.auth/user.json');

export interface StorageCookie {
  name: string;
  value: string;
  domain: string;
  path: string;
  expires: number;
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'Strict' | 'Lax' | 'None';
}

export interface StorageState {
  cookies: StorageCookie[];
  origins: Array<{
    origin: string;
    localStorage: Array<{ name: string; value: string }>;
  }>;
}

export function getBaseUrl(): string {
  const url = process.env.DIDAXIS_URL ?? 'https://test.didaxis.studio';
  return url.replace(/\/$/, '');
}

export function getCredentials(): { email: string; password: string } {
  const email = process.env.DIDAXIS_EMAIL;
  const password = process.env.DIDAXIS_PASSWORD;
  if (!email || !password) {
    throw new Error('DIDAXIS_EMAIL and DIDAXIS_PASSWORD must be set in .env');
  }
  return { email, password };
}

export function loadSession(): StorageState | null {
  if (!fs.existsSync(SESSION_FILE)) {
    return null;
  }
  return JSON.parse(fs.readFileSync(SESSION_FILE, 'utf8')) as StorageState;
}

export function sessionExpiresAt(state: StorageState | null = loadSession()): Date | null {
  if (!state?.cookies.length) {
    return null;
  }
  const refresh = state.cookies.find((c) => c.name === 'didaxis_refresh_token');
  const anchor = refresh ?? state.cookies.reduce((latest, cookie) =>
    cookie.expires > latest.expires ? cookie : latest,
  );
  if (!anchor?.expires || anchor.expires <= 0) {
    return null;
  }
  return new Date(anchor.expires * 1000);
}

export function isSessionValid(bufferMs = 5 * 60_000, state: StorageState | null = loadSession()): boolean {
  const expiresAt = sessionExpiresAt(state);
  if (!expiresAt) {
    return false;
  }
  return expiresAt.getTime() - Date.now() > bufferMs;
}

export async function loginAndSaveSession(page: Page): Promise<void> {
  const { email, password } = getCredentials();
  const baseURL = getBaseUrl();

  await page.goto(`${baseURL}/login`);
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await page.waitForURL((url) => !url.pathname.includes('/login'), { timeout: 15_000 });

  fs.mkdirSync(path.dirname(SESSION_FILE), { recursive: true });
  await page.context().storageState({ path: SESSION_FILE });
}
