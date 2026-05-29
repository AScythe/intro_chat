---
name: rebuild-indexes
description: 'Rebuild CocoIndex code index and Graphify knowledge graph. On explicit invocation always rebuilds; when invoked as Phase 0 of review-implementation, checks git diff for necessity. Use after any code change, or when the user says "rebuild indexes", "update indexes", "reindex", or similar.'
---

## What I do

Two invocation modes:

- **Explicit** (user says "rebuild indexes"): Always rebuilds CocoIndex and Graphify unconditionally.
- **Implicit** (Phase 0 of `review-implementation`): Detects source file changes via git diff, rebuilds only if needed, skips if nothing changed.
- Handle edge cases: missing CLI tools, missing settings.yml, timeouts.

## Boundaries
- **Index/graph artifacts only** — never modifies source code. Rebuilds auto-generated files in `.cocoindex_code/` and `graphify-out/`.
- **Non-blocking** — failures produce warnings but do not halt the caller.

## Phase 0: Prerequisites

- [ ] Confirm `git` is available
- [ ] Determine invocation mode — explicit (standalone "rebuild indexes") or implicit (Phase 0 of review-implementation)
- [ ] Confirm `ccc` is installed (warn if not found — skip CocoIndex rebuild)
- [ ] Confirm `graphify` is installed (warn if not found — skip Graphify rebuild)

## Explicit Path (standalone "rebuild indexes")

Skip necessity check entirely. Rebuild unconditionally.

### Step 1: Rebuild CocoIndex

Run with 120s timeout:

```
ccc index
```

If settings.yml missing → first run `ccc init`, then `ccc index`.

- Success → continue
- Command not found → WARNING: "ccc not found — CocoIndex rebuild skipped"
- Timeout/failure → WARNING: "CocoIndex rebuild failed/timed out — search may return stale data"

### Step 2: Rebuild Graphify

Run with 120s timeout:

```
graphify .
```

- Success → continue
- Command not found → WARNING: "graphify not found — Graphify rebuild skipped"
- Timeout/failure → WARNING: "Graphify rebuild failed/timed out — graph queries may return stale data"

### Step 3: Report

| Scenario | Output |
|----------|--------|
| Both rebuilt successfully | "Index and graph rebuilt successfully. Data is current." |
| Partial failure | "WARNING: [tool] failed. [Implications]." |

## Implicit Path (Phase 0 of review-implementation)

Conditional rebuild — only rebuilds if source files changed.

### Step 1: Detect Changed Files

On POSIX:

```bash
git diff --name-only "$(git merge-base HEAD main)" HEAD
```

On PowerShell:

```powershell
git diff --name-only $(git merge-base HEAD main) HEAD
```

If this fails (e.g., no commits yet), fall back to `git status --porcelain`.

### Step 2: Check Necessity

Filter changed files against indexed file types:

```
.py, .ts, .tsx, .js, .jsx, .css, .json, .html, .toml
```

**If any changed file matches** → proceed to rebuild.
**If none match** (only .md, lock files, .gitignore, etc.) → skip. Report: "No source files changed — index/graph is current. Skipping rebuild."

### Step 3: Rebuild CocoIndex

Same as Explicit Path Step 1.

### Step 4: Rebuild Graphify

Same as Explicit Path Step 2.

### Step 5: Report

| Scenario | Output |
|----------|--------|
| Both rebuilt successfully | "Index and graph rebuilt successfully. Data is current." |
| Skipped (no source changes) | "No source files changed — index/graph is current. Skipping rebuild." |
| Partial failure | "WARNING: [tool] failed. [Implications]. Continuing review." |

## Outputs & Triggers

### Output
Verbal report: rebuild result + any warnings.

### Exit Declaration
State clearly: "**Rebuild complete. [summary of what was done / skipped / failed].**"

### Next Step
- **Explicit path**: Done.
- **Implicit path**: Return to `review-implementation` Phase 0 which continues with baseline tests.
