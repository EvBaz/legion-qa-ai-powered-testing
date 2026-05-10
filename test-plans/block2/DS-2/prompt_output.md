# Test Plan — DS-2: Edit Existing Program Details

## Overview

| Attribute       | Detail                                                          |
| --------------- | --------------------------------------------------------------- |
| Feature         | Edit Existing Program Details                                   |
| Story           | DS-2                                                            |
| Role under test | Admin user                                                      |
| Entry criteria  | Application is running; admin user is logged in; at least one program exists |

---

## 1. Positive Flows

### TC-001 — Edit form opens pre-populated with current program data

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-001                                                                                                             |
| **Title**       | Edit form displays current program name and description                                                            |
| **Preconditions** | Admin user is on the Programs page; "Web Development 2026" exists with description "Full-stack web development program" |
| **Steps**       | 1. Locate "Web Development 2026" in the program list<br>2. Click the edit icon on "Web Development 2026"           |
| **Expected**    | An edit modal/form opens with Program Name pre-filled as "Web Development 2026" and Description pre-filled as "Full-stack web development program" |
| **Priority**    | High                                                                                                               |

### TC-002 — Successfully edit the program name

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-002                                                                                                             |
| **Title**       | Updated program name is saved and reflected in the list immediately                                                |
| **Preconditions** | Admin user has opened the edit form for "Web Development 2026"                                                   |
| **Steps**       | 1. Clear the Program Name field<br>2. Enter "Web Development 2026 - Updated"<br>3. Click Save                     |
| **Expected**    | The modal closes and the program list immediately shows "Web Development 2026 - Updated" instead of the old name   |
| **Priority**    | High                                                                                                               |

### TC-003 — Successfully edit the program description

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-003                                                                                                             |
| **Title**       | Updated description is saved while program name remains unchanged                                                  |
| **Preconditions** | Admin user has opened the edit form for a program named "Data Science 101" with description "Intro to data science" |
| **Steps**       | 1. Clear the Description field<br>2. Enter "Advanced data science and machine learning program"<br>3. Click Save   |
| **Expected**    | The modal closes; the program name remains "Data Science 101"; the description updates to "Advanced data science and machine learning program" |
| **Priority**    | High                                                                                                               |

### TC-004 — Edit preserves unchanged fields when only name is modified

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-004                                                                                                             |
| **Title**       | Unchanged description field is preserved after editing only the name                                               |
| **Preconditions** | Program "UX Design" exists with description "User experience design fundamentals"                                |
| **Steps**       | 1. Click the edit icon on "UX Design"<br>2. Change the Name to "UX/UI Design"<br>3. Do not modify the Description<br>4. Click Save |
| **Expected**    | The program name updates to "UX/UI Design"; the description remains "User experience design fundamentals"          |
| **Priority**    | High                                                                                                               |

### TC-005 — Edited program data persists after page refresh

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-005                                                                                                             |
| **Title**       | Edited program data persists across browser refresh                                                                |
| **Preconditions** | Admin user has just successfully edited "Web Development 2026" to "Web Development 2026 - Updated"               |
| **Steps**       | 1. Refresh the browser<br>2. Navigate to the Programs page                                                         |
| **Expected**    | "Web Development 2026 - Updated" still appears with the updated data                                              |
| **Priority**    | High                                                                                                               |

### TC-006 — Edit both name and description simultaneously

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-006                                                                                                             |
| **Title**       | Both name and description can be updated in a single save action                                                   |
| **Preconditions** | Program "Old Program" exists with description "Old description"                                                  |
| **Steps**       | 1. Click the edit icon on "Old Program"<br>2. Change name to "New Program"<br>3. Change description to "New description"<br>4. Click Save |
| **Expected**    | The modal closes; the program list shows "New Program" with description "New description"                          |
| **Priority**    | Medium                                                                                                             |

---

## 2. Negative Flows

### TC-007 — Save is disabled or rejected when program name is cleared

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-007                                                                                                             |
| **Title**       | Editing a program name to empty is prevented                                                                       |
| **Preconditions** | Admin user has opened the edit form for "Web Development 2026"                                                   |
| **Steps**       | 1. Clear the Program Name field completely<br>2. Observe the Save button                                           |
| **Expected**    | The Save button is disabled or a validation error is displayed; the program is not saved with an empty name         |
| **Priority**    | High                                                                                                               |

### TC-008 — Closing the edit modal without saving discards changes

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-008                                                                                                             |
| **Title**       | Unsaved edits are discarded when the modal is dismissed                                                            |
| **Preconditions** | Admin user has opened the edit form for "Web Development 2026"                                                   |
| **Steps**       | 1. Change the Name to "Changed Name"<br>2. Close the modal (click X or press Escape)<br>3. Observe the program list |
| **Expected**    | The program list still shows "Web Development 2026"; the change is not saved                                       |
| **Priority**    | Medium                                                                                                             |

### TC-009 — Non-admin user cannot access the edit icon

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-009                                                                                                             |
| **Title**       | Non-admin users do not see the edit icon on programs                                                               |
| **Preconditions** | User is logged in with a non-admin role                                                                          |
| **Steps**       | 1. Navigate to the Programs page                                                                                   |
| **Expected**    | No edit icon is visible on any program entry                                                                       |
| **Priority**    | Medium                                                                                                             |

### TC-010 — Saving with no changes does not create a false update

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-010                                                                                                             |
| **Title**       | Clicking Save without modifications does not alter program data                                                    |
| **Preconditions** | Admin user has opened the edit form for "Web Development 2026"                                                   |
| **Steps**       | 1. Do not change any field<br>2. Click Save                                                                        |
| **Expected**    | The modal closes; program data remains exactly the same (no unintended side effects such as timestamp changes visible to the user) |
| **Priority**    | Low                                                                                                                |

---

## 3. Edge Cases

### TC-011 — Edit program name to maximum allowed length

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-011                                                                                                             |
| **Title**       | Program name can be updated to the maximum character limit                                                         |
| **Preconditions** | Admin user has opened the edit form for an existing program                                                       |
| **Steps**       | 1. Replace the current name with a 255-character string<br>2. Click Save                                          |
| **Expected**    | The program is saved with the full 255-character name                                                              |
| **Priority**    | Medium                                                                                                             |

### TC-012 — Edit program name with leading/trailing whitespace

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-012                                                                                                             |
| **Title**       | Leading/trailing whitespace is trimmed on save during edit                                                         |
| **Preconditions** | Admin user has opened the edit form for "Web Development 2026"                                                   |
| **Steps**       | 1. Change the name to "  Web Development 2026 - Trimmed  "<br>2. Click Save                                       |
| **Expected**    | The program name is saved as "Web Development 2026 - Trimmed" (whitespace trimmed)                                 |
| **Priority**    | Medium                                                                                                             |

### TC-013 — Edit program name to a name that already exists (duplicate)

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-013                                                                                                             |
| **Title**       | Renaming a program to an existing name is rejected                                                                 |
| **Preconditions** | Programs "Web Development 2026" and "Data Science 101" both exist                                                |
| **Steps**       | 1. Click the edit icon on "Data Science 101"<br>2. Change the name to "Web Development 2026"<br>3. Click Save     |
| **Expected**    | An error message indicates the program name already exists; the change is not saved                                |
| **Priority**    | High                                                                                                               |

### TC-014 — Rapid double-click on Save does not cause duplicate updates or errors

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-014                                                                                                             |
| **Title**       | Double-clicking Save does not produce errors or inconsistent state                                                 |
| **Preconditions** | Admin user has modified a program name in the edit form                                                           |
| **Steps**       | 1. Rapidly double-click the Save button                                                                            |
| **Expected**    | The program is updated once; no errors or duplicate requests are visible                                           |
| **Priority**    | Medium                                                                                                             |

### TC-015 — Edit form handles concurrent editing gracefully

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-015                                                                                                             |
| **Title**       | Concurrent edits to the same program do not cause data loss                                                        |
| **Preconditions** | Two admin users have opened the edit form for the same program simultaneously                                    |
| **Steps**       | 1. Admin A changes the name to "Version A" and clicks Save<br>2. Admin B (still on old data) changes the name to "Version B" and clicks Save |
| **Expected**    | The system either prevents the stale save with an error (optimistic locking) or the last save wins; no data corruption occurs |
| **Priority**    | Low                                                                                                                |

### TC-016 — Edit description to empty value

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-016                                                                                                             |
| **Title**       | Description can be cleared during edit                                                                             |
| **Preconditions** | Program "Web Development 2026" exists with a non-empty description                                               |
| **Steps**       | 1. Click the edit icon on "Web Development 2026"<br>2. Clear the Description field completely<br>3. Click Save     |
| **Expected**    | The program is saved with an empty description; the name remains unchanged                                         |
| **Priority**    | Medium                                                                                                             |

---

## Ambiguities & Gaps

| #  | Question                                                                                                     |
| -- | ------------------------------------------------------------------------------------------------------------ |
| 1  | Is there a "Cancel" button on the edit form in addition to the close (X) icon?                               |
| 2  | Should there be an unsaved-changes confirmation when closing the edit modal with pending edits?               |
| 3  | Does the system track an "updated at" timestamp, and is it displayed to the user?                            |
| 4  | What happens if the program being edited is deleted by another admin while the edit form is open?             |
| 5  | Is there a loading/spinner state on the Save button while the update request is in progress?                 |
| 6  | Should editing a program name to a duplicate be validated client-side, server-side, or both?                 |
| 7  | Are there any fields besides Name and Description that can be edited?                                        |
| 8  | Can the edit form be opened by clicking the program row, or only via the edit icon?                          |
| 9  | What error message is shown if the save fails due to network issues?                                         |
