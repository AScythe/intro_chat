---
name: analyze-and-plan
description: Pre-implementation analysis and planning — understand context (code and requirements), surface assumptions, resolve ambiguities, confirm understanding with user, then create a concrete plan. Trigger at the start of any coding task, or when the user says "analyze the requirements", "understand before making plan", "analyze and plan", or similar.
---

## What I do
- Analyze requirements against existing project materials using a layered approach: consult `docs/` first, spot-check against 1-2 key source files to verify accuracy, fall back to full codebase examination only when no relevant docs exist
- Surface assumptions, ambiguities, and missing information explicitly
- Describe the requirements back to the user as you understood them for confirmation
- Once confirmed, create a concrete plan covering files, approach, edge cases, testing strategy, and success criteria
- Block implementation until understanding is confirmed and plan is accepted

## Guidelines

### Pre-Task Analysis
**Understand context and requirements before planning.**

Before planning, follow this layered analysis pipeline:

**Layer 1: Consult docs (`docs/`)**
- Map the task type to the right document:
  - Product vision / user flow → `SPECIFICATIONS.md`
  - Module structure / data flow / API → `ARCHITECTURE.md`
  - Setup / configuration / agent rules → `README.md` or `AGENTS.md`
  - Patterns / conventions / lessons learned → `PROJECT_BEST_PRACTICES.md`
- Read only the sections relevant to the task. Do not read entire docs.

**Layer 2: Spot-check doc accuracy**
- Read 1-2 key source files referenced in the docs to confirm the doc is not stale. Use the project tree in ARCHITECTURE.md to locate the right file.
- If the doc matches the code → proceed with confidence.
- If the doc is stale or wrong → note the gap, then examine more files to understand the full picture before planning.

**Layer 3: Fallback (only if no relevant docs exist)**
- Examine the relevant source code files directly.

**After the pipeline:**
- Fully describe your understanding of the requirements back to the user.
- If something is unclear, state what's confusing, surface assumptions explicitly, and ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- Check that the proposal is logically sound and satisfies the intended functionalities.

### Planning
**Once requirements are confirmed, create a concrete plan.**

The plan must include:
- Which files need to be created, modified, or removed
- The approach and design decisions
- Edge cases considered and how they'll be handled
- A testing strategy (TDD: tests before code)
- Initial success criteria (verifiable)

State clearly before proceeding: "Plan created. Shall I present it for review?"
- Cite which docs were consulted (or note that no relevant docs existed)
