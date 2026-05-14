---
name: evaluate-architecture
mode: plan
description: 'Analyze the current project structure and architecture against best practices, produce a prioritized list of structural improvements. Trigger after review-implementation (first pass), alongside modularize-and-clean, or when the user says "evaluate the architecture", "review project structure", or similar. Output: verbal prioritized list. Exit: "Architecture evaluation complete" — invites improve-architecture.'
---

## What I do
- Scan the full project structure (file tree, directory layout, package organization)
- Compare against best practices from `PROJECT_BEST_PRACTICES.md` and general software engineering conventions
- Inspect import hygiene, config placement, asset location, test structure, monolithic patterns, naming conventions, and dead/deprecated code
- Produce a **verbal prioritized list** (P0–P2) with file:line references, findings, and recommendations
- Output is session-local (like `analyze-and-plan` or `modularize-and-clean` candidate lists) — no persistent document

## Boundaries (read-only phase)
- **No file writes.** Do NOT create, modify, or write any files — including notes, markdown, or code changes.
- **No implementation.** This skill only analyzes and reports.
- **Verbal output only.** Present findings in the conversation.

## Documents to Read

Read via Grep→Read (grep heading line number, Read with offset/limit):

- **`ARCHITECTURE.md`**: "Project Structure", "Module Descriptions", "Import Structure"
- **`PROJECT_BEST_PRACTICES.md`**: Sections §1 (Modularization), §4 (Documentation), §5 (Testing), §7 (Session Lessons Learned), §8 (Automation & Process Design)
- **`AGENTS.md`**: "File Ownership" (confirms where files belong)
- **Source files**: spot-check 2-3 key files per area below to confirm doc accuracy vs reality

## Guidelines

### Scan Checklist

Examine each area in order. For each finding, note priority, file:line, and a clear recommendation.

| # | Area | What to Check | Priority Guide |
|---|------|---------------|----------------|
| 1 | **Directory organization** | Are backend (`app/`) and frontend (`frontend/`) files in the right packages? Are static assets (CSS, JS, images) co-located with their runtime? Is there code in the wrong package? | P0 = cross-package misplacement, P1 = confusing layout, P2 = minor naming |
| 2 | **Import hygiene** | Are path aliases (`@/`) used where configured? Are there relative `../../` imports that should use the alias? Any circular imports? Imports from wrong package? | P0 = broken or circular imports, P1 = alias unused but configured, P2 = minor inconsistency |
| 3 | **Config placement** | Are configuration constants in a designated `config.py` / `constants.ts`? Are any config values mixed into state or logic modules? | P0 = config in wrong module, P1 = duplicated values, P2 = minor misplacement |
| 4 | **Asset location** | Do CSS, images, and other static assets live in `frontend/` (for UI assets) or `app/` (for backend)? Are they served via the right tool (Vite for frontend assets, FastAPI for backend)? | P0 = frontend CSS in backend dir, P1 = served via wrong mechanism, P2 = minor convention |
| 5 | **Test structure** | Do tests mirror the source tree (tests/ mirrors src/ structure)? Are there tests in unexpected locations? Tests for modules that no longer exist? | P0 = orphaned test files, P1 = non-mirroring layout, P2 = missing test dir |
| 6 | **Monolithic patterns** | Are there files over ~200 lines with multiple distinct concerns that could be split? Single files handling too many responsibilities? | P0 = mixed concerns blocking extension, P1 = large but single-purpose, P2 = borderline |
| 7 | **Dead/deprecated code** | Are there exported symbols, files, or directories with zero imports? Unused config, templates, or assets? | P0 = dead code in active build path, P1 = orphaned docs/notes, P2 = dead comments |
| 8 | **Naming conventions** | Do all source files have `# Description:` / `// Description:` / `/* Description: */` headers? Consistent naming (camelCase TS, snake_case Python)? | P0 = missing headers, P1 = inconsistent casing, P2 = minor style |
| 9 | **Module boundaries** | Are feature modules clearly separated? Do pages import from the wrong layer (e.g., component imports from pages)? | P0 = layer violation, P1 = unclear boundary, P2 = minor cross-ref |
| 10 | **Config vs convention gaps** | Are there best practices from PROJECT_BEST_PRACTICES.md that the codebase doesn't follow? | P0 = safety issue, P1 = maintainability, P2 = style |

### Output Format

Present findings grouped by area, with each item in this format:

```
[P0/P1/P2] <file:line> — <finding> → Recommend: <action>
```

Example:
```
P0: app/static/css/style.css — frontend CSS stored in backend package — Recommend: move to frontend/src/styles/
P1: frontend/src/pages/ChatPage.tsx — uses relative imports but @/ alias is configured — Recommend: convert to @/
P2: frontend/src/hooks/useTimer.ts — missing file-level Description: header — Recommend: add // Description: ...
```

If all 10 areas pass with zero findings:
- Report: "**Architecture evaluation complete. Codebase structure is clean — no issues found.**"
- No routing — the workflow ends here for the architecture track.

### Priority Definitions

| Priority | Meaning |
|----------|---------|
| P0 | Must fix — structural issue that violates separation of concerns, breaks tooling, or creates safety risk |
| P1 | Should fix — maintainability concern that increases cognitive load or refactoring risk |
| P2 | Nice to fix — style or convention inconsistency with low impact |

## Outputs & Triggers

### Output
Verbal prioritized list with file:line references, findings, and recommendations for each of the 10 scan areas.

### Exit Declaration (findings found)
State clearly: "**Architecture evaluation complete. [N] items identified (P0: X, P1: Y, P2: Z). Implement via improve-architecture?**"

### Exit Declaration (clean)
State clearly: "**Architecture evaluation complete. Codebase structure is clean — no issues found.**"

### Next Step (findings found)
User invokes `improve-architecture` (Build mode — switch needed).

### Next Step (clean)
Workflow complete for the architecture track. User may continue with other tasks.
