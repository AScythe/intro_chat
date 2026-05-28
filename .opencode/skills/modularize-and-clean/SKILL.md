---
name: modularize-and-clean
description: 'Scan code-level quality — DRY violations, mixed concerns, naming, large files, dead code, type safety, idempotency, immutability, deep modules, and referential transparency — then apply cleanup in batches with [CLEANUP] flags. Use after review-implementation passes, or triggered when user says "modularize", "clean up", "refactor", "code quality", "restructure", or similar.'
---

## What I do
- Scan codebase for code-level issues across 11 scopes (imports, DRY, mixed concerns, naming, large files, dead code, deep modules, type safety, idempotency, immutability, referential transparency)
- Compile candidates with file:line references
- Present for user approval — never apply without sign-off
- Apply changes batch-by-batch with [CLEANUP] flags
- Write coverage tests for new modules, adapt test references
- Produce verbal change-log
- Route back to review-implementation

## Boundaries
- **Phase 1 is strictly read-only.**
- **Structural changes only.** No behavior changes, bug fixes, or new features.
- **Dead code requires user approval.** Evidence (zero imports/references) required.
- **Coverage tests required.** When extraction creates a new module.
- **Self-contained workflow.** Batch discipline, flag format, and test adaptation rules are documented below in the per-batch workflow.

## Phase 0: Prerequisites

- [ ] Read the review pass findings (from review-implementation)
- [ ] Run baseline tests — all must pass
- [ ] Apply Smart Tool Selection per task type (see AGENTS.md §Smart Tool Selection)
- [ ] Read ARCHITECTURE.md for current documented structure

## Documents to Read

- **`docs/ARCHITECTURE.md`**: "Project Structure", "Import Structure", relevant module descriptions
- **Source files** — read files identified during scanning to confirm structural issues before reporting

## Modularization and Cleanup Workflow

### Phase 1: Analyze (read-only)

First, read the test suite — imports will be adapted during cleanup.

Apply Smart Tool Selection (see [AGENTS.md §Smart Tool Selection](../../../AGENTS.md#smart-tool-selection)). Use **graphify** community detection to identify strongly-connected components — same communities stay together, different communities are extraction candidates. Query `graphify path "A" "B"` to assess coupling before splitting. Use **ast_grep_search** for DRY analysis and **ast_grep_replace** with `dryRun: true` for rename preview. Use **cocoindex-code** to find related functions with different naming conventions.

Then examine source files across 11 scopes:

- **Import structure** — circular/sibling-to-sibling imports
- **Shared code (DRY)** — duplicated logic across files
- **Mixed concerns** — config+logic, UI+API, persistence+business in the same file
- **Naming clarity** — unclear function/variable names
- **Large files (>~200 lines)** — clean seams for splitting
- **Dead code** — unused exports, orphaned files, unreachable code
- **Deep modules** — bloated public interfaces exposing implementation details
- **Type safety** — raw dicts, `Any`/`any` types, untyped signatures
- **Idempotency** — operations that change state differently on re-run
- **Immutability** — mutable defaults, shared mutable state, internal collections returned directly
- **Referential transparency** — I/O mixed with business logic, hidden state reads

Prefer extractions that improve testability — separate pure logic from I/O. Follow the leaf module pattern (leafs export only, never import internal). Separate by layer (config → state → logic → persistence). Split triggers: >200 lines, mixed concerns, or circular imports.

#### 3. Compile Candidate List

Present findings categorized by scope with file:line references and proposed changes.

For dead code items, use this format:
```
[DEAD] <file:line> — <symbol> — <evidence> → Recommend: <Remove / Keep / Archive>
```

Recommendation guide:

| Category | Default Recommendation |
|----------|----------------------|
| Unused export (zero imports) | Remove |
| Entire unused file (zero imports) | Remove or Archive |
| Type-only export | Remove |
| Public API export | Keep — needs user confirmation |
| Orphaned test file | Remove |

### Gate: User Approval

Present the candidate list and ask: **"Shall I proceed with these changes?"**

Wait for explicit approval before Phase 2.

### Phase 2: Apply (batch-by-batch)

> **Before applying:** run full test suite + lint. Flag pre-existing failures.

#### Batching Rules

Each batch = one logical structural change. Do NOT mix unrelated changes.

Valid batch examples:
- ✅ Fix circular import chain + adapt tests
- ✅ Extract shared utility + coverage tests + update callers
- ✅ Separate mixed concerns into dedicated modules
- ✅ Rename file + update all imports

**Conflict resolution:** When multiple candidates touch the same file, sort by dependency order. If ordering isn't possible, present the conflict with line ranges and a recommendation. Do NOT silently apply conflicting batches in sequence.

#### Per-Batch Workflow

For each approved candidate, in order:

1. **Apply the structural change**
   - Move functions, split files, rename symbols, fix imports
   - Do NOT change any behavior or logic
   - When moving/renaming files: preserve and update the Description: header. Never delete it.
   - Remove imports/variables/functions your changes made unused
   - Apply changes one logical unit at a time within each file

2. **Flag every changed line with `[CLEANUP]`**

3. **Write coverage tests for new modules** (only if extraction created a new file)
   - Verify extracted logic works independently
   - Match existing test conventions (NOT TDD — covers already-working behavior)
   - Add docstring to extracted shared utilities
   - Tests are permanent regression tests — never delete after batch passes

4. **Adapt existing test references**
   - Update import paths, function names, and references to match new source structure
   - Do NOT change test logic, assertions, or test names
   - Update every occurrence in the same batch — imports, calls, mocks

5. **Run full test suite** — all must pass. On failure: import path issue → fix and re-run. Any other cause → revert batch, skip, move to next.

6. **Proceed to next batch**

#### Change-Log (verbal)

After all batches, produce a verbal markdown change-log grouped by scope with `[CLEANUP]` `[file:line]` entries — coverage tests added and unsafe candidates skipped.

## Hand-off
- Phase 1: All 11 scopes scanned, candidate list compiled
- Gate: User approved
- Phase 2: Approved batches applied or explicitly skipped
- All changed lines carry [CLEANUP]
- Full test suite and lint pass
- Verbal change-log produced

### Abort Paths
If interrupted mid-phase: record current state in a TODO or pending list, offer to resume at the same point when re-invoked. Do NOT commit partial work.

---

## Outputs & Triggers

### Output
Structural changes with [CLEANUP] flags. Updated test imports. Coverage tests for new modules. Verbal change-log.

### Exit Declaration
State clearly: "**Cleanup complete. Verbal change-log above. Review the changes? Say 'review' to trigger review of the changes.**"

### Next Step
User invokes `review-implementation` (clean-up pass) — switch to Plan mode before proceeding.