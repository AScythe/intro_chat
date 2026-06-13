# Plan: Modularize & Clean + Improve Architecture + Improve Security

**Date:** 2026-06-12
**Session:** After implementing `--delete-events` cascade deletion

---

## Phase 1 Findings Summary

### modularize-and-clean (11 scopes scanned)

| Finding | Severity | File | Details |
|---------|----------|------|---------|
| DRY violation: cascade DELETE block repeated 4x | High | `utility/cleanup_db.py` | `dedup_events`, `keep_only_event`, `delete_events`, `remove_orphaned_events` all repeat the same 6-7 DELETE statements. Extract into `_cascade_delete_event_ids(cur, eids: list[str])` helper. |
| `import random` inside function body | Medium | `app/routes_api.py:374` | `import random` is redundant — already imported at line 5. Dead import shadows module-level. |
| `dedup_events(cur)` called twice in `process()` | Medium | `utility/cleanup_db.py:181,183` | Second call is a no-op (first already deduped). Bug-like pattern. |
| Stale `[CLEANUP]` tag in description comment | Low | `app/__init__.py:1` | Tag from prior cleanup session not removed. |

### improve-architecture (8 areas scanned)

| Finding | Severity | File | Details |
|---------|----------|------|---------|
| No CORS middleware configured | High | `app/__init__.py` | Documented in ARCHITECTURE.md as "Set `ENV=production` and configure CORS origins" but never implemented. Add conditional CORS via `FastAPI.add_middleware(CORSMiddleware, ...)`. |
| `utility/` pkg has 1 file | Low | `utility/` | Standalone script, reasonable placement. No action needed. |
| 19 files in `app/`, well-modularized | OK | `app/` | Good separation by concern (routes, state, tasks, etc.). |

### improve-security (9 dimensions scanned)

| Finding | Severity | File | Details |
|---------|----------|------|---------|
| No CORS middleware | High | `app/__init__.py` | Same as ARCH finding — cross-cutting. |
| No rate limiting | Medium | `app/routes_api.py` | No protection against API abuse on POST endpoints (create event, join, request chat, etc.). |
| SQL injection posture | Pass | All files | All queries use `?` parameterized placeholders. Safe. |
| No secrets/API keys | Pass | N/A | App is anonymous — no tokens, no passwords, no env secrets. |
| Input validation | Pass (basic) | `app/routes_api.py` | Basic presence checks exist (e.g., `if not data.rooms`). SQL injection already mitigated. |
| Host binding | Pass | `app/config.py` | `HOST = '127.0.0.1'` — localhost only, safe default. |
| No eval/exec/pickle | Pass | N/A | No dangerous deserialization. |

---

## Batches (dependency order)

### Batch 1: [CLEANUP] Extract cascade DELETE helper
- **File:** `utility/cleanup_db.py`
- **Change:** Extract repeated 7-line cascade block into `_cascade_delete_event_ids(cur, eids: list[str])`, use it in `dedup_events`, `keep_only_event`, `delete_events`, `remove_orphaned_events`
- **Risk:** Low — pure mechanical refactor, same behavior
- **Test:** `uv run python utility/cleanup_db.py` (idempotent)

### Batch 2: [CLEANUP] Fix duplication bugs
- **File:** `utility/cleanup_db.py`
- **Changes:**
  1. Remove duplicate `dedup_events(cur)` call in `process()` (line 183)
- **Risk:** Very low

### Batch 3: [CLEANUP] Remove dead import + stale tag
- **Files:**
  1. `app/routes_api.py:374` — remove `import random` from inside function body
  2. `app/__init__.py:1` — remove ` [CLEANUP]` from description
- **Risk:** Very low

### Batch 4: [ARCH/SECURITY] Add conditional CORS middleware
- **File:** `app/__init__.py`
- **Change:** Add `CORSMiddleware` with configurable origins (default: allow all for dev, restrict in production)
- **Cross-reference:** Matches ARCHITECTURE.md documented behavior
- **Risk:** Low — middleware is additive and well-understood

### Batch 5: [SECURITY] Add rate limiting
- **File:** `app/__init__.py` (or new middleware)
- **Change:** Add rate limiting on POST endpoints (create event, join, request chat, etc.)
- **Risk:** Low — additive protection, no existing behavior changes

---

## Verification Plan
1. All backend tests pass: `uv run python tests/test_app.py`
2. Agent guidelines pass: `uv run python tests/test_agent_guidelines.py`
3. Type-check frontend: `cd frontend; npx tsc --noEmit`
4. Frontend unit tests: `cd frontend; npm test`
5. Manual run: `uv run python utility/cleanup_db.py` (idempotent after Batch 1-2)
