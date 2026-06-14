# DS-2: Edit Existing Program Details

```gherkin
Feature: Edit existing program details
  As an admin user
  I want to edit a program's name and description
  So that program information stays accurate

  Background:
    Given the application is running
    And an admin user is logged in
    And at least one program exists on the Programs page

  # Positive flows
  Scenario: TC-001 Edit form displays current program name and description
    When the admin opens the edit form for a program
    Then the edit modal shows the current program name and description

  Scenario: TC-002 Updated program name is saved and reflected in the list immediately
    When the admin changes the program name and saves
    Then the modal closes and the list shows the updated name

  Scenario: TC-003 Updated description is saved while program name remains unchanged
    When the admin changes only the description and saves
    Then the program name is unchanged and the description is updated

  Scenario: TC-004 Unchanged description field is preserved after editing only the name
    When the admin changes only the program name and saves
    Then the description remains unchanged

  Scenario: TC-005 Edited program data persists across browser refresh
    When the admin saves an edited program and refreshes the page
    Then the updated program data is still displayed

  Scenario: TC-006 Both name and description can be updated in a single save action
    When the admin changes both fields and saves
    Then the list shows the new name and description

  # Negative flows
  Scenario: TC-007 Editing a program name to empty is prevented
    When the admin clears the program name in the edit form
    Then save is disabled or validation prevents saving

  Scenario: TC-008 Unsaved edits are discarded when the modal is dismissed
    When the admin changes the name and closes the modal without saving
    Then the program list still shows the original name

  Scenario: TC-009 Non-admin users do not see the edit icon on programs
    Given a non-admin user is logged in
    When they navigate to the Programs page
    Then no edit icon is visible on any program entry

  Scenario: TC-010 Clicking Save without modifications does not alter program data
    When the admin opens edit and saves without changes
    Then program data remains exactly the same

  # Edge cases
  Scenario: TC-011 Program name can be updated to the maximum character limit
    When the admin sets the name to 255 characters and saves
    Then the program is saved with the full name

  Scenario: TC-012 Leading/trailing whitespace is trimmed on save during edit
    When the admin saves a name with leading and trailing spaces
    Then the stored name has whitespace trimmed

  Scenario: TC-013 Renaming a program to an existing name is rejected
    When the admin renames a program to a duplicate name and saves
    Then an error indicates the name already exists and the change is not saved

  Scenario: TC-014 Double-clicking Save does not produce errors or inconsistent state
    When the admin double-clicks Save after editing
    Then the program is updated once without errors

  Scenario: TC-015 Concurrent edits to the same program do not cause data loss
    Given two admin sessions editing the same program
    When both save conflicting changes
    Then the system handles concurrency without data corruption

  Scenario: TC-016 Description can be cleared during edit
    When the admin clears the description and saves
    Then the program is saved with an empty description and the name is unchanged
```
