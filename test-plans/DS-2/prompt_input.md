# DS-2: Edit Existing Program Details

## User Story

As an admin user, I want to edit an existing program's details so that I can correct or update program information after creation.

## Acceptance Criteria

### Scenario: Open program for editing

- **Given** I am on the Programs page
- **And** a program "Web Development 2026" exists
- **When** I click the edit icon on "Web Development 2026"
- **Then** I see the edit form pre-populated with the program's current data

### Scenario: Successfully edit a program name

- **Given** I am editing "Web Development 2026"
- **When** I change the Name to "Web Development 2026 - Updated"
- **And** I click Save
- **Then** the modal closes
- **And** the program list immediately shows "Web Development 2026 - Updated"

### Scenario: Edit preserves unchanged fields

- **Given** I am editing a program
- **When** I only change the Description
- **And** I click Save
- **Then** the Name and other fields remain unchanged
