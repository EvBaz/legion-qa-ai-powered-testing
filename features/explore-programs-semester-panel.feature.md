## Coverage snapshot
- Page: `/programs`
- Explored via: `npm run explore:programs` + `npm run explore:programs:selection` (Playwright `playwright/.auth/user.json` session)
- Date: 2026-07-01

### Already covered (current `tests/`)
| Area | Spec | Scenarios |
|---|---|---|
| Delete program | `ds4-delete-program.spec.ts` | confirm, cancel, dismiss dialog, reload persistence, isolation, dialog message, retry delete |
| Auth / cleanup infra | `auth.setup.ts`, `cleanup-programs.spec.ts` | session bootstrap, API program cleanup |

### Not covered (visible in UI, no active spec)
| Flow | UI evidence (2026-07-01) | Gap |
|---|---|---|
| Create program | `+ New Program` button | **Gap** — DS-1 spec removed, not regenerated |
| Edit program | per-row `Edit {name}` buttons | **Gap** — DS-2 removed |
| Name validation | create/edit modals | **Gap** — DS-3 removed |
| List display / columns | 663 program rows in table | **Gap** — DS-5 removed |
| **Semester panel selection** | After row click: heading level 4, `Semesters & scheduling config`, `+ Semester`, `Manage Courses` | **Gap** — highest-value uncovered flow |
| Sidebar navigation | Dashboard, Calendar, Validation, Scheduler, Export, Settings | **Gap** — no nav specs |
| Cancel create (modal dismiss) | `+ New Program` opens modal (not opened this run) | **Partial** — likely gap |

## Selected gap (one flow)
**Flow:** Program row selection opens the semester management panel  
**Why this one:** Distinct right-hand panel (`Semesters & scheduling config`, `+ Semester`, `Manage Courses`) with zero coverage in the current suite after M5 migration; POM helpers already exist in `pages/programs.page.ts`.

## Gherkin test plan

Feature: Programs — semester panel selection (discovered)

  # Positive path
  Scenario: Selecting a program reveals the semester panel
    Given I am logged in as admin
    And I am on the Programs page
    And a program exists in the list
    When I click the program row for that program
    Then I see the heading for that program at level 4
    And I see "Semesters & scheduling config"
    And I see the button "+ Semester"
    And I see the button "Manage Courses"
    And I do not see "Select a program to manage semesters"

  # Edge case
  Scenario: Switching selection updates the semester panel
    Given I am logged in as admin
    And two distinct programs exist in the list
    And I have selected the first program
    When I click the row for the second program
    Then the semester panel shows the second program heading
    And the semester panel does not show the first program heading

## Locator hints (from a11y tree)
- Program row: `getByRole('row').filter({ has: getByText(name, { exact: true }) })`
- Detail heading: `getByRole('heading', { name, level: 4 })`
- Semesters section: `getByText('Semesters & scheduling config')`
- Add semester: `getByRole('button', { name: '+ Semester' })`
- Manage courses: `getByRole('button', { name: 'Manage Courses' })`
- Empty state hint: `getByText('Select a program to manage semesters')`

## For test-writer
- Suggested file: `tests/program-semester-panel-selection.spec.ts`
- POM updates: reuse `ProgramsPage.selectProgram()`, `detailPanel()`, `semestersSectionHeading`, `addSemesterButton`, `manageCoursesButton` — no new POM required
