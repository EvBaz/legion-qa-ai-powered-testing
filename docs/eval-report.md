# Suite reliability eval report

**As of:** 2026-07-18  
**Scope:** Didaxis Playwright suite (`tests/`, 76 chromium tests across 7 specs)  
**Window:** Last **N = 20** completed GitHub Actions Playwright runs (`Playwright CI` + legacy `Playwright Tests`)

> Cursor has no built-in telemetry for these metrics. Numbers below were computed manually from CI logs (`gh run view --log`), PR history (`gh pr list/view`), git history, and a review of 12 local agent session transcripts.

---

## 1. Flake rate

| Metric | Value |
|--------|-------|
| **Tests that passed only on retry** | **8** flaky executions across 20 runs (7 runs had ≥1 flaky test) |
| **Flake rate** | **1.1%** (8 flaky ÷ 751 passed+flaky executions in window) |
| **Recent slice CI (last 3 runs)** | **0** flaky (`@sanity` / `@smoke`, 2026-07-18) |

**How measured:** Parsed Playwright summary lines (`N flaky`, `N passed`) from `gh run view --log` on the 20 most recent completed Playwright workflow runs. Cross-checked individual flaky annotations (e.g. run [#28711955642](https://github.com/EvBaz/legion-qa-ai-powered-testing/actions/runs/28711955642): TC-018 passed on retry; TC-011 retried but still failed — not counted as flaky).

**What it tells us:** Retries (`playwright.config.ts`: `retries: 2` in CI) are doing work — about one flaky execution per 125 passes in the full-suite era — mostly around **shared program-list state** (duplicate rows, single-char name collisions). The new smoke/sanity slices show **zero** flakes so far, but the window is only three runs.

**Notable flaky tests (full-suite era):**

| Test | Flaky signal |
|------|----------------|
| `ds3` TC-018 — single-character name | Passed on retry (true flake; strict-mode duplicate `W` text) |
| `ds1` TC-016 — double-click Create | Retried; still failed (app bug, not flake) |
| `ds3` TC-007/008/009, `ds2` TC-013 | Retried; still failed (likely real app bugs) |

---

## 2. Heal success rate

| Metric | Value |
|--------|-------|
| **Drift runs healed cleanly** | **1 / 2** |
| **Heal success rate** | **50%** |
| **Masked-regression count** | **0** *(must stay 0)* |

**How measured:** Git history + session transcript review ([self-heal session](3ef03d39-c4d3-49ba-b1ac-4ba1a1c66e74)). Counted locator-drift remediation attempts with before/after CI evidence:

| Attempt | Commit / run | Outcome |
|---------|--------------|---------|
| Incorrect dialog rename | `76bebb2` → CI [#28710063458](https://github.com/EvBaz/legion-qa-ai-powered-testing/actions/runs/28710063458) (**67 failed**) | **Not clean** — invented accessible name `New Programs` |
| Approved self-heal revert | `154c793` → CI [#28711955642](https://github.com/EvBaz/legion-qa-ai-powered-testing/actions/runs/28711955642) (**7 failed**, down from 67) | **Clean** — POM-only revert; assertions unchanged |

**Masked-regression audit:** Searched heal commits and hook-blocked edits for weakened/removed `expect(` assertions. None found. The bad `76bebb2` change **surfaced** failures; it did not greenwash an app bug.

**What it tells us:** The self-heal gate works when triage + human approval precede the patch, but **unguarded POM edits still ship** (the `76bebb2` regression). Assertion guard + heal-on-red orchestration (`154c793`) were added in response.

---

## 3. Generation-gate pass rate

| Metric | Value |
|--------|-------|
| **First-PR gate passes** | **0 / 1** (**0%**) |
| **Eligible generated PRs** | **1** — [PR #6](https://github.com/EvBaz/legion-qa-ai-powered-testing/pull/6) (`tests-generated`, DS-5) |

**Gate definition:** Generated spec is **green in CI**, **constitution-conforming** (role locators, layered tags, no WON'T violations), and **maps to AC** (plan in `features/<ticket>.feature.md`) on the **first PR** opened by the test-generation workflow.

**How measured:**

- `gh pr list --label tests-generated --state all` → 1 PR
- PR #6 body + `gh pr view 6 --json statusCheckRollup` → agent run **13 passed, 1 skipped, 1 failed**; CI check **FAILURE**
- Conformance spot-check: `tests/ds5-program-list-display.spec.ts` — role-based locators, `@regression` + slice tags, API cleanup fixture; no XPath / `waitForTimeout`
- AC mapping: TC titles align with `features/DS-5.feature.md` (including TC-011 layout overflow)

**Breakdown for PR #6:**

| Criterion | Pass? |
|-----------|-------|
| Green CI on first PR | **No** — TC-011 fails (documented real app bug: 255-char name overflow) |
| Conforming | **Yes** |
| Maps to AC | **Yes** |

Scheduled test-generation runs since 2026-07-15 report an **empty queue** (all In Progress DS tickets already labeled `tests-generated`); no new first-PR candidates in window.

**What it tells us:** The generator produces **sound, AC-aligned specs**, but the gate fails when AC includes assertions that correctly expose **open app bugs** — CI stays red until the app is fixed or the workflow distinguishes expected failures.

---

## 4. Ask vs guess

| Metric | Value |
|--------|-------|
| **Times agent asked (human gate)** | **2** |
| **Times agent invented a value** | **1** |
| **Ratio** | **2 : 1** (ask-first when triage mattered) |

**How measured:** Manual review of 12 agent session transcripts under `.cursor/projects/.../agent-transcripts/`. Counted:

- **Ask:** Structured `@qa-mission` pauses with Options A/B/C before filing, healing, or merging
  1. CI triage after run [#28710063458](https://github.com/EvBaz/legion-qa-ai-powered-testing/actions/runs/28710063458) (locator drift)
  2. DS-1 TC-016 failure triage (real app bug — duplicate Create)
- **Guess:** Material values introduced without MCP/a11y verification or human input
  1. Dialog accessible name `'New Programs'` (plural) in `pages/new-program.modal.ts` at `76bebb2` — UI uses `'New Program'`

*(Excluded: `.env.example` placeholders — documented pattern, not runtime guesses.)*

**What it tells us:** Triage discipline is good when failures are surfaced, but **one unverified locator guess caused 67 CI failures** — the highest-impact reliability incident in the window.

---

## Top reliability risk

**Shared program-list state + CI retries under-report instability.** Duplicate program rows (TC-016, TC-018, strict-mode collisions) produce intermittent flakes and hard failures; `retries: 2` can mark tests flaky/passed while data pollution persists. This overlaps with **multiple open app bugs** (duplicate-name validation, double-click Create, DS-5 layout overflow) that keep full-suite CI red even after the modal heal.

## Next action

1. **Run `workflow_dispatch` regression on `main`** and attach the report artifact — establish a post-heal baseline for the 7 known reds.
2. **Stabilize data-dependent tests:** audit specs for unique Faker names + API teardown on every create; run `@destructive` / duplicate-sensitive tests with `--workers=1`.
3. **Generation gate policy:** decide whether first-PR CI may fail on **documented app-bug assertions** (expected-fail / separate check) vs requiring app fixes before merge.
4. **Automate this report:** add a CI step that parses Playwright JSON/github reporter for `flaky` count and fails the job if flaky > 0 on smoke/sanity.

---

## Report location

**Canonical path:** `docs/eval-report.md` (this file)

| Location | Verdict |
|----------|---------|
| **`docs/eval-report.md`** | **Recommended** — human-facing QA metrics; keeps README and `.cursor/` rules clean |
| `docs/reliability/eval-report-YYYY-MM-DD.md` | Optional dated snapshots when you re-run evals |
| `features/` | Wrong — Gherkin **plans**, not metrics |
| `.cursor/` | Wrong — agent config, not deliverables |
| Repo root | Avoid — clutters onboarding |

**Refresh cadence:** Re-run after every 20 CI builds, each generation PR, or any self-heal merge — update the **As of** date and N.
