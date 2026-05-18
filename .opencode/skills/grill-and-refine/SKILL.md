---
name: grill-and-refine
description: 'Interview relentlessly about a plan or design until reaching shared understanding, resolving each branch of the decision tree, then produce a fool-proof revised plan with no gaps. Use when user wants to stress-test a plan/design, after brainstorm-and-plan, or triggered when the user says "grill the plan", "stress-test the plan", or similar.'
---

## What I do
- Relentlessly interrogate the plan through a structured decision-tree approach
- Probe every assumption, edge case, alternative, dependency, risk, and consistency concern
- Walk through each dimension interactively — present findings as options, gather user input, resolve before moving to the next
- After all branches are resolved, produce a fool-proof revised plan with no gaps

## Boundaries (read-only phase)
- **No file writes.** Do NOT create, modify, or write any files — including plan documents, analysis notes, or code changes.
- **No implementation.** This skill only grills and refines.
- **Deep scrutiny, not broad strokes.** Every assumption, edge case, and risk is probed. This is the full examination — unlike `brainstorm-and-plan`.
- **Interactive.** Phase 2 requires user input. Do not produce a revised plan without walking through unresolved dimensions.
- **Verbal output only.** Present the revised plan as text in the conversation. Formal plan documents (`docs/PLAN_*.md`) are written later by `check-plan-readiness`.

## Pipeline Position

This skill is the second planning stage. It receives the broad-strokes plan from brainstorm and produces a fully examined revised plan.

| Input | From | Format |
|-------|------|--------|
| Initial broad-strokes plan | brainstorm-and-plan (Phase 3) | Verbal |
| Confirmed requirements | brainstorm-and-plan (Phase 1) | Verbal |

| Output | To | Format |
|--------|----|--------|
| Revised plan with resolved dimensions | check-plan-readiness | Copy-ready code blocks |
| Gap grilling results | check-plan-readiness | Verbal |

## Documents to Read

Before Phase 1 analysis, consult these docs via Grep→Read for the listed sections:

- **`ARCHITECTURE.md`** — "Project Structure", "Module Descriptions" (relevant entries), "Data Flow", "Key Design Decisions", "Import Structure", "Critical Implementation Details"
- **`SPECIFICATIONS.md`** — "Hard Constraints", "Out of Scope"

Do not read the full documents — read only the sections listed above.

## How to Grill

### Phase 1: Analyze (agent only)

**Analyze alone first** — before the user walkthrough, explore the codebase independently across all dimensions. Do not jump to interactive mode prematurely.

Start with the initial plan (from `brainstorm-and-plan` output). Explore identified files/code to gather findings for each dimension:

| Dimension | What to probe |
|-----------|--------------|
| **Assumptions** | Which assumptions does the plan make? Are they validated by code? |
| **Edge cases** | What happens with empty, null, boundary, or unexpected input? |
| **Alternatives** | Is there a simpler or safer approach? Does it introduce a new external dependency — and does the benefit clearly outweigh the maintenance cost? |
| **Dependencies** | Does this change break anything else? Are there order-dependent steps? Are dependencies injected or hardcoded? |
| **Risks** | What could go wrong? What is the blast radius of failure? Is there a defined error strategy, or will errors be handled ad hoc? Are there performance implications that might tempt future workarounds? |
| **Consistency** | Does this approach conflict with existing patterns or architecture? Is the proposed control flow straightforward — or does it give bugs places to hide? |

#### Testability Probe (embedded in Dependencies and Risks)

During the **Dependencies** dimension, probe for the five testability anti-patterns:

- **AP1: Non-determinism** — does the code path touch clocks (`datetime.now()`), RNG (`random`, `uuid`), or network calls? These make tests non-repeatable unless injected as defaulted parameters.
- **AP2: I/O mixed with logic** — does a single function fetch data AND transform it AND persist it? Splitting them enables testing each in isolation without any mocking.
- **AP3: Tight coupling / hardcoded dependencies** — does the plan require mocking 3+ collaborators to test a single unit? That's a sign the design is shallow. Flag and propose injection using the canonical defaulted-parameter pattern.
- **AP4: Shared mutable state** — does the plan introduce or rely on global/shared state that multiple tests could modify? Tests that share mutable state become order-dependent and flaky.
- **AP5: Missing seams** — are there places in the code where behavior can be substituted without modifying the code itself? If not, tests will require patching internals.

During the **Risks** dimension, probe for test fragility risks:

- **Brittle assertions** — will tests pass even when behavior changes (e.g., testing type rather than value)?
- **Test doubles confusion** — does the plan call for "mocking" when a simpler stub or fake would do? Over-mocking signals a coupling problem in the design, not a testing problem.

### Phase 2: Interactive Walkthrough (with user)

**One dimension at a time** — address dimensions sequentially. Flag skippable items upfront; resolve each before moving to the next.

1. **Before starting:** flag each dimension as "needs discussion" or "skippable" based on your Phase 1 analysis. Confirm the skip list with the user first.
2. Walk through each non-skipped dimension one by one in order. For each:
   - State your finding and recommendation clearly
   - Offer concrete options (e.g., "We could [A] handle this server-side, [B] client-side, or [C] something else")
   - Accept free-form input beyond the offered options
   - Resolve the dimension before moving to the next — do not revisit resolved items
3. After all dimensions, summarize the confirmed decisions

### Phase 3: Produce the Revised Plan

**Copy-ready outputs** — format all resolved dimensions as blocks the next stage can paste directly into the plan document.

Compile the gathered information from all resolved dimensions. Output each dimension as a copy-ready code block:

```
### Dimension: [name]
- Decision: [what was decided]
- Rationale: [why this choice]
- Impact: [how it affects the plan]
```

After all dimensions, produce the full revised plan summary. The revised plan must be:

- **Complete** — approach, design decisions, files, resolved dimensions, testing strategy, success criteria
- **Gap-free** — no unresolved questions, no skipped branches in the decision tree
- **Logically sound** — reasoning holds under scrutiny; control flow is straightforward with no convoluted paths
- **Error strategy defined** — states what can fail and how failures are handled consistently. Ad hoc error patches are not acceptable.
- **Testable** — clear testing strategy with specific test cases. Core logic testable without spinning up external systems? If not, how are dependencies injected?

Presented in a clean, copy-ready format.

### General Methodology

**Gap grilling methodology** — when comparing two sources (template vs implementation, spec vs code), test each gap against four questions:

1. Is it truly additive?
2. Does it affect output or methodology?
3. Which document owns it?
4. What's the cost/benefit?

Only act on gaps that survive the grill.

## Hand-off

Before declaring completion:
- All six dimensions probed and resolved (Phase 1)
- Each dimension walked through and resolved interactively (Phase 2)
- Revised plan compiled with copy-ready blocks and quality criteria verified (Phase 3)
- Gap grilling methodology applied where needed
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