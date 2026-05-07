# DS-3: Program Name Validation and Duplicate Prevention

## User Story

As an admin user, I want the system to prevent invalid or duplicate program names so that data integrity is maintained.

## Acceptance Criteria

### Scenario: Reject program name with only whitespace

- **Given** I am on the program creation form
- **When** I enter "   " as the program name
- **And** I click Create
- **Then** the form is not submitted (name is trimmed, treated as empty)

### Scenario: Accept program name with special characters

- **Given** I am on the program creation form
- **When** I enter "Informatique & IA - Niveau 2" as the program name
- **And** I fill other required fields
- **And** I click Create
- **Then** the program is created successfully

### Scenario: Reject duplicate program name

- **Given** a program "Web Development 2026" already exists
- **When** I try to create a new program with the same name
- **Then** I see an error indicating the name already exists
