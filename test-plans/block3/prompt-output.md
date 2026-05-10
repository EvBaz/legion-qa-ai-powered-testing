# Test Plan — TODO MVC App (React • TodoMVC)

**Application URL:** https://demo.playwright.dev/todomvc/#/  
**Framework:** React  
**Date:** 2026-05-10

---

## 1. Positive Flows

### AC-1: Create a TODO list

| Field | Value |
|-------|-------|
| **ID** | TC-001 |
| **Title** | New todo list is empty on first load |
| **Preconditions** | Browser opened, no prior local storage data |
| **Steps** | 1. Navigate to `https://demo.playwright.dev/todomvc/#/` |
| **Expected Result** | The page loads with the header "todos", an empty input field with placeholder "What needs to be done?", and no todo items displayed. The footer with item count and filters is not visible. |
| **Priority** | High |

---

### AC-2: Add items — item to be added

| Field | Value |
|-------|-------|
| **ID** | TC-002 |
| **Title** | Single todo item is added successfully |
| **Preconditions** | App is loaded, todo list is empty |
| **Steps** | 1. Click the input field "What needs to be done?" <br> 2. Type `Buy groceries` <br> 3. Press Enter |
| **Expected Result** | The item "Buy groceries" appears in the list. The footer shows "1 item left". The input field is cleared. |
| **Priority** | High |

| Field | Value |
|-------|-------|
| **ID** | TC-003 |
| **Title** | Multiple todo items are added in sequence |
| **Preconditions** | App is loaded, todo list is empty |
| **Steps** | 1. Type `Buy groceries` and press Enter <br> 2. Type `Clean the house` and press Enter <br> 3. Type `Walk the dog` and press Enter |
| **Expected Result** | All three items appear in the list in the order they were added. The footer shows "3 items left". |
| **Priority** | High |

---

### AC-3: Finish item — item to be finished

| Field | Value |
|-------|-------|
| **ID** | TC-004 |
| **Title** | Todo item is marked as completed |
| **Preconditions** | App has one active item: "Buy groceries" |
| **Steps** | 1. Click the toggle checkbox to the left of "Buy groceries" |
| **Expected Result** | The item "Buy groceries" gets a strikethrough style. The footer shows "0 items left". The item is still visible in the "All" view. |
| **Priority** | High |

| Field | Value |
|-------|-------|
| **ID** | TC-005 |
| **Title** | Completed item can be unchecked to become active again |
| **Preconditions** | App has one completed item: "Buy groceries" |
| **Steps** | 1. Click the toggle checkbox to the left of "Buy groceries" again |
| **Expected Result** | The strikethrough is removed. The footer shows "1 item left". The item is active again. |
| **Priority** | High |

| Field | Value |
|-------|-------|
| **ID** | TC-006 |
| **Title** | Completed items appear under the Completed filter |
| **Preconditions** | App has two items: "Buy groceries" (completed), "Walk the dog" (active) |
| **Steps** | 1. Click the "Completed" filter link in the footer |
| **Expected Result** | Only "Buy groceries" is displayed. "Walk the dog" is hidden. |
| **Priority** | High |

| Field | Value |
|-------|-------|
| **ID** | TC-007 |
| **Title** | Active items appear under the Active filter |
| **Preconditions** | App has two items: "Buy groceries" (completed), "Walk the dog" (active) |
| **Steps** | 1. Click the "Active" filter link in the footer |
| **Expected Result** | Only "Walk the dog" is displayed. "Buy groceries" is hidden. |
| **Priority** | High |

| Field | Value |
|-------|-------|
| **ID** | TC-008 |
| **Title** | Toggle-all marks every item as completed |
| **Preconditions** | App has three active items |
| **Steps** | 1. Click the toggle-all chevron (❯) to the left of the input field |
| **Expected Result** | All items receive strikethrough styling. The footer shows "0 items left". |
| **Priority** | Medium |

---

### AC-4: Removing item from the list — item to be removed

| Field | Value |
|-------|-------|
| **ID** | TC-009 |
| **Title** | Single todo item is removed via the destroy button |
| **Preconditions** | App has one item: "Buy groceries" |
| **Steps** | 1. Hover over "Buy groceries" <br> 2. Click the "×" (destroy) button that appears on the right |
| **Expected Result** | "Buy groceries" is removed from the list. The footer disappears because the list is empty. |
| **Priority** | High |

| Field | Value |
|-------|-------|
| **ID** | TC-010 |
| **Title** | "Clear completed" removes all finished items |
| **Preconditions** | App has three items, two of which are completed |
| **Steps** | 1. Click the "Clear completed" button in the footer |
| **Expected Result** | The two completed items are removed. Only the one active item remains. The "Clear completed" button disappears. |
| **Priority** | High |

---

## 2. Negative Flows

| Field | Value |
|-------|-------|
| **ID** | TC-011 |
| **Title** | Empty input does not create a todo |
| **Preconditions** | App is loaded, input field is empty |
| **Steps** | 1. Click the input field <br> 2. Press Enter without typing anything |
| **Expected Result** | No item is added to the list. The list remains empty. No footer appears. |
| **Priority** | High |

| Field | Value |
|-------|-------|
| **ID** | TC-012 |
| **Title** | Whitespace-only input does not create a todo |
| **Preconditions** | App is loaded, input field is empty |
| **Steps** | 1. Click the input field <br> 2. Type `     ` (only spaces) <br> 3. Press Enter |
| **Expected Result** | No item is added to the list. The input field is cleared. |
| **Priority** | High |

| Field | Value |
|-------|-------|
| **ID** | TC-013 |
| **Title** | Destroy button does not appear without hover |
| **Preconditions** | App has one item: "Buy groceries" |
| **Steps** | 1. Observe the item "Buy groceries" without hovering |
| **Expected Result** | The "×" destroy button is not visible. |
| **Priority** | Low |

| Field | Value |
|-------|-------|
| **ID** | TC-014 |
| **Title** | Editing a todo to empty text removes the item |
| **Preconditions** | App has one item: "Buy groceries" |
| **Steps** | 1. Double-click on "Buy groceries" to enter edit mode <br> 2. Clear the text completely <br> 3. Press Enter |
| **Expected Result** | The item is removed from the list (empty todos are not allowed). |
| **Priority** | Medium |

| Field | Value |
|-------|-------|
| **ID** | TC-015 |
| **Title** | Pressing Escape during edit cancels the change |
| **Preconditions** | App has one item: "Buy groceries" |
| **Steps** | 1. Double-click on "Buy groceries" to enter edit mode <br> 2. Change text to `Buy milk` <br> 3. Press Escape |
| **Expected Result** | The item text reverts to "Buy groceries". Edit mode is exited. |
| **Priority** | Medium |

---

## 3. Edge Cases

| Field | Value |
|-------|-------|
| **ID** | TC-016 |
| **Title** | Todo with special characters is added correctly |
| **Preconditions** | App is loaded, todo list is empty |
| **Steps** | 1. Type `Buy <milk> & "eggs" @store #1` <br> 2. Press Enter |
| **Expected Result** | The item is added with the exact text `Buy <milk> & "eggs" @store #1` displayed correctly (HTML entities properly escaped). |
| **Priority** | Medium |

| Field | Value |
|-------|-------|
| **ID** | TC-017 |
| **Title** | Duplicate todo items are allowed |
| **Preconditions** | App has one item: "Buy groceries" |
| **Steps** | 1. Type `Buy groceries` <br> 2. Press Enter |
| **Expected Result** | A second "Buy groceries" item appears in the list. The footer shows "2 items left". Both items are independent and can be completed or deleted separately. |
| **Priority** | Medium |

| Field | Value |
|-------|-------|
| **ID** | TC-018 |
| **Title** | Very long todo text is handled gracefully |
| **Preconditions** | App is loaded, todo list is empty |
| **Steps** | 1. Type a string of 500 characters (e.g., `a` repeated 500 times) <br> 2. Press Enter |
| **Expected Result** | The item is added and displayed. The text may be truncated visually or overflow gracefully (no layout breakage). |
| **Priority** | Low |

| Field | Value |
|-------|-------|
| **ID** | TC-019 |
| **Title** | Leading and trailing whitespace is trimmed from new items |
| **Preconditions** | App is loaded, todo list is empty |
| **Steps** | 1. Type `   Buy groceries   ` (with leading and trailing spaces) <br> 2. Press Enter |
| **Expected Result** | The item is added with trimmed text "Buy groceries" (no leading or trailing spaces). |
| **Priority** | Medium |

| Field | Value |
|-------|-------|
| **ID** | TC-020 |
| **Title** | Todo item can be edited via double-click |
| **Preconditions** | App has one item: "Buy groceries" |
| **Steps** | 1. Double-click on "Buy groceries" <br> 2. Clear the text and type `Buy milk` <br> 3. Press Enter |
| **Expected Result** | The item text updates to "Buy milk". The item remains in its original position. |
| **Priority** | High |

| Field | Value |
|-------|-------|
| **ID** | TC-021 |
| **Title** | Item count updates correctly as items are added and removed |
| **Preconditions** | App is loaded, todo list is empty |
| **Steps** | 1. Add `Item A` — verify footer shows "1 item left" <br> 2. Add `Item B` — verify footer shows "2 items left" <br> 3. Complete `Item A` — verify footer shows "1 item left" <br> 4. Delete `Item B` — verify footer shows "0 items left" |
| **Expected Result** | The "X items left" counter in the footer accurately reflects the number of active (uncompleted) items after each operation. |
| **Priority** | High |

| Field | Value |
|-------|-------|
| **ID** | TC-022 |
| **Title** | Todos persist after page reload (local storage) |
| **Preconditions** | App has two items: "Buy groceries" (active), "Walk the dog" (completed) |
| **Steps** | 1. Reload the page (F5 or Ctrl+R) |
| **Expected Result** | Both items are still present with their original completion states. "Buy groceries" is active, "Walk the dog" is completed with strikethrough. |
| **Priority** | High |

| Field | Value |
|-------|-------|
| **ID** | TC-023 |
| **Title** | Filter state is preserved via URL hash routing |
| **Preconditions** | App has items in both active and completed states |
| **Steps** | 1. Click "Active" filter <br> 2. Verify URL is `/#/active` <br> 3. Navigate directly to `https://demo.playwright.dev/todomvc/#/completed` |
| **Expected Result** | Navigating to `/#/active` shows only active items. Navigating to `/#/completed` shows only completed items. The correct filter link is highlighted. |
| **Priority** | Medium |

| Field | Value |
|-------|-------|
| **ID** | TC-024 |
| **Title** | Single item uses singular "item left" text |
| **Preconditions** | App has exactly one active item |
| **Steps** | 1. Observe the footer text |
| **Expected Result** | The footer reads "1 item left" (singular), not "1 items left". |
| **Priority** | Low |

| Field | Value |
|-------|-------|
| **ID** | TC-025 |
| **Title** | Multiple items use plural "items left" text |
| **Preconditions** | App has two or more active items |
| **Steps** | 1. Observe the footer text |
| **Expected Result** | The footer reads "2 items left" (plural). |
| **Priority** | Low |

---

## Ambiguities and Gaps in the Acceptance Criteria

1. **Edit functionality not mentioned:** The ACs do not cover editing an existing todo item (double-click to edit), which is a core TodoMVC feature.
2. **Persistence not specified:** No AC addresses whether todos should survive a page reload (local storage behavior).
3. **Filter behavior not covered:** The ACs do not mention the All / Active / Completed filter links or URL hash routing.
4. **"Clear completed" not mentioned:** The bulk-remove action for completed items is not referenced in the ACs.
5. **Toggle-all not mentioned:** The ability to mark/unmark all items at once is not covered.
6. **Input validation rules unclear:** ACs do not specify behavior for whitespace-only input, leading/trailing spaces, special characters, or maximum input length.
7. **"Removing item" is ambiguous:** AC-4 says "Removing item from the list" but does not specify the mechanism (destroy button on hover vs. other methods).
8. **Duplicate items:** ACs do not state whether duplicate todo text should be allowed or prevented.
9. **Singular vs. plural counter:** ACs do not specify whether the footer counter should correctly pluralize ("1 item left" vs. "2 items left").

---

*Test plan revalidated against all 4 acceptance criteria. Each AC is covered by at least one high-priority positive test case (TC-001 through TC-010). Negative flows and edge cases extend coverage beyond the stated ACs.*
