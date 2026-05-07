---
name: coding-conduct
description: Active coding behavior — write minimal, surgical, reviewable code and verify against defined success criteria. Applies during and after implementation. Trigger when writing, editing, or reviewing code, or when the user says "we are ready to implement", "proceed with implementation", "implement with care", "apply coding rules when implementing", or similar.
---

## What I do
- Enforce simplicity, surgical edits, and review-friendly output while writing code
- Define and verify success criteria before declaring a task complete
- Apply all four rules simultaneously during implementation

## Skill Scope
The `coding-conduct` skill defines *how* to write and deliver code — behavioral rules for implementing, editing, and verifying. `AGENTS.md` defines *what* to work on — project context, tech stack, commands, and file boundaries. These guidelines are layered on top of `AGENTS.md` and take precedence when there is conflict.

## Guidelines

### Simplicity First
**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- Make it concise and straightforward. Prioritize readability and maintainability.
- If you write 200 lines and it could be 50, rewrite it.

Ask: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### Surgical Changes
**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't revise/refactor code that aren't related to the requirement or request.
- Don't "improve" adjacent code, comments, or formatting.
- Just do what is required.
- Match existing style.
- Flag unrelated dead code. Do not delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

### Easy to Review
**Make it easy for the user to verify your changes.**
- Write clear and concise comments on the changes you made.
- Put flags like `# REVISED` or `# ADDED` or `# REMOVED` or `# FIXED` on the comments for changed lines.
- Explain the purpose of the changes on your comments.
- If you add a function, add a docstring.
- If you write a constant, add a comment explaining what it does.
- Don't comment on unchanged code or code you didn't write.

### Goal-Driven Execution
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
Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

**Final Check:** Review your implementation to ensure logic is sound, functionalities work as intended, and all success criteria are met.