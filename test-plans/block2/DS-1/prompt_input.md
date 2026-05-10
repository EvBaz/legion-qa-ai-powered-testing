# DS-1: Create New Academic Program

## User Story

As an admin user, I want to create a new academic program so that I can begin designing its curriculum structure.

## Acceptance Criteria

### Scenario: Navigate to program creation form

- **Given** I am logged in as admin
- **When** I navigate to the Programs page
- **And** I click "+ New Program"
- **Then** I see the program creation form with fields: Program Name, Description

### Scenario: Successfully create a program

- **Given** I am on the program creation form
- **When** I fill in Program Name with "Web Development 2026"
- **And** I fill in Description with "Full-stack web development program"
- **And** I click Create
- **Then** the modal closes
- **And** the program list shows "Web Development 2026"

### Scenario: Validation prevents empty program name

- **Given** I am on the program creation form
- **When** I leave the Program Name field empty
- **Then** the Create button is disabled
