---
name: review-implementation
description: Verify the completed implementation meets all success criteria — review diff, run tests, run lint, confirm intended function. Trigger after implement-plan, or when user says "review the implementation", "verify changes", or similar.
---

## What I do
- Review the diff — confirm every change has a flag with a valid reason
- Run the full test suite — all must pass
- Run lint/typecheck — all must pass
- Confirm all success criteria from the plan are met
- For non-testable changes (config, rename): confirm the intended purpose is achieved
- If all pass → "✓ All checks pass. Implementation verified."
- If any fail → report clearly and recommend re-entering implement-plan to fix the issues

## Review Process

### 1. Read the Diff
Open the full diff. Verify every changed line or block carries a flag: `[ADDED]`, `[MODIFIED]`, `[FIXED]`, `[REMOVED]`, `[MOVED]` with a short reason. No unflagged changes should survive review.

### 2. Run All Tests
Execute the project's full test suite. All tests must pass. On failure: list what failed and why — do not fix here.

### 3. Run Lint
Execute all lint/typecheck commands. Must pass. On failure: list files and issues.

### 4. Verify Success Criteria
Open `docs/plans/PLAN_*.md` — read the latest plan file. Check every success criterion. For non-testable changes: test the intended effect directly.

### 5. Sign Off or Route
All pass → "✓ All checks pass. Implementation verified."
Any fail → "Review failed. Re-enter implement-plan to fix the issues above, then re-trigger review-implementation."
