---
name: check-plan-readiness
description: 'Create the finalized plan document from conversation context, verify it passes all gates, and save to docs/. If all pass, declare ready. If any fail, triage: minor gaps get a quick fix, significant gaps ask user interactively. This step creates the plan document. Use after grill-and-refine, triggered when the user says "finalize the plan", "check plan readiness", "is the plan ready?", or similar.'
---

## What I do
- Gather the plan from conversation context (brainstorm-and-plan + grill-and-refine outputs)
- Create `docs/PLAN_YYYY_MM_DD_XXX.md` — write all sections
- Verify the plan document against all 7 pre-implementation gates
- Append gate results to the file
- If all gates pass, give go signal with file path
- If any gate fails, report and triage

## Boundaries (gate-driven phase)
- **Plan file writes only.** This skill creates `docs/PLAN_*.md` — the sole creator of plan files.
- **No code writes.** Plan documents only. No source code changes.
- **Presence check, not re-probe.** Verify each criterion is *addressed*. Do not re-analyze from scratch.
- **Gate-driven.** No plan is finalized until all 7 gates pass.

## Pipeline Position

This skill is the third and final planning stage. It receives structured inputs from the two upstream skills:

| Input | From | Format |
|-------|------|--------|
| Confirmed requirements | brainstorm Phase 1 (Layer 4) | Verbal |
| Initial plan (approach, files, testing, success criteria) | brainstorm Phase 3 | Verbal |
| Design quality evaluation | brainstorm Phase 2 | Verbal |
| Resolved 6 dimensions + testability probe | grill Phases 1-3 | Copy-ready code blocks |

This skill formalizes verbal outputs into a persistent file and verifies them against the 7 readiness gates.

## Plan Document Lifecycle

### Phase 1: Gather from Conversation Context

Collect structured inputs from the two upstream skills:

1. **Requirements / Problem** — from the user's initial request + brainstorm Phase 1 confirmation
2. **Solution / Approach** — from brainstorm Phase 3 plan
3. **Implementation details** — files, testing strategy, success criteria from brainstorm Phase 3
4. **Resolved dimensions** — all 6 from grill (Assumptions, Edge Cases, Alternatives, Dependencies, Risks, Consistency), with decision/rationale/impact
5. **Design quality** — testability principles from brainstorm Phase 2

#### Task Breakdown Guidelines

The **Task Breakdown** subsection (written in Phase 2) must decompose the implementation into a sequence of logical, independently testable tasks organized by phase:

1. **Group by phase** — organize tasks into phases (e.g., Foundation → State Layer → Components → Pages → Integration). Each phase has a clear prerequisite.
2. **Each task must specify**:
   - **What** — one clear unit of work (create a file, modify a module, extract logic)
   - **Files** — every file touched by this task, with a brief purpose
   - **Dependencies** — which earlier tasks must be complete first
   - **Tests** — what specific test cases validate this task (use TDD: test before code)
   - **Verification** — how to confirm the task is done (e.g., `npm test` passes, specific test names pass)
3. **Task numbering** — sequential numbers across all phases (Task 1, Task 2, ...) makes cross-referencing easy.
4. **Independently verifiable** — each task must be testable in isolation. Never merge two unrelated changes into one task.
5. **Phase headers** — use `#### Phase N: Name` to separate groups. Include a brief summary of the phase's purpose.

### Phase 2: Create the Plan Document

**Sequential numbering** — scan `docs/` for existing `PLAN_*.md` files and increment the highest number. Use `PLAN_YYYY_MM_DD_XXX.md` format.

Write the plan file using the template below. Populate each section from the structured inputs gathered in Phase 1.

#### Template

```markdown
# PLAN_YYYY_MM_DD_XXX

## Requirements / Problem Statement

## Solution

## Implementation Plan

### Files to Create, Modify, or Remove
### Approach & Design Decisions
### Testing Strategy (TDD)
### Task Breakdown
### Success Criteria

---

## Grill Outcomes

[All 6 resolved dimensions — includes Edge Cases as one dimension]

### Dimension: [name]
- Decision: [what was decided]
- Rationale: [why this choice]
- Impact: [how it affects the plan]

## Readiness Gate Results
```

Populate each section:
- **Requirements / Problem** — from user request + brainstorm understanding
- **Solution** — from brainstorm plan (approach and design decisions)
- **Implementation Plan** — files, approach, testing strategy, task breakdown, success criteria; all extracted from brainstorm and grill outputs. Edge Cases live in Grill Outcomes only.
- **Grill Outcomes** — resolved dimensions from grill's Phase 2-3 output in copy-ready code blocks. Edge Cases is one of the 6 dimensions here.
- **Readiness Gate Results** — appended after Phase 3 verification

### Phase 3: Verify Gates

**Presence check, not re-probe** — verify each criterion is *addressed* in the plan file. Do not re-analyze from scratch.

Check each of the following against the plan file:

| # | Gate | Pass Criteria | Verified by |
|---|------|-------------|-------------|
| 1 | Context | Plan references which docs/code were consulted | brainstorm Layer 4 — cite docs requirement |
| 2 | Assumptions | Plan states confirmed assumptions | grill Phase 1 — Assumptions dimension |
| 3 | Edge Cases | Plan addresses edge cases | grill Phase 1 — Edge Cases dimension |
| 4 | Clarity | Plan states resolved ambiguities and has no unclear questions | brainstorm Layer 4 (clarify) + grill (gap-free criterion) |
| 5 | Soundness | Plan is logically sound and satisfies intended function and purpose | grill Phase 3 — quality criterion |
| 6 | Testing | Plan defines specific test cases | brainstorm Phase 3 + grill Phase 3 — Testable criterion |
| 7 | Success Criteria | Plan defines verifiable success criteria | brainstorm Phase 3 — plan template |

After checking all gates, append the results table under **## Readiness Gate Results** in the plan file:

```markdown
## Readiness Gate Results

| Gate | Pass? | Notes |
|------|-------|-------|
| Context | ✅ / ❌ | ... |
| Assumptions | ✅ / ❌ | ... |
| Edge Cases | ✅ / ❌ | ... |
| Clarity | ✅ / ❌ | ... |
| Soundness | ✅ / ❌ | ... |
| Testing | ✅ / ❌ | ... |
| Success Criteria | ✅ / ❌ | ... |
```

## On Failure

When a gate fails:
1. Clearly list which gates failed and why
2. Assess severity:
   - **Minor** (missing documentation, unclear wording) — suggest the fix, update the plan file, and re-check without leaving check-plan-readiness
   - **Significant** (unresolved assumption, edge case, soundness risk) — interactively ask the user about the affected dimension
3. Re-check all gates after resolution

## Hand-off

Before declaring completion:
- Phase 1: Structured inputs gathered from brainstorm and grill outputs
- Phase 2: Plan file created at `docs/PLAN_*.md` with all sections populated
- Phase 3: All 7 gates checked and results appended to plan file
- All gates pass → route to implement-plan
- Gate failure → triaged (minor: fixed in-place; significant: route to grill-and-refine)

---

## Outputs & Triggers

### Output
Persistent plan file at `docs/PLAN_*.md` with all sections populated and gate results appended. This skill is the sole creator of the plan file — no other step writes to it.

### Exit Declaration (pass)
State clearly: "**All planning gates pass. Plan saved at `docs/PLAN_...`. Ready to implement. Say 'proceed' or 'implement' to trigger implementation of the plan.**"

### Exit Declaration (fail)
State clearly: "**Gate failure: [list failed gates]. Triage: [minor → fixed in place | significant → let's resolve these: list affected dimensions].**"

### Next Step (pass)
User invokes `implement-plan` (Build mode — same mode, no switch needed).

### Next Step (fail)
User invokes `grill-and-refine` (Plan mode) to resolve the failed gates.