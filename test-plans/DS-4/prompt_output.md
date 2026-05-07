# Test Plan — DS-4: Delete Program with Confirmation

## Overview

| Attribute       | Detail                                                          |
| --------------- | --------------------------------------------------------------- |
| Feature         | Delete Program with Confirmation                                |
| Story           | DS-4                                                            |
| Role under test | Admin user                                                      |
| Entry criteria  | Application is running; admin user is logged in; at least one program exists |

---

## 1. Positive Flows

### TC-001 — Confirmation dialog appears when delete icon is clicked

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-001                                                                                                             |
| **Title**       | Clicking delete icon shows a confirmation dialog before deletion                                                   |
| **Preconditions** | Admin user is on the Programs page; "Test Program" exists                                                        |
| **Steps**       | 1. Locate "Test Program" in the program list<br>2. Click the delete icon for "Test Program"                        |
| **Expected**    | A confirmation dialog appears asking the user to confirm the deletion of "Test Program"                            |
| **Priority**    | High                                                                                                               |

### TC-002 — Program is deleted after confirming deletion

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-002                                                                                                             |
| **Title**       | Confirming deletion removes the program from the list                                                              |
| **Preconditions** | Admin user has clicked delete on "Test Program" and the confirmation dialog is visible                            |
| **Steps**       | 1. Click the Confirm / Delete button on the confirmation dialog                                                    |
| **Expected**    | The dialog closes; "Test Program" is no longer visible in the program list                                         |
| **Priority**    | High                                                                                                               |

### TC-003 — Program deletion is cancelled when Cancel is clicked

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-003                                                                                                             |
| **Title**       | Cancelling the confirmation dialog preserves the program                                                           |
| **Preconditions** | Admin user has clicked delete on a program and the confirmation dialog is visible                                 |
| **Steps**       | 1. Click the Cancel button on the confirmation dialog                                                              |
| **Expected**    | The dialog closes; the program still exists in the program list unchanged                                          |
| **Priority**    | High                                                                                                               |

### TC-004 — Deleted program does not reappear after page refresh

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-004                                                                                                             |
| **Title**       | Deletion persists across browser refresh                                                                           |
| **Preconditions** | Admin user has just confirmed deletion of "Test Program"                                                         |
| **Steps**       | 1. Refresh the browser<br>2. Navigate to the Programs page                                                         |
| **Expected**    | "Test Program" does not appear in the program list                                                                 |
| **Priority**    | High                                                                                                               |

### TC-005 — Confirmation dialog displays the correct program name

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-005                                                                                                             |
| **Title**       | Confirmation dialog identifies the specific program to be deleted                                                  |
| **Preconditions** | Admin user is on the Programs page; multiple programs exist including "Test Program"                              |
| **Steps**       | 1. Click the delete icon for "Test Program"<br>2. Read the confirmation dialog text                                |
| **Expected**    | The dialog clearly references "Test Program" by name (e.g., "Are you sure you want to delete Test Program?")       |
| **Priority**    | Medium                                                                                                             |

### TC-006 — Delete the last remaining program

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-006                                                                                                             |
| **Title**       | Deleting the only program results in an empty state                                                                |
| **Preconditions** | Only one program exists: "Last Program"                                                                          |
| **Steps**       | 1. Click the delete icon for "Last Program"<br>2. Confirm deletion                                                |
| **Expected**    | "Last Program" is removed; the Programs page shows the empty state message (e.g., "No programs have been created") |
| **Priority**    | Medium                                                                                                             |

---

## 2. Negative Flows

### TC-007 — Non-admin user cannot see the delete icon

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-007                                                                                                             |
| **Title**       | Non-admin users do not have access to the delete action                                                            |
| **Preconditions** | User is logged in with a non-admin role; programs exist                                                          |
| **Steps**       | 1. Navigate to the Programs page                                                                                   |
| **Expected**    | No delete icon is visible on any program entry                                                                     |
| **Priority**    | Medium                                                                                                             |

### TC-008 — Dismissing the confirmation dialog (Escape key) cancels deletion

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-008                                                                                                             |
| **Title**       | Pressing Escape on the confirmation dialog does not delete the program                                             |
| **Preconditions** | Admin user has clicked delete on "Test Program" and the confirmation dialog is visible                            |
| **Steps**       | 1. Press the Escape key                                                                                            |
| **Expected**    | The dialog closes; "Test Program" still exists in the list                                                         |
| **Priority**    | Medium                                                                                                             |

### TC-009 — Clicking outside the confirmation dialog cancels deletion

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-009                                                                                                             |
| **Title**       | Clicking the overlay/backdrop dismisses the dialog without deleting                                                |
| **Preconditions** | Admin user has clicked delete on "Test Program" and the confirmation dialog is visible                            |
| **Steps**       | 1. Click outside the confirmation dialog (on the overlay/backdrop)                                                 |
| **Expected**    | The dialog closes; the program is not deleted                                                                      |
| **Priority**    | Low                                                                                                                |

### TC-010 — Network failure during deletion shows error and preserves program

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-010                                                                                                             |
| **Title**       | Network error during deletion prevents data loss                                                                   |
| **Preconditions** | Admin user is about to confirm deletion; network connection is interrupted                                        |
| **Steps**       | 1. Click the delete icon for "Test Program"<br>2. Disconnect from the network<br>3. Click Confirm                  |
| **Expected**    | An error message is shown; the program is not removed from the list; data remains intact once network is restored   |
| **Priority**    | Medium                                                                                                             |

---

## 3. Edge Cases

### TC-011 — Rapid double-click on delete icon does not trigger duplicate dialogs

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-011                                                                                                             |
| **Title**       | Double-clicking the delete icon shows only one confirmation dialog                                                 |
| **Preconditions** | Admin user is on the Programs page; "Test Program" exists                                                        |
| **Steps**       | 1. Rapidly double-click the delete icon for "Test Program"                                                         |
| **Expected**    | Only one confirmation dialog appears; no duplicate dialogs or errors                                               |
| **Priority**    | Medium                                                                                                             |

### TC-012 — Rapid double-click on Confirm button does not cause errors

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-012                                                                                                             |
| **Title**       | Double-clicking Confirm does not send duplicate delete requests                                                    |
| **Preconditions** | Confirmation dialog is visible for "Test Program"                                                                |
| **Steps**       | 1. Rapidly double-click the Confirm / Delete button                                                                |
| **Expected**    | The program is deleted once; no errors are shown (e.g., "program not found" on second request)                     |
| **Priority**    | Medium                                                                                                             |

### TC-013 — Delete a program that is currently being edited in another session

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-013                                                                                                             |
| **Title**       | Deleting a program that another admin is editing is handled gracefully                                             |
| **Preconditions** | Admin A has the edit form open for "Shared Program"; Admin B is on the Programs page                             |
| **Steps**       | 1. Admin B clicks the delete icon for "Shared Program" and confirms<br>2. Admin A clicks Save on the edit form     |
| **Expected**    | Admin B's deletion succeeds; Admin A receives an error indicating the program no longer exists; no data corruption  |
| **Priority**    | Low                                                                                                                |

### TC-014 — Delete multiple programs sequentially

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-014                                                                                                             |
| **Title**       | Multiple programs can be deleted in sequence without errors                                                        |
| **Preconditions** | Admin user is on the Programs page; programs "Program A", "Program B", and "Program C" exist                     |
| **Steps**       | 1. Delete "Program A" (click delete icon, confirm)<br>2. Delete "Program B" (click delete icon, confirm)<br>3. Delete "Program C" (click delete icon, confirm) |
| **Expected**    | All three programs are removed from the list; no errors during sequential deletions                                |
| **Priority**    | Medium                                                                                                             |

### TC-015 — Confirmation dialog text for program with special characters in the name

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-015                                                                                                             |
| **Title**       | Special characters in program name are displayed correctly in the confirmation dialog                              |
| **Preconditions** | Program "Informatique & IA - Niveau 2" exists                                                                    |
| **Steps**       | 1. Click the delete icon for "Informatique & IA - Niveau 2"<br>2. Read the confirmation dialog                    |
| **Expected**    | The dialog displays the full program name "Informatique & IA - Niveau 2" correctly (no HTML encoding issues)       |
| **Priority**    | Low                                                                                                                |

### TC-016 — Program list updates correctly after deletion (order and count)

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-016                                                                                                             |
| **Title**       | Program list count and order updates immediately after deletion                                                    |
| **Preconditions** | Five programs exist on the Programs page                                                                         |
| **Steps**       | 1. Note the total count of programs<br>2. Delete one program and confirm<br>3. Observe the program list            |
| **Expected**    | The total count decreases by one; the remaining programs maintain their correct order; no blank rows appear         |
| **Priority**    | Medium                                                                                                             |

---

## Ambiguities & Gaps

| #  | Question                                                                                                     |
| -- | ------------------------------------------------------------------------------------------------------------ |
| 1  | What is the exact wording of the confirmation dialog? Does it include the program name?                      |
| 2  | Is the deletion a hard delete or a soft delete (can it be undone/restored)?                                  |
| 3  | Is there a success toast/notification after deletion, or does only the list update serve as feedback?         |
| 4  | Can the confirmation dialog be dismissed by clicking outside of it (overlay click)?                          |
| 5  | What happens if the program has associated curriculum data (courses, modules)? Is cascading deletion performed, or is deletion blocked? |
| 6  | Is there a bulk delete option, or only one-at-a-time?                                                        |
| 7  | What label does the confirm button use — "Delete", "Confirm", "Yes, delete", etc.?                          |
| 8  | Is there a keyboard shortcut (e.g., Enter) to confirm the deletion from the dialog?                          |
| 9  | Does the deleted program still appear in any references (e.g., audit logs, reports)?                         |
