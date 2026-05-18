---
name: grill-and-refine
description: 'Interview relentlessly about a plan or design until reaching shared understanding, resolving each branch of the decision tree, then produce a fool-proof revised plan with no gaps. Use when user wants to stress-test a plan/design, after brainstorm-and-plan, or triggered when the user says "grill the plan", "stress-test the plan", or similar.'
---

## What I do
- Interrogate the plan across all six dimensions (assumptions, edge cases, alternatives, dependencies, risks, consistency)
- Walk through each dimension interactively — present findings as options, gather input, resolve before moving on
- After all branches resolved, produce a fool-proof revised plan with no gaps

## Boundaries (read-only phase)
- **No file writes** — including plans, analysis notes, or code changes.
- **No implementation** — grill and refine only.
- **Deep scrutiny** — full examination of every edge case and risk. Unlike `brainstorm-and-plan`.
- **Interactive** — Phase 2 requires user input. Do not produce revised plan without walking through unresolved dimensions.
- **Verbal output only** — formal plan documents written by `check-plan-readiness`.

## Documents to Read

- **`ARCHITECTURE.md`** — "Project Structure", "Module Descriptions" (relevant), "Data Flow", "Key Design Decisions", "Import Structure", "Critical Implementation Details"
- **`SPECIFICATIONS.md`** — "Hard Constraints", "Out of Scope"

## How to Grill

### Phase 1: Analyze (agent only)

**Analyze alone first** — before the user walkthrough, explore the codebase independently across all dimensions. Do not jump to interactive mode prematurely.

Start with the initial plan (from `brainstorm-and-plan` output). Explore identified files/code for each dimension:

| Dimension | What to probe |
|-----------|--------------|
| **Assumptions** | Validated by code? |
| **Edge cases** | Empty, null, boundary, or unexpected input? |
| **Alternatives** | Simpler or safer approach? New dependency worth the cost? |
| **Dependencies** | Breaks anything? Order-dependent? Injected or hardcoded? |
| **Risks** | Blast radius? Error strategy defined? Performance implications? |
| **Consistency** | Conflicts with existing patterns? Straightforward control flow? |

#### Testability Probe (embedded in Dependencies and Risks)

During **Dependencies**, probe for five anti-patterns:

- **AP1: Non-determinism** — clocks, RNG, or network calls make tests non-repeatable unless injected as defaulted parameters.
- **AP2: I/O mixed with logic** — a function that fetches, transforms, AND persists. Split for isolated testing without mocking.
- **AP3: Tight coupling** — mocking 3+ collaborators to test one unit? Flag and propose injection via defaulted-parameter pattern.
- **AP4: Shared mutable state** — global state modified by multiple tests causes order-dependent flaky tests.
- **AP5: Missing seams** — no place to substitute behavior without patching internals?

During **Risks**, probe for test fragility:

- **Brittle assertions** — testing type rather than value?
- **Test doubles confusion** — "mocking" when a stub or fake would do? Over-mocking signals a coupling problem.

### Phase 2: Interactive Walkthrough (with user)

**Present all Phase 1 findings to the user.** One dimension at a time — address sequentially. Flag skippable items upfront; resolve each before moving on.

1. **Before starting:** flag each dimension as "needs discussion" or "skippable" based on Phase 1 analysis. Confirm skip list with the user.
2. Walk through each non-skipped dimension in order. For each:
   - State finding and recommendation
   - Offer concrete options (e.g., "server-side, client-side, or something else")
   - Accept free-form input beyond offered options
   - Resolve before moving to the next — do not revisit
3. After all dimensions, summarize confirmed decisions

### Phase 3: Produce the Revised Plan

**Copy-ready outputs** — format resolved dimensions as blocks the next stage can paste directly into the plan document. Use this template for each:

```
### Dimension: [name]
- Decision: [what was decided]
- Rationale: [why this choice]
- Impact: [how it affects the plan]
```

After all dimensions, produce the full revised plan summary. Must be:

- **Complete** — approach, design decisions, files, resolved dimensions, testing strategy, success criteria
- **Gap-free** — no unresolved questions or skipped branches
- **Logically sound** — straightforward control flow
- **Error strategy defined** — what can fail and how. No ad hoc patches.
- **Testable** — specific test cases; core logic testable without external systems

### General Methodology

**Gap grilling** — when comparing two sources (template vs implementation, spec vs code), test each gap against four questions:

1. Is it truly additive?
2. Does it affect output or methodology?
3. Which document owns it?
4. What's the cost/benefit?

Only act on gaps that survive the grill.

## Hand-off
- All six dimensions probed and resolved (Phase 1)
- Each dimension walked through interactively (Phase 2)
- Revised plan compiled with copy-ready blocks, quality criteria met (Phase 3)
- No file writes occurred

---

## Outputs & Triggers

### Output
Revised plan (verbal) formatted as a ready-to-copy code block.

### Exit Declaration
State clearly: "**Grill complete. Check for plan readiness? Say 'check' to trigger checking the readiness of the plan.**"

### Next Step
User invokes `check-plan-readiness` — **switch to Build mode before proceeding**.