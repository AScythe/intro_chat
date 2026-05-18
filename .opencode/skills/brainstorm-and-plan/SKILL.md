---
name: brainstorm-and-plan
description: 'Brainstorming and planning stage. Analyze requirements against project docs, surface ideas and assumptions, confirm direction with user, then produce an initial plan. Use at the beginning of any tasks, or triggered when the user says "brainstorm and plan", "analyze and plan", "analyze the requirements", or similar.'
---

## What I do
- Analyze requirements via layered doc→code reading; surface assumptions, ambiguities, and missing information explicitly
- Describe requirements back to the user for confirmation; block implementation until plan is accepted
- Produce an **initial broad-strokes plan** covering files, approach, testing strategy, and success criteria

## Boundaries (read-only phase)
- **No file writes** — including plans, analysis notes, or code changes.
- **No implementation** — understand and plan only.
- **Broad strokes only** — deep edge-case analysis handled by `grill-and-refine`.
- **Interactive** — Phase 2 requires user input. Do not produce final plan without walking through and confirming with the user.
- **Verbal output only** — formal plan documents written by `check-plan-readiness`.

## Guidelines

### Phase 1: Analyze (agent only)

Follow this layered analysis pipeline — all read-only:

**Layer 1: Consult docs (`docs/`)**
- Read only the sections relevant to the task (Grep→Read pattern — grep for heading line number, Read with offset/limit). Do not read entire docs.
- Map the task type to the right document:
  - Product context, user flow, feature scope, privacy → `SPECIFICATIONS.md` (read: "Problem", "Solution", "How It Works", "Core Features", "User Flow", "Out of Scope", "Hard Constraints")
  - Module structure, data flow, API design → `ARCHITECTURE.md` (read: "Project Structure", "Module Descriptions" relevant entries, "Import Structure", "Modifying Instructions")
- `PROJECT_BEST_PRACTICES.md` is excluded at this stage — coding patterns are implementation concerns, not planning concerns.

**Layer 2: Spot-check doc accuracy**
- Read key source files referenced in the docs to confirm the doc is not stale. Use the project tree in `ARCHITECTURE.md` to locate the right file.
- If the doc matches the code → extract relevant info and proceed to planning.
- If the doc is stale or wrong → note the gap, then examine more files to understand the full picture before planning.

**Layer 3: Fallback (only if no relevant docs exist)**
- Examine the relevant source code files directly.

**Layer 4: Evaluate design approach**

Evaluate the proposed approach against these principles. Surface concerns here — fixing at `grill-and-refine` is cheaper than reversing during implementation.

- **Deep modules** — simple public interface, complex logic hidden inside. Pass simple inputs, assert final outcomes.
- **Pure functions** — same input → same output, no side effects. Flag functions that fetch data, modify global state, or write to DB (requires mocking).
- **Injected dependencies** — pass in DB clients, HTTP clients, clocks, RNG. Tests substitute fakes without live servers.
- **Single responsibility** — a function that fetches, parses, validates, and saves has four responsibilities. Flag multi-responsibility functions; propose splits.
- **Minimal dependencies** — every dependency is a maintenance liability. Ask: does benefit outweigh cost? Prefer self-contained solutions.
- **Elegance and efficiency** — clean design is easier to optimize correctly later. A design requiring workarounds to be fast enough is wrong from the start.

#### Questions to Ask During Planning

Is the control flow easy to follow at a glance? Convoluted logic is a design problem, not an implementation detail.

### Phase 2: Interactive Walkthrough (with user)

Present all Phase 1 findings to the user. Walk through each step sequentially; resolve before moving on.

1. **Clarify understanding** — restate requirements back to the user. Do not proceed until confirmed.
2. **Surface ambiguities** — state unclear points explicitly. Present multiple interpretations if they exist; do not pick silently.
3. **Discuss design approach** — present findings from Phase 1 evaluation (design principles, control flow). Discuss trade-offs, alternatives, and risks. Push back on questionable approaches.
4. **Confirm direction** — ensure the user agrees with the approach before producing the plan.
5. **Document sources** — cite which docs/sections were consulted.

### Phase 3: Produce the Plan

**Produce an initial plan verbally.** The plan must specify:
- Approach and high-level design decisions
- Files to create, modify, or remove
- Testing strategy (framework, key scenarios)
- Success criteria (verifiable)
- Consulted docs (or note: no relevant docs existed)

## Hand-off
- Analysis complete, approach evaluated (Phase 1)
- Requirements, ambiguities, and design approach discussed and confirmed with user (Phase 2)
- Plan presented verbally, no file writes (Phase 3)
- Document sources cited

---

## Outputs & Triggers

### Output
Initial (broad-strokes) plan (verbal).

### Exit Declaration
State clearly: "**Initial plan ready. Want to grill the plan or check for readiness? Say 'grill' to trigger grilling the plan.**"

### Next Step
User invokes `grill-and-refine` (Plan mode) or `check-plan-readiness` (Build mode — switch needed).