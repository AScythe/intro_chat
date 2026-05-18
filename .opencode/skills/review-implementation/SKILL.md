---
name: review-implementation
description: 'Verify the completed implementation meets all success criteria — review diff, run tests, run lint, confirm intended function. Trigger after implement-plan, improve-architecture, or modularize-and-clean, or when the user says "review the implementation", "verify changes", "review and verify", or similar.'
---

## What I do
- Review the diff — confirm every change has a valid [FLAG] with reason
- Run all test suites — all must pass (compare test count to baseline)
- Run build — production build must succeed
- Run lint/typecheck — all must pass
- Check git status — only expected files touched
- Check test quality — assertions semantically tight, non-determinism injected
- Verify against plan or evaluation list — every criterion met
- Sign off or route back to the appropriate prior skill
- Archive plan on success

## Boundaries
- **Find only, don't fix.** Review and fix are separate stages. Report failures clearly and route backward — do not resolve them here.
- **Read-only and verbal.** No file writes. No fixes.
- **Independent verification.** Re-run all checks from scratch — never trust the implementer's self-test.

## Pipeline Position

This skill is the fifth stage — a branching review point that receives from three upstream skills.

| Input | From | Format |
|-------|------|--------|
| Code changes with [FLAG] annotations | implement-plan | Source + tests |
| OR: Cleanup diff with [CLEANUP] flags | modularize-and-clean | Source + tests |
| OR: Architecture diff with [ARCH] flags | improve-architecture | Source + tests |

| Output | To | Format |
|--------|----|--------|
| Pass → forward | modularize-and-clean, improve-architecture, or update-docs | Verbal report |
| Fail → route back | The prior skill that produced the diff | Failure list |

## Documents to Read

Read via Grep→Read (grep heading line number, Read with offset/limit):

- **First pass** (after `implement-plan`): `docs/PLAN_*.md` (relevant plan) + `ARCHITECTURE.md` ("Import Structure", relevant module descriptions)
- **Clean-up pass** (after `modularize-and-clean`): `docs/PLAN_*.md` (success criteria only) — fall back to `archive/` if the plan was already moved after the first pass. Change-log from `modularize-and-clean` is the primary verification target.
- **Architecture pass** (after `improve-architecture`): `improve-architecture` output from session context — the evaluation list is the verification target

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
Run `git status` (or equivalent for untracked directories) to list all modified, added, and deleted files. Verify only expected files were touched. Flag any unexpected files:
- **Orphaned files** — new files that aren't referenced anywhere
- **Accidental modifications** — files changed outside the plan scope
- **Missing deletions** — files that should have been removed but still exist

### Phase 2: Verify Execution

#### Run All Tests
Execute every test suite. All must pass. On failure: list what failed and why — do not fix here.

Exact commands:
```bash
uv run python tests/test_app.py
uv run python tests/test_js_modules.py
cd frontend && npx vitest run
```

**Diff test count**: Before running, note the test count from each suite. After running, compare. Flag unexpected changes:
- Tests removed without explanation (behavioral regression risk)
- Tests added without a planned batch (scope creep)
- Report: *"Test count changed: [suite]: [N before] → [N after] ([+/-]N)"*

#### Run Build
After tests pass, run the production build:
```bash
cd frontend && npm run build
```
Must succeed. On failure: list errors — do not fix here.

#### Run Lint and Typecheck
Execute all lint/typecheck commands. Must pass. On failure: list files and issues.

Exact commands:
```bash
cd frontend && npx tsc --noEmit
```
Must pass. On failure: list files and issues — do not fix here.

### Phase 3: Audit & Sign Off

#### Check Test Quality
**A passing test suite is not enough — verify the assertions are meaningful.**

For each new or modified test in the diff, check:

- **Assertion strength** — does the assertion verify the actual expected value/shape/side-effect, or just that something non-null was returned? `assertEqual(result, 42)` passes this check. `assertIsNotNone(result)` where 42 is expected does not.
- **Non-determinism** — are clocks, RNG, or network calls injected rather than called internally? A test that calls `datetime.now()` internally will pass today and fail tomorrow.
- **Mock count** — does the test mock 3+ collaborators to test a single unit? This signals a shallow module design that leaked into the test. Flag it — route back to `implement-plan` if the design needs correction, or `modularize-and-clean` if it's structural.
- **Test doubles usage** — is a mock used where a stub or fake would suffice? Over-mocking verifies *how* code works rather than *what* it produces. Flag but do not fail the review — note it for `modularize-and-clean`.

A test that passes with weak assertions is a false positive. Treat it as a failure and route back to `implement-plan` to tighten the assertions.

#### Verify Against Plan or Evaluation List

Identify which pass this is by the prior skill, then verify against the appropriate target:

**First pass** (prior: `implement-plan`):
Read `docs/PLAN_*.md`. Check every item in the Implementation Plan against the actual code. Every planned change must be accounted for. Every success criterion must be met. If any planned item is missing or incomplete, it's a failure.

Also check:
- **Error strategy** — are error paths handled per a stated strategy, not ad hoc patches?
- **No hardcoded values** — are configuration-like values parameterized rather than embedded?
- **Control flow** — no tangled logic, nested conditions hiding bugs, or multiple returns where a single clear path exists
- **No unprincipled optimizations** — no clever-but-brittle performance hacks that aren't justified by a measured need
- **Docs updated** — are relevant docs in sync with the changes?

**Clean-up pass** (prior: `modularize-and-clean`):
Read the verbal change-log produced by `modularize-and-clean`. Verify every `[CLEANUP]` entry was applied correctly. Confirm all approved batches are either applied or explicitly skipped with a reason. Check that no behavioral changes snuck in (flags must be `[CLEANUP]` only).

**Architecture pass** (prior: `improve-architecture`):
Read the evaluation list from `improve-architecture` session context. Verify:
- Every P0/P1 item is either addressed in the diff or explicitly skipped with a reason
- No double-paths — if files were moved, old path is removed (not left as ghost). Run `git status` to confirm no old files show as "deleted" alongside new "untracked" for the same content.
- No orphaned references — imports, route mounts, static mounts, and config referencing old locations are updated
- Description headers — moved or created files have correct `Description:` headers matching new location
- Flag consistency — all flags are `[ARCH]` with valid reasons

For non-testable changes (config, rename): confirm the intended effect directly.

#### Sign Off or Route

**All pass — first pass** → see Exit Declarations below
**All pass — clean-up pass** → see Exit Declarations below
**All pass — architecture pass** → see Exit Declarations below
**Any fail** → see Exit Declarations below

#### Archive Plan (on success)

Run this only after confirming a pass. If the plan is already in `archive/`, skip entirely.

Ask the user: **"Move plan to archive? (y/n)"**

If yes:
- Scan `archive/` for the highest existing `PLAN_*` number → increment by 1 for the new filename
- Read `docs/PLAN_xxx.md`, update the internal `# PLAN_...` header to match the new archive filename
- Move the file: `docs/PLAN_xxx.md` → `archive/PLAN_yyy.md`
- Confirm the move: "Plan archived as `archive/PLAN_yyy.md`."

## Hand-off

Before declaring completion:
- Phase 1: Diff reviewed, git status clean — only expected files touched
- Phase 2: All tests pass (count compared to baseline), build succeeds, lint clean
- Phase 3: Test quality verified, plan/evaluation criteria met, archive moved
- Route declared to next skill

---

## Outputs & Triggers

### Output
Verbal verification report: pass (all items implemented, all criteria met) or fail (specific items listed for the appropriate prior skill).

### Exit Declaration

**First pass (after `implement-plan`) — pass:**
State clearly: "**All checks pass. Implementation verified. Recommended: modularize-and-clean (structural cleanup), improve-architecture (architectural review), or update-docs (skip to documentation sync). Proceed?**"

**Clean-up pass (after `modularize-and-clean`) — pass:**
State clearly: "**All checks pass. Cleanup verified. Proceed to update-docs?**"

**Architecture pass (after `improve-architecture`) — pass:**
State clearly: "**All checks pass. Architecture improvements verified. Proceed to update-docs?**"

**Any pass — fail:**
State clearly: "**Review failed. [List specific items not met.] Route back to implement-plan (features), modularize-and-clean (cleanup), or improve-architecture (architecture) to resolve.**"

### Next Step

**First pass — pass:** User invokes `modularize-and-clean` (Build mode), `improve-architecture` (Plan mode), or `update-docs` (Build mode) to skip cleanup/arch review.

**Clean-up pass — pass:** User invokes `update-docs` to orchestrate documentation sync.

**Architecture pass — pass:** User invokes `update-docs` to orchestrate documentation sync.

**Any pass — fail:** User invokes the prior skill that produced the diff to resolve the failing items.