---
name: implement-plan
description: Execute the approved plan following TDD in reviewable batches. Flag every change. Verify locally per batch. Hand off to review-implementation for final sign-off. Trigger after plan-readiness passes, or when the user says "implement", "proceed", "start coding", or similar.
---

## What I do
- **Step 1: Read the plan** — open `docs/plans/PLAN_*.md` (the latest plan file), read every change and success criterion
- **Step 2: Split into batches** — divide implementation into logical, independently verifiable units
- **Step 3: For each batch** — write test → implement → verify test passes → flag all changes
- **Step 4: For non-testable changes** — implement directly and confirm the intended purpose is achieved
- **Step 5: After all batches** — run full test suite, confirm all criteria, hand off with "Implementation complete. Ready for review."

## Guidelines

### 1. Read the Plan
**Open the approved plan file before writing any code.**

- Read `docs/plans/PLAN_*.md` — use the latest numbered plan file
- Read every change and success criterion in the plan
- Identify which files will be created, modified, or removed
- If anything is unclear, ask before proceeding
- Map each test file to a plan task

### 2. TDD First
**Write tests before implementation code.**

- "Add feature" → write a failing test → make it pass → refactor
- "Fix bug" → write a test that reproduces the bug → make it pass → refactor
- "Refactor" → ensure existing tests pass before and after
- Create test files for every change. Match existing test framework and conventions.
- Do not skip tests even for "simple" changes.

### 3. Batch for Reviewability
**Split implementation into logical units. One concern per batch.**

- Each batch = one complete logical change (not measured by lines of code)
- Examples of a batch: add one API endpoint + its test, fix one bug + its regression test, extract one function + its unit test
- Each batch must be independently testable — its tests pass before moving to the next
- After each batch, flag every changed line before starting the next batch
- Do not mix unrelated concerns in the same batch
- If a change touches multiple files, they belong in the same batch

### 4. Simplicity First
**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- Make it concise and straightforward. Prioritize readability and maintainability.
- If you write 200 lines and it could be shorter, rewrite it.

Ask: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 5. Surgical Changes
**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't revise, refactor, or "improve" code not related to the requirement.
- Just do what is required. Match existing style.
- Flag unrelated dead code. Do not delete it.

When your changes create orphans:
- Remove imports, variables, or functions that your changes made unused.
- Do not remove pre-existing dead code unless asked.

**Refactoring:** Only refactor when requested or necessary. Ensure tests pass before and after, one change at a time. Never refactor unrelated code.

**Debugging:** Reproduce → isolate root cause → write a failing test → make minimal fix → verify test and all existing tests pass.

The test: Every changed line should trace directly to the user's request.

### 6. Easy to Review
**Make it easy for the user to verify your changes.**

- Use exact flags on every changed line or block: `[ADDED]`, `[MODIFIED]`, `[FIXED]`, `[REMOVED]`, `[MOVED]`
- Format: `[FLAG]: short_reason — what/why`
- Example: `[ADDED]: validate_email helper — validates email before registration`
- If you add a function, add a docstring.
- If you write a constant, add a comment explaining what it does.
- Don't comment on unchanged code or code you didn't write.

### 7. Batch Verification and Hand-off
**Define success criteria per task. Verify after every batch. Confirm at hand-off.**

Define verifiable goals for every change:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]

After each batch: run its tests before moving to the next.

Before hand-off to review-implementation:
- All tests pass
- Lint or typecheck passes (run the project's lint and typecheck commands)
- All success criteria are met
- No unrelated changes remain
- Code is reviewable (flags, docstrings, comments — see section 6)
