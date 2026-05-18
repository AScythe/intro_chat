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
- **Read-only and verbal** — no file writes, no fixes
- **Independent verification** — re-run all checks from scratch, never trust the implementer's self-test

## Documents to Read

- **First pass** (after `implement-plan`): `docs/PLAN_*.md` + `ARCHITECTURE.md` ("Import Structure", relevant module descriptions)
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

#### Run All Tests
All must pass. On failure: list what failed and why — do not fix here.

Exact commands:
```bash
uv run python tests/test_app.py
uv run python tests/test_js_modules.py
cd frontend && npx vitest run
```

**Diff test count**: Before running, note the count per suite. After, compare. Flag unexpected changes:
- Tests removed without explanation (regression risk)
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
**A passing test suite is not enough — verify assertions are meaningful.**

For each new or modified test:

- **Assertion strength** — verifies expected value, not just non-null? `assertEqual(result, 42)` ✅. `assertIsNotNone(result)` where 42 is expected ❌.
- **Non-determinism** — clocks, RNG, or network injected rather than called internally?
- **Mock count** — mocking 3+ collaborators for one unit? Signals shallow design. Route back.
- **Test doubles usage** — mock used where stub/fake suffices? Flag for modularize-and-clean.

A test that passes with weak assertions is a false positive. Treat as failure, route back to `implement-plan`.

#### Verify Against Plan or Evaluation List

Identify which pass this is by the prior skill, then verify against the appropriate target:

**First pass** (prior: `implement-plan`):
Read `docs/PLAN_*.md`. Check every Implementation Plan item against the code. Every planned change must be accounted for; every success criterion met.

Also check:
- **Error strategy** — error paths handled per a stated strategy, not ad hoc patches?
- **No hardcoded values** — configuration-like values parameterized?
- **Control flow** — no tangled logic or nested conditions hiding bugs?
- **No unprincipled optimizations** — no brittle performance hacks?
- **Docs updated** — relevant docs in sync with changes?

**Clean-up pass** (prior: `modularize-and-clean`):
Read the verbal change-log produced by `modularize-and-clean`. Verify every `[CLEANUP]` entry was applied correctly. Confirm all approved batches are either applied or explicitly skipped with a reason. Check that no behavioral changes snuck in (flags must be `[CLEANUP]` only).

**Architecture pass** (prior: `improve-architecture`):
Read the evaluation list from session context. Verify:
- Every P0/P1 item addressed or explicitly skipped with reason
- No double-paths — old path removed, not left as ghost
- No orphaned references — imports, mounts, config updated from old locations
- Description headers match new locations for moved/created files
- All flags are `[ARCH]` with valid reasons

#### Sign Off or Route

All pass → see Exit Declaration below (scoped to pass type).
Any fail → see Exit Declaration below.

#### Archive Plan (on success)

Skip if plan already in `archive/`.

Ask: **"Move plan to archive? (y/n)"**

If yes:
- Scan `archive/` for highest `PLAN_*` number → increment by 1
- Read `docs/PLAN_xxx.md`, update internal header to match new archive filename
- Move: `docs/PLAN_xxx.md` → `archive/PLAN_yyy.md`
- Confirm: "Plan archived as `archive/PLAN_yyy.md`."

## Hand-off
- Phase 1: Diff reviewed, git status clean — only expected files touched
- Phase 2: All tests pass (count compared), build succeeds, lint clean
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