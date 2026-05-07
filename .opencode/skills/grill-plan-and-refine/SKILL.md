---
name: grill-plan-and-refine
description: Interview relentlessly about a plan or design until reaching shared understanding, resolving each branch of the decision tree, then produce a fool-proof revised plan with no gaps. Use when user wants to stress-test a plan/design, after analyze-and-plan, or when the user says "grill the plan", "stress-test the plan", or similar.
---

## What I do
- Relentlessly interrogate the plan through a structured decision-tree approach
- Probe every assumption, edge case, alternative, dependency, and risk
- Resolve each branch of the decision tree before moving to the next
- After all branches are resolved, produce a fool-proof revised plan with no gaps
- Ensure the intended functionality will work as expected

## How to Grill

1. **Start with the plan** (can be from the previous step analyze-and-plan output)
2. **Systematically probe every dimension:**
   - **Assumptions:** Are all assumptions valid? What if one is wrong?
   - **Edge cases:** What happens with empty, null, or unexpected input?
   - **Dependencies:** Does this change break anything else? Are there order-dependent steps?
   - **Risks:** What could go wrong? Is there a safer approach?
   - **Consistency:** Does this approach conflict with existing patterns or architecture?
3. **For each question:**
   - If answerable by exploring the codebase, explore it instead of asking the user
   - Otherwise, ask the user with your recommended answer
4. **Resolve each branch completely** before moving to the next

## Output: Fool-Proof Revised Plan

After all branches are resolved, produce a revised plan that is:
- **Complete** — every file, every change, every edge case accounted for
- **Gap-free** — no unresolved questions, no skipped branches
- **Logically sound** — the approach will work as intended
- **Testable** — clear testing strategy (TDD) defined with specific test cases

State clearly: "Grill complete. Here is the fool-proof revised plan."
