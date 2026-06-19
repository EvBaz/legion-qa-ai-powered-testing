---
name: ci-failure-triage
description: When a CI run is red, pull the run's logs and the
  playwright-report artifact via GitHub MCP or GH CLI, read the Playwright error
  and trace, cross-reference the spec, POM, and app source in the repo,
  classify real app bug vs test issue, and post a structured diagnosis
  to the PR. Use whenever a build fails — even if triage isn't asked for.
---

# CI Failure Triage

## QA mission

Follow `@qa-mission`. This repo exists to **test the application and find bugs**, not to produce green pipelines.

- If the failure matches acceptance criteria and the test/POM are correct → **real app bug** → notify human; if approved → Jira. **Do not** propose test changes to pass CI.
- If triage proves a **test issue** → notify human; if approved → propose a test/POM patch aligned with AC.
- A correctly failing test is valuable signal — treat it as success for QA, not something to silence.

## Steps
1. Pull the failed run's logs + playwright-report artifact (GitHub MCP / gh CLI).
2. Read the Playwright error: failing test, expected vs received, trace path.
3. Cross-reference: the spec, the POM, and the Didaxis source in the repo.
4. Classify: real app bug (route to a Jira bug via jira-bug-reporter) vs
   test issue (propose a patch for human review).
5. Report: post root cause, affected file, expected/actual, suggested next step,
   and evidence (trace/screenshot + run id) as a PR comment.

## Rules
- **Notify the human** after classification with evidence and options (Jira vs test fix); wait for explicit approval before either action (`@qa-mission`).
- Never merge a fix automatically — propose, a human approves.
- For a **real app bug**: suggested next step = Jira bug via jira-bug-reporter; **never** suggest weakening assertions, skips, or expected-value changes to green CI.
- For a **test issue**: suggested next step = concrete test/POM patch that restores alignment with AC — not a workaround that hides app defects.
- The diagnosis must name the source location and cause, not just the symptom.
