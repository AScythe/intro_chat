---
name: rebuild-indexes
description: 'Rebuild CocoIndex code index and Graphify knowledge graph when source files change. Uses git diff to detect necessity, runs conditional rebuild. Use after any code change, or when the user says "rebuild indexes", "update indexes", "reindex", or similar. Invoked as a Phase 0 prerequisite by review-implementation.'
---

## What I do
- Detect whether source files changed since the last baseline (via `git diff` against `main`)
- If changed: rebuild CocoIndex (`ccc index`) and Graphify (`graphify .`)
- If unchanged: skip with a clear message
- Handle edge cases: missing CLI tools, missing settings.yml, timeouts

## Boundaries
- **Index/graph artifacts only** — never modifies source code. Rebuilds auto-generated files in `.cocoindex_code/` and `graphify-out/`.
- **Non-blocking** — failures produce warnings but do not halt the caller.

## Phase 0: Prerequisites

- [ ] Confirm `git` is available
- [ ] Confirm `ccc` is installed (warn if not found — skip CocoIndex rebuild)
- [ ] Confirm `graphify` is installed (warn if not found — skip Graphify rebuild)

## Rebuild Workflow

### Step 1: Detect Changed Files

Run:

```
git diff --name-only $(git merge-base HEAD main) HEAD
```

If this fails (e.g., no commits yet), fall back to `git status --porcelain`.

### Step 2: Check Necessity

Filter changed files against indexed file types:

```
.py, .ts, .tsx, .js, .jsx, .css, .json, .html, .toml
```

**If any changed file matches** → rebuild is necessary.
**If none match** (only .md, lock files, .gitignore, etc.) → skip. Report: "No source files changed — index/graph is current. Skipping rebuild."

### Step 3: Rebuild CocoIndex

Run with 120s timeout:

```
ccc index
```

If settings.yml missing → first run `ccc init`, then `ccc index`.

- Success → continue
- Command not found → WARNING: "ccc not found — CocoIndex rebuild skipped"
- Timeout/failure → WARNING: "CocoIndex rebuild failed/timed out — search may return stale data"

### Step 4: Rebuild Graphify

Run with 120s timeout:

```
graphify .
```

- Success → continue
- Command not found → WARNING: "graphify not found — Graphify rebuild skipped"
- Timeout/failure → WARNING: "Graphify rebuild failed/timed out — graph queries may return stale data"

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
Return to the calling skill (e.g., `review-implementation` Phase 0) which continues with baseline tests.
