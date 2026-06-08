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
- Auto-execute update-docs (implicit) on success — documentation sync runs automatically after sign-off

## Boundaries
- **Find and fix** — inspect the codebase for issues; fix broken structural references, stale test assertions, and index staleness inline. Do not route backward for fixable issues found during review.
- **Prefer read-only inspection** — start with inspection; only write when changes are necessary (stale structural refs, broken test assertions, index rebuild).
- **Independent verification** — re-run all checks from scratch, never trust the implementer's self-test

## Phase 0: Prerequisites

- [ ] Check for context continuity — see AGENTS.md §Session Continuity Check for trigger conditions. Load and execute the check logic from `save-session` Step 9 if needed.
- [ ] Confirm which prior skill produced the diff (implement-plan, improve-architecture, or modularize-and-clean)
- [ ] Read the prior plan or evaluation list
- [ ] Run baseline tests — all must pass before proceeding
- [ ] Load and execute `rebuild-test-and-indexes` skill in **implicit mode** — handles: delta structural sync (via git diff) → test re-run → triage (max 3 cycles) → conditional index rebuild. Everything test+index related is delegated here.

## Review Workflow

### Phase 1: Inspect Changes
**Purpose:** Establish what was changed, confirm it matches the expected pass type, load the right reference material, and verify scope — all before running any automated checks.

#### Step 1: Confirm Pass Type
**Purpose:** Formally identify the review context — this drives which docs to read, which checks apply, and what constitutes a pass throughout the rest of the review.

Check which flags appear in the diff:

| Flag type | Pass | Prior skill |
|-----------|------|-------------|
| `[ADDED]` `[MODIFIED]` `[FIXED]` `[REMOVED]` `[MOVED]` | First pass | `implement-plan` |
| `[CLEANUP]` | Clean-up pass | `modularize-and-clean` |
| `[ARCH]` | Architecture pass | `improve-architecture` |

Any non-CLEANUP flag in a clean-up pass → route back to `modularize-and-clean`. Any non-ARCH flag in an architecture pass → route back to `improve-architecture`.

#### Step 2: Read Docs
**Purpose:** Load the reference material for the confirmed pass type — needed to verify the diff against what was planned or approved.

- **First pass** (after `implement-plan`): `docs/PLAN_*.md` + `docs/ARCHITECTURE.md` ("Import Structure", relevant module descriptions)
- **Clean-up pass** (after `modularize-and-clean`): `docs/PLAN_*.md` (success criteria) — fall back to `archive/plan/` if already moved. Change-log is the primary target.
- **Architecture pass** (after `improve-architecture`): `improve-architecture` session output — the evaluation list is the target.

#### Step 3: Read the Diff
**Purpose:** Confirm every change is intentional and flagged — no unflagged changes should survive review.

Open the full diff. Verify every changed line or block carries a flag with a short reason.

#### Step 4: Check Git Status
**Purpose:** Confirm the blast radius matches expectations — only expected files were touched.

Run `git status` to list all modified, added, and deleted files. Flag:
- **Orphaned files** — not referenced anywhere
- **Accidental modifications** — changed outside plan scope
- **Missing deletions** — should have been removed but still exist

### Phase 2: Verify Execution
**Purpose:** Run all automated checks and use codebase exploration to catch anything the implementation may have missed — before the manual audit in Phase 3.

#### Step 1: Codebase Exploration
**Purpose:** Verify the codebase reflects the intended changes — find code that should have been changed but wasn't, and confirm no stale patterns remain.

See AGENTS.md §Codebase Exploration for the full decision framework. For verification, run the pipeline (graphify→cocoindex→ast-grep) to catch missed changes, then use individual tools as needed. Use these tools for review verification:

Apply the tier-based pipeline from AGENTS.md §Codebase Exploration:

- `graphify` — confirm changed modules have expected connections in the knowledge graph
- `cocoindex-code_search` — find code that _should_ have been changed but wasn't (semantic coverage check)
- `ast_grep_search` — confirm zero stale occurrences of old patterns; structural search catches what text search misses
- `grep / read` — fallback for exact-text verification


#### Step 2: Run All Tests
**Purpose:** Confirm all tests pass and track count changes to catch regressions and scope creep.

All must pass. On failure: list what failed and why — do not fix here.

Exact commands:
```bash
python -m pytest tests/ -v
cd frontend && npx vitest run
```

**Diff test count** — note count per suite before and after. Flag: tests removed without explanation (regression risk) or added without planned batch (scope creep). Report: *"Test count changed: [suite]: [N before] → [N after] ([+/-]N)"*

#### Step 3: Test Health Audit
**Purpose:** Beyond pass/fail, verify tests are structurally sound and not silently broken.

Check for:
- **Stale file paths** — do file-existence checks in tests reference files that no longer exist? (e.g., `test_file_structure()` listing a deleted file like `requirements.txt` or relocated files)
- **Misleading comments** — do inline comments accurately describe what the test actually verifies? (e.g., "# Returns empty list" when the endpoint returns 8 default rooms)
- **Coverage gaps** — are files tested for exports in one test section but missing from the file-existence check and code-quality check in another section?

Flag any findings: *"Test health: [N issues found] — stale paths, misleading comments, coverage gaps."* Route back if structural issues would cause test failures. Report only (no fix) for cosmetic issues like stale comments. The implementer resolves these.

#### Step 4: Run Build
**Purpose:** Confirm the production build succeeds after all changes.

```bash
cd frontend && npm run build
```
Must succeed. On failure: list errors — do not fix here.

#### Step 5: Run Lint and Typecheck
**Purpose:** Confirm type safety and style compliance across all changed files.

Exact commands:
```bash
python -m py_compile <changed_file>.py
cd frontend && npx tsc --noEmit
```

Must pass. On failure: list files and issues — do not fix here.

### Phase 3: Audit & Sign Off
**Purpose:** Manually audit test quality and code properties, verify everything against the plan or evaluation list, then sign off or route back. Archive the plan as the final action on success.

#### Step 1: Check Test Quality

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

### Step 2: Code Property Audit

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

#### Step 3: Verify Against Plan or Evaluation List

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

Use the `question` tool to ask: **"Move plan to archive?"** Provide clickable `options` with `label` ("Yes, archive", "No, keep") and `description` fields.

If yes:
- Use Get-ChildItem (bash) to scan `docs/` and `archive/plan/` for the highest NNN across all PLAN_*.md files (CRITICAL: do NOT use glob — glob respects `.ignore` which excludes `archive/plan/`, causing silent failure). Increment by 1 → MMM.
- Move: `docs/PLAN_<date>_<NNN>.md` → `archive/plan/PLAN_<date>_<MMM>.md` (preserves original creation date, assigns global sequential archive number)
- Confirm: "Plan archived as `archive/plan/PLAN_<date>_<MMM>.md`."

### Phase 4: Save Session
**Purpose:** Capture the review conversation before handing off — ensures context is not lost across sessions.

Only reached on successful sign-off.

**Steps:**
1. Load the skill: `skill(name: "save-session")`
2. Follow the save-session workflow (determine file, gate for new/append, format, write, rotate)
3. After save completes, proceed to the update-docs step below

### Phase 5: Update Docs
**Purpose:** Sync documentation to reflect the verified implementation — closes the review loop.

Only reached after Phase 4 Save Session completes.

**Steps:**
1. Load the skill: `skill(name: "update-docs")`
2. Follow the implicit path: Phase 1 (Scope) → Phase 2 (Delta Analysis) → Phase 3 (Quick Approval) → Phase 4 (Apply) → Phase 5 (Verify)
3. After update-docs completes, proceed to Hand-off below

## Hand-off
- Phase 1: Diff reviewed, git status clean — only expected files touched
- Phase 2: All tests pass (count compared), build succeeds, lint clean
- Phase 3: Test quality verified, plan/evaluation criteria met, archive moved
- Phase 4: Review session saved
- Phase 5: Update-docs (implicit) executed — delta updates applied, cross-references verified
- Pass → route to modularize-and-clean (first pass) or improve-architecture (first pass). Fail → route back to the prior skill that produced the diff.

### Abort Paths
If interrupted mid-phase: record current state in a TODO or pending list, offer to resume at the same point when re-invoked. Do NOT commit partial work.

---

## Outputs & Triggers

### Output
Verbal verification report: pass (all items implemented, all criteria met) or fail (specific items listed for the appropriate prior skill).

### Exit Declaration

**Pass** — state clearly:
- First pass: "**All checks pass. Implementation verified. Recommended: modularize-and-clean (structural cleanup) with improve-architecture (architectural improvement). Proceed?**"
- Clean-up/Architecture pass: "**All checks pass. Cleanup and architecture improvements verified. Documentation sync already triggered — no manual update-docs needed.**"

**Fail** — state clearly: "**Review failed. [List items not met.] Route back to [prior skill: implement-plan / modularize-and-clean / improve-architecture] to resolve.**"

### Next Step

- **First pass — pass:** User invokes `modularize-and-clean` (Build mode) and `improve-architecture` (Plan mode). Update-docs was already auto-executed.
- **Clean-up/Architecture pass — pass:** No further action needed. Update-docs was already auto-executed.
- **Any fail:** User invokes the prior skill that produced the diff.