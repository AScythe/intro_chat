---
name: implementation-guide
description: Full-spectrum coding, testing, refactoring, and debugging guidelines. Write minimal, surgical, reviewable code following TDD. Define and verify success criteria before declaring complete. Trigger when the user says "proceed with implementation", "implement", "ready to code", "start coding", or similar.
---

## What I do
- Enforce TDD (tests before code) for every change
- Enforce simplicity, surgical edits, and review-friendly output while writing code
- Guide systematic refactoring and debugging
- Define and verify success criteria before declaring a task complete

## Skill Scope
This skill defines *how* to write and deliver code. `AGENTS.md` defines *what* to work on — project context, tech stack, commands, and file boundaries. These guidelines are layered on top of `AGENTS.md` and take precedence when there is conflict.

## Guidelines

### 1. TDD First
**Write tests before implementation code.**

- "Add feature" → write a failing test → make it pass → refactor
- "Fix bug" → write a test that reproduces the bug → make it pass → refactor
- "Refactor" → ensure existing tests pass before and after
- Create test files for every change. Match existing test framework and conventions.
- Do not skip tests even for "simple" changes.

### 2. Simplicity First
**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- Make it concise and straightforward. Prioritize readability and maintainability.
- If you write 200 lines and it could be shorter, rewrite it.

Ask: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes
**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't revise or refactor code that isn't related to the requirement or request.
- Don't "improve" adjacent code, comments, or formatting.
- Just do what is required.
- Match existing style.
- Flag unrelated dead code. Do not delete it.

When your changes create orphans:
- Remove imports, variables, or functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

**Refactoring:** Only refactor when requested or necessary. Ensure tests pass before and after, one change at a time. Never refactor unrelated code.

**Debugging:** Reproduce → isolate root cause → write a failing test → make minimal fix → verify test and all existing tests pass.

The test: Every changed line should trace directly to the user's request.

### 4. Easy to Review
**Make it easy for the user to verify your changes.**

- Write clear and concise comments on the changes you made.
- Put flags like `# ADDED` or `# REVISED` or `# FIXED` or `# REMOVED` on the comments for changed lines.
- Explain the purpose of the changes in your comments.
- If you add a function, add a docstring.
- If you write a constant, add a comment explaining what it does.
- Don't comment on unchanged code or code you didn't write.

### 5. Goal-Driven Execution
**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

### 6. Final Verification
**Before declaring complete:**

- All tests pass
- Lint or typecheck passes (run the project's lint and typecheck commands)
- All success criteria are met
- No unrelated changes remain
- Code is reviewable (comments, flags, docstrings)

**Final Check:** Review your implementation to ensure logic is sound, functionalities work as intended, and all success criteria are met.

State clearly: "✓ All success criteria met. Implementation complete."
