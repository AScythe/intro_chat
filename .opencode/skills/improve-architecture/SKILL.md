---
name: improve-architecture
description: 'Scan the project structure and architecture against best practices, produce a prioritized list of structural improvements, then apply them in TDD-backed batches with [ARCH] flags. Trigger after review-implementation (first pass), or when the user says "evaluate the architecture", "improve architecture", "review project structure", or similar.'
---

## What I do
- Scan the full project structure against conventions across directory layout, import hygiene, config placement, module boundaries, naming, dead code, and more
- Produce a verbal prioritized list (P0–P2) with file:line references, findings, and recommendations
- After user approval, apply structural changes in TDD-backed batches with `[ARCH]` flags — no behavior or logic changes
- Route back to review-implementation for architecture pass

## Boundaries
- **Phase 1 is strictly read-only.** No file writes, no code changes, no notes files.
- **Phase 2 is structural changes only.** No behavior changes, no bug fixes, no feature additions.
- **Cross-reference implement-plan.** Shared rules for batch discipline, surgical changes, flag format, and test adaptation live in `implement-plan` — this skill documents only what differs.

## Pipeline Position

This skill runs after a successful first-pass review. It routes back to review-implementation for an architecture pass.

| Input | From | Format |
|-------|------|--------|
| Approved, implemented code | review-implementation (first pass) | Source + tests |
| Architecture conventions | `docs/ARCHITECTURE.md` | Read-only reference |

| Output | To | Format |
|--------|----|--------|
| Structural changes with `[ARCH]` flags | review-implementation (architecture pass) | Source + tests |
| Verbal prioritized list (P0–P2) | User / plan context | Text |

## Documents to Read

Use Grep→Read for all sources (grep heading line number, then `Read(offset=line, limit=~100)`):

- **`ARCHITECTURE.md`** — "Project Structure", "Module Descriptions", "Import Structure"
- **Source files** — spot-check 2-3 key files per scan area to verify docs reflect reality

## Workflow

### Phase 1: Evaluate (Read-Only)

1. Read `ARCHITECTURE.md` sections listed in Documents to Read
2. Spot-check source files to confirm docs are current
3. Work through all 10 areas in order:

| # | Area | What to Check | Priority Guide |
|---|------|---------------|----------------|
| 1 | **Directory organization** | Backend/frontend files in the right packages? Static assets co-located with their runtime? Any code in the wrong package? | P0 = cross-package misplacement, P1 = confusing layout, P2 = minor naming |
| 2 | **Import hygiene** | Path aliases (`@/`) used where configured? Relative `../../` imports that should use the alias? Circular imports? Imports from wrong package? | P0 = broken/circular, P1 = alias unused but configured, P2 = inconsistency |
| 3 | **Config placement** | Config constants in designated `config.py`/`constants.ts`? Config values mixed into state or logic modules? | P0 = config in wrong module, P1 = duplicated values, P2 = minor misplacement |
| 4 | **Asset location** | CSS/images/static assets in `frontend/` (UI) or `app/` (backend)? Served via the right tool (Vite vs FastAPI)? | P0 = frontend CSS in backend dir, P1 = served via wrong mechanism, P2 = minor convention |
| 5 | **Test structure** | Tests mirror source tree? Tests in unexpected locations? Tests for modules that no longer exist? | P0 = orphaned test files, P1 = non-mirroring layout, P2 = missing test dir |
| 6 | **Monolithic patterns** | Files over ~200 lines with multiple distinct concerns? Single files handling too many responsibilities? | P0 = mixed concerns blocking extension, P1 = large but single-purpose, P2 = borderline |
| 7 | **Dead/deprecated code** | Exported symbols, files, or directories with zero imports? Unused config, templates, or assets? | P0 = dead code in active build path, P1 = orphaned docs/notes, P2 = dead comments |
| 8 | **Naming conventions** | All source files have `# Description:`/`// Description:`/`/* Description: */` headers? Consistent casing? | P0 = missing headers, P1 = inconsistent casing, P2 = minor style |
| 9 | **Module boundaries** | Feature modules clearly separated? Pages importing from the wrong layer? | P0 = layer violation, P1 = unclear boundary, P2 = minor cross-ref |
| 10 | **Config vs convention gaps** | Project conventions that the codebase doesn't follow? | P0 = safety issue, P1 = maintainability, P2 = style |

4. Apply priority definitions:

| Priority | Meaning |
|----------|---------|
| **P0** | Must fix — violates separation of concerns, breaks tooling, or creates a safety risk |
| **P1** | Should fix — increases cognitive load or refactoring risk |
| **P2** | Nice to fix — style or convention inconsistency with low impact |

5. Present findings grouped by area. Format each item:

```
[P0/P1/P2] file:line — finding → Recommend: action
```

Example:
```
P0: app/static/css/style.css — frontend CSS in backend package → Recommend: move to frontend/src/styles/
P1: frontend/src/pages/ChatPage.tsx — relative imports when @/ alias is configured → Recommend: convert to @/
P2: frontend/src/hooks/useTimer.ts — missing // Description: header → Recommend: add header
```

### Gate: User Approval

After presenting findings, ask: **"Shall I apply these changes? You can approve all, select specific items, or reorder."**

- Wait for explicit approval before proceeding to Phase 2.
- If the codebase changes significantly between evaluation and improvement, re-run Phase 1 first.
- If zero findings: report **"Architecture evaluation complete. Codebase structure is clean — no issues found."** Workflow ends here.

### Phase 2: Improve (Write)

> Cross-reference `implement-plan/SKILL.md` for shared rules: batch discipline (§3), surgical changes (§5), flag format (§6), and test-adaptation. This section documents only what differs.

Work through approved items in P0 → P1 → P2 order. For each item:

1. **Baseline** — Run the full test suite. All must pass. Record test counts. Do not proceed if pre-existing failures exist.

2. **TDD oracle** — If an existing test covers this code's behavior, use it as the oracle. If not, write a regression test that captures current behavior, save it to `tests/`, and confirm it passes.

3. **Apply the change** — Move, rename, reorganize, fix import, add header. Do NOT change behavior or logic. Do NOT fix unrelated bugs.

4. **Flag every changed line with `[ARCH]`**
   ```
   [ARCH]: short_reason — what/why
   ```
   Test adaptation flags too: `[ARCH]: update test import — reflect new file path`

5. **Update test references** — If files moved or renamed, update all import paths in test files in the same batch as the source change.

6. **Verify** — Run the full test suite. Compare to baseline counts:
   - Same count, all passing → item verified ✅
   - Count changed (test added/removed) → flag and explain
   - Any failure → see Failure Handling below

#### Failure Handling

| Symptom | Action |
|---------|--------|
| Import path error | Fix the import — do not revert the source change |
| Change is correct but test is brittle | Fix the test, re-verify |
| Change breaks intended behavior | Revert the batch, skip item, report in handoff |

Never silently revert. Review first, decide based on logic.

#### Partial Completion & Staleness

- **Partial:** Track done items in-conversation. On resume, pick up at the first undone item.
- **Stale evaluation:** If the codebase changed significantly since Phase 1, re-run Phase 1 before continuing.

## Hand-off

Before declaring completion:
- Phase 1: All 10 areas evaluated, findings presented with priorities
- Gate: User approved (or selected specific items)
- Phase 2: All approved items applied or explicitly skipped (with reason)
- Full test suite passes with same or documented test count change
- Every changed line carries `[ARCH]` flag — zero non-ARCH flags
- Frontend build and typecheck pass

---

## Outputs & Triggers

### Output
Verbal prioritized list (P0–P2) with file:line references and recommendations. Then: structural changes with `[ARCH]` flags, updated test imports, regression tests for uncovered behavior, and a summary of applied and skipped items.

### Exit Declaration
State clearly: "**Architecture improvements complete. Review implementation?**"

### Next Step
User invokes `review-implementation` — switch to Plan mode before proceeding.