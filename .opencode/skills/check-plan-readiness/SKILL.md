---
name: check-plan-readiness
description: 'Create the finalized plan document from conversation context, verify it passes all gates, and save to docs/. If all pass, declare ready. If any fail, triage: minor gaps get a quick fix, significant gaps ask user interactively. This step creates the plan document. Use after grill-and-refine, or triggered when the user says "finalize the plan", "check plan readiness", "is the plan ready?", or similar.'
---

## What I do
- Gather the plan from conversation context (brainstorm + grill outputs)
- Create `docs/PLAN_YYYY_MM_DD_XXX.md` with all sections populated
- Verify the plan against all 7 pre-implementation gates and append results
- All pass → give go signal with file path. Any fail → report and triage

## Boundaries (gate-driven phase)
- **Plan file writes only** — creates `docs/PLAN_*.md` (sole creator)
- **No code writes** — plan documents only, no source code changes
- **Presence check, not re-probe** — verify each criterion is addressed, not re-analyzed
- **Gate-driven** — no plan finalized until all 7 gates pass

## Plan Document Lifecycle

### Phase 1: Gather from Conversation Context

Collect from upstream skill outputs (brainstorm + grill). No additional analysis needed.

#### Task Breakdown Guidelines

The **Task Breakdown** subsection (written in Phase 2) must decompose the implementation into logical, independently testable tasks:

1. **Group by phase** — e.g., Foundation → State Layer → Components → Pages → Integration. Each phase has a clear prerequisite.
2. **Each task specifies** — What (unit of work), Files (every file touched), Dependencies (prior tasks), Tests (TDD: test before code), Verification (how to confirm done)
3. **Task numbering** — sequential across all phases (Task 1, Task 2, ...)
4. **Independently verifiable** — each task testable in isolation. Never merge unrelated changes into one.
5. **Phase headers** — use `#### Phase N: Name` with a brief purpose summary.

### Phase 2: Create the Plan Document

**Sequential numbering** — scan `docs/` for existing `PLAN_*.md` files and increment the highest. Use `PLAN_YYYY_MM_DD_XXX.md` format.

Populate each section from Phase 1 inputs using this template:

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

Section sources:
- **Requirements / Problem** → brainstorm understanding
- **Solution** → brainstorm plan
- **Implementation Plan** → brainstorm (files, approach, testing, tasks). Edge Cases in Grill Outcomes only.
- **Grill Outcomes** → grill resolved dimensions (copy-ready blocks)
- **Readiness Gate Results** → appended after Phase 3

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

After checking all gates, append the results table:

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

1. List which gates failed and why
2. Assess severity:
   - **Minor** (missing doc, unclear wording) — fix in place, re-check
   - **Significant** (unresolved assumption, edge case, soundness) — **ask user interactively:**
     1. State which gate failed and why
     2. Present the unresolved dimension with concrete options
     3. Get user input and resolve before proceeding
3. Re-check all gates after resolution

## Hand-off
- Phase 1: Inputs gathered from upstream skills
- Phase 2: Plan file at `docs/PLAN_*.md` with all sections populated
- Phase 3: All 7 gates checked, results appended
- Pass → route to `implement-plan`. Fail → triaged (minor: fixed in place; significant: route to `grill-and-refine`)

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