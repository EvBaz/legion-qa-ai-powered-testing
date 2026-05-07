# Test Plan — DS-3: Program Name Validation and Duplicate Prevention

## Overview

| Attribute       | Detail                                                          |
| --------------- | --------------------------------------------------------------- |
| Feature         | Program Name Validation and Duplicate Prevention                |
| Story           | DS-3                                                            |
| Role under test | Admin user                                                      |
| Entry criteria  | Application is running; admin user is logged in                 |

---

## 1. Positive Flows

### TC-001 — Program name with special characters is accepted

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-001                                                                                                             |
| **Title**       | Special characters in program name are accepted and stored correctly                                               |
| **Preconditions** | Admin user is on the program creation form                                                                       |
| **Steps**       | 1. Enter "Informatique & IA - Niveau 2" in the Program Name field<br>2. Enter "French CS program" in Description<br>3. Click Create |
| **Expected**    | The program is created successfully; the program list shows "Informatique & IA - Niveau 2"                         |
| **Priority**    | High                                                                                                               |

### TC-002 — Program name with accented characters is accepted

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-002                                                                                                             |
| **Title**       | Accented and diacritical characters are accepted in program names                                                  |
| **Preconditions** | Admin user is on the program creation form                                                                       |
| **Steps**       | 1. Enter "Développement Réseau Avancé" in the Program Name field<br>2. Click Create                               |
| **Expected**    | The program is created successfully with the accented name intact                                                  |
| **Priority**    | Medium                                                                                                             |

### TC-003 — Program name with parentheses and slashes is accepted

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-003                                                                                                             |
| **Title**       | Parentheses, slashes, and common punctuation are valid in program names                                            |
| **Preconditions** | Admin user is on the program creation form                                                                       |
| **Steps**       | 1. Enter "AI/ML (Advanced) - Fall/Winter 2026" in the Program Name field<br>2. Click Create                        |
| **Expected**    | The program is created successfully with the name displayed as entered                                             |
| **Priority**    | Medium                                                                                                             |

### TC-004 — Program name with numbers and hyphens is accepted

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-004                                                                                                             |
| **Title**       | Numeric values and hyphens are valid in program names                                                              |
| **Preconditions** | Admin user is on the program creation form                                                                       |
| **Steps**       | 1. Enter "CS-101: Intro to Programming 2026-2027" in the Program Name field<br>2. Click Create                    |
| **Expected**    | The program is created with the name "CS-101: Intro to Programming 2026-2027"                                     |
| **Priority**    | Low                                                                                                                |

### TC-005 — Unique program name is accepted without errors

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-005                                                                                                             |
| **Title**       | A completely unique program name passes validation                                                                 |
| **Preconditions** | Admin user is on the program creation form; no program named "Quantum Computing 2026" exists                     |
| **Steps**       | 1. Enter "Quantum Computing 2026" in the Program Name field<br>2. Click Create                                    |
| **Expected**    | The program is created without any validation errors                                                               |
| **Priority**    | High                                                                                                               |

---

## 2. Negative Flows

### TC-006 — Whitespace-only program name is rejected

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-006                                                                                                             |
| **Title**       | Program name consisting only of spaces is treated as empty and rejected                                            |
| **Preconditions** | Admin user is on the program creation form                                                                       |
| **Steps**       | 1. Enter "   " (three spaces) in the Program Name field<br>2. Click Create (or observe button state)              |
| **Expected**    | The name is trimmed to empty; the form is not submitted; the Create button remains disabled or a validation error is shown |
| **Priority**    | High                                                                                                               |

### TC-007 — Duplicate program name (exact match) is rejected

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-007                                                                                                             |
| **Title**       | Creating a program with an exact duplicate name shows an error                                                     |
| **Preconditions** | Program "Web Development 2026" already exists                                                                    |
| **Steps**       | 1. Click "+ New Program"<br>2. Enter "Web Development 2026" in the Program Name field<br>3. Click Create           |
| **Expected**    | An error message is displayed indicating the program name already exists; the program is not created               |
| **Priority**    | High                                                                                                               |

### TC-008 — Duplicate program name with different casing is rejected

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-008                                                                                                             |
| **Title**       | Case-insensitive duplicate detection prevents "web development 2026" when "Web Development 2026" exists            |
| **Preconditions** | Program "Web Development 2026" already exists                                                                    |
| **Steps**       | 1. Click "+ New Program"<br>2. Enter "web development 2026" in the Program Name field<br>3. Click Create           |
| **Expected**    | An error indicates the name already exists (case-insensitive comparison)                                           |
| **Priority**    | High                                                                                                               |

### TC-009 — Duplicate program name with extra whitespace is rejected

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-009                                                                                                             |
| **Title**       | Duplicate detection catches names that match after trimming whitespace                                             |
| **Preconditions** | Program "Web Development 2026" already exists                                                                    |
| **Steps**       | 1. Click "+ New Program"<br>2. Enter "  Web Development 2026  " (with leading/trailing spaces) in Program Name<br>3. Click Create |
| **Expected**    | After trimming, the name matches "Web Development 2026"; an error indicates duplication                            |
| **Priority**    | Medium                                                                                                             |

### TC-010 — Tab characters in program name are treated as whitespace

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-010                                                                                                             |
| **Title**       | Tab characters in the program name are trimmed or rejected                                                         |
| **Preconditions** | Admin user is on the program creation form                                                                       |
| **Steps**       | 1. Paste a string consisting of only tab characters into the Program Name field<br>2. Attempt to click Create      |
| **Expected**    | The name is treated as empty after trimming; the form is not submitted                                             |
| **Priority**    | Low                                                                                                                |

### TC-011 — Program name with HTML/script tags is sanitized

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-011                                                                                                             |
| **Title**       | HTML and script tags in program name are sanitized to prevent XSS                                                  |
| **Preconditions** | Admin user is on the program creation form                                                                       |
| **Steps**       | 1. Enter `<script>alert('XSS')</script>` in the Program Name field<br>2. Click Create                             |
| **Expected**    | The input is either rejected, sanitized, or stored as plain text; no script execution occurs when the name is displayed |
| **Priority**    | High                                                                                                               |

### TC-012 — SQL injection attempt in program name is handled safely

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-012                                                                                                             |
| **Title**       | SQL injection strings in program name do not compromise the database                                               |
| **Preconditions** | Admin user is on the program creation form                                                                       |
| **Steps**       | 1. Enter `'; DROP TABLE programs; --` in the Program Name field<br>2. Click Create                                 |
| **Expected**    | The input is handled safely; if accepted, it is stored as literal text; no database operations are triggered        |
| **Priority**    | High                                                                                                               |

---

## 3. Edge Cases

### TC-013 — Program name that is a substring of an existing name is accepted

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-013                                                                                                             |
| **Title**       | A name that is a partial match of an existing name is not treated as duplicate                                     |
| **Preconditions** | Program "Web Development 2026" exists                                                                            |
| **Steps**       | 1. Click "+ New Program"<br>2. Enter "Web Development" in the Program Name field<br>3. Click Create               |
| **Expected**    | The program "Web Development" is created successfully (partial match is not a duplicate)                           |
| **Priority**    | Medium                                                                                                             |

### TC-014 — Program name with only numeric characters

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-014                                                                                                             |
| **Title**       | A purely numeric program name is accepted                                                                          |
| **Preconditions** | Admin user is on the program creation form                                                                       |
| **Steps**       | 1. Enter "12345" in the Program Name field<br>2. Click Create                                                      |
| **Expected**    | The program "12345" is created successfully                                                                        |
| **Priority**    | Low                                                                                                                |

### TC-015 — Program name with mixed whitespace in the middle

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-015                                                                                                             |
| **Title**       | Internal multiple spaces in program name are preserved or normalized                                               |
| **Preconditions** | Admin user is on the program creation form                                                                       |
| **Steps**       | 1. Enter "Web    Development    2026" (multiple internal spaces) in Program Name<br>2. Click Create                |
| **Expected**    | The program is created; the name is stored either as entered or with normalized single spaces                      |
| **Priority**    | Low                                                                                                                |

### TC-016 — Duplicate check during edit (renaming to existing name)

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-016                                                                                                             |
| **Title**       | Duplicate validation also applies when renaming an existing program                                                |
| **Preconditions** | Programs "Program A" and "Program B" both exist                                                                  |
| **Steps**       | 1. Click the edit icon on "Program B"<br>2. Change the name to "Program A"<br>3. Click Save                       |
| **Expected**    | An error indicates the name "Program A" already exists; the rename is rejected                                     |
| **Priority**    | High                                                                                                               |

### TC-017 — Program name with emoji characters

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-017                                                                                                             |
| **Title**       | Emoji characters in program name are handled correctly                                                             |
| **Preconditions** | Admin user is on the program creation form                                                                       |
| **Steps**       | 1. Enter "🎓 Graduate Studies 2026" in the Program Name field<br>2. Click Create                                   |
| **Expected**    | The program is created with the emoji preserved in the name                                                        |
| **Priority**    | Low                                                                                                                |

### TC-018 — Program name at exactly 1 character

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-018                                                                                                             |
| **Title**       | A single-character program name passes validation                                                                  |
| **Preconditions** | Admin user is on the program creation form                                                                       |
| **Steps**       | 1. Enter "A" in the Program Name field<br>2. Click Create                                                          |
| **Expected**    | The program "A" is created successfully                                                                            |
| **Priority**    | Low                                                                                                                |

### TC-019 — Duplicate check is exact after trimming (not fuzzy)

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-019                                                                                                             |
| **Title**       | Names that differ only by punctuation are not treated as duplicates                                                |
| **Preconditions** | Program "Web Development 2026" exists                                                                            |
| **Steps**       | 1. Click "+ New Program"<br>2. Enter "Web Development, 2026" in Program Name<br>3. Click Create                   |
| **Expected**    | The program "Web Development, 2026" is created (comma makes it distinct)                                           |
| **Priority**    | Low                                                                                                                |

---

## Ambiguities & Gaps

| #  | Question                                                                                                     |
| -- | ------------------------------------------------------------------------------------------------------------ |
| 1  | Is the duplicate check case-sensitive or case-insensitive? The AC does not specify.                          |
| 2  | Is duplicate detection performed client-side (real-time) or server-side (on submit)?                         |
| 3  | What is the exact error message wording when a duplicate name is detected?                                   |
| 4  | Are there any disallowed characters (e.g., `<`, `>`, `"`, `'`) beyond the whitespace-only rule?              |
| 5  | Does the whitespace-only rejection apply to the edit form (DS-2) as well, or only creation?                  |
| 6  | What is the minimum character length for a program name? Is a single character valid?                        |
| 7  | Are internal multiple spaces normalized (e.g., "Web  Dev" becomes "Web Dev")?                                |
| 8  | Is the duplicate check scoped to active programs only, or does it include soft-deleted programs?              |
| 9  | How is the error message for duplicates dismissed — automatically, or does the user close it?                |
