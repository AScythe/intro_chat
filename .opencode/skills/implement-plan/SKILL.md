---
name: implement-plan
description: 'Execute the approved plan following TDD in reviewable batches. Flag every change. Verify locally per batch. Hand off to review-implementation for final sign-off. Trigger after check-plan-readiness passes, or when the user says "implement", "proceed", "start coding", or similar. Reads the plan file as read-only — never writes to it.'
---

## What I do
- **Step 0: Verify plan readiness** — check the plan file's Readiness Gate Results; all 7 gates must pass before proceeding
- **Step 1: Read the plan** — open `plans/PLAN_*.md` (the plan file in consideration), read every change and success criterion
- **Step 2: Split into batches** — divide implementation into logical, independently verifiable units
- **Step 3: For each batch** — write test → save test in `tests/` → implement → verify test passes → flag all changes
- **Step 4: For non-testable changes** — implement directly and confirm the intended purpose is achieved. Non-testable means: config changes, renames without logic changes, typo fixes, or infrastructure with no observable behavior. When in doubt, write the test.
- **Step 5: After all batches** — run full test suite, confirm all criteria, hand off with exit declaration.

## Boundaries
- **Plan file is read-only.** Never create or modify `plans/PLAN_*.md`.
- **No scope creep.** Only implement what the plan specifies — nothing speculative, no unrelated fixes.

## Documents to Read

Read specific sections via Grep→Read (grep heading line number, Read with offset/limit):

- **`SPECIFICATIONS.md`**: "Out of Scope"
- **`ARCHITECTURE.md`**: "Project Structure", "Import Structure", "Modifying Instructions", relevant module descriptions only

## Guidelines

### 1. Read the Plan
**Open the approved plan file before writing any code.**

- Read `plans/PLAN_*.md` — use the relevant plan file from check-plan-readiness's output
- Read every change and success criterion
- Identify which files will be created, modified, or removed
- Map each test file to a plan task
- If anything is unclear, ask before proceeding
- The plan file is read-only. Do not modify it


### 2. TDD First
**Write tests before implementation code.**

- "Add feature" → write a failing test → make it pass → refactor
- "Fix bug" → write a test that reproduces the bug → make it pass → refactor
- "Refactor" → ensure existing tests pass before and after
- Create test files for every change. Match existing test framework and conventions.
- Do not skip tests even for "simple" changes.
- All tests are saved as `.py` files in the `tests/` directory. They become permanent regression tests — never delete them after the batch passes. They will run on every `pytest` invocation going forward.

### 3. Batch for Reviewability
**Split implementation into logical units. One concern per batch.**

- Each batch = one complete logical change (not measured by lines of code)
- Examples of a batch: add one API endpoint + its test, fix one bug + its regression test, extract a new function during feature development + its unit test
- Each batch must be independently testable — its tests pass before moving to the next
- After each batch, flag every changed line before starting the next batch
- Do not mix unrelated concerns in the same batch
- If a change touches multiple files, they belong in the same batch
- Every batch that adds or modifies logic must include its test file(s) in `tests/`. A batch is not complete until its tests are saved and passing.
- **When a batch modifies existing code** (rename, signature change, behavioral change), update ALL test references to that code in the **same batch** — import paths, function names, mock setups, and assertion expectations. Source and tests are a single unit; never split them across batches.
- **After tests pass, re-read the test assertions** — confirm they still validate the changed behavior at the semantic level (correct value, correct shape, correct side-effect). If an assertion is too loose (e.g., `assertIsNumber` after a truncate→round change), tighten it. A passing test with weak assertions is a false positive — treat it as a failure.

### 4. Simplicity First
**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- Make it concise and straightforward. Prioritize readability and maintainability.
- If code is long and could be shorter, rewrite it shorter.

Ask: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 5. Surgical Changes
**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't revise, refactor, or "improve" code not related to the requirement.
- Just do what is required. 
- Match existing style.
- Flag unrelated dead code. Do not delete it.
- Never remove file-level description comments. You may edit them for accuracy after your changes, but never delete them.

When creating new files:
- Every new file must include a file-level description comment matching the project convention:
  - `.py`: `# filename.py` + `# Description: ...`
  - `.ts` / `.tsx`: `// filename.ext` + `// Description: ...`
  - `.css`: `/* filename.ext */` + `/* Description: ... */`
- The description must state the module's single responsibility in one concise line.

When introducing new dependencies:
- Add imports only to files you are actively modifying
- Only include imports directly referenced in your changes — remove any unused or duplicate imports

When your changes create orphans:
- Remove imports, variables, or functions that your changes made unused.
- Do not remove pre-existing dead code unless asked.

**Refactoring:** Only refactor when requested or necessary. Ensure tests pass before and after, one change at a time. Never refactor unrelated code.

**Debugging:** Reproduce → isolate root cause → write a failing test → make minimal fix → verify test and all existing tests pass.

**Failure triage:** See "Failure Triage" table in `AGENTS.md`. Never auto-revert on first failure.

**Reminder:** Every changed line should trace directly to the user's request.

### 6. Easy to Review
**Make it easy for the user to verify your changes.**

Use exact flags on every changed line or block:
 
| Flag | When to use |
|------|------------|
| `[ADDED]` | New code, new file, new function |
| `[MODIFIED]` | Changed existing code |
| `[FIXED]` | Bug fix |
| `[REMOVED]` | Deleted code or file |
| `[MOVED]` | Relocated code without logic change |
 
Format: `[FLAG]: short_reason — what/why`
Example: `[ADDED]: validate_email helper — validates email before registration`
 
- If you add a function, add a docstring
- If you write a constant, add a comment explaining what it does
- Preserve and update file-level description comments when you change a file's behavior
- Don't comment on unchanged code or code you didn't write

### 7. Batch Verification
**Define success criteria per task. Verify after every batch.**

Define verifiable goals for every change:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]

After each batch: run its tests before moving to the next.


## Hand-off

Before declaring completion:
- All batches implemented and verified independently
- Full test suite passes
- Lint and typecheck pass
- All TDD tests saved in `tests/` — no transient or deleted tests
- Every changed line carries a valid `[FLAG]` annotation
- Test assertions are semantically tight — no false positives
- Plan file unchanged (read-only)

---

## Outputs & Triggers

### Output
All code changes with `[FLAG]` annotations. Full test suite passes. All success criteria from the plan are met. Plan file is unchanged.

### Exit Declaration
State clearly: "**Implementation complete. Proceed to review the implementation?**"

### Next Step
User invokes `review-implementation` — **switch to Plan mode before proceeding**.
