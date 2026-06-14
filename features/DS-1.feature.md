# Feature: DS-1 — Create New Academic Program

Admin users can create new academic programs via the Programs page.

# Happy paths

## TC-001 — Program creation form displays Program Name and Description fields

Scenario: Open program creation form
  Given I am logged in as an admin user
  When I navigate to the Programs page
  And I click "+ New Program"
  Then a modal appears with Program Name and Description fields

## TC-002 — Program is created and appears in the program list

Scenario: Create program with valid name and description
  Given I am on the program creation form
  When I enter a program name and description
  And I click Create
  Then the modal closes
  And the program appears in the list with the entered name and description

## TC-003 — Create button is disabled by default on empty form

Scenario: Create button disabled on empty form
  Given I am logged in as an admin user
  When I open the program creation form without entering data
  Then the Create button is disabled

## TC-004 — Create button becomes enabled when a valid Program Name is entered

Scenario: Create button enables after entering program name
  Given I am on the program creation form with Create disabled
  When I enter a valid program name
  Then the Create button becomes enabled

## TC-005 — Program is created successfully with only Program Name (no Description)

Scenario: Create program with name only
  Given I am on the program creation form
  When I enter a program name and leave Description empty
  And I click Create
  Then the modal closes
  And the program appears in the list

## TC-006 — Created program survives a full page reload

Scenario: Created program persists after refresh
  Given a program was just created successfully
  When I refresh the browser and navigate to Programs
  Then the program still appears in the list

# Negative

## TC-007 — Empty Program Name prevents form submission

Scenario: Description alone does not enable Create
  Given I am on the program creation form
  When I leave Program Name empty and fill Description
  Then the Create button remains disabled

## TC-008 — Clearing Program Name after entry re-disables the Create button

Scenario: Clearing name re-disables Create
  Given I entered a valid program name on the creation form
  When I clear the Program Name field
  Then the Create button becomes disabled again

## TC-009 — Non-admin users do not see the program creation option

Scenario: Non-admin cannot create programs
  Given I am logged in as a non-admin user
  When I navigate to the Programs page
  Then the "+ New Program" button is not visible or is disabled

## TC-010 — Dismissing the creation form does not create a program

Scenario: Cancel discards unsaved input
  Given I am on the program creation form with data entered
  When I close the modal without saving
  Then no new program appears in the list

# Edge cases

## TC-011 — Program creation accepts a name at the maximum allowed character limit

Scenario: Maximum-length program name
  Given I am on the program creation form
  When I enter a 255-character program name and click Create
  Then the program is created successfully or input is capped at the limit

## TC-012 — Program name beyond max length is rejected or truncated

Scenario: Over-limit program name
  Given I am on the program creation form
  When I attempt to enter more than 255 characters in Program Name
  Then the field prevents excess input or shows validation on submit

## TC-013 — Leading/trailing whitespace in Program Name is trimmed before saving

Scenario: Whitespace trimmed from program name
  Given I am on the program creation form
  When I enter a name with leading and trailing spaces and click Create
  Then the program is saved with the trimmed name

## TC-014 — Single-character Program Name is accepted

Scenario: Single-character name
  Given I am on the program creation form
  When I enter a single character as the program name and click Create
  Then the program is created and appears in the list

## TC-015 — Long description text is accepted and stored completely

Scenario: Very long description
  Given I am on the program creation form
  When I enter a program name and a 2000-character description and click Create
  Then the program is created with the full description stored

## TC-016 — Double-clicking Create does not produce duplicate entries

Scenario: Double-click Create
  Given I am on the program creation form with valid data
  When I double-click the Create button
  Then only one program is created

## TC-017 — Unicode and emoji characters in Program Name are handled correctly

Scenario: Unicode and emoji in program name
  Given I am on the program creation form
  When I enter a name with Unicode and emoji characters and click Create
  Then the program is created with the name intact

<!--
Ambiguities & Gaps:
- Maximum character length for Program Name and Description is unspecified in the ticket.
- Description required vs optional is unclear (TC-005 assumes optional).
- No spec for network failure during submit, success toast, overlay click to close, or unsaved-changes warning.
- Non-admin roles and partial creation access are undefined (TC-009 skipped — credentials unavailable).
- List sort order for newly created programs is unspecified.
- Loading/spinner state on Create during submit is unspecified.
-->
