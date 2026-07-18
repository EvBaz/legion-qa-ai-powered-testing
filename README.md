# Legion QA — AI-Powered Playwright Testing

End-to-end Playwright tests for [Didaxis](https://test.didaxis.studio/) with Page Object Models, API cleanup, and Cursor agents/skills for test generation and triage.

## Prerequisites

- **Node.js** LTS (see `.github/workflows/playwright-ci.yml`)
- Access to a Didaxis test environment and credentials (see `.env.example`)

## Install

```bash
git clone https://github.com/EvBaz/legion-qa-ai-powered-testing.git
cd legion-qa-ai-powered-testing
npm install
```

`npm install` runs `postinstall`, which downloads Playwright browsers into `.playwright-browsers/` (repo-local, not global).

## Environment

Copy the example file and fill in your values. **Never commit `.env`** — it is git-ignored.

```bash
cp .env.example .env
```

| Variable | Required for `playwright test` | Purpose |
|----------|-------------------------------|---------|
| `DIDAXIS_URL` | Yes | App base URL |
| `DIDAXIS_EMAIL` | Yes | Primary login (auth setup project) |
| `DIDAXIS_PASSWORD` | Yes | Primary login password |
| `DIDAXIS_API_TOKEN` | Yes | API cleanup after tests that create programs |
| `DIDAXIS_ALT_EMAIL` | No | Secondary account for permission probes |
| `DIDAXIS_ALT_PASSWORD` | No | Password for the alternate account |

Agent / CI variables (`CURSOR_API_KEY`, `ATLASSIAN_*`) are documented in `.env.example` but are **not** needed to run tests locally.

## Run tests

Full suite (setup auth + chromium, firefox, webkit):

```bash
npm test
# or
npx playwright test
```

Chromium only (matches CI):

```bash
npx playwright test --project=chromium
```

Single spec file:

```bash
npx playwright test tests/ds1-create-program.spec.ts
```

Open the HTML report after a run:

```bash
npx playwright show-report
```

### Run a tagged slice

Every test includes `@regression` (full suite). Slice tags filter subsets for local runs and CI:

| Command | Tag | Notes |
|---------|-----|-------|
| `npm run test:smoke` | `@smoke` | 4 CRUD proof tests — runs on **pull requests** in CI |
| `npm run test:sanity` | `@sanity` | 14 tests (smoke + UI/auth/validation paths) — runs on **push** in CI |
| `npm run test:regression` | `@regression` | **Full suite** — run **on demand** in CI (`workflow_dispatch`) |
| `npm run test:api` | `@api` | API-only tests |
| `npm run test:destructive` | `@destructive` | Shared-state mutations; runs with `--workers=1` |

```bash
npm run test:smoke
npm run test:regression
npx playwright test tests/ds1-create-program.spec.ts --grep @sanity
```

See `.cursor/rules/playwright-convention.mdc` for tagging rules (including `@destructive` revert hooks).

## Useful scripts

| Command | Description |
|---------|-------------|
| `npm test` | Full suite locally (setup auth + chromium, firefox, webkit) |
| `npm run test:smoke` | `@smoke` slice (also runs on PRs in CI) |
| `npm run test:sanity` | `@sanity` slice (also runs on push in CI) |
| `npm run test:regression` | Full suite via `@regression` (CI: manual workflow only) |
| `npm run test:api` | `@api` slice only |
| `npm run test:destructive` | `@destructive` slice (`--workers=1`) |
| `npm run auth:refresh` | Refresh `playwright/.auth/user.json` session |
| `npm run auth:status` | Check whether the saved session is still valid |
| `npm run delete-programs` | Delete all programs via API (requires `DIDAXIS_API_TOKEN`) |
| `npm run explore:programs` | Accessibility snapshot of `/programs` (exploration) |

## Cursor agents and skills

This repo is set up for AI-assisted QA in Cursor. You do **not** need any of this to run `npx playwright test`.

### Rules (always-on guidance)

- `.cursor/rules/constitution.mdc` — non-negotiable Playwright standards
- `.cursor/rules/qa-mission.mdc` — triage gate; never weaken assertions without human approval
- `.cursor/rules/playwright-convention.mdc` — locators, POMs, auth, cleanup patterns

Reference `@qa-orchestrator` in chat for end-to-end flows (Jira ticket → plan → spec → run → PR).

### Agents

| Agent | Role |
|-------|------|
| `.cursor/agents/triage.md` | Classify red CI: app bug vs test issue |
| `.cursor/agents/test-writer.md` | Turn a plan into a conforming spec + POM |
| `.cursor/agents/bug-reporter.md` | Draft/file Jira bugs after human approval |

### Skills

| Skill | Use when |
|-------|----------|
| `.cursor/skills/explore-and-generate/` | Find untested UI flows without a Jira ticket |
| `.cursor/skills/self-heal/` | Repair drifted locators after triage confirms a test issue |
| `.agents/skills/jira-ticket-analyzer/` | Turn Jira AC into Gherkin plans |
| `.agents/skills/ci-failure-triage/` | Diagnose a failed GitHub Actions run |

### Hooks

`.cursor/hooks/guard-constitution.js` runs on file edits and blocks changes that violate the constitution (e.g. hardcoded secrets, `waitForTimeout`).

### MCP and CI tokens

For Jira/Confluence in Cursor, configure the **Atlassian MCP** plugin with `ATLASSIAN_EMAIL`, `ATLASSIAN_API_TOKEN`, and `ATLASSIAN_BASE_URL` in Cursor settings (or your user-level env).

The scheduled **test-generation** workflow (`.github/workflows/test-generation.yml`) uses `CURSOR_API_KEY` plus the Atlassian vars as GitHub Actions secrets — store those in the repo/environment secrets, not in the repo tree.

## CI

| Workflow | Trigger | What it does |
|----------|---------|--------------|
| `.github/workflows/playwright-ci.yml` | Push | **Sanity** — `npm run test:sanity` on chromium |
| `.github/workflows/playwright-ci.yml` | Pull request | **Smoke** — `npm run test:smoke` on chromium |
| `.github/workflows/playwright-ci.yml` | Manual (`workflow_dispatch`) | **Regression** — full suite via `npm run test:regression` |
| `.github/workflows/test-generation.yml` | Schedule / manual | Headless Cursor agent generates tests from the DS backlog |

## Project layout

```
tests/          Playwright specs (one file per Jira story where possible)
test-data/      Faker factories, invalid input sets, shared enums
pages/          Page Object Models — locators live here, not in specs
fixtures/       Shared test fixtures (e.g. API cleanup)
lib/            Auth, API helpers, program tracking
features/       Gherkin test plans produced from Jira tickets
playwright/.auth/  Generated storageState (git-ignored)
```
