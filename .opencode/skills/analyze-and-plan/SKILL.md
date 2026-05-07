---
name: analyze-and-plan
description: Pre-implementation analysis and planning — understand context (code and requirements), surface assumptions, resolve ambiguities, confirm understanding with user, then create a concrete plan. Trigger at the start of any coding task, or when the user says "analyze the requirements", "understand before making plan", "analyze and plan", or similar.
---

## What I do
- Analyze the logic and functionalities of all relevant existing code before proposing anything
- Surface assumptions, ambiguities, and missing information explicitly
- Describe the requirements back to the user as you understood them for confirmation
- Once confirmed, create a concrete plan covering files, approach, edge cases, testing strategy, and success criteria
- Block implementation until understanding is confirmed and plan is accepted

## Guidelines

### Pre-Task Analysis
**Understand context and requirements. Don't assume. Don't hide confusion.**

Before planning:
- Analyze the logic and functionalities of all the components of the existing relevant code.
- Fully describe your understanding of the requirements back to the user.
- If something is unclear, state what's confusing and ask.
- State assumptions explicitly. If uncertain or information is missing, ask.
- If multiple interpretations exist, present them, don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- Check if the logic of the proposal is sound and satisfies the intended functionalities.

### Planning
**Once requirements are confirmed, create a concrete plan.**

The plan must include:
- Which files need to be created, modified, or removed
- The approach and design decisions
- Edge cases considered and how they'll be handled
- A testing strategy (TDD: tests before code)
- Initial success criteria (verifiable)

State clearly before proceeding: "Plan created. Shall I present it for review?"
