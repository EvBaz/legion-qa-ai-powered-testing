# DS-5: Program List Filtering and Display

## User Story

As an admin user, I want to view and filter the list of academic programs so that I can quickly find and manage programs.

## Acceptance Criteria

### Scenario: Display program list with key details

- **Given** programs exist in the system
- **When** I navigate to the Programs page
- **Then** I see a list showing each program's name and description

### Scenario: Empty state when no programs exist

- **Given** no programs exist
- **When** I navigate to the Programs page
- **Then** I see a message indicating no programs have been created
- **And** I see a prompt to create the first program
