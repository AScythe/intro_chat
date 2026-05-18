---
name: update-docs
description: 'Analyze session changes and run the matching update-* skills to sync all project documentation. Trigger when a documentation sync phase completes, or when the user says "sync docs", "update docs", "docs are outdated", or similar.'
---

## What I do
- Review session changes to determine which docs need updating
- Consult the Doc Sync Triggers table to match change types to skills
- Run each update-* skill in dependency order
- Verify cross-reference integrity across all project docs after syncs
- Route to push-to-git

## Boundaries
- **Read-only analysis.** Review session changes and trigger syncs — do not create content for docs that had no changes.
- **One pass at end.** Sync all docs in one batch at end of session, not after every commit or phase.
- **Cross-reference integrity.** All `[See ...](...)` links must resolve after syncs complete.

## Pipeline Position

This skill is the penultimate stage — a documentation orchestration point that runs before the final push.

| Input | From | Format |
|-------|------|--------|
| Session changes | Prior skill's output (review-implementation or direct trigger) | Git diff + conversation flags |
| Doc Sync Triggers | `AGENTS.md` | Reference table |

| Output | To | Format |
|--------|----|--------|
| Updated documentation | push-to-git | `docs/*.md` |

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

## Workflow

### Phase 1: Inventory

1. **Review session changes** — capture the session scope from the prior phase. Review:
   - Session conversation — what files were discussed, what behaviors changed
   - Git diff — staged and unstaged changes across the session
   - Any `[MODIFIED]`, `[ADDED]`, `[REMOVED]`, `[ARCH]`, `[CLEANUP]` flags from prior phases

2. **Match against Doc Sync Triggers** — consult the table in `AGENTS.md`:

   | Change type | Skill to run |
   |-------------|-------------|
   | New/deleted/renamed file, module restructure, new endpoint, changed function signature | `update-architecture-md` |
   | New feature, changed user journey, updated privacy, changed Out of Scope | `update-specifications-md` |
   | Changed setup steps, new CLI command, new env var, new user-visible feature | `update-readme-md` |
   | Changed behavioral rules, new file ownership entry, updated commands | `update-agents-md` |
   | Changed demo flow, new screen, changed prerequisite | `update-demo-guide-md` |
   | Recurring pattern, new debugging lesson, new skill methodology insight | `update-best-practices-md` |

3. **List which skills to run** — for each change type that occurred, note the corresponding skill. If none match, skip to Phase 3.

### Phase 2: Sync

Run each applicable update-* skill identified in Phase 1. Follow each skill's full workflow — investigation, reading, gap identification, update, verification.

**One pass at end:** Run all needed syncs in one batch. If multiple skills match, run them in dependency order:

1. `update-architecture-md` — architectural changes affect README, SPECS, DEMO_GUIDE
2. `update-specifications-md` — spec changes affect DEMO_GUIDE, README
3. `update-agents-md` — agent rules are self-contained
4. `update-readme-md` — README references ARCHITECTURE, SPECS, DEMO_GUIDE
5. `update-demo-guide-md` — demo guide references features, setup, spec
6. `update-best-practices-md` — best practices are self-contained

### Phase 3: Verify

After all syncs are complete, verify document integrity:

- [ ] All `[See <DOC>.md](...)` links between documents resolve to existing headings
- [ ] No dead anchor references — every `#section-name` target exists in the target doc
- [ ] No orphaned sections — every section in each doc is reachable from another doc or from the doc's own TOC
- [ ] No stale redirects — `→ Redirect to <filename>` markers are removed if the target document no longer exists

## Hand-off

Before declaring completion:
- Phase 1: Session changes inventoried and matched against Doc Sync Triggers
- Phase 2: All applicable update-* skills run in dependency order
- Phase 3: Cross-references verified — no dead links, orphaned sections, or stale redirects

---

## Outputs & Triggers

### Output
All applicable update-* skills run. Cross-references verified across all project docs. No dead links, orphaned sections, or stale redirects.

### Exit Declaration
State clearly: "**Documentation sync complete. All applicable syncs run, cross-references verified. Proceed to push-to-git?**"

### Next Step
User invokes `push-to-git` (Build mode — same mode, no switch needed).