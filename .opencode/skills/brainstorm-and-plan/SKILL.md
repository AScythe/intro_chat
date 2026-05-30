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

## Phase 0: Prerequisites

- [ ] Read the upstream problem description or prior plan document
- [ ] Run baseline tests — all must pass
- [ ] Apply Codebase Exploration per task type (see AGENTS.md §Codebase Exploration)
- [ ] Read ARCHITECTURE.md, SPECIFICATIONS.md, relevant source files

## Guidelines

### Phase 1: Analyze (agent only)

Follow this layered analysis pipeline — all read-only:

**Codebase Exploration** — See [AGENTS.md §Codebase Exploration](../../../AGENTS.md) for the full decision framework. For complex questions, use the pipeline (graphify→cocoindex→ast-grep) rather than picking one tool. Use these skill-specific commands during analysis:

- **graphify** — macro-level architecture map before diving into files:
  - `graphify_query_graph "..."` — broad concept search (e.g. "which modules handle SRT processing")
  - `graphify_god_nodes` — discover core abstractions (most-connected modules in the project)
  - `graphify_get_community <id>` — see all files in a dependency community
  - `graphify_shortest_path "A" "B"` — relationship mapping between two modules

- **cocoindex-code** — search by natural language intent (e.g. "where are user sessions created" or "how are tracking logs saved"):
  - Set `refresh_index: False` for faster consecutive queries when code hasn't changed

- **ast_grep_search** — understand structural patterns (e.g. `load_*_log($$$)` to find JSON tracking log loaders across stages, or `def main()` to identify all pipeline entry points) before diving into files

**Layer 1: Consult docs (`docs/`)**
- Read only the sections relevant to the task (Grep→Read pattern — grep for heading line number, Read with offset/limit). Do not read entire docs.
- Map the task type to the right document:
  - Product context, user flow, feature scope, privacy → `SPECIFICATIONS.md` (read: "Problem", "Solution", "How It Works", "Core Features", "User Flow", "Out of Scope", "Hard Constraints")
  - Module structure, data flow, API design → `docs/ARCHITECTURE.md` (read: "Project Structure", "Module Descriptions" relevant entries, "Import Structure", "Modifying Instructions")
- `PROJECT_BEST_PRACTICES.md` is excluded at this stage — coding patterns are implementation concerns, not planning concerns.

**Layer 2: Spot-check doc accuracy**
- Read key source files referenced in the docs to confirm the doc is not stale. Use the project tree in `docs/ARCHITECTURE.md` to locate the right file.
- Use `cocoindex-code_search` to verify functions mentioned in docs still exist under those names
- Use `graphify_query_graph "module_name"` to verify documented module relationships match the graph
- If the doc matches the code → extract relevant info and proceed to planning.
- If the doc is stale or wrong → note the gap, then examine more files to understand the full picture before planning.

**Layer 3: Fallback (only if no relevant docs exist)**
- Examine the relevant source code files directly.

**Layer 4: Evaluate design approach**

Evaluate the proposed approach against these principles. Surface concerns here.

- **Deep modules** — simple public interface, complex logic hidden inside
- **Pure functions** — same input → same output, no side effects
- **Injected dependencies** — pass in DB clients, HTTP clients, clocks, RNG
- **Single responsibility** — each module or function does one thing
- **Minimal dependencies** — every dependency is a maintenance liability
- **Elegance and efficiency** — clean design is easier to optimize
- **Immutability** — create data once, never mutate
- **Strict type safety** — explicit types over dynamic typing
- **Idempotent operations** — same result whether run once or twice
- **Self-documenting names** — name reveals intent
- **Small functional footprint** — short functions are scannable and testable
- **Control flow clarity** — straightforward flow; convoluted logic is a design problem

### Phase 2: Interactive Walkthrough (with user)

Follow the User Interaction Pattern in AGENTS.md: present one decision-point at a time, resolve, then present the next. Never present multiple items in a single message and ask the user to respond to all at once.

1. **Clarify understanding** — restate requirements back to the user. Do not proceed until confirmed.
2. **Surface ambiguities** — state ONE unclear point at a time. Present multiple interpretations if they exist for that point; do not pick silently. Resolve before moving to the next ambiguity.
3. **Discuss design approach** — present findings from Phase 1 evaluation (design principles, control flow). Discuss ONE trade-off or risk at a time. Push back on questionable approaches.
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