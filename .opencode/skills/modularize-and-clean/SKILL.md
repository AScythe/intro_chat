---
name: modularize-and-clean
description: 'Clean and modularize code after implementation review: fix imports, extract shared code, separate concerns, rename for clarity. Adapts tests, uses [CLEANUP] flags, produces a verbal change-log (no file). Use after review-implementation passes, or triggered when user says "modularize", "clean up", or similar.'
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
- **Cross-reference implement-plan.** Shared rules for batch discipline, surgical changes, flag format, and test adaptation live in `implement-plan` — this skill documents only what differs.

## Documents to Read

- **`PROJECT_BEST_PRACTICES.md`**: §1 (Modularization Techniques), §5 (Testing), §8 (Automation & Process Design)
- **`ARCHITECTURE.md`**: "Project Structure", "Import Structure", relevant module descriptions

## Modularization and Cleanup Workflow

### Phase 1: Analyze (read-only)

#### 1. Understand Existing Tests
Read the test suite to learn import paths and test structure — test imports will be adapted during cleanup.

#### 2. Scan Codebase for Candidates
Examine source files across six scopes:

- **Import structure** — circular/sibling-to-sibling imports. Restructure to leaf-module pattern.
- **Shared code (DRY)** — duplicated logic across files. Extract into shared utilities.
- **Mixed concerns** — config+logic, UI+API, persistence+business. Separate into dedicated modules.
- **Naming clarity** — unclear names. Rename to be self-documenting.
- **Large files (>~200 lines)** — evaluate for clean seams. Split only if distinct component functionalities exist.
- **Dead code** — unused exports, orphaned files, unreachable code. Collect evidence (zero imports/references). Do NOT remove without user approval.

Prefer extractions that improve testability — separate pure logic from I/O, isolate stateful code from stateless helpers. A structural change that makes modules harder to test is not an improvement.

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

**Conflict resolution:** When multiple candidates touch the same file:
1. Sort by dependency order (shared code before consumers)
2. If ordering isn't possible, present the conflict with line ranges and a recommendation
3. Do NOT silently apply conflicting batches in sequence

#### Per-Batch Workflow

For each approved candidate, in order:

1. **Apply the structural change**
   - Move functions, split files, rename symbols, fix imports
   - Do NOT change any behavior or logic
   - When moving/renaming files: preserve and update the Description: header. Never delete it.
   - Remove imports/variables/functions your changes made unused

2. **Flag every changed line with `[CLEANUP]`**
   ```
   [CLEANUP]: short_reason — what changed
   ```
   Every line must carry `[CLEANUP]` — zero non-CLEANUP flags allowed.

3. **Write coverage tests for new modules** (only if extraction created a new file)
   - Verify extracted logic works independently
   - Match existing test conventions
   - NOT TDD — covers already-working behavior
   - Add docstring to extracted shared utilities (purpose, parameters, return)
   - Save permanently in `tests/` — never delete after batch passes

4. **Adapt existing test references**
   - Update import paths, function names, and references to match new source structure
   - Do NOT change test logic, assertions, or test names
   - Update every occurrence in the same batch — imports, calls, mocks

5. **Run full test suite**
   - All tests must pass. Compare to baseline counts. Flag count changes.
   - On failure: import path issue → fix and re-run. Any other cause → revert batch, flag as unsafe, move to next.
   - **Failure triage:** See "Failure Triage" in `AGENTS.md`. Never silently revert.

6. **Proceed to next batch**

#### Change-Log (verbal, no file)

After ALL batches, produce a verbal markdown change-log grouped by scope with `[CLEANUP]` `[file:line]` entries. Include sections for coverage tests added and unsafe candidates skipped. Do NOT write the change-log to a file — present it as text output only.

## Hand-off
- Phase 1: All 6 scopes scanned, candidate list compiled
- Gate: User approved (or selected specific items)
- Phase 2: Approved batches applied or explicitly skipped (with reason)
- Every changed line carries `[CLEANUP]` — zero non-CLEANUP flags
- Full test suite and lint pass. Coverage tests written for new modules.
- Verbal change-log produced

---

## Outputs & Triggers

### Output
Structural changes with `[CLEANUP]` flags. Updated test imports. Coverage tests for new modules. Verbal change-log (no file).

### Exit Declaration
State clearly: "**Cleanup complete. Verbal change-log above. Review the changes? Say 'review' to trigger review of the changes.**"

### Next Step
User invokes `review-implementation` (clean-up pass) — switch to Plan mode before proceeding.