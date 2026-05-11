---
name: plan-readiness
description: Create the finalized plan document from conversation context, verify it passes all gates, and save to docs/plans/. If all pass, declare ready. If any fail, triage: minor gaps get a quick fix, significant gaps route back to grill-plan. Trigger after grill-plan-and-refine, or when the user says "are we ready to code", "check readiness", "is everything considered", or similar.
---

## What I do
- Gather the plan from conversation context (analyze-and-plan + grill-plan-and-refine outputs)
- Create `docs/plans/PLAN_YYYY_MM_DD_XXX.md` — write all sections
- Verify the plan document against all 7 pre-implementation gates
- Append gate results to the file
- If all gates pass, give go signal with file path
- If any gate fails, report and triage

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
### Success Criteria

---

## Grill Outcomes

## Readiness Gate Results
```

Populate each section from conversation context:
- **Requirements / Problem** — from the user's initial request and analyze-and-plan's understanding
- **Solution** — from analyze-and-plan's plan
- **Implementation Plan** — files, approach, edge cases, testing strategy, success criteria
- **Grill Outcomes** — resolved dimensions from grill-plan-and-refine's Phase 3 output
- **Readiness Gate Results** — append after gates below

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
   - **Minor** (missing documentation, unclear wording) — suggest the fix, update the plan file, and re-check without leaving plan-readiness
   - **Significant** (unresolved assumption, edge case, soundness risk) — recommend re-entering grill-plan for the affected dimension
3. Re-check all gates after resolution

State clearly on pass: "✓ All gates pass. Plan saved at docs/plans/PLAN_.... Ready to implement?"
