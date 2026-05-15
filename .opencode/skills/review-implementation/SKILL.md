---
name: review-implementation
description: 'Verify the completed implementation meets all success criteria — review diff, run tests, run lint, confirm intended function. Trigger after implement-plan, improve-architecture, or modularize-and-clean, or when the user says "review the implementation", "verify changes", or similar. '
---

## What I do
- Review the diff — confirm every change has a flag with a valid reason
- Run all test suites (Python + frontend) — all must pass
- Run lint/typecheck — all must pass
- Run build — production build must succeed
- Check `git status` — only expected files were touched
- Diff test count — flag unexpected additions or removals
- Confirm all success criteria from the plan are met
- For non-testable changes (config, rename): confirm the intended purpose is achieved
- When reviewing from improve-architecture: run the Architecture Integrity Check (Section 6 — Architecture pass)
- Confirm all success criteria from the plan (or evaluation list) are met
- Sign off or route back to the appropriate prior skill

## Boundaries
- **Read-only and verbal.** No file writes, no fixes. Find problems and report — do not resolve them here.
- **Route, don't fix.** Any failure routes back to the skill that produced the diff.

## Documents to Read

Read via Grep→Read (grep heading line number, Read with offset/limit):

- **First pass** (after `implement-plan`): `plans/PLAN_*.md` (relevant plan) + `ARCHITECTURE.md` ("Import Structure", relevant module descriptions)
- **Clean-up pass** (after `modularize-and-clean`): `plans/PLAN_*.md` (success criteria only) — change-log from `modularize-and-clean` is the primary verification target
- **Architecture pass** (after `improve-architecture`): `improve-architecture` output from session context — the evaluation list is the verification target

## Review Process

### Flag Type Reference
 
Before reviewing, identify which pass this is by the flag type in the diff:
 
| Flag type | Pass | Prior skill |
|-----------|------|-------------|
| `[ADDED]` `[MODIFIED]` `[FIXED]` `[REMOVED]` `[MOVED]` | First pass | `implement-plan` |
| `[CLEANUP]` | Clean-up pass | `modularize-and-clean` |
| `[ARCH]` | Architecture pass | `improve-architecture` |
 
Any non-CLEANUP flag in a clean-up pass → route back to `modularize-and-clean`.
Any non-ARCH flag in an architecture pass → route back to `improve-architecture`.

### 1. Read the Diff
Open the full diff. Verify every changed line or block carries a flag with a short reason. No unflagged changes should survive review.

### 2. Check Git Status
Run `git status` (or equivalent for untracked directories) to list all modified, added, and deleted files. Verify only expected files were touched. Flag any unexpected files:
- **Orphaned files** — new files that aren't referenced anywhere
- **Accidental modifications** — files changed outside the plan scope
- **Missing deletions** — files that should have been removed but still exist

### 3. Run All Tests
Execute every test suite. All must pass. On failure: list what failed and why — do not fix here.

Exact commands:
```bash
python tests/test_app.py
python tests/test_js_modules.py
cd frontend && npx vitest run
```

**Diff test count**: Before running, note the test count from each suite. After running, compare. Flag unexpected changes:
- Tests removed without explanation (behavioral regression risk)
- Tests added without a planned batch (scope creep)
- Report: *"Test count changed: [suite]: [N before] → [N after] ([+/-]N)"*

### 4. Run Build
After tests pass, run the production build:
```bash
cd frontend && npm run build
```
Must succeed. On failure: list errors — do not fix here.

### 5. Run Lint
Execute all lint/typecheck commands. Must pass. On failure: list files and issues.

Exact commands:
```bash
cd frontend && npx tsc --noEmit
```
Must pass. On failure: list files and issues — do not fix here.

### 6. Verify Against the Plan or Evaluation List

Identify which pass this is by the prior skill (see Flag Type Reference above), then verify against the appropriate target:

**First pass** (prior: `implement-plan`):  
Read `plans/PLAN_*.md`. Check every item in the Implementation Plan against the actual code. Every planned change must be accounted for. Every success criterion must be met. If any planned item is missing or incomplete, it's a failure.

**Clean-up pass** (prior: `modularize-and-clean`):  
Read the verbal change-log produced by `modularize-and-clean`. Verify every `[CLEANUP]` entry was applied correctly. Confirm all approved batches are either applied or explicitly skipped with a reason. Check that no behavioral changes snuck in (flags must be `[CLEANUP]` only).

**Architecture pass** (prior: `improve-architecture`):  
Read the evaluation list from `improve-architecture` session context. Verify:
- Every P0/P1 item is either addressed in the diff or explicitly skipped with a reason
- No double-paths — if files were moved, old path is removed (not left as ghost). Run `git status` to confirm no old files show as "deleted" alongside new "untracked" for the same content.
- No orphaned references — imports, route mounts, static mounts, and config referencing old locations are updated
- Description headers — moved or created files have correct `Description:` headers matching new location
- Flag consistency — all flags are `[ARCH]` with valid reasons

For non-testable changes (config, rename): confirm the intended effect directly.

### 7. Sign Off or Route

**All pass — first pass** → see Exit Declarations below
**All pass — clean-up pass** → see Exit Declarations below
**All pass — architecture pass** → see Exit Declarations below
**Any fail** → see Exit Declarations below


## Hand-off

Before declaring completion:
- Diff reviewed — every change has a valid flag with reason
- All test suites run and pass
- Build succeeds
- Lint and typecheck pass
- Only expected files touched (per `git status`)
- Test count compared to baseline — no unexpected changes
- All success criteria met (from plan or evaluation list)
- Route declared to next skill

---

## Outputs & Triggers

### Output
Verbal verification report: pass (all items implemented, all criteria met) or fail (specific items listed for the appropriate prior skill).

### Exit Declaration
 
**First pass (after `implement-plan`) — pass:**
State clearly: "**All checks pass. Implementation verified. Recommended: modularize-and-clean (structural cleanup), improve-architecture (architectural review), or update-docs (skip to documentation sync). Proceed?**"
 
**Clean-up pass (after `modularize-and-clean`) — pass:**
State clearly: "**All checks pass. Cleanup verified. Proceed to update-docs?**"
 
**Architecture pass (after `improve-architecture`) — pass:**
State clearly: "**All checks pass. Architecture improvements verified. Proceed to update-docs?**"
 
**Any pass — fail:**
State clearly: "**Review failed. [List specific items not met.] Route back to implement-plan (features), modularize-and-clean (cleanup), or improve-architecture (architecture) to resolve.**"
 
### Next Step
 
**First pass — pass:** User invokes `modularize-and-clean` (Build mode), `improve-architecture` (Plan mode), or `update-docs` (Build mode) to skip cleanup/arch review.
 
**Clean-up pass — pass:** User invokes `update-docs` to orchestrate documentation sync.
 
**Architecture pass — pass:** User invokes `update-docs` to orchestrate documentation sync.
 
**Any pass — fail:** User invokes the prior skill that produced the diff to resolve the failing items.
