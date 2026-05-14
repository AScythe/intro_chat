---
name: analyze-and-plan
mode: plan
description: 'Pre-implementation analysis and planning — understand context (code and requirements), surface assumptions, resolve ambiguities, confirm understanding with user, then create a concrete plan. Trigger at the start of any coding task, or when the user says "analyze the requirements", "understand before making plan", "analyze and plan", or similar. Output: verbal broad-strokes plan. Exit: "Initial plan ready" — invites grill or readiness check.'
---

## What I do
- Analyze requirements against existing project materials using a layered approach: consult `docs/` first, spot-check against 1-2 key source files to verify accuracy, fall back to full codebase examination only when no relevant docs exist
- Surface assumptions, ambiguities, and missing information explicitly
- Describe the requirements back to the user as you understood them for confirmation
- Once confirmed, produce an **initial broad-strokes plan** covering files, approach, testing strategy, and success criteria
- Block implementation until understanding is confirmed and plan is accepted

## Boundaries (read-only phase)
- **No file writes.** Do NOT create, modify, or write any files — including plan documents, analysis notes, or code changes.
- **No implementation.** This skill only understands and plans.
- **Broad strokes, not deep scrutiny.** Deep edge-case analysis, risk probing, and alternative evaluation are handled by `grill-and-refine`.
- **Verbal output only.** Present the plan as text in the conversation. Formal plan documents (`docs/plans/PLAN_*.md`) are written later by `check-plan-readiness`.

## Guidelines

### Phase 1: Understand
**Understand requirements and codebase context.**

Follow this layered analysis pipeline — all read-only:

**Layer 1: Consult docs (`docs/`)**
- Read only the sections relevant to the task (Grep→Read pattern — grep for heading line number, Read with offset/limit). Do not read entire docs.
- Map the task type to the right document:
  - Product vision / user flow → `SPECIFICATIONS.md` (read: "Problem", "Solution", "How It Works", "User Flow" sections)
  - Module structure / data flow / API → `ARCHITECTURE.md` (read: "Project Structure", "Module Descriptions" relevant entries, "Import Structure", "Modifying Instructions")
  - Setup / configuration / agent rules / Out of Scope → `AGENTS.md` (read: "File Ownership", "Context Window Discipline", "Failure Triage"), `SPECIFICATIONS.md` (read: "Out of Scope")
- PROJECT_BEST_PRACTICES.md is excluded at this stage — coding patterns are implementation concerns, not planning concerns.

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

### Phase 2: Initial Plan (broad strokes)
**Once requirements are confirmed, produce an initial plan verbally.**

The plan must include:
- Which files need to be created, modified, or removed
- The approach and high-level design decisions
- Notable risks or open questions (deep analysis deferred to grill-and-refine)
- Testing strategy (test framework, key scenarios)
- Initial success criteria (verifiable)

State clearly: "**Plan ready. Shall I present it for review, or skip straight to grill-and-refine?**"
- Cite which docs were consulted (or note that no relevant docs existed)

## Outputs & Triggers

### Output
Broad-strokes plan (verbal) covering: files to create/modify/remove, approach and design decisions, risks, testing strategy, success criteria.

### Exit Declaration
State clearly: "**Initial plan ready. Want to grill the plan or check for readiness?**"

### Next Step
User invokes `grill-and-refine` (Plan mode) or `check-plan-readiness` (Build mode — switch needed).
