---
name: review-implementation
mode: plan
description: 'Verify the completed implementation meets all success criteria — review diff, run tests, run lint, confirm intended function. Trigger after implement-plan or improve-architecture, or when the user says "review the implementation", "verify changes", or similar. When triggered after improve-architecture, runs conditional Step 6.5 (Architecture Integrity Check). Exit (pass): "Verified." Exit (fail): "Failed, route back." Verifies every item in the plan document (or architecture evaluation list) against actual code.'
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
- When reviewing from improve-architecture: run Step 6.5 Architecture Integrity Check
- If all pass (first pass, after implement-plan) → "✓ All checks pass. Recommended: modularize-and-clean or evaluate-architecture."
- If all pass (clean up pass, after modularize-and-clean) → "✓ All checks pass. Update documentation to reflect changes?"
- If all pass (architecture pass, after improve-architecture) → "✓ All checks pass. Architecture improvements verified."
- If any fail → report clearly and recommend re-entering implement-plan (or improve-architecture) to fix the issues

## Documents to Read

Read via Grep→Read (grep heading line number, Read with offset/limit):

- **First pass** (after implement-plan): `docs/plans/PLAN_*.md` (all) + `ARCHITECTURE.md` ("Import Structure", relevant module descriptions — verify diff fits system)
- **Clean up pass** (after modularize-and-clean): `docs/plans/PLAN_*.md` (success criteria only) — change-log from modularize-and-clean is the primary verification target
- **Architecture pass** (after improve-architecture): `evaluate-architecture` output (verbal list from session context) — the evaluation list is the verification target

## Review Process

### 1. Read the Diff
Open the full diff. Verify every changed line or block carries a flag: `[ADDED]`, `[MODIFIED]`, `[FIXED]`, `[REMOVED]`, `[MOVED]` with a short reason. No unflagged changes should survive review.

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

### 6. Verify Against the Plan Document
Read `docs/plans/PLAN_*.md` — the latest plan file. Check every item in the Implementation Plan (files, approach, edge cases, testing strategy) against the actual code. Every planned change must be accounted for. Every success criterion must be met. If any planned item is missing or incomplete, it's a failure.

For non-testable changes (config, rename): confirm the intended effect directly.

### 6.5 Architecture Integrity Check (conditional)
**Only applies when the prior step was `improve-architecture`.** Skip if the prior step was `implement-plan` or `modularize-and-clean`.

Read the evaluation list from `evaluate-architecture` (session context) and verify:

- **List completeness** — every item marked P0/P1 in the evaluation list is either addressed in the diff or explicitly skipped (with reason logged in the improve-architecture hand-off)
- **No double-paths** — if files were moved, the old path is removed (not left as ghost). Run: `git status` should not show old files as "deleted" alongside new "untracked" for the same content
- **No orphaned references** — imports, route mounts, static mounts, and any configuration referencing the old location are updated
- **Description headers** — files that moved or were created have correct `Description:` headers matching the new location and responsibility
- **Flag consistency** — all flags are `[ARCH]` with valid reasons. Zero non-ARCH flags should appear in an architecture-only diff

If any check fails: report what's missing and route back to `improve-architecture`. Do NOT advance to sign-off.

### 7. Sign Off or Route

**First pass** (after implement-plan) → "**All checks pass. Implementation verified. Recommended: modularize-and-clean for structural cleanup, or evaluate-architecture for architectural review. Proceed or wrap up?**"

**Clean up pass** (after modularize-and-clean) → "**All checks pass. Implementation verified. Update documentation to reflect changes?**"

**Architecture pass** (after improve-architecture) → "**All checks pass. Architecture improvements verified. Update documentation to reflect changes?**"

Any fail → "**Review failed. Some items not implemented. Go back to implement-plan (features), modularize-and-clean (cleanup), or improve-architecture (architecture) to complete the missing items.**"

**Flag-type differentiation**: The flag type identifies which pass produced the diff:
- `[ADDED]` / `[MODIFIED]` / `[FIXED]` / `[REMOVED]` / `[MOVED]` → implement-plan pass (first pass)
- `[CLEANUP]` → modularize-and-clean pass (clean up pass). If any non-CLEANUP flags appear here, route to `implement-plan` — behavioral change during cleanup means the fix belongs in implementation, not restructuring. The change-log replaces the plan file as the verification target.
- `[ARCH]` → improve-architecture pass (architecture pass). If any non-ARCH flags appear here, route to `improve-architecture` — the architecture pass should only contain structural changes.

## Outputs & Triggers

### Output
Verification report (verbal): pass (all plan items or evaluation items implemented, all criteria met) or fail (specific items not met, listed for appropriate prior skill).

### Exit Declaration (pass, first pass — after implement-plan)
State clearly: "**All checks pass. Implementation verified. Recommended: modularize-and-clean for structural cleanup, or evaluate-architecture for architectural review. Proceed or wrap up?**"

### Exit Declaration (pass, clean up pass — after modularize-and-clean)
State clearly: "**All checks pass. Implementation verified. Update documentation to reflect changes?**"

### Exit Declaration (pass, architecture pass — after improve-architecture)
State clearly: "**All checks pass. Architecture improvements verified. Update documentation to reflect changes?**"

### Exit Declaration (fail)
State clearly: "**Review failed. Some items not implemented. Go back to implement-plan (features), modularize-and-clean (cleanup), or improve-architecture (architecture) to complete the missing items.**"

### Next Step (pass, first pass — after implement-plan)
User invokes **modularize-and-clean** (Build mode) or **evaluate-architecture** (Plan mode).
**Mode switch required:** Switch to Build mode for modularize-and-clean, or stay in Plan mode for evaluate-architecture.

### Next Step (pass, clean up pass — after modularize-and-clean)
User invokes the document update skills (`update-agents`, `update-architecture`, `update-specifications`, `update-readme`) or `push-to-git` (Build mode). All are optional — workflow core is complete. May also invoke `evaluate-architecture` (Plan mode) for a fresh architecture review.

### Next Step (pass, architecture pass — after improve-architecture)
User invokes the document update skills (`update-agents`, `update-architecture`, `update-specifications`, `update-readme`) or `push-to-git` (Build mode). All are optional — workflow core is complete.
