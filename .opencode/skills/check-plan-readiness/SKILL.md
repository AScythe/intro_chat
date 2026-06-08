---
name: check-plan-readiness
description: 'Create the finalized plan document from conversation context, verify it passes all gates, and save to docs/. If all pass, declare ready. If any fail, triage: minor gaps get a quick fix, significant gaps ask user interactively. Use after grill-and-refine or brainstorm and plan, or triggered when the user says "finalize the plan", "check plan readiness", "is the plan ready?", or similar.'
---

## What I do
- Gather from upstream (brainstorm + grill)
- Create `docs/PLAN_YYYY_MM_DD_XXX.md` with all sections populated
- Verify against all 8 gates and append results
- All pass → declare ready with file path. Fail → report and triage

## Boundaries (gate-driven phase)
- **Plan file writes only** — creates `docs/PLAN_*.md`
- **No code writes**
- **Presence check, not re-probe** — verify each criterion is present in the plan file
- **Gate-driven** — no plan finalized until all 8 gates pass

## Phase 0: Prerequisites

- [ ] Check for context continuity — see AGENTS.md §Session Continuity Check for trigger conditions. Load and execute the check logic from `save-session` Step 9 if needed.
- [ ] Read the upstream plan (from brainstorm-and-plan or grill-and-refine) — all sections
- [ ] Confirm upstream plan contains all required sections (approach, files, testing, success criteria) before writing the document
- [ ] Confirm the plan document does not already exist in docs/

## Plan Document Lifecycle

### Phase 1: Gather from Conversation Context
**Purpose:** Extract all inputs needed to populate the plan document — from conversation context only. No codebase analysis at this stage.

Collect from upstream skills. No additional analysis needed.

**From brainstorm:**
- **Problem Statement, Goals/Non-Goals** → clarified requirements (Phase 2 walkthrough)
- **Technical Approach, Files, Testing Strategy, Success Criteria** → initial plan output (Phase 3)
- **Consulted docs** → feeds Gate 1 (Context)

**From grill:**
- **Grill Outcomes** → copy-ready dimension blocks (Phase 3) — paste directly into the template
- **Resolved dimensions** → feeds Gates 2–7

### Phase 2: Create the Plan Document
**Purpose:** Write the plan file from Phase 1 inputs. No analysis — pure assembly from gathered context.

**Sequential numbering** — scan `docs/` for existing `PLAN_*.md` files and increment the highest. Use `PLAN_YYYY_MM_DD_XXX.md` format.

Populate each section from Phase 1 inputs using this template:

#### Template

```markdown
# PLAN_YYYY_MM_DD_XXX

## Problem Statement

## Goals & Non-Goals
### Goals
### Non-Goals

## Success Metrics

## Technical Approach

## Implementation Plan
### Files to Create, Modify, or Remove
### Architecture & Design Decisions
### Testing Strategy
### Task Breakdown
### Success Criteria

## Open Questions & Risks

---

## Grill Outcomes
### Dimension: [name]
- Decision: [what was decided]
- Rationale: [why this choice]
- Impact: [how it affects the plan]

## Readiness Gate Results
```

#### Task Breakdown

Each task must be independently testable and map 1:1 to a batch:

1. **Group by phase** — e.g., Foundation → State Layer → Components → Pages. Each phase has a clear prerequisite.
2. **Each task specifies** — What, Files, Dependencies, Tests, Verification
3. **Sequential numbering** across all phases (Task 1, Task 2, ...)
4. **Phase headers** — use `#### Phase N: Name`

### Phase 3: Verify Gates
**Purpose:** Confirm the plan document is complete and sound before declaring it ready for implementation.

**Presence check, not re-probe** — verify each criterion is present in the plan file. Exception: Gate 8 requires an active `graphify get_community` query to verify scope coverage — it cannot be satisfied by presence alone.

Check each of the following against the plan file:

| # | Gate | Pass Criteria |
|---|------|-------------|
| 1 | Context | Plan cites which docs/code were consulted |
| 2 | Assumptions | Plan states confirmed assumptions |
| 3 | Edge Cases | Plan addresses edge cases |
| 4 | Clarity | Plan has no unresolved ambiguities |
| 5 | Soundness | Plan satisfies intended function |
| 6 | Testing | Plan defines specific test cases |
| 7 | Success Criteria | Plan defines verifiable success criteria |
| 8 | Community Coverage | Graph query confirms all related communities addressed |

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
| Community Coverage | ✅ / ❌ | ... |
```

### Phase 4: Triage Failures
**Purpose:** Resolve failed gates before proceeding — minor issues fixed in place, significant ones resolved interactively with the user.

Only reached if one or more gates fail in Phase 3.

1. List which gates failed and why
2. Assess severity:
   - **Minor** (missing doc, unclear wording) → fix in place, re-check.
   - **Significant** (unresolved assumption, edge case, soundness) → follow the User Interaction Pattern:
     1. State which gates failed and why — one gate at a time, do not dump all at once
     2. For each failed gate, use the `question` tool with concrete options (e.g., "Option A: extend the plan to cover this, Option B: mark as out of scope, Option C: route back to grill-and-refine"). Provide `label` and `description` in every option.
     3. Rely on the auto-added "Type your own answer" for free-form input beyond offered options
     4. Resolve before moving to the next gate — do not revisit
     5. After all resolved, summarize confirmed decisions
3. Re-check all gates after resolution

## Hand-off
- Phase 1: Inputs gathered from brainstorm + grill
- Phase 2: Plan file created with all sections populated
- Phase 3: All 8 gates checked, results appended
- Phase 4: Failed gates triaged (minor: fixed in place; significant: resolved interactively)
- Pass → route to implement-plan. Fail → triaged (minor: fixed; significant: route to grill-and-refine)

---

## Outputs & Triggers

### Output
Persistent plan file at `docs/PLAN_*.md` with all sections populated and gate results appended.

### Exit Declaration (pass)
State clearly: "**All planning gates pass. Plan saved at `docs/PLAN_...`. Ready to implement. Say 'proceed' or 'implement' to trigger implementation of the plan. Remember to compact before proceeding.**"

### Exit Declaration (fail)
State clearly: "**Gate failure: [list failed gates]. Triage: [minor → fixed in place | significant → let's resolve these: list affected dimensions].**"

### Next Step (pass)
User invokes `implement-plan`.

### Next Step (fail)
User invokes `grill-and-refine` to resolve the failed gates.