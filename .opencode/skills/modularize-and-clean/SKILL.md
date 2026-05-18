---
name: modularize-and-clean
description: 'Clean and modularize code after implementation review: fix imports, extract shared code, separate concerns, rename for clarity. Adapts tests, uses [CLEANUP] flags, produces a verbal change-log (no file). Routes back to review-implementation. Trigger after review-implementation passes, or when user says "modularize", "clean up", or similar.'
---

## What I do
- Scan codebase for structural issues across 6 scopes (imports, DRY, mixed concerns, naming, large files, dead code)
- Compile candidates with file:line references and recommendations
- Present candidates for user approval — never apply without sign-off
- Apply approved changes batch-by-batch with `[CLEANUP]` flags
- Write coverage tests for new modules, adapt existing test references
- Produce verbal change-log (no file)
- Route back to review-implementation for clean-up pass

## Boundaries
- **Phase 1 is strictly read-only.** No file writes during analysis.
- **Structural changes only.** No behavior changes, no bug fixes, no new features.
- **Dead code requires user approval.** Never remove without explicit confirmation and evidence.
- **Coverage tests required.** When extraction creates a new module, write coverage tests that verify the extracted logic works independently.

## Pipeline Position

This skill runs after a successful first-pass review. It routes back to review-implementation for a clean-up pass.

| Input | From | Format |
|-------|------|--------|
| Approved, implemented code | review-implementation (first pass) | Source + tests |
| Plan file (success criteria) | `docs/PLAN_*.md` | Read-only reference |

| Output | To | Format |
|--------|----|--------|
| Structural changes with `[CLEANUP]` flags | review-implementation (clean-up pass) | Source + tests |
| Verbal change-log | review-implementation (clean-up pass) | Text output |

## Documents to Read

Read specific sections via Grep→Read (grep heading line number, Read with offset/limit):

- **`PROJECT_BEST_PRACTICES.md`**: §1 (Modularization Techniques), §5 (Testing), §8 (Automation & Process Design)
- **`ARCHITECTURE.md`**: "Project Structure", "Import Structure", relevant module descriptions

## Workflow

### Phase 1: Analyze (read-only)

Scan the codebase for structural issues. Do NOT write any files during this phase.

#### 1. Understand Existing Tests
Read the test suite to learn import paths and test structure — test imports will be adapted during cleanup.

#### 2. Scan Codebase for Candidates
Examine source files across six scopes using grep, glob, read:

- **Import structure** — find circular/sibling-to-sibling imports and leaf-module violations. Restructure to leaf-module pattern (leafs export, internal modules import from leafs).
- **Shared code (DRY)** — find duplicated logic across files. Extract into shared utility modules.
- **Mixed concerns** — find files mixing config+logic, UI+API, persistence+business. Separate into dedicated modules.
- **Naming clarity** — find unclear file/function/variable names. Rename to be self-documenting.
- **Large files (>~200 lines)** — evaluate for clean seams. Only propose split if logic separates into distinct component functionalities. If single-purpose, leave as-is.
- **Dead code** — find unused exports, orphaned files, and unreachable code. For each finding, collect evidence (grep showing zero imports/references), flag, and assign a recommendation. Do NOT remove without user approval.

When evaluating candidates, prefer extractions that improve testability — separate pure logic from I/O, isolate stateful code from stateless helpers. A structural change that makes modules harder to test is not an improvement.

#### 3. Compile Candidate List

Present findings categorized by scope with file:line references and proposed changes.

For dead code items, use this format:
```
[DEAD] <file:line> — <symbol> — <evidence> → Recommend: <Remove / Keep / Archive>
```

Recommendation guide:

| Category | Default Recommendation |
|----------|----------------------|
| Unused export (zero imports across codebase) | Remove — safe, confirmed dead |
| Entire unused file (zero imports anywhere) | Remove or Archive (move to `_archive/`) |
| Type-only export (no runtime effect) | Remove — no risk |
| Public API export (could be used externally) | Keep — flag but don't remove without explicit confirmation |
| Orphaned test file | Remove — test for something that no longer exists |

### Gate: User Approval

Present the candidate list and ask: **"Shall I proceed with these changes?"**

The user may approve all, select specific items, reject all (exit), or request modifications. Do NOT proceed to Phase 2 without explicit approval.

### Phase 2: Apply (batch-by-batch)

> **Before applying:** run full test suite + lint. All must pass. Flag pre-existing failures — do not proceed until baseline is clean.
> This skill extracts EXISTING logic (coverage tests are written after). Feature-time extraction belongs in `implement-plan`.

#### Batching Rules

Each batch = one logical structural change. Do NOT mix unrelated changes.

Valid batch examples:
- ✅ Fix circular import chain + adapt tests
- ✅ Extract shared utility + coverage tests + update callers
- ✅ Separate mixed concerns into dedicated modules
- ✅ Rename file + update all imports
- ✅ Split large module (if clean seams exist)
- ✅ Remove dead code / orphaned files (user-approved only)

**Conflict resolution:** When multiple approved candidates touch the same file:
1. Sort by dependency order (extract shared code before renaming consumers)
2. If ordering isn't possible (two candidates modify the same lines), present the conflict to the user: `[file:line-range]` — candidate A + candidate B both modify this section → Recommend: merge into one batch, or apply one and skip the other
3. Do NOT silently apply conflicting batches in sequence

#### Per-Batch Workflow

For each approved candidate, in order:

1. **Apply the structural change**
   - Move functions, split files, rename symbols, fix imports
   - Do NOT change any behavior or logic
   - When moving or renaming files: preserve and update the file-level description comment to match the new path and responsibility (`# Description:` / `// Description:` / `/* Description: */`). Never delete it.
   - Remove imports, variables, or functions your changes made unused
   - Pre-existing dead code must have user approval before removal

2. **Flag every changed line with `[CLEANUP]`**
   ```
   [CLEANUP]: short_reason — what changed
   ```
   Every line must carry `[CLEANUP]` — zero non-CLEANUP flags allowed.

3. **Write coverage tests for new modules** (only if extraction created a new file)
   - Coverage tests verify the extracted logic works independently
   - Match existing test conventions (framework, naming, file location)
   - These are NOT TDD tests — they cover already-working behavior
   - When extracting a function into a shared utility, add a docstring describing its purpose, parameters, and return value
   - Coverage tests are saved permanently in `tests/` — never delete them after the batch passes

4. **Adapt existing test references**
   - Update import paths, function names, and any references in test files to match the new source structure
   - Do NOT change test logic, assertions, or test names
   - Update every occurrence in the same batch — imports, calls, mocks

5. **Run full test suite**
   - All tests must pass. Compare to baseline counts. Flag and explain any count changes.
   - On failure:
     - Import path issue → fix and re-run
     - Any other cause → revert the entire batch, flag the candidate as unsafe in the change-log, move to next batch
   - **Failure triage:** See "Failure Triage" table in `AGENTS.md`. Never silently revert.

6. **Proceed to next batch**

#### Change-Log (verbal, no file)

After ALL batches, produce a verbal markdown change-log grouped by scope with `[CLEANUP]` `[file:line]` entries. Include sections for coverage tests added and unsafe candidates skipped. Do NOT write the change-log to a file — present it as text output only.

## Hand-off

Before declaring completion:
- Phase 1: All 6 scopes scanned, candidate list compiled
- Gate: User approved (or selected specific items)
- Phase 2: All approved batches applied or explicitly skipped (with reason)
- Every changed line carries `[CLEANUP]` — zero non-CLEANUP flags
- Full test suite and lint pass with same or documented test count change
- Coverage tests written for new modules
- Verbal change-log produced

---

## Outputs & Triggers

### Output
Structural changes with `[CLEANUP]` flags. Updated test imports. Coverage tests for new modules. Verbal change-log (no file).

### Exit Declaration
State clearly: "**Cleanup complete. Verbal change-log above. Review the changes?**"

### Next Step
User invokes `review-implementation` (clean-up pass) — switch to Plan mode before proceeding.