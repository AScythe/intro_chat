---
name: update-docs
description: 'Analyze session changes and sync all project documentation by delegating to each doc-specific update skill. Trigger when a documentation sync phase completes, or when the user says "sync docs", "update docs", "docs are outdated", or similar.'
---

## What I do
- Review session changes to determine which docs need updating
- Match change types to docs via the Doc Sync Triggers table
- Update each doc in dependency order
- Verify cross-reference integrity across all project docs
- Route to push-to-git

## Boundaries
- **Read-only analysis.** Review session changes and trigger syncs — do not create content for docs that had no changes.
- **One pass at end.** Sync all docs in one batch at end of session, not after every commit or phase.
- **Cross-reference integrity.** All `See ...` links must resolve after syncs complete.

## Content Rules

### Quality Gates
- **Litmus test:** Would an agent miss this without running the sync? If not, leave it out.
- **Cross-reference integrity:** All links between documents must resolve to existing anchors.
- **Batch discipline:** All syncs in one pass — not per commit or phase.

### Scope
- Change inventory — which files were created, modified, or deleted
- Doc Sync Triggers consultation — match changes to the correct doc
- Cross-reference verification — ensure all `See ...` links resolve
- Hand-off instruction to `push-to-git`


## Phase 0: Prerequisites

- [ ] Review session changes — git diff, [FLAG] annotations, conversation history
- [ ] Match changes against Doc Sync Triggers table
- [ ] Read AGENTS.md doc sync triggers table

## Document Update Workflow

### Phase 1: Inventory

1. **Review session changes** — session conversation, git diff, and `[FLAG]` annotations from prior phases

2. **Match against Doc Sync Triggers** — consult the table below:

   | Change type | Target document |
   |-------------|-----------------|
   | New/deleted/renamed file, module restructure, new endpoint, changed function signature | `docs/ARCHITECTURE.md` |
   | New feature, changed user journey, updated privacy, changed Out of Scope | `docs/SPECIFICATIONS.md` |
   | Changed setup steps, new CLI command, new env var, new user-visible feature | `docs/README.md` |
   | Changed behavioral rules, new file ownership entry, updated commands | `AGENTS.md` |
    | Changed tooling setup, new MCP server, changed env requirements | `refs/AGENT_SETUP.md` |
    | Recurring pattern, new debugging lesson, new skill methodology insight | `refs/PROJECT_BEST_PRACTICES.md` |
   | New document added, document scope/boundary change, doc structure change | `refs/DOCUMENT_GUIDELINES.md` |

3. **List which docs to update** — for each change type that occurred, note the corresponding doc. If none match, skip to Phase 3.

### Phase 2: Sync

For each doc in the update list from Phase 1, invoke the corresponding skill via the Task tool. Each skill investigates independently per its own Investigation Protocol — no session context or git diff needed.

Run in dependency order:

1. `docs/ARCHITECTURE.md` → `skill(name: "update-architecture-md")`
2. `docs/SPECIFICATIONS.md` → `skill(name: "update-specifications-md")`
3. `AGENTS.md` → `skill(name: "update-agents-md")`
4. `docs/README.md` → `skill(name: "update-readme-md")`
5. `refs/PROJECT_BEST_PRACTICES.md` → `skill(name: "update-best-practices-md")`
6. `refs/AGENT_SETUP.md` → `skill(name: "update-agent-setup-md")`
7. `refs/DOCUMENT_GUIDELINES.md` — inline update only (no dedicated skill)

### Phase 3: Verify

- [ ] All `See <DOC>.md` links between documents resolve to existing headings
- [ ] No dead anchor references — every `#section-name` target exists in the target doc
- [ ] No orphaned sections — every section in each doc is reachable from another doc or from the doc's own TOC
- [ ] No stale redirects — `→ Redirect to <filename>` markers are removed if the target document no longer exists

## Hand-off
- Phase 1: Session changes inventoried and matched against Doc Sync Triggers
- Phase 2: All applicable docs updated in dependency order
- Phase 3: Cross-references verified — no dead links, orphaned sections, or stale redirects

### Abort Paths
If interrupted mid-phase: record current state in a TODO or pending list, offer to resume at the same point when re-invoked. Do NOT commit partial work.

---

## Outputs & Triggers

### Output
All applicable docs updated in dependency order. Cross-references verified across all project docs. No dead links, orphaned sections, or stale redirects.

### Exit Declaration
State clearly: "**Documentation sync complete. All applicable syncs run, cross-references verified. Proceed to push-to-git? Say 'push' to trigger pushing the changes to git.**"

### Next Step
User invokes `push-to-git` (Build mode — same mode, no switch needed).