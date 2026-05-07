# DS-4: Delete Program with Confirmation

## User Story

As an admin user, I want to delete an academic program so that I can remove programs that are no longer needed.

## Acceptance Criteria

### Scenario: Delete program with confirmation

- **Given** a program "Test Program" exists
- **When** I click the delete icon for "Test Program"
- **Then** I see a confirmation dialog
- **When** I confirm deletion
- **Then** "Test Program" is removed from the program list

### Scenario: Cancel program deletion

- **Given** I click the delete icon for a program
- **When** I see the confirmation dialog
- **And** I click Cancel
- **Then** the program still exists in the list
