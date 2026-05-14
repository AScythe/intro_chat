---
name: check-plan-readiness
mode: build
description: '[Build mode — creates plan documents] Create the finalized plan document from conversation context, verify it passes all gates, and save to docs/plans/. If all pass, declare ready. If any fail, triage: minor gaps get a quick fix, significant gaps route back to grill-and-refine. This step creates the plan document — no other step writes to it. Output: docs/plans/PLAN_*.md. Exit: "All planning gates pass" — invokes implement-plan.'
---

## What I do
- Gather the plan from conversation context (analyze-and-plan + grill-and-refine outputs)
- Create `docs/plans/PLAN_YYYY_MM_DD_XXX.md` — write all sections
- Verify the plan document against all 7 pre-implementation gates
- Append gate results to the file
- If all gates pass, give go signal with file path
- If any gate fails, report and triage

## Documents to Read

None. Gates 1-7 are presence-checks on the plan file; gate 5 (Soundness) was already validated by the preceding grill-and-refine step.

## Plan Document Creation

Create the plan file at `docs/plans/PLAN_YYYY_MM_DD_XXX.md`:
- **YYYY_MM_DD**: today's date
- **XXX**: next available 3-digit number (001, 002, ...). List existing files in `docs/plans/` and increment the highest number.
- Example: `docs/plans/PLAN_2026_05_11_001.md`

### Template

```markdown
# PLAN_YYYY_MM_DD_XXX

## Requirements / Problem

## Solution

## Implementation Plan

### Files to Create, Modify, or Remove
### Approach & Design Decisions
### Edge Cases
### Testing Strategy (TDD)
### Task Breakdown
### Success Criteria

---

## Grill Outcomes

## Readiness Gate Results
```

Populate each section from conversation context:
- **Requirements / Problem** — from the user's initial request and analyze-and-plan's understanding
- **Solution** — from analyze-and-plan's plan
- **Implementation Plan** — files, approach, edge cases, testing strategy, task breakdown, success criteria
- **Grill Outcomes** — resolved dimensions from grill-and-refine's Phase 3 output
- **Readiness Gate Results** — append after gates below

#### Task Breakdown Guidelines

The **Task Breakdown** subsection must decompose the implementation into a sequence of logical, independently testable tasks organized by phase:

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

## Gates
**Only write code when all gates are clear.**

Check each of the following against the plan file:

| # | Gate | Pass Criteria |
|---|---|---|
| 1 | Context | Plan references which docs/code were consulted |
| 2 | Assumptions | Plan states confirmed assumptions |
| 3 | Edge Cases | Plan addresses edge cases |
| 4 | Ambiguities | Plan states resolved ambiguities |
| 5 | Soundness | Plan is logically sound and will satisfy the intended function and purpose |
| 6 | Testing | Plan defines specific test cases |
| 7 | Success Criteria | Plan defines verifiable success criteria |

After checking all gates, append a summary under **## Readiness Gate Results** in the plan file:

```markdown
## Readiness Gate Results

| Gate | Pass? | Notes |
|------|-------|-------|
| Context | ✅ / ❌ | ... |
| Assumptions | ✅ / ❌ | ... |
| Edge Cases | ✅ / ❌ | ... |
| Ambiguities | ✅ / ❌ | ... |
| Soundness | ✅ / ❌ | ... |
| Testing | ✅ / ❌ | ... |
| Success Criteria | ✅ / ❌ | ... |
```

## On Failure

When a gate fails:
1. Clearly list which gates failed and why
2. Assess severity:
   - **Minor** (missing documentation, unclear wording) — suggest the fix, update the plan file, and re-check without leaving check-plan-readiness
   - **Significant** (unresolved assumption, edge case, soundness risk) — recommend re-entering grill-and-refine for the affected dimension
3. Re-check all gates after resolution

State clearly on pass: "✓ All gates pass. Plan saved at docs/plans/PLAN_.... Ready to implement?"

## Outputs & Triggers

### Output
Persistent plan file at `docs/plans/PLAN_*.md` with all sections populated and gate results appended. This skill is the sole creator of the plan file — no other step writes to it.

### Exit Declaration (pass)
State clearly: "**All planning gates pass. Plan saved at `docs/plans/PLAN_...`. Ready to implement. Say 'proceed' or 'implement' to trigger implement-plan.**"

### Exit Declaration (fail)
State clearly: "**Gate failure: [list failed gates]. Triage: [minor → fixed in place | significant → route back to grill-and-refine for: list affected dimensions].**"

### Next Step (pass)
User invokes `implement-plan` (Build mode — same mode, no switch needed).
