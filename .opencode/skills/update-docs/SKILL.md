---
name: update-docs
description: 'Analyze session changes and sync all project documentation using the inline doc sync rules. Trigger when a documentation sync phase completes, or when the user says "sync docs", "update docs", "docs are outdated", or similar.'
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
- **Cross-reference integrity.** All `[See ...](...)` links must resolve after syncs complete.

## Content Rules

### Quality Gates
- **Litmus test:** Would an agent miss this without running the sync? If not, leave it out.
- **Cross-reference integrity:** All links between documents must resolve to existing anchors.
- **Batch discipline:** All syncs in one pass — not per commit or phase.

### Scope
- Change inventory — which files were created, modified, or deleted
- Doc Sync Triggers consultation — match changes to the correct doc
- Cross-reference verification — ensure all `[See ...](...)` links resolve
- Hand-off instruction to `push-to-git`

Doc sync rules are defined inline below — no external sub-skills needed.

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

### Doc Sync Rules Summary

Key constraints per document. For full detail see the document itself.

| Doc | Must include | Must NOT include |
|-----|-------------|-----------------|
| **ARCHITECTURE.md** | Project tree, module descriptions, data flow, import graph, key design decisions, per-function detail | User-facing features, product vision, setup instructions |
| **SPECIFICATIONS.md** | Problem statement, user journey, feature descriptions with rationale, product decisions, Out of Scope | Internal module names, implementation details, command references |
| **README.md** | Quick start, features list, how-to-use, tech stack (high-level only) | Internal module structure, per-function signatures, design decisions |
| **AGENTS.md** | File ownership, SDD workflow phases, cross-phase rules, commands, test suite, failure triage | User-facing documentation, implementation walkthroughs |
| **AGENT_SETUP.md** | Prerequisites, tool install commands, PATH config, global config, first-time flow | App dependencies, API keys, project-specific run commands (→ README) |
| **PROJECT_BEST_PRACTICES.md** | Universal patterns: Context + Principle + Example + Why it matters | Project-specific names, code snippets with project identifiers |
| **DOCUMENT_GUIDELINES.md** | Document scope boundaries, cross-reference rules | Implementation details, setup instructions |

**Anti-duplication rule (all docs):** One purpose per doc. Cross-reference via `[See <DOC>.md](<DOC>.md)` instead of copying. If content belongs elsewhere, use `→ Redirect to <filename>`.

### Phase 2: Sync

Update each changed doc by applying the rules above. Run in dependency order:

1. `docs/ARCHITECTURE.md` — architectural changes affect README, SPECS
2. `docs/SPECIFICATIONS.md` — spec changes affect README
3. `AGENTS.md` — self-contained
4. `docs/README.md` — references ARCHITECTURE, SPECS
5. `refs/PROJECT_BEST_PRACTICES.md` — self-contained
6. `refs/AGENT_SETUP.md` — self-contained
7. `refs/DOCUMENT_GUIDELINES.md` — inline update when doc structure/scope changes

### Phase 3: Verify

- [ ] All `[See <DOC>.md](...)` links between documents resolve to existing headings
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