# DS-5: Program List Filtering and Display

```gherkin
Feature: Program list filtering and display
  As an admin user
  I want to see all programs in a clear list
  So that I can quickly find and manage them

  Background:
    Given the application is running
    And an admin user is logged in

  # Happy paths (from acceptance criteria)
  Scenario: TC-001 Display program list with key details
    Given programs exist in the system:
      | name                  | description                          |
      | Web Development 2026  | Full-stack web development program |
      | Data Science 101      | Intro to data science and analytics  |
    When the admin navigates to the Programs page
    Then each program row shows its name and description
    And "Web Development 2026" shows "Full-stack web development program"
    And "Data Science 101" shows "Intro to data science and analytics"

  Scenario: TC-002 Empty state when no programs exist
    Given no programs exist in the system
    When the admin navigates to the Programs page
    Then a message indicates no programs have been created
    And a prompt to create the first program is visible

  Scenario: TC-003 Empty state create prompt opens program creation
    Given no programs exist in the system
    And the admin is on the Programs page
    When the admin clicks the create-first-program prompt
    Then the program creation form opens

  Scenario: TC-004 Program list updates immediately after creating a program
    Given at least one program exists on the Programs page
    When the admin creates a program named "New Program 2026"
    Then "New Program 2026" appears in the program list without a page refresh

  Scenario: TC-005 Program list updates immediately after editing a program
    Given a program named "Old Name" exists on the Programs page
    When the admin edits "Old Name" to "Updated Name" and saves
    Then the list shows "Updated Name" instead of "Old Name" without a page refresh

  Scenario: TC-006 Program list updates immediately after deleting a program
    Given "Deleted Program" and other programs exist on the Programs page
    When the admin deletes "Deleted Program" and confirms
    Then "Deleted Program" is no longer in the list
    And the remaining programs are still displayed

  Scenario: TC-007 Program with empty description displays correctly
    Given a program "No Desc Program" exists with an empty description
    When the admin navigates to the Programs page
    Then "No Desc Program" is visible in the list
    And the description area is blank or shows a placeholder without layout breakage

  Scenario: TC-008 Empty state is replaced after the first program is created
    Given no programs exist and the empty state is visible
    When the admin creates a program named "First Program"
    Then the empty state message is no longer shown
    And the list shows "First Program"

  # Negative flows
  Scenario: TC-009 Non-admin user sees the list but not management controls
    Given a non-admin user is logged in
    And programs exist in the system
    When they navigate to the Programs page
    Then program names and descriptions are visible
    And "+ New Program", Edit, and Delete controls are not shown

  Scenario: TC-010 Unauthenticated user cannot access the Programs page
    Given the user is not logged in
    When they navigate directly to the Programs page
    Then they are redirected to login or shown an access denied message

  # Edge cases
  Scenario: TC-011 Program with a 255-character name displays without breaking layout
    Given a program exists with a 255-character name
    When the admin navigates to the Programs page
    Then the long name is displayed with wrapping or truncation without layout overflow

  Scenario: TC-012 Program with special characters displays correctly
    Given programs exist with names "Informatique & IA - Niveau 2", "Développement Réseau", and "🎓 Graduate Studies"
    When the admin navigates to the Programs page
    Then each name renders with special characters, accents, and emoji intact

  Scenario: TC-013 Rapid create-then-delete does not leave ghost entries
    Given the admin is on the Programs page
    When the admin creates "Temp Program" and immediately deletes it with confirmation
    Then "Temp Program" is not shown in the list

  Scenario: TC-014 Program list is consistent after a full page refresh
    Given multiple programs exist on the Programs page
    When the admin notes the current list and refreshes the browser
    Then the same program names and descriptions are still displayed
```

## Ambiguities & gaps

| # | Question |
|---|----------|
| 1 | The story title mentions **filtering**, but the acceptance criteria only cover list display and empty state. Are search/filter controls in scope for DS-5? |
| 2 | What is the default sort order of the program list (alphabetical, creation date, other)? |
| 3 | Is there pagination or infinite scroll, or are all programs loaded at once? |
| 4 | What is the exact empty-state copy and is the create prompt a button, link, or other control? |
| 5 | Are descriptions shown inline in the table or only on row expand/hover? |
| 6 | What loading or error state is shown while programs are fetched (TC-010 API-failure case)? |
| 7 | Non-admin credentials are not available in test env — block TC-009 like DS-1/DS-2/DS-4? |
