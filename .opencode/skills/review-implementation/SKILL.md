---
name: review-implementation
description: 'Verify the completed implementation meets all success criteria — review diff, run tests, run lint, confirm intended function. Use after implement-plan, improve-architecture, or modularize-and-clean; or when the user says "review the implementation", "verify changes", "review and verify", or similar.'
---

## What I do
- Review the diff — confirm every change has a valid [FLAG] with reason
- Run all test suites — all must pass (compare test count to baseline)
- Run build + lint/typecheck — all must succeed
- Check git status — only expected files touched
- Check test quality — assertions semantically tight, non-determinism injected
- Verify against plan or evaluation list — every criterion met
- Sign off or route back to the appropriate prior skill
- Archive plan on success

## Boundaries
- **Find only, don't fix** — report failures and route backward, do not resolve here
- **Read-only and verbal** — no file writes, no fixes. Exception: rebuilding CocoIndex/Graphify indexes (auto-generated artifacts in `.cocoindex_code/` and `graphify-out/`) — not source code.
- **Independent verification** — re-run all checks from scratch, never trust the implementer's self-test

## Phase 0: Prerequisites

- [ ] Confirm which prior skill produced the diff (implement-plan, improve-architecture, or modularize-and-clean)
- [ ] Read the prior plan or evaluation list
- [ ] Load and execute `rebuild-indexes` skill — conditionally rebuilds CocoIndex and Graphify
- [ ] Run baseline tests — all must pass before review
- [ ] Apply Smart Tool Selection per task type (see AGENTS.md §Smart Tool Selection)

## Documents to Read

- **First pass** (after `implement-plan`): `docs/PLAN_*.md` + `docs/ARCHITECTURE.md` ("Import Structure", relevant module descriptions)
- **Clean-up pass** (after `modularize-and-clean`): `docs/PLAN_*.md` (success criteria) — fall back to `archive/` if already moved. Change-log is the primary target.
- **Architecture pass** (after `improve-architecture`): `improve-architecture` session output — the evaluation list is the target.

## Review Workflow

### Phase 1: Inspect Changes

**Identify the pass type first** — check which flags appear in the diff:

| Flag type | Pass | Prior skill |
|-----------|------|-------------|
| `[ADDED]` `[MODIFIED]` `[FIXED]` `[REMOVED]` `[MOVED]` | First pass | `implement-plan` |
| `[CLEANUP]` | Clean-up pass | `modularize-and-clean` |
| `[ARCH]` | Architecture pass | `improve-architecture` |

Any non-CLEANUP flag in a clean-up pass → route back to `modularize-and-clean`. Any non-ARCH flag in an architecture pass → route back to `improve-architecture`.

#### Read the Diff
Open the full diff. Verify every changed line or block carries a flag with a short reason. No unflagged changes should survive review.

#### Check Git Status
Run `git status` to list all modified, added, and deleted files. Verify only expected files were touched. Flag:
- **Orphaned files** — not referenced anywhere
- **Accidental modifications** — changed outside plan scope
- **Missing deletions** — should have been removed but still exist

### Phase 2: Verify Execution

#### Smart Tool Selection

See [AGENTS.md §Smart Tool Selection](../../../AGENTS.md#smart-tool-selection) for the full decision framework. Use these tools for review verification:

**graphify** — verify the graph reflects intended structure. Query the knowledge graph to confirm changed modules have expected connections.

**cocoindex-code** — search by intent to verify nothing semantically related was missed. Find code that _should_ have been changed but wasn't.

**ast_grep_search** — confirm zero stale occurrences of old patterns. Structural search catches what text search misses.

**grep / read** — fall back for exact-text verification and detailed file inspection.

#### Run All Tests
All must pass. On failure: list what failed and why — do not fix here.

Exact commands:
```bash
python -m pytest tests/ -v
cd frontend && npx vitest run
```

**Diff test count** — note count per suite before and after. Flag: tests removed without explanation (regression risk) or added without planned batch (scope creep). Report: *"Test count changed: [suite]: [N before] → [N after] ([+/-]N)"*

#### Test Health Audit

Beyond pass/fail, audit tests for structural health. Check for:

- **Stale file paths** — do file-existence checks in tests reference files that no longer exist? (e.g., `test_file_structure()` listing a deleted file like `requirements.txt` or relocated files)
- **Misleading comments** — do inline comments accurately describe what the test actually verifies? (e.g., "# Returns empty list" when the endpoint returns 8 default rooms)
- **Coverage gaps** — are files tested for exports in one test section but missing from the file-existence check and code-quality check in another section? (e.g., `hooks/useChatRequest.ts` tested in `test_hook_exports()` but absent from `required_files` and `test_code_quality()` lists)

Flag any findings: *"Test health: [N issues found] — stale paths, misleading comments, coverage gaps."* Route back if structural issues would cause test failures. Report only (no fix) for cosmetic issues like stale comments. The implementer resolves these.

#### Run Build
After tests pass, run the production build:
```bash
cd frontend && npm run build
```
Must succeed. On failure: list errors — do not fix here.

#### Run Lint and Typecheck
Execute all lint/typecheck commands. Must pass. On failure: list files and issues. Do not fix here.

Exact commands:
```bash
python -m py_compile <changed_file>.py
cd frontend && npx tsc --noEmit
```

Must pass. On failure: list files and issues — do not fix here.

### Phase 3: Audit & Sign Off

#### Check Test Quality

For each new or modified test:

- **Assertion strength** — verifies expected value, not just non-null? `assertEqual(result, 42)` ✅. `assertIsNotNone(result)` where 42 is expected ❌ (false positive — route back).
- **Non-determinism (AP1)** — clocks, RNG, or network injected rather than called internally?
- **Untestable I/O fusion (AP2)** — function reads external state AND contains decision logic based on that state?
- **Tight coupling (AP3)** — mocking 3+ collaborators for one unit?
- **Shared mutable state (AP4)** — global state modified by multiple tests?
- **Missing seams (AP5)** — no way to substitute behavior without patching internals?
- **Type ambiguity (AP6)** — `Any` types, untyped dicts, or missing schemas in signatures?
- **Non-idempotent writes (AP7)** — running same write twice produces different state?
- **Mutable outputs (AP8)** — function returns a list/dict the caller can accidentally mutate?
- **Mock count** — mocking 3+ collaborators for one unit? Signals shallow design. Route back.
- **Test doubles usage** — mock used where stub/fake suffices? Flag for modularize-and-clean.

#### Code Property Audit

For each new or modified file, check these 12 properties. Route back to `implement-plan` for any fail:

| Property | Pass criteria |
|----------|--------------|
| **Deep Modules** | Public surface is small; internals hidden |
| **High Cohesion** | Each module/function does one thing |
| **Referential Transparency** | Core logic is pure; I/O pushed to edges |
| **Idempotency** | Re-running same operation produces same result |
| **Strict Type Safety** | Typed dataclass/Pydantic for all data; no `Any` |
| **Dependency Injection** | External services/clocks/RNG injected as params |
| **Immutability** | Data created once, never mutated; returned copies not references |
| **Low Coupling** | Few well-defined dependencies |
| **Self-Documenting Naming** | Name reveals intent; no comments explaining what |
| **Deterministic** | Same input always produces same output |
| **Small Footprint** | Functions scannable in one screen (~40 lines max) |
| **Logging Convention** | Standard logging setup block present; bare `print()` only for CLI output/menus/structured stdout — never for operational logging |

#### Verify Against Plan or Evaluation List

Identify the pass type by prior skill, then verify against the appropriate target:

**First pass** (prior: `implement-plan`):
Read `docs/PLAN_*.md`. Check every Implementation Plan item against the code. Every planned change must be accounted for; every success criterion met. Also check: error strategy is consistent, configuration is parameterized, control flow is straightforward, and docs are in sync.

**Clean-up pass** (prior: `modularize-and-clean`):
Read the verbal change-log. Verify every `[CLEANUP]` entry was applied correctly. Confirm all approved batches applied or explicitly skipped. No behavioral changes (flags must be `[CLEANUP]` only).

**Architecture pass** (prior: `improve-architecture`):
Read the evaluation list from session context. Verify: every P0/P1 item addressed or skipped with reason, no double-paths, no orphaned references, Description headers match new locations, all flags are `[ARCH]`.

#### Sign Off or Route

All pass or any fail → see Exit Declaration below.

#### Archive Plan (on success)

Skip if plan already in `archive/`.

Ask: **"Move plan to archive? (y/n)"**

If yes:
- Scan `archive/` for the globally highest NNN number across all `PLAN_*.md` files → increment by 1 (MMM)
- Move: `docs/PLAN_<date>_<NNN>.md` → `archive/PLAN_<date>_<MMM>.md` (preserves original creation date, assigns global sequential archive number)
- Confirm: "Plan archived as `archive/PLAN_<date>_<MMM>.md`."

## Hand-off
- Phase 1: Diff reviewed, git status clean — only expected files touched
- Phase 2: All tests pass (count compared), build succeeds, lint clean
- Phase 3: Test quality verified, plan/evaluation criteria met, archive moved
- Pass → route to modularize-and-clean (first pass), improve-architecture (first pass), or update-docs (clean-up/arch pass). Fail → route back to the prior skill that produced the diff.

### Abort Paths
If interrupted mid-phase: record current state in a TODO or pending list, offer to resume at the same point when re-invoked. Do NOT commit partial work.

---

## Outputs & Triggers

### Output
Verbal verification report: pass (all items implemented, all criteria met) or fail (specific items listed for the appropriate prior skill).

### Exit Declaration

**Pass** — state clearly:
- First pass: "**All checks pass. Implementation verified. Recommended: modularize-and-clean (structural cleanup), improve-architecture (architectural review), or update-docs (skip to documentation sync). Proceed?**"
- Clean-up pass: "**All checks pass. Cleanup verified. Proceed to update-docs?**"
- Architecture pass: "**All checks pass. Architecture improvements verified. Proceed to update-docs?**"

**Fail** — state clearly: "**Review failed. [List items not met.] Route back to [prior skill: implement-plan / modularize-and-clean / improve-architecture] to resolve.**"

### Next Step

- **First pass — pass:** User invokes `modularize-and-clean` (Build mode), `improve-architecture` (Plan mode), or `update-docs` (Build mode).
- **Clean-up/Architecture pass — pass:** User invokes `update-docs`.
- **Any fail:** User invokes the prior skill that produced the diff.