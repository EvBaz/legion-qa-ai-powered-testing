/**
 * Print session status JSON for agents (no secret values).
 * Usage: npm run auth:status
 */
import dotenv from 'dotenv';
import fs from 'fs';
import {
  isSessionValid,
  loadSession,
  SESSION_FILE,
  sessionExpiresAt,
} from '../lib/didaxis-auth';
import { getBrowserMcpAuthPlan } from '../lib/browser-mcp-auth';

dotenv.config();

function main(): void {
  const exists = fs.existsSync(SESSION_FILE);
  const state = exists ? loadSession() : null;
  const plan = exists && state ? getBrowserMcpAuthPlan() : null;

  const status = {
    sessionFile: SESSION_FILE,
    exists,
    valid: exists ? isSessionValid() : false,
    expiresAt: state ? sessionExpiresAt(state)?.toISOString() ?? null : null,
    cookieCount: state?.cookies.length ?? 0,
    refresh: exists ? 'npm run auth:refresh' : 'npm run auth:refresh -- --force',
    browserMcp: plan
      ? {
          programsUrl: plan.programsUrl,
          loginUrl: plan.loginUrl,
          cdpCookieCount: plan.cdpCookies.length,
          uiLoginFallback: true,
        }
      : null,
  };

  console.log(JSON.stringify(status, null, 2));
}

main();
