---
name: update-docs
description: 'Analyze session changes and run the matching update-* skills to sync all project documentation. Trigger when a documentation sync phase completes, or when the user says "sync docs", "update docs", "docs are outdated", or similar.'
---

## Purpose
Coordinate the documentation sync pass at the end of a session. Consults the Doc Sync Triggers table in `AGENTS.md` to determine which update-* skills to run based on what changed during the session.

Answers "Which docs need updating?", "Which update-* skills should I run?", "Are cross-references still valid?".

Handles the Phase 8 hand-off: receives completion from `modularize-and-clean`, runs matching syncs, then routes to `push-to-git`.

---

## Audience
- AI agents running the SDD workflow
- Developers verifying documentation is up-to-date before committing

---

## Content Rules

### Quality Gates
Every piece of content must pass these three checks:

- **"Would an agent miss this?" litmus test:** Every line must answer "Would an agent miss this without running the sync?" If not, leave it out.
- **Cross-reference integrity:** All links between documents must resolve to existing anchors.
- **Batch discipline:** Sync all docs in one pass, not after every commit or phase.

### What to Include
- Change inventory across the session — which file types were created, modified, or deleted
- Doc Sync Triggers consultation — match changes to the correct update-* skill
- Cross-reference verification — ensure all `[See ...](...)` links resolve
- Hand-off instruction to `push-to-git`

### What NOT to Include

| Document | Scope | Audience | Content Type | Canonical Source Of |
|----------|-------|----------|--------------|-------------------|
| **README.md** | User-facing setup, usage, features, benefits, installation | End users, new developers | User-facing | Install/run commands, user-facing features, quick-start, troubleshooting |
| **ARCHITECTURE.md** | Technical structure, modules, file tree, implementation, data flow | Developers, AI agents | Technical | API endpoints, WebSocket events, module descriptions, import graph, design decisions (technical) |
| **SPECIFICATIONS.md** | Product vision, user journey, problem statement, pitch, Out of Scope, privacy | Product owners, devs, AI agents, evaluators/stakeholders | Product / Vision | Product vision, user journey, feature rationale, privacy model, design decisions (product), out-of-scope boundaries |
| **DEMO_GUIDE.md** | Demo presentation, walkthrough, step-by-step instructions | Presenters, evaluators | Practical | Demo walkthrough, testing scenarios, fallback options, reset instructions |
| **AGENTS.md** | AI agent permissions, rules, file ownership, operational constraints | AI agents | Operational | Agent behavioral rules, file ownership policies, doc sync triggers, failure triage, cross-phase universal rules |
| **PROJECT_BEST_PRACTICES.md** | Universal coding patterns, best practices, lessons learned | All developers, AI agents | Educational | Universal coding practices, skill methodologies, transferable patterns |
| **DOCUMENT_GUIDELINES.md** | Doc scope, content boundaries, governance | Developers, AI agents | Governance | Document metadata, content boundaries (no dedicated skill) |

**Anti-duplication:**
- One purpose per document — if content fits two documents, choose the PRIMARY purpose
- Cross-reference, don't copy — use `[See <DOC>.md](<DOC>.md)` instead of duplicating
- Summary here, details there — each document gets its appropriate level of detail; cross-reference for full content
- Audience-first — if audience overlaps, choose the document with the MOST RELEVANT audience
- This skill does NOT own individual doc content — it delegates to the appropriate update-* skill

---

## Workflow

### 1. Review Session Changes

Capture the session scope from the prior phase (receives completion from `modularize-and-clean`, `improve-architecture`, `review-implementation`, or equivalent).

Capture the session's scope by reviewing:
- Session conversation — what files were discussed, what behaviors changed
- Git diff — staged and unstaged changes across the session
- Any `[MODIFIED]`, `[ADDED]`, `[REMOVED]`, `[ARCH]`, `[CLEANUP]` flags from prior phases

### 2. Inventory Changes Against Doc Sync Triggers

Consult the [Doc Sync Triggers](#doc-sync-triggers) table in `AGENTS.md`:

| Change type | Skill to run |
|-------------|-------------|
| New file, deleted file, renamed file, module restructure, new endpoint, changed function signature | `update-architecture-md` |
| New feature, changed user journey, updated privacy behavior, changed Out of Scope | `update-specifications-md` |
| Changed setup steps, new CLI command, new env var, new feature visible to users | `update-readme-md` |
| Changed behavioral rules, new file ownership entry, updated commands | `update-agents-md` |
| Changed demo flow, new screen, changed prerequisite | `update-demo-guide-md` |
| Recurring pattern, new debugging lesson, new skill methodology insight | `update-best-practices-md` |

For each change type that occurred during this session, note the corresponding skill. If none match, skip to Step 4.

### 3. Run Each Applicable update-* Skill

Run each skill identified in Step 2. Follow the skill's full workflow — investigation, reading, gap identification, update, verification.

**One pass at end:** Run all needed syncs in one batch — not after every commit or phase. If multiple skills match, run them in dependency order:

1. `update-architecture-md` — architectural changes affect README, SPECS, DEMO_GUIDE
2. `update-specifications-md` — spec changes affect DEMO_GUIDE, README
3. `update-agents-md` — agent rules are self-contained
4. `update-readme-md` — README references ARCHITECTURE, SPECS, DEMO_GUIDE
5. `update-demo-guide-md` — demo guide references features, setup, spec
6. `update-best-practices-md` — best practices are self-contained

### 4. Verify Cross-References

After all syncs are complete, verify document integrity:

- [ ] All `[See <DOC>.md](...)` links between documents resolve to existing headings
- [ ] No dead anchor references — every `#section-name` target exists in the target doc
- [ ] No orphaned sections — every section in each doc is reachable from another doc or from the doc's own TOC
- [ ] No stale redirects — `→ Redirect to <filename>` markers are removed if the target document no longer exists


## Hand-off

Before declaring completion:
- All applicable update-* skills run based on session changes
- Cross-references verified across all project docs
- No dead links, orphaned sections, or stale redirects

---

## Outputs & Triggers

### Output
All applicable update-* skills run. Cross-references verified across all project docs. No dead links, orphaned sections, or stale redirects.

### Exit Declaration
State clearly: "**Documentation sync complete. All applicable syncs run, cross-references verified. Proceed to push-to-git?**"

### Next Step
User invokes `push-to-git` (Build mode — same mode, no switch needed).
