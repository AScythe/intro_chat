---
name: modularize-and-clean
mode: build
description: '[Build mode — modifies source code] Clean and modularize code after implementation review: fix imports, extract shared code, separate concerns, rename for clarity. Adapts tests, uses [CLEANUP] flags, produces a change-log. Routes back to review-implementation. Trigger after review-implementation passes, or when user says "modularize", "clean up", or similar.'
---

## What I do
- **Phase 1: Analyze (read-only)** — scan codebase for import issues, shared code, mixed concerns, naming problems, and large-file split opportunities
- **Gate: User Approval** — present candidates categorized by scope; user approves, rejects, or selects specific items
- **Baseline Check** — verify full test suite and lint pass before any changes; flag pre-existing failures
- **Phase 2: Apply (batch-by-batch)** — apply approved changes in logical batches, flagging every change with `[CLEANUP]`, adapting test imports, writing coverage tests for new modules, and verifying all tests pass per batch
- **Hand-off** — produce a change-log and route to `review-implementation` for re-verification

## Documents to Read

Read specific sections via Grep→Read (grep heading line number, Read with offset/limit):

- **`PROJECT_BEST_PRACTICES.md`**: Section 1 (Modularization Techniques), Section 5 (Testing), Section 8 (Automation & Process Design)

---

## Phase 1: Analyze (read-only)

Scan the codebase for structural issues — imports, shared code, mixed concerns, naming, large files — and compile candidates for cleanup. Do NOT write any files during this phase.

### 1. Understand Existing Tests
Read the test suite to learn import paths and test structure — test imports will be adapted during cleanup.

### 2. Scan Codebase for Candidates
Examine source files across five scopes using grep, glob, read — no external tools needed.

- **Import structure**: find circular/sibling-to-sibling imports and leaf-module violations. Restructure to leaf-module pattern (leafs export, internal modules import from leafs).
- **Shared code (DRY)**: find duplicated logic across files. Extract into shared utility modules.
- **Mixed concerns**: find files mixing config+logic, UI+API, persistence+business. Separate into dedicated modules.
- **Naming clarity**: find unclear file/function/variable names. Rename to be self-documenting.
- **Large files (>~200 lines)**: evaluate for clean seams — only propose split if logic separates into distinct component functionalities. If single-purpose, leave as-is.

### 3. Compile Candidate List

Present findings categorized by scope with file:line references and proposed changes.

---

## Gate: User Approval

Present the candidate list and ask: **"Shall I proceed with these changes?"**

The user may approve all, select specific items, reject all (exit), or request modifications. Do NOT proceed to Phase 2 without explicit approval.

---

## Phase 2: Apply Changes (batch-by-batch)

> **Before applying**: run full test suite + lint. All must pass. Flag pre-existing failures — do not proceed until baseline is clean.
> This skill extracts EXISTING logic (coverage tests are written after). Feature-time extraction belongs in `implement-plan`.

### Batching Rules
Each batch = one logical structural change. Do NOT mix unrelated changes.
- ✅ Fix circular import chain + adapt tests
- ✅ Extract shared utility + coverage tests + update callers
- ✅ Separate mixed concerns into dedicated modules
- ✅ Rename file + update all imports
- ✅ Split large module (if clean seams exist)

### Per-Batch Workflow

For each approved candidate, in order:

1. **Apply the structural change**
   - Move functions, split files, rename symbols, fix imports
   - Do NOT change any behavior or logic
   - When moving or renaming files: preserve and update the file-level `# Description:` comment to match the new path and responsibility. Never delete it.
   - Remove imports, variables, or functions that your changes made unused. Do NOT remove pre-existing dead code.

2. **Flag every changed line with `[CLEANUP]`**
   - Format: `[CLEANUP]: short_reason — what changed`
   - Example: `[CLEANUP]: extract fetchJSON — moved from room.js to api-utils.js`
   - Every line must carry `[CLEANUP]` — zero non-CLEANUP flags allowed

3. **Write coverage tests for new modules** (only if extraction created a new file)
   - Coverage tests verify the extracted logic works independently
   - Match existing test conventions (framework, naming, file location)
   - These are NOT TDD tests — they cover already-working behavior
   - When extracting a function into a shared utility, add a docstring describing its purpose, parameters, and return value
   - Coverage tests are saved permanently in `tests/` — they become part of the regression suite. Never delete them after the batch passes.

4. **Adapt existing test imports**
   - Update import paths in test files to match new file structure
   - Do NOT change test logic, assertions, or test names
   - If a test file references a moved function, update the import only

5. **Run full test suite**
   - All tests must pass
   - On failure:
     - If caused by import path issue → fix and re-run
     - If caused by any other change → **revert the entire batch**, flag the candidate as unsafe in the change-log, move to next batch

6. **Proceed to next batch**

### Change-Log

After ALL batches, produce a markdown change-log grouped by scope with `[CLEANUP]` [file:line] entries. Include sections for coverage tests added and unsafe candidates skipped. Present it at hand-off.

---

## Hand-off

Before declaring completion: all approved batches applied, all flags are `[CLEANUP]`, full test suite + lint passes, coverage tests written for new modules, no changes beyond scope, change-log produced, unsafe candidates documented.

State clearly: **"Cleanup complete. [N] changes in [M] batches. Change-log available. Review the changes?"**

---

## Outputs & Triggers

### Output
Structural changes with `[CLEANUP]` flags. Updated test imports. Coverage tests for new modules. Change-log.

### Exit Declaration
State clearly: "**Cleanup complete. [N] changes in [M] batches. Change-log available. Review the changes?**"

### Next Step
User invokes `review-implementation` (second pass) — **switch to Plan mode before proceeding**.
