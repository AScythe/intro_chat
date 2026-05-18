---
name: brainstorm-and-plan
description: 'Brainstorming and exploration. Explore requirements against project docs, surface ideas and assumptions, confirm direction with user, then produce a concrete plan. Trigger at the start of any coding task, or when the user says "brainstorm and plan", "analyze the requirements", "analyze the plan", or similar.'
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
- **Verbal output only.** Present the plan as text in the conversation. Formal plan documents (`docs/PLAN_*.md`) are written later by `check-plan-readiness`.

## Pipeline Position

This skill is the first planning stage. It receives the user's request and produces a broad-strokes plan for the next stage.

| Input | From | Format |
|-------|------|--------|
| User's request / task | User (conversation) | Verbal |
| Project docs (SPECS, ARCH) | `docs/` | Reference sections |

| Output | To | Format |
|--------|----|--------|
| Initial broad-strokes plan | grill-and-refine or check-plan-readiness | Verbal |
| Confirmed requirements understanding | grill-and-refine or check-plan-readiness | Verbal |

## Guidelines

### Phase 1: Understand and Analyze

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

**Layer 4: Clarify understanding**
- Fully describe your understanding of the requirements back to the user.
- If something is unclear, state what's confusing, surface assumptions explicitly, and ask interactively.
- If multiple interpretations exist, present them interactively — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted — if the solution introduces a new external dependency, ask whether the benefit clearly outweighs the maintenance cost. Check logical soundness before endorsing.
- Make sure the proposal is logically sound and satisfies the intended functionalities.
- Cite which docs were consulted (and which sections) — or note that no relevant docs existed.
- Do not proceed until the user has confirmed your understanding.

### Phase 2: Shape the Approach

**Before writing a plan, evaluate what makes the design testable and maintainable.** Use these principles and questions to shape your thinking about the approach. The output of this phase is a design direction — not a written plan.

#### Design for Testability and Quality

When shaping the approach, evaluate whether the proposed design produces testable, maintainable code. Flag shallow or tangled designs before they reach implementation. Prefer:

- **Deep modules** — simple public interface, complex logic hidden inside. The caller (and test) should pass simple inputs and assert final outcomes, with no setup ceremony required.
- **Pure functions** — same input always produces the same output, no side effects. If a function fetches data, modifies global state, or writes to a database, it mixes concerns and requires mocking to test.
- **Injected dependencies** — DB clients, HTTP clients, clocks, and RNG should be passed in, not instantiated inside the function. This lets tests substitute lightweight fakes without touching a live server.
- **Single responsibility** — a function that fetches, parses, validates, and saves has four responsibilities. Each added responsibility multiplies the test cases required. Flag multi-responsibility functions and propose a split.
- **Minimal dependencies** — every external dependency is a maintenance liability. Before proposing one, ask whether the benefit clearly outweighs the cost. Prefer self-contained solutions; add a dependency only when it's clearly the right tool.
- **Elegance and efficiency** — these reinforce each other. A clean design is easier to optimize correctly later. A design that requires workarounds to be fast enough is wrong from the start.

#### Questions to Ask During Planning

Is the control flow of the proposed solution easy to follow at a glance? If not, flag it — convoluted logic is a design problem, not an implementation detail.

Surface these concerns now — resolving them at the `grill-and-refine` stage is far cheaper than reversing them during implementation.

### Phase 3: Produce the Plan

**Once the approach is shaped, produce an initial plan verbally.**

The initial plan must include:
- The approach and high-level design decisions.
- Which files need to be created, modified, or removed.
- Testing strategy (test framework, key scenarios).
- Initial success criteria (verifiable).
- Cite which docs were consulted (or note that no relevant docs existed).

## Hand-off

Before declaring completion:
- Requirements understood and confirmed by the user (Phase 1)
- Design approach evaluated against testability and quality principles (Phase 2)
- Initial broad-strokes plan covers approach, files, testing strategy, and success criteria (Phase 3)
- No file writes occurred (read-only phase)
- Plan presented verbally with cited document sources

---

## Outputs & Triggers

### Output
Initial (broad-strokes) plan (verbal).

### Exit Declaration
State clearly: "**Initial plan ready. Want to grill the plan or check for readiness?**"

### Next Step
User invokes `grill-and-refine` (Plan mode) or `check-plan-readiness` (Build mode — switch needed).