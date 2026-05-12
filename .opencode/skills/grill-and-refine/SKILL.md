---
name: grill-and-refine
mode: plan
description: 'Interview relentlessly about a plan or design until reaching shared understanding, resolving each branch of the decision tree, then produce a fool-proof revised plan with no gaps. Use when user wants to stress-test a plan/design, after analyze-and-plan, or when the user says "grill the plan", "stress-test the plan", or similar. Output: verbal revised plan with resolved dimensions as copy-ready code blocks. Exit: "Grill complete" — invokes check-plan-readiness.'
---

## What I do
- Relentlessly interrogate the plan through a structured decision-tree approach
- Probe every assumption, edge case, alternative, dependency, risk, and consistency concern
- Walk through each dimension interactively — present findings as options, gather user input, resolve before moving to the next
- After all branches are resolved, produce a fool-proof revised plan with no gaps

## Documents to Read

Before Phase 1 analysis, consult `ARCHITECTURE.md` via Grep→Read for these sections:
- "Project Structure" (file tree context)
- "Module Descriptions" (relevant entries — modules the plan touches)
- "Data Flow" (endpoint and event sequences)
- "Key Design Decisions" (why the system is built this way)
- "Import Structure" (dependency graph validation)
- "Critical Implementation Details" (match expiry, thread behavior, etc.)

Do not read the full document — read only the sections listed above.

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

Compile the revised plan from all resolved dimensions. Output each dimension as a copy-ready code block that `check-plan-readiness` can paste directly into the plan document:

```
### Dimension: [name]
- Decision: [what was decided]
- Rationale: [why this choice]
- Impact: [how it affects the plan]
```

After all dimensions, produce the full revised plan summary.

## Output: Fool-Proof Revised Plan

After all branches are resolved, produce a revised plan that is:
- **Complete** — every file, every change, every edge case accounted for
- **Gap-free** — no unresolved questions, no skipped branches in the decision tree
- **Logically sound** — the reasoning holds under scrutiny and will work as intended
- **Testable** — clear testing strategy (TDD) with specific test cases defined

State clearly: "**Grill complete. Check for plan readiness?**"

## Outputs & Triggers

### Output
Revised plan (verbal) with each resolved dimension formatted as a ready-to-copy code block. Updated approach, edge cases, risks, testing strategy, and success criteria.

### Exit Declaration
State clearly: "**Grill complete. Check for plan readiness?**"

### Next Step
User invokes `check-plan-readiness` — **switch to Build mode before proceeding**.
