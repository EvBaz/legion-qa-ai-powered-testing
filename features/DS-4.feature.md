# Feature: DS-4 — Delete Program with Confirmation

As an admin user
I want to delete a program I no longer need, with a confirmation step
So that accidental deletions are prevented

# Happy paths

Scenario: TC-001 — Delete program with confirmation
  Given I am logged in as admin on the Programs page
  And a program named "Test Program" exists in the list
  When I click the Delete button for "Test Program"
  Then I see a browser confirmation dialog
  When I confirm deletion
  Then "Test Program" is removed from the program list

Scenario: TC-002 — Cancel program deletion
  Given I am logged in as admin on the Programs page
  And a program exists in the list
  When I click the Delete button for that program
  And I see the confirmation dialog
  And I dismiss the dialog without confirming
  Then the program still appears in the program list

# Negative

Scenario: TC-003 — Dismissing the confirmation dialog keeps the program
  Given a program exists on the Programs page
  When I click Delete and dismiss the native confirmation dialog
  Then the program row remains visible
  And no other programs are affected

Scenario: TC-004 — Non-admin users do not see the delete action
  Given a non-admin user is logged in
  When they navigate to the Programs page
  Then no Delete button is visible on program rows

# Edge cases

Scenario: TC-005 — Confirmed deletion persists after a full page reload
  Given a program was deleted after confirming the dialog
  When I reload the Programs page
  Then the deleted program does not reappear

Scenario: TC-006 — Deleting one program does not remove other programs
  Given two distinct programs exist in the list
  When I delete one program and confirm
  Then the deleted program is gone
  And the other program remains in the list

Scenario: TC-007 — Confirmation dialog references the program being deleted
  Given a program named "Test Program" exists
  When I click Delete for that program
  Then the confirmation dialog message mentions "Test Program"

Scenario: TC-008 — Cancelled deletion can be retried and then confirmed
  Given a program exists in the list
  When I cancel the first delete attempt
  And I delete again and confirm
  Then the program is removed from the list

<!--
Ambiguities / gaps:
- Ticket uses "delete icon" but the app exposes accessible Delete buttons named "Delete {programName}".
- Confirmation is a native browser dialog (window.confirm), not an in-app modal — Cancel is via Dismiss, not a labeled Cancel button.
- Non-admin credentials are not available in this environment (TC-004 skipped).
- Ticket does not specify dialog copy; TC-007 asserts the program name appears in the message if the app includes it.
-->
