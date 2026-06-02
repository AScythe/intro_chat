---
name: grill-and-refine
description: 'Interview relentlessly about a plan or design until reaching shared understanding, resolving each branch of the decision tree, then produce a fool-proof revised plan with no gaps. Use when user wants to stress-test a plan/design, after brainstorm-and-plan, or triggered when the user says "grill the plan", "stress-test the plan", "interrogate the plan", or similar.'
---

## What I do
- Interrogate the plan across all seven dimensions (assumptions, edge cases, alternatives, dependencies, risks, consistency, code discovery)
- Walk through each dimension interactively — present findings as options, gather input, resolve before moving on
- After all branches resolved, produce a fool-proof revised plan with no gaps

## Boundaries (read-only phase)
- **No file writes** — including plans, analysis notes, or code changes.
- **No implementation** — grill and refine only.
- **Deep scrutiny** — full examination of every edge case and risk. Unlike `brainstorm-and-plan`.
- **Interactive** — Phase 2 requires user input. Do not produce revised plan without walking through unresolved dimensions.
- **Verbal output only** — formal plan documents written by `check-plan-readiness`.

## Phase 0: Prerequisites

- [ ] Read the upstream plan (from brainstorm-and-plan) — all sections
- [ ] Verify the plan has all required sections (approach, files, testing, success criteria)
- [ ] Run baseline tests — all must pass
- [ ] Apply Codebase Exploration per task type (see AGENTS.md §Codebase Exploration)
- [ ] Read ARCHITECTURE.md, SPECIFICATIONS.md, relevant source files

## Documents to Read

- **`docs/ARCHITECTURE.md`** — "Project Structure", "Module Descriptions" (relevant), "Data Flow", "Key Design Decisions", "Import Structure", "Critical Implementation Details"
- **`SPECIFICATIONS.md`** — "Hard Constraints", "Out of Scope"

## How to Grill

### Phase 1: Analyze (agent only)

**Analyze alone first** — explore the codebase independently before the user walkthrough.

Start with the initial plan (from `brainstorm-and-plan` output). Explore identified files/code for each dimension:

Use Codebase Exploration to verify the plan's coverage completeness across all dimensions (see [AGENTS.md §Codebase Exploration](../../../AGENTS.md)). For complex plans, run the pipeline (graphify→cocoindex→ast-grep) first to discover scope before grilling individual dimensions:

**graphify** — query the knowledge graph for concepts, communities, and connections across the entire codebase. Use `graphify query "..."` for broad context, `graphify path "X" "Y"` for blast radius between modules.

**cocoindex-code** — search by natural language intent to find functions even when key terms don't match the plan. Verify the plan mentions all relevant code paths.

**ast_grep_search** — understand structural patterns (e.g. all `try/except` blocks, all calls to a deprecated function) to validate the plan's assumptions about code structure.

**grep / read** — fall back to exact-text search and file reading for details uncovered by the tools above.

**Gap grilling** — when comparing two sources (template vs implementation, spec vs code), test each gap against four questions:

1. Is it truly additive?
2. Does it affect output or methodology?
3. Which document owns it?
4. What's the cost/benefit?

Only act on gaps that survive the grill.

| Dimension | What to probe |
|-----------|--------------|
| **Assumptions** | Validated by code? |
| **Edge cases** | Empty, null, boundary, or unexpected input? |
| **Alternatives** | Simpler or safer approach? New dependency worth the cost? |
| **Dependencies** | Breaks anything? Order-dependent? Injected or hardcoded? |
| **Risks** | Blast radius? Error strategy defined? Performance implications? |
| **Consistency** | Conflicts with existing patterns? Straightforward control flow? |
| **Code Discovery** | Plan missed related concepts? `graphify path "X" "Y"` for blast radius between planned and missed modules. |

#### Testability Probe

During **Dependencies**, probe for eight anti-patterns:

- **AP1: Non-determinism** — clocks, RNG, or network calls make tests non-repeatable?
- **AP2: Untestable I/O fusion** — a function that reads external state AND contains decision logic based on that state?
- **AP3: Tight coupling** — mocking 3+ collaborators to test one unit?
- **AP4: Shared mutable state** — global state modified by multiple tests causes order-dependent flaky tests?
- **AP5: Missing seams** — no place to substitute behavior without patching internals?
- **AP6: Type ambiguity** — `Any`/`any` types, untyped dicts, or missing schemas in function signatures?
- **AP7: Non-idempotent writes** — running the same write operation twice produces different state?
- **AP8: Mutable outputs** — function returns a list/dict the caller can accidentally mutate?

During **Risks**, probe for test fragility:

- **Brittle assertions** — testing type rather than value?
- **Test doubles confusion** — mocking when a stub or fake would do?

### Phase 2: Interactive Walkthrough (with user)

Follow the User Interaction Pattern in AGENTS.md — use the `question` tool with clickable selectable options for every user decision point. Provide `options` with `label` and `description` fields. Never use raw text prompts or unformatted "y/n" questions. Present one decision-point at a time, resolve, then present the next.

1. **Before starting:** identify which dimensions need discussion and which are skippable (obvious, no decisions needed). Skip skippable ones silently.
2. Walk through each non-skipped dimension in order. For each:
   - State ONE finding and recommendation at a time
   - Use the `question` tool with concrete options (e.g., "server-side, client-side, or something else")
   - Rely on the auto-added "Type your own answer" for free-form input beyond offered options
   - Resolve before moving to the next item within this dimension — do not revisit
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
- **Error strategy defined** — what can fail and how
- **Testable** — specific test cases; core logic testable without external systems

## Hand-off
- All seven dimensions probed and resolved (Phase 1)
- Each dimension walked through interactively (Phase 2)
- Revised plan compiled with copy-ready blocks, quality criteria met (Phase 3)
- No file writes occurred

---

## Outputs & Triggers

### Output
Revised plan (verbal) formatted as a ready-to-copy code block.

### Exit Declaration
State clearly: "**Grill complete. Check for plan readiness? Say 'check' to trigger checking the readiness of the plan. Remember to switch to Build mode**"

### Next Step
User invokes `check-plan-readiness` — **switch to Build mode before proceeding**.