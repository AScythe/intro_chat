---
name: grill-and-refine
description: 'Interview relentlessly about a plan or design until reaching shared understanding, resolving each branch of the decision tree, then produce a fool-proof revised plan with no gaps. Use when user wants to stress-test a plan/design, after analyze-and-plan, or triggered when the user says "grill the plan", "stress-test the plan", or similar.'
---

## What I do
- Relentlessly interrogate the plan through a structured decision-tree approach
- Probe every assumption, edge case, alternative, dependency, risk, and consistency concern
- Walk through each dimension interactively — present findings as options, gather user input, resolve before moving to the next
- After all branches are resolved, produce a fool-proof revised plan with no gaps

## Documents to Read

Before Phase 1 analysis, consult these docs via Grep→Read for the listed sections:

**`ARCHITECTURE.md`**
- "Project Structure" (file tree context)
- "Module Descriptions" (relevant entries — modules the plan touches)
- "Data Flow" (endpoint and event sequences)
- "Key Design Decisions" (why the system is built this way)
- "Import Structure" (dependency graph validation)
- "Critical Implementation Details" (match expiry, thread behavior, etc.)

**`SPECIFICATIONS.md`**
- "Hard Constraints" (privacy rules, non-negotiables to probe against)
- "Out of Scope" (boundaries to respect during probing)

Do not read the full documents — read only the sections listed above.

## How to Grill

### Phase 1: Analyze (agent only)
1. **Start with the initial plan** (can be from the previous step analyze-and-plan output)
2. **Explore the identified files/code** to explore findings for each dimension:
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

Compile the gathered information from all resolved dimensions. 
Output each dimension as a copy-ready code block:

```
### Dimension: [name]
- Decision: [what was decided]
- Rationale: [why this choice]
- Impact: [how it affects the plan]
```

After all dimensions, produce the full revised plan summary.

## Fool-Proof Revised Plan

After all branches are resolved, produce a revised plan that is:
- **Complete** — contains the approach on how to implement the task
   - The approach and design decisions.
   - Which files need to be created, modified, or removed.
   - Resolved dimensions from the grill.
   - Testing strategy (test framework, key scenarios).
   - Success criteria (verifiable).
- **Gap-free** — no unresolved questions, no skipped branches in the decision tree
- **Logically sound** — the reasoning holds under scrutiny and will work as intended
- **Testable** — clear testing strategy (TDD) with specific test cases defined

Presented in a clean, copy-ready format.


## Hand-off

Before declaring completion:
- All six dimensions probed and resolved (assumptions, edge cases, alternatives, dependencies, risks, consistency)
- Each dimension documented with decision, rationale, and impact
- Revised plan gap-free, logically sound, and testable
- No file writes occurred (read-only phase)
- Plan formatted as copy-ready code block

---

## Outputs & Triggers

### Output
Revised plan (verbal) formatted as a ready-to-copy code block.

### Exit Declaration
State clearly: "**Grill complete. Check for plan readiness?**"

### Next Step
User invokes `check-plan-readiness` — **switch to Build mode before proceeding**.
