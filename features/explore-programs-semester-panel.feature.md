## Coverage snapshot
- Page: `/programs`
- Already covered: create (DS-1), edit (DS-2), name validation (DS-3), delete (DS-4), modal cancel/dismiss paths
- Explored via a11y tree: 2026-06-20

## Selected gap (one flow)
**Flow:** Program row selection opens the semester management panel
**Why this one:** Exercises a distinct right-hand panel region that no existing spec asserts; POM had helpers but zero test coverage.

## Gherkin test plan

Feature: Programs — semester panel selection (discovered)

  # Positive path
  Scenario: Selecting a program reveals the semester panel
    Given I am logged in as admin
    And I am on the Programs page
    And a program "Semester Panel Program" exists in the list
    When I reload the page
    And I click the program row "Semester Panel Program"
    Then I see the heading "Semester Panel Program" at level 4
    And I see "Semesters & scheduling config"
    And I see the button "+ Semester"
    And I see the button "Manage Courses"

  # Edge case
  Scenario: Switching selection updates the semester panel
    Given I am logged in as admin
    And programs "Semester Panel Alpha" and "Semester Panel Beta" exist in the list
    And I have selected program "Semester Panel Alpha"
    When I click the program row "Semester Panel Beta"
    Then the semester panel shows heading "Semester Panel Beta"
    And the semester panel does not show heading "Semester Panel Alpha"

## Locator hints (from a11y tree)
- Program row: `getByRole('row').filter({ has: getByText(name, { exact: true }) })`
- Detail heading: `getByRole('heading', { name, level: 4 })`
- Semesters section: `getByText('Semesters & scheduling config')`
- Add semester: `getByRole('button', { name: '+ Semester' })`
- Manage courses: `getByRole('button', { name: 'Manage Courses' })`

## For test-writer
- Suggested file: `tests/program-semester-panel-selection.spec.ts`
- POM updates: `semestersSectionHeading`, `addSemesterButton`, `manageCoursesButton`, `programDetailHeading()` in `pages/programs.page.ts`
