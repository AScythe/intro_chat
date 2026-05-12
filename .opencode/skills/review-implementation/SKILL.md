---
name: review-implementation
mode: plan
description: 'Verify the completed implementation meets all success criteria — review diff, run tests, run lint, confirm intended function. Trigger after implement-plan, or when user says "review the implementation", "verify changes", or similar. Exit (pass): "Verified." Exit (fail): "Failed, route back." Verifies every item in the plan document against actual code.'
---

## What I do
- Review the diff — confirm every change has a flag with a valid reason
- Run the full test suite — all must pass
- Run lint/typecheck — all must pass
- Confirm all success criteria from the plan are met
- For non-testable changes (config, rename): confirm the intended purpose is achieved
- If all pass (first pass) → "✓ All checks pass. Implementation verified. Recommended: modularize-and-clean for structural cleanup."
- If all pass (second pass, after cleanup) → "✓ All checks pass. Implementation verified. Workflow complete."
- If any fail → report clearly and recommend re-entering implement-plan (or modularize-and-clean) to fix the issues

## Documents to Read

Read via Grep→Read (grep heading line number, Read with offset/limit):

- **First pass** (after implement-plan): `docs/plans/PLAN_*.md` (all) + `ARCHITECTURE.md` ("Import Structure", relevant module descriptions — verify diff fits system)
- **Second pass** (after modularize-and-clean): `docs/plans/PLAN_*.md` only — change-log from modularize-and-clean is the primary verification target

## Review Process

### 1. Read the Diff
Open the full diff. Verify every changed line or block carries a flag: `[ADDED]`, `[MODIFIED]`, `[FIXED]`, `[REMOVED]`, `[MOVED]` with a short reason. No unflagged changes should survive review.

### 2. Run All Tests
Execute the project's full test suite. All tests must pass. On failure: list what failed and why — do not fix here.

### 3. Run Lint
Execute all lint/typecheck commands. Must pass. On failure: list files and issues.

### 4. Verify Against the Plan Document
Read `docs/plans/PLAN_*.md` — the latest plan file. Check every item in the Implementation Plan (files, approach, edge cases, testing strategy) against the actual code. Every planned change must be accounted for. Every success criterion must be met. If any planned item is missing or incomplete, it's a failure.

For non-testable changes (config, rename): confirm the intended effect directly.

### 5. Sign Off or Route
All pass (first pass) → "**All checks pass. Implementation verified. Recommended: modularize-and-clean for structural cleanup. Proceed or wrap up?**"
All pass (second pass, after cleanup) → "**All checks pass. Implementation verified. Workflow complete. Optionally invoke update-agents, update-architecture, or update-specifications (Plan mode) or push-to-git (Build mode).**"

Any fail → "**Review failed. Some items not implemented. Go back to implement-plan to complete the missing items.**"

**Second-pass differentiation**: When running after `modularize-and-clean`, every flag must be `[CLEANUP]`. If any non-CLEANUP flag (`[ADDED]`, `[MODIFIED]`, `[FIXED]`) is present, flag it as a potential behavioral change and route back to `modularize-and-clean`. The change-log replaces the plan file as the verification target — confirm every item in the log is accounted for in the diff.

## Outputs & Triggers

### Output
Verification report (verbal): pass (all plan items implemented, all criteria met) or fail (specific plan items not met, listed for implement-plan or modularize-and-clean).

### Exit Declaration (pass, first pass)
State clearly: "**All checks pass. Implementation verified. Recommended: modularize-and-clean for structural cleanup. Proceed or wrap up?**"

### Exit Declaration (pass, second pass)
State clearly: "**All checks pass. Implementation verified. Workflow complete. Optionally invoke update-agents, update-architecture, or update-specifications (Plan mode) or push-to-git (Build mode).**"

### Exit Declaration (fail)
State clearly: "**Review failed. Some items not implemented. Go back to implement-plan (or modularize-and-clean if structural issues found) to complete the missing items.**"

### Next Step (pass, first pass)
User invokes **modularize-and-clean** (Build mode — recommended) or wraps up.
**Mode switch required:** Switch from Plan to Build mode before invoking modularize-and-clean.

### Next Step (pass, second pass)
Workflow complete. User may optionally invoke `update-agents`, `update-architecture`, `update-specifications` (Plan mode) or `push-to-git` (Build mode).
