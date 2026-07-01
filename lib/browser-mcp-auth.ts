import {
  getBaseUrl,
  getCredentials,
  isSessionValid,
  loadSession,
  sessionExpiresAt,
  type StorageState,
} from './didaxis-auth';

export interface BrowserMcpAuthPlan {
  baseUrl: string;
  sessionFile: string;
  sessionValid: boolean;
  sessionExpiresAt: string | null;
  /** Prefer navigating here after session bootstrap. */
  programsUrl: string;
  loginUrl: string;
  /** CDP Network.setCookie payloads (may be blocked by Browser MCP — use ui_login fallback). */
  cdpCookies: Array<Record<string, unknown>>;
  /** Runtime.evaluate script to restore localStorage from Playwright storageState. */
  localStorageScript: string;
  credentials: { email: string; password: string } | null;
}

export function buildLocalStorageScript(state: StorageState): string {
  const origin = state.origins.find((entry) => entry.origin.startsWith('http'));
  if (!origin?.localStorage.length) {
    return 'true';
  }
  const assignments = origin.localStorage
    .map(({ name, value }) => `localStorage.setItem(${JSON.stringify(name)}, ${JSON.stringify(value)});`)
    .join('\n');
  return `(function () { ${assignments} return true; })()`;
}

export function buildCdpCookies(state: StorageState, baseUrl: string): Array<Record<string, unknown>> {
  const origin = new URL(baseUrl);
  return state.cookies.map((cookie) => ({
    name: cookie.name,
    value: cookie.value,
    domain: cookie.domain.startsWith('.') ? cookie.domain : cookie.domain,
    path: cookie.path,
    secure: cookie.secure ?? true,
    httpOnly: cookie.httpOnly ?? false,
    sameSite: cookie.sameSite ?? 'Lax',
    expires: cookie.expires,
    url: `${origin.protocol}//${cookie.domain}${cookie.path}`,
  }));
}

/** Plan for Browser MCP: inject session from playwright/.auth/user.json, then open /programs. */
export function getBrowserMcpAuthPlan(): BrowserMcpAuthPlan {
  const baseUrl = getBaseUrl();
  const state = loadSession();
  if (!state) {
    throw new Error(
      'No session file at playwright/.auth/user.json. Run: npm run auth:refresh',
    );
  }

  const plan: BrowserMcpAuthPlan = {
    baseUrl,
    sessionFile: 'playwright/.auth/user.json',
    sessionValid: isSessionValid(),
    sessionExpiresAt: sessionExpiresAt(state)?.toISOString() ?? null,
    programsUrl: `${baseUrl}/programs`,
    loginUrl: `${baseUrl}/login`,
    cdpCookies: buildCdpCookies(state, baseUrl),
    localStorageScript: buildLocalStorageScript(state),
    credentials: null,
  };

  try {
    plan.credentials = getCredentials();
  } catch {
    // UI login fallback unavailable without .env — session injection may still work.
  }

  return plan;
}

export function snapshotLooksLikeLogin(snapshotYaml: string): boolean {
  return /name: Sign In/i.test(snapshotYaml) && /name: Email/i.test(snapshotYaml);
}
