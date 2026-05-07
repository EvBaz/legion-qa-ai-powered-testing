# Test Plan — DS-1: Create New Academic Program

## Overview

| Attribute       | Detail                                          |
| --------------- | ----------------------------------------------- |
| Feature         | Create New Academic Program                     |
| Story           | DS-1                                            |
| Role under test | Admin user                                      |
| Entry criteria  | Application is running; admin user is logged in |

---

## 1. Positive Flows

### TC-001 — Program creation form opens with correct fields

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-001                                                                                                             |
| **Title**       | Program creation form displays Program Name and Description fields                                                 |
| **Preconditions** | Admin user is logged in                                                                                          |
| **Steps**       | 1. Navigate to the Programs page<br>2. Click "+ New Program"                                                       |
| **Expected**    | A modal/form appears containing the fields: Program Name (text input) and Description (text area)                  |
| **Priority**    | High                                                                                                               |

### TC-002 — Successfully create a program with valid data

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-002                                                                                                             |
| **Title**       | Program is created and appears in the program list                                                                 |
| **Preconditions** | Admin user is on the program creation form                                                                       |
| **Steps**       | 1. Enter "Web Development 2026" in the Program Name field<br>2. Enter "Full-stack web development program" in the Description field<br>3. Click Create |
| **Expected**    | The modal closes and the program list displays "Web Development 2026" with description "Full-stack web development program" |
| **Priority**    | High                                                                                                               |

### TC-003 — Create button is disabled when form first opens

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-003                                                                                                             |
| **Title**       | Create button is disabled by default on empty form                                                                 |
| **Preconditions** | Admin user is logged in                                                                                          |
| **Steps**       | 1. Navigate to the Programs page<br>2. Click "+ New Program"<br>3. Observe the Create button state without entering any data |
| **Expected**    | The Create button is disabled (greyed out / not clickable)                                                         |
| **Priority**    | High                                                                                                               |

### TC-004 — Create button enables after entering a valid program name

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-004                                                                                                             |
| **Title**       | Create button becomes enabled when a valid Program Name is entered                                                 |
| **Preconditions** | Admin user is on the program creation form with Create button disabled                                           |
| **Steps**       | 1. Enter "Data Science Bootcamp" in the Program Name field                                                         |
| **Expected**    | The Create button becomes enabled (clickable)                                                                      |
| **Priority**    | High                                                                                                               |

### TC-005 — Create program with only the required field (Program Name)

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-005                                                                                                             |
| **Title**       | Program is created successfully with only Program Name and no Description                                          |
| **Preconditions** | Admin user is on the program creation form                                                                       |
| **Steps**       | 1. Enter "Cybersecurity Fundamentals" in the Program Name field<br>2. Leave the Description field empty<br>3. Click Create |
| **Expected**    | The modal closes and "Cybersecurity Fundamentals" appears in the program list with an empty description             |
| **Priority**    | Medium                                                                                                             |

### TC-006 — Newly created program persists after page refresh

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-006                                                                                                             |
| **Title**       | Created program survives a full page reload                                                                        |
| **Preconditions** | "Web Development 2026" has just been created successfully                                                        |
| **Steps**       | 1. Refresh the browser (F5 / Ctrl+R)<br>2. Navigate to the Programs page                                          |
| **Expected**    | "Web Development 2026" still appears in the program list                                                           |
| **Priority**    | High                                                                                                               |

---

## 2. Negative Flows

### TC-007 — Create button remains disabled when Program Name is empty

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-007                                                                                                             |
| **Title**       | Empty Program Name prevents form submission                                                                        |
| **Preconditions** | Admin user is on the program creation form                                                                       |
| **Steps**       | 1. Leave the Program Name field empty<br>2. Fill in Description with "Some description"<br>3. Observe the Create button |
| **Expected**    | The Create button remains disabled; no program is created                                                          |
| **Priority**    | High                                                                                                               |

### TC-008 — Create button disables again when Program Name is cleared

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-008                                                                                                             |
| **Title**       | Clearing Program Name after entry re-disables the Create button                                                    |
| **Preconditions** | Admin user is on the program creation form with a valid name entered                                             |
| **Steps**       | 1. Enter "Temp Program" in Program Name<br>2. Verify Create button is enabled<br>3. Clear the Program Name field completely<br>4. Observe the Create button |
| **Expected**    | The Create button becomes disabled again                                                                           |
| **Priority**    | Medium                                                                                                             |

### TC-009 — Non-admin user cannot access "+ New Program" button

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-009                                                                                                             |
| **Title**       | Non-admin users do not see the program creation option                                                             |
| **Preconditions** | User is logged in with a non-admin role (e.g., viewer, instructor)                                               |
| **Steps**       | 1. Navigate to the Programs page                                                                                   |
| **Expected**    | The "+ New Program" button is not visible or is disabled                                                            |
| **Priority**    | Medium                                                                                                             |

### TC-010 — Closing the modal without saving discards input

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-010                                                                                                             |
| **Title**       | Dismissing the creation form does not create a program                                                             |
| **Preconditions** | Admin user is on the program creation form                                                                       |
| **Steps**       | 1. Enter "Abandoned Program" in Program Name<br>2. Close the modal (click X or press Escape)<br>3. Observe the program list |
| **Expected**    | No program named "Abandoned Program" appears in the list; the form is dismissed                                    |
| **Priority**    | Medium                                                                                                             |

---

## 3. Edge Cases

### TC-011 — Program name with maximum length

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-011                                                                                                             |
| **Title**       | Program creation accepts a name at the maximum allowed character limit                                             |
| **Preconditions** | Admin user is on the program creation form                                                                       |
| **Steps**       | 1. Enter a 255-character string in the Program Name field (e.g., "A" repeated 255 times)<br>2. Click Create       |
| **Expected**    | The program is created successfully, or the field prevents input beyond the limit and the name is stored fully     |
| **Priority**    | Medium                                                                                                             |

### TC-012 — Program name exceeding maximum length is rejected or truncated

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-012                                                                                                             |
| **Title**       | Program name beyond max length is rejected or truncated                                                            |
| **Preconditions** | Admin user is on the program creation form                                                                       |
| **Steps**       | 1. Attempt to enter a 256+ character string in the Program Name field<br>2. Observe field behavior                 |
| **Expected**    | The field either prevents input beyond the limit, or shows a validation error on submit                            |
| **Priority**    | Low                                                                                                                |

### TC-013 — Program name with leading and trailing whitespace is trimmed

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-013                                                                                                             |
| **Title**       | Leading/trailing whitespace in Program Name is trimmed before saving                                               |
| **Preconditions** | Admin user is on the program creation form                                                                       |
| **Steps**       | 1. Enter "  Web Development 2026  " (with leading/trailing spaces) in Program Name<br>2. Click Create             |
| **Expected**    | The program is created with the name "Web Development 2026" (trimmed)                                              |
| **Priority**    | Medium                                                                                                             |

### TC-014 — Program name with single character

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-014                                                                                                             |
| **Title**       | Single-character Program Name is accepted                                                                          |
| **Preconditions** | Admin user is on the program creation form                                                                       |
| **Steps**       | 1. Enter "X" in the Program Name field<br>2. Click Create                                                          |
| **Expected**    | The program "X" is created and appears in the list                                                                 |
| **Priority**    | Low                                                                                                                |

### TC-015 — Description field with very long text

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-015                                                                                                             |
| **Title**       | Long description text is accepted and stored completely                                                            |
| **Preconditions** | Admin user is on the program creation form                                                                       |
| **Steps**       | 1. Enter "Long Description Test" in Program Name<br>2. Enter a 2000-character description<br>3. Click Create      |
| **Expected**    | The program is created; the full description is stored and displayed correctly                                      |
| **Priority**    | Low                                                                                                                |

### TC-016 — Rapid double-click on Create does not create duplicate programs

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-016                                                                                                             |
| **Title**       | Double-clicking Create does not produce duplicate entries                                                           |
| **Preconditions** | Admin user is on the program creation form with valid data entered                                               |
| **Steps**       | 1. Enter "Double Click Test" in Program Name<br>2. Rapidly double-click the Create button                         |
| **Expected**    | Only one program named "Double Click Test" is created                                                              |
| **Priority**    | Medium                                                                                                             |

### TC-017 — Program name with Unicode / emoji characters

| Field           | Value                                                                                                              |
| --------------- | ------------------------------------------------------------------------------------------------------------------ |
| **ID**          | TC-017                                                                                                             |
| **Title**       | Unicode and emoji characters in Program Name are handled correctly                                                 |
| **Preconditions** | Admin user is on the program creation form                                                                       |
| **Steps**       | 1. Enter "プログラム 🎓 2026" in Program Name<br>2. Click Create                                                  |
| **Expected**    | The program is created successfully with the Unicode/emoji name intact                                             |
| **Priority**    | Low                                                                                                                |

---

## Ambiguities & Gaps

| #  | Question                                                                                                     |
| -- | ------------------------------------------------------------------------------------------------------------ |
| 1  | What is the maximum allowed character length for the Program Name field?                                     |
| 2  | What is the maximum allowed character length for the Description field?                                      |
| 3  | Is the Description field required or optional for program creation?                                          |
| 4  | What happens if the user loses network connectivity while submitting the form?                                |
| 5  | Is there a success toast/notification shown after creation, or only the list update?                          |
| 6  | Should the modal be closable by clicking outside of it (overlay click), or only via a close button?          |
| 7  | Is there an unsaved-changes warning when closing the modal with data entered?                                |
| 8  | What roles besides admin exist, and should any of them have partial program creation access?                  |
| 9  | Does the newly created program appear at the top of the list, bottom, or in alphabetical order?              |
| 10 | Is there a loading/spinner state on the Create button while the request is in progress?                      |
