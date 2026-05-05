# GUIDELINES.md

> This file defines *how* I should work; `AGENTS.md` defines *what* I'm working on.
> For Project context: See `AGENTS.md` for tech stack, commands, and file boundaries.

Behavioral guidelines to reduce LLM coding mistakes. Merge with project-specific instructions as needed.

## 1. Think Before Coding
**Understand context and requirements. Don't assume. Don't hide confusion.**

Before implementing:
- Analyze the logic and functionalities of all the components of the existing relevant codes.
- Fully describe your understanding of the requirements.
- State assumptions explicitly. If uncertain or information is missing, ask.
- If multiple interpretations exist, present them, don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, state what's confusing and ask.
- Check if the logic of the proposal is sound, and satisfies the intended functionalities.

## 2. Implementation signal
**Only write code when all gates are clear.**

Proceed to implementation only when:
- Necessary context/info has been gathered.
- All assumptions are confirmed.
- Ambiguities are resolved.
- The proposed approach is logically sound and functionality will work as intended.

## 3. Simplicity First
**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 4. Surgical Changes
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

## 5. Goal-Driven Execution
**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```
Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

**Final Check:** Review your implementation to ensure logic is sound, functionality works as intended, and all success criteria are met.