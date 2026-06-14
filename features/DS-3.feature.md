# Feature: DS-3 — Program Name Validation and Duplicate Prevention

As an admin user
I want program names validated on create and edit
So that empty, whitespace-only, and duplicate names are rejected while valid names are accepted

# Happy paths

Scenario: TC-001 — Special characters in program name are accepted
  Given I am logged in as admin on the program creation form
  When I enter "Informatique & IA - Niveau 2" as the program name
  And I enter "French CS program" as the description
  And I click Create
  Then the program is created successfully
  And the program list shows "Informatique & IA - Niveau 2"

Scenario: TC-002 — Accented characters are accepted in program names
  Given I am logged in as admin on the program creation form
  When I enter "Développement Réseau Avancé" as the program name
  And I click Create
  Then the program is created with the accented name intact

Scenario: TC-003 — Parentheses, slashes, and punctuation are valid
  Given I am logged in as admin on the program creation form
  When I enter "AI/ML (Advanced) - Fall/Winter 2026" as the program name
  And I click Create
  Then the program is created with the name displayed as entered

Scenario: TC-004 — Numbers and hyphens are valid in program names
  Given I am logged in as admin on the program creation form
  When I enter "CS-101: Intro to Programming 2026-2027" as the program name
  And I click Create
  Then the program is created with that exact name

Scenario: TC-005 — A unique program name passes validation
  Given I am logged in as admin on the program creation form
  And no program named "Quantum Computing 2026" exists
  When I enter "Quantum Computing 2026" as the program name
  And I click Create
  Then the program is created without validation errors

# Negative

Scenario: TC-006 — Whitespace-only program name is rejected
  Given I am logged in as admin on the program creation form
  When I enter "   " (three spaces) in the Program Name field
  And I attempt to click Create
  Then the form is not submitted
  And the Create button remains disabled or a validation error is shown

Scenario: TC-007 — Exact duplicate program name is rejected
  Given a program named "Web Development 2026" already exists
  When I open the new program form
  And I enter "Web Development 2026" as the program name
  And I click Create
  Then an error indicates the program name already exists
  And the duplicate program is not created

Scenario: TC-008 — Case-insensitive duplicate is rejected
  Given a program named "Web Development 2026" already exists
  When I open the new program form
  And I enter "web development 2026" as the program name
  And I click Create
  Then an error indicates the name already exists

Scenario: TC-009 — Duplicate with extra whitespace is rejected
  Given a program named "Web Development 2026" already exists
  When I open the new program form
  And I enter "  Web Development 2026  " as the program name
  And I click Create
  Then an error indicates duplication after trimming

Scenario: TC-010 — Tab-only program name is treated as empty
  Given I am logged in as admin on the program creation form
  When I paste tab characters only into the Program Name field
  And I attempt to click Create
  Then the name is treated as empty and the form is not submitted

Scenario: TC-011 — HTML/script tags in program name are handled safely
  Given I am logged in as admin on the program creation form
  When I enter "<script>alert('XSS')</script>" as the program name
  And I click Create
  Then the input is rejected, sanitized, or stored as plain text
  And no script executes when the name is displayed

Scenario: TC-012 — SQL injection string in program name is handled safely
  Given I am logged in as admin on the program creation form
  When I enter "'; DROP TABLE programs; --" as the program name
  And I click Create
  Then the input is handled safely as literal text if accepted

# Edge cases

Scenario: TC-013 — Substring of existing name is not a duplicate
  Given a program named "Web Development 2026" exists
  When I create a program named "Web Development"
  Then the program "Web Development" is created successfully

Scenario: TC-014 — Purely numeric program name is accepted
  Given I am logged in as admin on the program creation form
  When I enter "12345" as the program name
  And I click Create
  Then the program "12345" is created successfully

Scenario: TC-015 — Internal multiple spaces are preserved or normalized
  Given I am logged in as admin on the program creation form
  When I enter "Web    Development    2026" as the program name
  And I click Create
  Then the program is created with the name stored as entered or normalized

Scenario: TC-016 — Duplicate validation applies when renaming
  Given programs "Program A" and "Program B" both exist
  When I edit "Program B" and change the name to "Program A"
  And I click Save
  Then an error indicates "Program A" already exists
  And the rename is rejected

Scenario: TC-017 — Emoji characters in program name are handled
  Given I am logged in as admin on the program creation form
  When I enter "🎓 Graduate Studies 2026" as the program name
  And I click Create
  Then the program is created with the emoji preserved

Scenario: TC-018 — Single-character program name passes validation
  Given I am logged in as admin on the program creation form
  When I enter "A" as the program name
  And I click Create
  Then the program "A" is created successfully

Scenario: TC-019 — Punctuation difference is not treated as duplicate
  Given a program named "Web Development 2026" exists
  When I create a program named "Web Development, 2026"
  Then the program "Web Development, 2026" is created successfully

<!--
Ambiguities & Gaps (from test plan):
1. Is duplicate check case-sensitive or case-insensitive?
2. Client-side vs server-side duplicate detection?
3. Exact error message wording for duplicates?
4. Disallowed characters beyond whitespace-only rule?
5. Does whitespace-only rejection apply on edit (DS-2)?
6. Minimum character length for program names?
7. Are internal multiple spaces normalized?
8. Duplicate scope: active programs only or soft-deleted too?
9. How is duplicate error message dismissed?
-->
