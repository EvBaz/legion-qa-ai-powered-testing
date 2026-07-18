---
name: exploratory-charter
description: >
  Turns a feature and a risk into a structured exploratory testing charter and
  session findings template. Use when the user asks for an exploratory charter,
  session charter, ET charter, or wants to scope ad-hoc exploration before or
  during a manual session. Does not crawl the UI or write Playwright specs —
  format only; the human provides the thinking.
---

# Exploratory Charter

Scope a time-boxed exploratory session. **Do not explore the app or invent
findings here** — fill the templates from what the human gives you (feature,
risk, mission, oracles). If inputs are missing, ask for **feature** and **risk**
only; do not pad with generic QA advice.

## Inputs

| Required | Example |
|----------|---------|
| **Feature** | Programs list — delete confirmation dialog |
| **Risk** | User can delete the wrong program when two names differ only by whitespace |

Optional (use if provided; otherwise leave blank or `TBD`): mission, time box,
preconditions, oracles, route, persona.

## Procedure

1. Restate feature + risk in one line each (human's words when possible).
2. Emit **Charter** using the template below — concise bullets, no essays.
3. Emit **Findings template** empty, ready to paste notes into during/after the
   session.
4. Save to `features/charter-<feature-slug>.md` unless the user wants chat-only.

## Charter template

```markdown
# Exploratory charter — <Feature>

**Risk:** <why this session matters — one sentence>
**Mission:** <what we want to learn or disprove — one sentence>
**Time box:** <e.g. 60 min | TBD>
**Persona / auth:** <e.g. admin | TBD>
**Route / entry:** <URL or navigation path | TBD>

## Scope

**In:**
- <behaviors, states, or paths to exercise>

**Out:**
- <explicit non-goals for this session>

## Setup

- <data, accounts, flags, starting state>

## Oracles

How to judge suspicious vs OK (human-defined):

- <expected behavior, AC ref, comparable product, heuristics>

## Focus prompts

Questions to keep in mind while exploring (derived from the risk):

1. <prompt tied to risk>
2. <prompt>
3. <prompt>

## Notes

- Findings go in the session log below — not here.
```

Derive **Focus prompts** (3–5) from the stated risk. Do not invent product
facts; use `TBD` when setup or route is unknown.

## Findings template

```markdown
# Session log — <Feature>

| Field | Value |
|-------|-------|
| Date | |
| Tester | |
| Charter | `features/charter-<feature-slug>.md` |
| Duration | |
| Build / env | |

## Coverage

| Area visited | Depth (skim / deep) | Notes |
|--------------|---------------------|-------|
| | | |

## Findings

| # | Type | Severity | Summary | Steps / evidence | Follow-up |
|---|------|----------|---------|------------------|-----------|
| 1 | bug / question / note | blocker / major / minor / — | | | Jira / retest / — |

**Type:** `bug` = likely defect; `question` = unclear spec or UX; `note` =
observation worth keeping.

**Severity:** use `—` for questions and notes.

## Open questions

- 

## Follow-ups

- [ ] 
```

## Handoffs

| Next step | When |
|-----------|------|
| Human runs the session and fills the log | Default |
| `@jira-bug-reporter` / bug-reporter agent | Finding confirmed as defect; human approves filing |
| `@test-writer` | Repeatable path worth automating; human approves |
| `explore-and-generate` | Need agent-led UI gap discovery without a ticket |

## Example (abbreviated)

**Inputs:** Feature = Program name validation on create. Risk = Copy-paste from
Word may inject invisible characters that pass the UI but break downstream exports.

**Mission (derived):** Learn whether hidden Unicode in the name field is accepted,
shown, or rejected.

**Focus prompts:** paste from Word; paste from Slack; trim-only spaces; emoji in
name; error message clarity.

(Full charter + empty findings template follow the blocks above.)
