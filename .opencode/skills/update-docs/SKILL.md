---
name: update-docs
type: workflow
upstream: [review-implementation]
description: 'Analyze session changes and run the matching update-* skills to sync all project documentation. Trigger when a documentation sync phase completes, or when the user says "sync docs", "update docs", "docs are outdated", or similar.'
---

## What I do
- Review session changes to determine which docs need updating
- Match change types to skills via the Doc Sync Triggers table
- Run each update-* skill in dependency order
- Verify cross-reference integrity across all project docs
- Route to push-to-git

## Boundaries
- **Read-only analysis.** Review session changes and trigger syncs — do not create content for docs that had no changes.
- **One pass at end.** Sync all docs in one batch at end of session, not after every commit or phase.
- **Cross-reference integrity.** All `[See ...](...)` links must resolve after syncs complete.

## Content Rules

### Quality Gates
- **Litmus test:** Would an agent miss this without running the sync? If not, leave it out.
- **Cross-reference integrity:** All links between documents must resolve to existing anchors.
- **Batch discipline:** All syncs in one pass — not per commit or phase.

### Scope
- Change inventory — which files were created, modified, or deleted
- Doc Sync Triggers consultation — match changes to the correct update-* skill
- Cross-reference verification — ensure all `[See ...](...)` links resolve
- Hand-off instruction to `push-to-git`

This skill delegates to the appropriate update-* skill.

## Phase 0: Prerequisites

- [ ] Review session changes — git diff, [FLAG] annotations, conversation history
- [ ] Check which update-* skills exist and match change types
- [ ] Read AGENTS.md doc sync triggers table

## Document Update Workflow

### Phase 1: Inventory

1. **Review session changes** — session conversation, git diff, and `[FLAG]` annotations from prior phases

2. **Match against Doc Sync Triggers** — consult the table below:

   | Change type | Skill to run | Target document |
   |-------------|-------------|-----------------|
   | New/deleted/renamed file, module restructure, new endpoint, changed function signature | `update-architecture-md` | `docs/ARCHITECTURE.md` |
   | New feature, changed user journey, updated privacy, changed Out of Scope | `update-specifications-md` | `docs/SPECIFICATIONS.md` |
   | Changed setup steps, new CLI command, new env var, new user-visible feature | `update-readme-md` | `docs/README.md` |
   | Changed behavioral rules, new file ownership entry, updated commands | `update-agents-md` | `AGENTS.md` |
   | Changed tooling setup, new MCP server, changed env requirements | `update-agent-setup-md` | `refs/AGENT_SETUP.md` |
   | Changed demo flow, new screen, changed prerequisite | `update-demo-guide-md` | `docs/DEMO_GUIDE.md` |
   | Recurring pattern, new debugging lesson, new skill methodology insight | `update-best-practices-md` | `refs/PROJECT_BEST_PRACTICES.md` |
   | New document added, document scope/boundary change, doc structure change | inline in `update-docs` | `refs/DOCUMENT_GUIDELINES.md` |

3. **List which skills to run** — for each change type that occurred, note the corresponding skill. If none match, skip to Phase 3.

### Phase 2: Sync

Run each applicable update-* skill in its full workflow. Run all syncs in one pass, in dependency order:

1. `update-architecture-md` — architectural changes affect README, SPECS, DEMO_GUIDE
2. `update-specifications-md` — spec changes affect DEMO_GUIDE, README
3. `update-agents-md` — self-contained
4. `update-readme-md` — README references ARCHITECTURE, SPECS, DEMO_GUIDE
5. `update-demo-guide-md` — demo guide references features, setup, spec
6. `update-best-practices-md` — self-contained
7. `update-agent-setup-md` — self-contained
8. `refs/DOCUMENT_GUIDELINES.md` — inline update when doc structure/scope changes

### Phase 3: Verify

- [ ] All `[See <DOC>.md](...)` links between documents resolve to existing headings
- [ ] No dead anchor references — every `#section-name` target exists in the target doc
- [ ] No orphaned sections — every section in each doc is reachable from another doc or from the doc's own TOC
- [ ] No stale redirects — `→ Redirect to <filename>` markers are removed if the target document no longer exists

## Hand-off
- Phase 1: Session changes inventoried and matched against Doc Sync Triggers
- Phase 2: All applicable update-* skills run in dependency order
- Phase 3: Cross-references verified — no dead links, orphaned sections, or stale redirects

### Abort Paths
If interrupted mid-phase: record current state in a TODO or pending list, offer to resume at the same point when re-invoked. Do NOT commit partial work.

---

## Outputs & Triggers

### Output
All applicable update-* skills run. Cross-references verified across all project docs. No dead links, orphaned sections, or stale redirects.

### Exit Declaration
State clearly: "**Documentation sync complete. All applicable syncs run, cross-references verified. Proceed to push-to-git? Say 'push' to trigger pushing the changes to git.**"

### Next Step
User invokes `push-to-git` (Build mode — same mode, no switch needed).