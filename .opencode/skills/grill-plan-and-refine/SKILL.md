---
name: grill-plan-and-refine
description: Interview relentlessly about a plan or design until reaching shared understanding, resolving each branch of the decision tree, then produce a fool-proof revised plan with no gaps. Use when user wants to stress-test a plan/design, after analyze-and-plan, or when the user says "grill the plan", "stress-test the plan", or similar.
---

## What I do
- Relentlessly interrogate the plan through a structured decision-tree approach
- Probe every assumption, edge case, alternative, dependency, risk, and consistency concern
- Walk through each dimension interactively — present findings as options, gather user input, resolve before moving to the next
- After all branches are resolved, produce a fool-proof revised plan with no gaps

## How to Grill

### Phase 1: Analyze (agent only)
1. **Start with the plan** (can be from the previous step analyze-and-plan output)
2. **Explore the codebase** to identify findings for each dimension:
   - **Assumptions:** Which assumptions does the plan make? Are they validated by code?
   - **Edge cases:** What happens with empty, null, or unexpected input?
   - **Alternatives:** Is there a simpler or safer approach?
   - **Dependencies:** Does this change break anything else? Are there order-dependent steps?
   - **Risks:** What could go wrong?
   - **Consistency:** Does this approach conflict with existing patterns or architecture?

### Phase 2: Interactive Walkthrough (with user)
1. **Before starting:** flag each dimension as "needs discussion" or "skippable" based on your Phase 1 analysis. Confirm the skip list with the user first.
2. Walk through each non-skipped dimension one by one in order. For each:
   - State your finding and recommendation clearly
   - Offer concrete options (e.g., "We could [A] handle this server-side, [B] client-side, or [C] something else")
   - Accept free-form input beyond the offered options
   - Resolve the dimension before moving to the next — do not revisit resolved items
3. After all dimensions, summarize the confirmed decisions

### Phase 3: Produce Revised Plan
Compile the revised plan from all resolved decisions. Plan-readiness will capture these outcomes in the plan file under ## Grill Outcomes.

## Output: Fool-Proof Revised Plan

After all branches are resolved, produce a revised plan that is:
- **Complete** — every file, every change, every edge case accounted for
- **Gap-free** — no unresolved questions, no skipped branches in the decision tree
- **Logically sound** — the reasoning holds under scrutiny and will work as intended
- **Testable** — clear testing strategy (TDD) with specific test cases defined

State clearly: "Grill complete. Here is the fool-proof revised plan."
