---
name: improve-architecture
mode: build
description: 'Apply architecture improvements from the evaluation list in TDD-backed batches. Each item verified by existing tests (or new regression test) before and after the change. Uses [ARCH] flags. Trigger after evaluate-architecture, or when the user says "improve architecture", "apply structural changes", or similar. Exit: "Architecture improvements complete" — invokes review-implementation.'
---

## What I do
- Read the prioritized list from `evaluate-architecture` (verbal, session context)
- For each item: TDD (use existing test or write regression test) → apply structural change with `[ARCH]` flag → verify
- Cross-reference **implement-plan** for shared guidelines: batch rules (§3), surgical changes (§5), flag format (§6), and test-adaptation rule (line 62) — see those sections for details; this skill only documents what differs
- On stale evaluation list: re-evaluate the current codebase before acting
- On partial completion: pick up where left off (track done items in conversation)
- On test failure: review if the change is logically sound; if yes → fix test; if not → skip the item and report

## Documents to Read

Read via Grep→Read (grep heading line number, Read with offset/limit):

- **`AGENTS.md`**: "File Ownership"
- **`ARCHITECTURE.md`**: "Project Structure", relevant module descriptions
- **`implement-plan/SKILL.md`**: §3 (Batch for Reviewability), §5 (Surgical Changes), §6 (Easy to Review), test-adaptation rule (line 62)
- **`evaluate-architecture/SKILL.md`**: Scan checklist (to understand how items were classified)

## Guidelines

### 0. Prerequisites
- Must have a current `evaluate-architecture` output in the conversation. If none exists or the output is stale (codebase has changed significantly since evaluation), re-run `evaluate-architecture` first.
- If resuming from a previous `improve-architecture` session: confirm which items were already completed.

### 1. Prepare the List
- Receive the prioritized list from `evaluate-architecture` (P0 items first, then P1, then P2).
- The user may approve all, select specific items, or prioritize out of order.
- If the user modifies the list (adds/removes/reorders), use the modified version.

### 2. Per-Item Workflow

For each item, in priority order:

**Step 1: Baseline test check**
- Run the full test suite. All must pass before starting. If any pre-existing failures exist, flag them and do not proceed until resolved.
- Record the test count for each suite: *"Backend: 25, Frontend: 83"*

**Step 2: TDD — determine the oracle**
- **If an existing test covers this code's behavior:** use it as the oracle. The test must pass before and after the change.
- **If NO existing test covers this code's behavior:** write a regression test that captures the current behavior. Save it in `tests/` (or `frontend/tests/`). Run it to confirm it passes — this is the oracle.
- Regression tests follow the project's existing test conventions. For structural-only changes (no behavior change), the test verifies the code works as before (import resolves, function call returns expected type, etc.).

**Step 3: Apply the structural change**
- Apply the change described in the evaluation item (move file, rename, reorganize, fix import, add header, etc.).
- Do NOT change behavior or logic. Do NOT add features or fix bugs unrelated to the architecture item.
- Follow **implement-plan §5 (Surgical Changes)** for editing discipline (touch only what's needed, preserve description headers, clean orphans).
- Follow **implement-plan §3 (Batch for Reviewability)** for batching rules (one concern per batch, dependency ordering, conflict resolution).

**Step 4: Flag every changed line with `[ARCH]`**
- Format: `[ARCH]: short_reason — what/why`
- Example: `[ARCH]: relocate CSS — moved from app/static/css/ to frontend/src/styles/`
- Follow **implement-plan §6 (Easy to Review)** for flagging conventions.
- Include test adaptation flags too: `[ARCH]: update test import — reflect new file path`

**Step 5: Update test references**
- If the change moved or renamed files, update all import paths in test files to match.
- Follow implement-plan's test-adaptation rule (line 62): source and test references updated in the same batch.

**Step 6: Verify**
- Run the full test suite. Use the same test count recording from Step 1 for comparison:
  - Same count with all passing → item verified ✅
  - Different count (test added/removed) → flag and explain
  - Any failure → enter failure review (Step 7)

**Step 7: Handle test failure**
- Analyze the failure:
  - **Import path issue** (module not found) → fix the import, re-verify
  - **The change is logically correct but exposed a brittle test** → fix the test to be resilient, re-verify
  - **The change breaks intended behavior** → revert the batch, skip this item, report in hand-off
- Do NOT silently revert. Review first, decide based on logic.

**Step 8: Proceed to next item**
- Done items are tracked in-conversation. On resume, pick up from the first undone item.

### 3. Hand-off

Before declaring completion:
- All selected items either applied or explicitly skipped (with reason)
- Full test suite passes with same or documented test counts
- Build succeeds (`cd frontend && npm run build`)
- Typecheck passes (`cd frontend && npx tsc --noEmit`)
- All changes carry `[ARCH]` flags — zero non-ARCH flags
- No unrelated changes remain
- File-level description headers preserved or updated on moved/changed files

State clearly: **"Architecture improvements complete. [N] batches applied, [M] skipped (with reasons). Review the changes?"**

## Cross-Reference Summary

| Guideline | Location | How improve-architecture uses it |
|-----------|----------|----------------------------------|
| Batch rules | implement-plan §3 | Same: one concern per batch, dependency order, conflict resolution |
| Surgical changes | implement-plan §5 | Same: touch only what's needed, preserve headers, clean orphans |
| Flag format | implement-plan §6 | Same format, but `[ARCH]` prefix instead of `[ADDED]`/etc |
| Test-adaptation rule | implement-plan line 62 | Same: test refs updated in same batch as code changes |
| TDD first | implement-plan §2 | Modified: use existing test as oracle, write regression test only if none exists |
| Simplicity first | implement-plan §4 | Same: minimum code, nothing speculative |

## Outputs & Triggers

### Output
Structural changes with `[ARCH]` flags. Updated test imports. Regression tests for uncovered behavior. Summary of applied and skipped items.

### Exit Declaration
State clearly: "**Architecture improvements complete. [N] batches applied, [M] skipped. Review implementation?**"

### Next Step
User invokes `review-implementation` — **switch to Plan mode before proceeding**.
