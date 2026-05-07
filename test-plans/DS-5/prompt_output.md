# Test Plan — DS-5: Program List Filtering and Display

## Overview

| Attribute       | Detail                                                          |
| --------------- | --------------------------------------------------------------- |
| Feature         | Program List Filtering and Display                              |
| Story           | DS-5                                                            |
| Role under test | Admin user                                                      |
| Entry criteria  | Application is running; admin user is logged in                 |

---

## 1. Positive Flows

### TC-001 — Program list displays names and descriptions

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-001                                                                                                             |
| **Title**       | Each program's name and description are visible in the list                                                        |
| **Preconditions** | Admin user is logged in; at least two programs exist:<br>- "Web Development 2026" with description "Full-stack web development program"<br>- "Data Science 101" with description "Intro to data science and analytics" |
| **Steps**       | 1. Navigate to the Programs page                                                                                   |
| **Expected**    | The page displays a list with each program showing its name and description. "Web Development 2026" shows "Full-stack web development program" and "Data Science 101" shows "Intro to data science and analytics" |
| **Priority**    | High                                                                                                               |

### TC-002 — Empty state is shown when no programs exist

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-002                                                                                                             |
| **Title**       | Empty state message and creation prompt are displayed when no programs exist                                       |
| **Preconditions** | Admin user is logged in; no programs exist in the system                                                         |
| **Steps**       | 1. Navigate to the Programs page                                                                                   |
| **Expected**    | The page shows a message indicating no programs have been created (e.g., "No programs yet") and a prompt/button to create the first program |
| **Priority**    | High                                                                                                               |

### TC-003 — Empty state create prompt navigates to program creation

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-003                                                                                                             |
| **Title**       | Clicking the empty state prompt opens the program creation form                                                    |
| **Preconditions** | Admin user is on the Programs page; no programs exist; empty state with creation prompt is visible                |
| **Steps**       | 1. Click the "Create first program" prompt/button shown in the empty state                                         |
| **Expected**    | The program creation form opens (same form as clicking "+ New Program")                                            |
| **Priority**    | Medium                                                                                                             |

### TC-004 — Program list updates after creating a new program

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-004                                                                                                             |
| **Title**       | Newly created program appears in the list immediately                                                              |
| **Preconditions** | Admin user is on the Programs page; at least one program exists                                                  |
| **Steps**       | 1. Click "+ New Program"<br>2. Create a program named "New Program 2026"<br>3. Observe the program list            |
| **Expected**    | "New Program 2026" appears in the program list without requiring a page refresh                                    |
| **Priority**    | High                                                                                                               |

### TC-005 — Program list updates after editing a program

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-005                                                                                                             |
| **Title**       | Edited program data is reflected in the list immediately                                                           |
| **Preconditions** | Admin user is on the Programs page; "Old Name" exists                                                            |
| **Steps**       | 1. Edit "Old Name" and change it to "Updated Name"<br>2. Save<br>3. Observe the program list                      |
| **Expected**    | The list shows "Updated Name" in place of "Old Name" without requiring a page refresh                              |
| **Priority**    | High                                                                                                               |

### TC-006 — Program list updates after deleting a program

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-006                                                                                                             |
| **Title**       | Deleted program is removed from the list immediately                                                               |
| **Preconditions** | Admin user is on the Programs page; "Deleted Program" exists alongside other programs                            |
| **Steps**       | 1. Delete "Deleted Program" and confirm<br>2. Observe the program list                                            |
| **Expected**    | "Deleted Program" is no longer in the list; remaining programs are still displayed correctly                        |
| **Priority**    | High                                                                                                               |

### TC-007 — Program with empty description displays correctly

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-007                                                                                                             |
| **Title**       | A program with no description is displayed without layout issues                                                   |
| **Preconditions** | A program "No Desc Program" exists with an empty description                                                     |
| **Steps**       | 1. Navigate to the Programs page<br>2. Locate "No Desc Program"                                                   |
| **Expected**    | "No Desc Program" is displayed with its name; the description area is blank or shows a placeholder; no layout breakage |
| **Priority**    | Medium                                                                                                             |

---

## 2. Negative Flows

### TC-008 — Non-admin user sees program list but not management controls

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-008                                                                                                             |
| **Title**       | Non-admin users can view the list but cannot see create/edit/delete controls                                       |
| **Preconditions** | User is logged in with a non-admin role; programs exist                                                          |
| **Steps**       | 1. Navigate to the Programs page                                                                                   |
| **Expected**    | The program list is visible (names and descriptions), but "+ New Program", edit icons, and delete icons are not shown |
| **Priority**    | Medium                                                                                                             |

### TC-009 — Unauthenticated user cannot access the Programs page

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-009                                                                                                             |
| **Title**       | Programs page is not accessible without authentication                                                             |
| **Preconditions** | User is not logged in                                                                                            |
| **Steps**       | 1. Attempt to navigate directly to the Programs page URL                                                           |
| **Expected**    | The user is redirected to the login page or shown an access denied message                                         |
| **Priority**    | Medium                                                                                                             |

### TC-010 — Error state when program list fails to load

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-010                                                                                                             |
| **Title**       | A friendly error message is shown when the program list cannot be loaded                                           |
| **Preconditions** | Admin user is logged in; the API/backend is unavailable or returns an error                                       |
| **Steps**       | 1. Navigate to the Programs page while the backend is down or simulating a 500 error                               |
| **Expected**    | An error message is displayed (e.g., "Unable to load programs. Please try again.") instead of a blank page or raw error |
| **Priority**    | Medium                                                                                                             |

---

## 3. Edge Cases

### TC-011 — Large number of programs renders without performance issues

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-011                                                                                                             |
| **Title**       | Program list handles a large dataset (100+ programs) without degraded performance                                  |
| **Preconditions** | 100+ programs exist in the system                                                                                |
| **Steps**       | 1. Navigate to the Programs page<br>2. Scroll through the list                                                     |
| **Expected**    | All programs load and are scrollable; the page does not freeze, lag noticeably, or run out of memory               |
| **Priority**    | Medium                                                                                                             |

### TC-012 — Program with very long name displays without breaking layout

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-012                                                                                                             |
| **Title**       | A program with a 255-character name is displayed without overflowing the layout                                    |
| **Preconditions** | A program with a 255-character name exists                                                                       |
| **Steps**       | 1. Navigate to the Programs page<br>2. Locate the program with the long name                                       |
| **Expected**    | The name is either fully displayed with wrapping, or truncated with an ellipsis and a tooltip/hover showing the full name |
| **Priority**    | Medium                                                                                                             |

### TC-013 — Program with very long description displays without breaking layout

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-013                                                                                                             |
| **Title**       | A program with a very long description is displayed cleanly                                                        |
| **Preconditions** | A program exists with a 2000-character description                                                               |
| **Steps**       | 1. Navigate to the Programs page<br>2. Locate the program with the long description                                |
| **Expected**    | The description is either truncated with an indicator (e.g., "...") or wrapped properly; the layout is not broken   |
| **Priority**    | Medium                                                                                                             |

### TC-014 — Program with special characters displays correctly in the list

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-014                                                                                                             |
| **Title**       | Special characters, accents, and emojis in program names render correctly in the list                              |
| **Preconditions** | Programs exist with names: "Informatique & IA - Niveau 2", "Développement Réseau", "🎓 Graduate Studies"          |
| **Steps**       | 1. Navigate to the Programs page                                                                                   |
| **Expected**    | All program names render correctly with special characters, accented characters, and emojis intact                  |
| **Priority**    | Low                                                                                                                |

### TC-015 — Empty state disappears after creating the first program

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-015                                                                                                             |
| **Title**       | Empty state is replaced by the program list after the first program is created                                     |
| **Preconditions** | No programs exist; the empty state message is displayed                                                          |
| **Steps**       | 1. Click the "Create first program" prompt<br>2. Create a program named "First Program"<br>3. Observe the Programs page |
| **Expected**    | The empty state message disappears; the program list now shows "First Program"                                     |
| **Priority**    | High                                                                                                               |

### TC-016 — Program list is consistent after rapid create-then-delete

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-016                                                                                                             |
| **Title**       | Rapid creation and deletion does not leave ghost entries in the list                                               |
| **Preconditions** | Admin user is on the Programs page                                                                               |
| **Steps**       | 1. Create a program "Temp Program"<br>2. Immediately delete "Temp Program" and confirm<br>3. Observe the program list |
| **Expected**    | "Temp Program" is fully removed; no ghost/stale entries remain in the list                                         |
| **Priority**    | Low                                                                                                                |

### TC-017 — Page refresh preserves program list data

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-017                                                                                                             |
| **Title**       | Program list data is consistent after a full page refresh                                                          |
| **Preconditions** | Admin user is on the Programs page; multiple programs exist                                                       |
| **Steps**       | 1. Note the current list of programs<br>2. Refresh the browser<br>3. Compare the list                              |
| **Expected**    | The same programs appear with the same names and descriptions                                                      |
| **Priority**    | Medium                                                                                                             |

---

## Ambiguities & Gaps

| #  | Question                                                                                                     |
| -- | ------------------------------------------------------------------------------------------------------------ |
| 1  | Is there pagination or infinite scroll for the program list, or are all programs loaded at once?              |
| 2  | Is there a search/filter input field on the Programs page? The feature title mentions "filtering" but the ACs do not describe filter controls. |
| 3  | What is the default sort order of the program list — alphabetical, creation date, or other?                  |
| 4  | Is there a way to sort the list by different columns (e.g., click column headers)?                           |
| 5  | What is the exact wording of the empty state message and creation prompt?                                    |
| 6  | Does the program list show any additional metadata (e.g., creation date, number of courses, last updated)?   |
| 7  | What is the loading state while the program list is being fetched?                                           |
| 8  | Is the empty state prompt a button, a link, or an illustrative graphic with text?                            |
| 9  | Are the program descriptions shown inline in the list, or only visible on hover/expand?                      |
| 10 | Is the program list view responsive / mobile-friendly?                                                       |
