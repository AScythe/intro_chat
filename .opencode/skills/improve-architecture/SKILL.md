---
name: improve-architecture
description: 'Scan project-level structure — directory layout, package organization, cross-module boundaries, and naming/file conventions — then apply structural improvements in TDD-backed batches with [ARCH] flags. Use after review-implementation (first pass), or triggered when the user says "evaluate the architecture", "improve architecture", "review project structure", or similar.'
---

## What I do
- Scan project-level structure — directory layout, import hygiene, config placement, module boundaries, naming conventions
- Produce a verbal prioritized list (P0–P2) with file:line references
- After user approval, apply structural changes in TDD-backed batches with [ARCH] flags
- Route back to review-implementation

## Boundaries
- **Phase 1 is strictly read-only.** No file writes, no code changes, no notes files.
- **Phase 2 is structural changes only.** No behavior changes, no bug fixes, no feature additions.
- **Self-contained TDD.** TDD principles, test double discipline, and non-determinism injection patterns are documented below in the Phase 2 workflow.

## Phase 0: Prerequisites

- [ ] Check for context continuity — see [AGENTS.md §Session Continuity Check](../../../AGENTS.md#session-continuity-check) for trigger conditions. Load and execute the check logic from `save-session` Step 9 if needed.
- [ ] Read the review pass findings (from review-implementation)
- [ ] Run baseline tests — all must pass
- [ ] Apply Codebase Exploration per task type (see AGENTS.md §Codebase Exploration)
- [ ] Read ARCHITECTURE.md for current documented structure

## Documents to Read

- **`docs/ARCHITECTURE.md`** — "Project Structure", "Module Descriptions", "Import Structure"
- **Source files** — read key files per scan area to verify documented structure matches actual codebase

## Architecture Improvement Workflow

### Phase 1: Evaluate (Read-Only)

Scan all 8 areas in order. Priority definitions:
- **P0** — Must fix: violates separation of concerns, breaks tooling, or creates a safety risk
- **P1** — Should fix: increases cognitive load or refactoring risk
- **P2** — Nice to fix: style or convention inconsistency

**Codebase Exploration:** See [AGENTS.md §Codebase Exploration](../../../AGENTS.md). Use **graphify** community detection to identify natural architecture boundaries — tightly-coupled groups stay together, loosely-connected candidates separate. Use **ast_grep_search** to find import violations, naming convention breaks, and dead exports across the codebase in one pass. Use **cocoindex-code** to discover similar code that should be consolidated.

Layer separation (config → state → logic → persistence) and leaf module pattern (leafs export only, never import internal) inform areas 1 (directory org), 2 (import hygiene), and 7 (module boundaries).

| # | Area | What to Check | Priority Guide |
|---|---|---|---|
| 1 | **Directory organization** | Backend/frontend files in the right packages? Static assets co-located with their runtime? Any code in the wrong package? | P0 = cross-package misplacement, P1 = confusing layout, P2 = minor naming |
| 2 | **Import hygiene** | Path aliases (`@/`) used where configured? Relative `../../` imports that should use the alias? Imports from wrong package? | P0 = alias unused but configured + wrong package, P1 = inconsistency, P2 = minor style |
| 3 | **Config placement** | Config constants in designated `config.py`/`constants.ts`? Config values mixed into state or logic modules? | P0 = config in wrong module, P1 = duplicated values, P2 = minor misplacement |
| 4 | **Asset location** | CSS/images/static assets in `frontend/` (UI) or `app/` (backend)? Served via the right tool (Vite vs FastAPI)? | P0 = frontend CSS in backend dir, P1 = served via wrong mechanism, P2 = minor convention |
| 5 | **Test structure** | Tests mirror source tree? Tests in unexpected locations? Tests for modules that no longer exist? | P0 = orphaned test files, P1 = non-mirroring layout, P2 = missing test dir |
| 6 | **Naming conventions** | All source files have `# Description:`/`// Description:`/`/* Description: */` headers? Consistent casing? | P0 = missing headers, P1 = inconsistent casing, P2 = minor style |
| 7 | **Module boundaries** | Feature modules clearly separated? Pages importing from the wrong layer? | P0 = layer violation, P1 = unclear boundary, P2 = minor cross-ref |
| 8 | **Config vs convention gaps** | Project conventions that the codebase doesn't follow? | P0 = safety issue, P1 = maintainability, P2 = style |

Present findings as: `[P0/P1/P2] file:line — finding → Recommend: action`

### Gate: User Approval

Present findings and use the `question` tool to ask: **"Shall I apply these changes?"** Provide clickable `options` with `label` ("Apply all", "Select items", "Skip") and `description` fields. Rely on the auto-added "Type your own answer" for custom input.

Wait for explicit approval before Phase 2. If zero findings, report **"Architecture evaluation complete — no issues found."**

### Phase 2: Improve (Write)

#### TDD Principles

Architecture changes must not alter behavior. Test discipline is about preserving existing behavior, not creating new specs.

**Test oracle approach** — for every item:
1. If an existing test covers this code, use it as the oracle (test passes before and after)
2. If no test covers it, write a regression test capturing current behavior first — save to `tests/`, confirm it passes
3. Apply the structural change
4. Run all tests — same count, all passing
5. If count changes (tests broke), flag and explain

**Test double discipline** — use the simplest substitute:
- **Stub** — return canned data, no assertions
- **Fake** — in-memory/lightweight real implementation
- **Spy** — record calls, assert after the fact
- **Mock** — assert specific interaction (use sparingly)

**Non-determinism injection** — inject clocks, RNG, network, and filesystem as parameters:
```python
def create_session(now=None, new_id=None):
    return {"id": str(new_id or uuid4()), "created_at": now or datetime.now()}
```

For each approved item (P0 → P1 → P2 order):

1. **Baseline** — Run full test suite. All must pass.
2. **TDD oracle** — Apply the test oracle approach above.
3. **Apply change** — Move, rename, reorganize, fix import, add header. Do NOT change behavior/logic or fix unrelated bugs. Apply changes one logical unit at a time within each file.
4. **Flag every changed line with `[ARCH]`**
5. **Update test references** in same batch as source change.
6. **Verify** — Run full test suite. Compare to baseline counts:
   - Same count, all passing ✅
   - Count changed → flag and explain
   - Failure → see Conflict Resolution below

#### Conflict Resolution
When multiple approved items touch the same file or directory, sort by dependency order. If ordering isn't possible, present the conflict with a recommendation. Do NOT silently apply conflicting changes in sequence.

#### Failure Handling

| Symptom | Action |
|---------|--------|
| Import path error | Fix the import |
| Change correct but test brittle | Fix the test, re-verify |
| Change breaks intended behavior | Revert the batch, skip item |
| Any failure without diagnosing | Review before deciding |

#### Partial Completion & Staleness
- **Partial:** Track done items in-conversation. On resume, pick up at first undone item.
- **Stale evaluation:** If codebase changed significantly since Phase 1, re-run Phase 1 before continuing.

### Combined execution with modularize-and-clean

When the user triggers both `improve-architecture` and `modularize-and-clean` together:

1. **Phase 1 runs in parallel** with `modularize-and-clean` Phase 1 — each skill independently scans its defined scope (structure vs code-level quality)
2. **Merge phase**: Both pass findings to a merge-and-synchronize phase that produces a single unified plan document (see [check-plan-readiness template format](../../../AGENTS.md#agentic-workflow-skills))
3. **Unified plan** covers all findings from both skills, deduplicated and re-prioritized with P0–P2 labels per skill
4. **User approval**: Present the unified plan for approval
5. **Apply batches**: Structural changes carry `[ARCH]` flags, code-quality changes carry `[CLEANUP]` flags — never mix flags in the same batch
6. **Review**: Route to `review-implementation`

## Save Session (before hand-off)

After all architecture improvements are applied and verified, load and execute the `save-session` skill before proceeding to hand-off.

**Steps:**
1. Load the skill: `skill(name: "save-session")`
2. Follow the save-session workflow (determine file, gate for new/append, format, write, rotate)
3. After save completes, proceed to Hand-off below

## Hand-off
- Phase 1: All 8 areas evaluated, findings presented with priorities
- Gate: User approved (or selected specific items)
- Phase 2: All approved items applied or explicitly skipped (with reason)
- Phase 3: Architecture session saved
- Full test suite passes with same or documented test count change
- Every changed line carries `[ARCH]` flag — zero non-ARCH flags

### Abort Paths
If interrupted mid-phase: record current state in a TODO or pending list, offer to resume at the same point when re-invoked. Do NOT commit partial work.

---

## Outputs & Triggers

### Output
Prioritized list (P0–P2) with file:line references. Structural changes with [ARCH] flags, updated test imports, regression tests, summary of applied/skipped items.

### Exit Declaration
State clearly: "**Architecture improvements complete. Review implementation? Say 'review' to trigger review of the implementation.**"

### Next Step
User invokes `review-implementation` — switch to Plan mode before proceeding.