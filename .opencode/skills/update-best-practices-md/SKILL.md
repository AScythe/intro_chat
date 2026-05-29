---
name: update-best-practices-md
description: Extract universal best practices from the current coding session and existing codebase, then write them into `refs/PROJECT_BEST_PRACTICES.md`. Trigger when the user says "update best practices", "document lessons learned", or similar.
---

## Purpose
Universal best practices collection for future projects. Answers "What lessons were learned?", "What patterns should I reuse?".

Mine session conversations, changed files, skills, and plan files for reusable, universal lessons, then update or create `refs/PROJECT_BEST_PRACTICES.md`.

---

## Audience
- Developers starting new projects
- AI agents learning transferable patterns

---

## Content Rules

### Quality Gates
- **"Would a developer starting a new project miss this?" litmus test**
- **Universal applicability:** Strip project-specific names and details
- **Strict format compliance:** Every entry must have Context + Principle + Example + Why it matters
- **Conciseness check:** No multi-sentence stories

### Entry Format

```markdown
### X.Y Practice Name
**Context**: When/where this applies (1 line max)
**Principle**: The universal rule (2-3 lines max)
**Example**: Short code snippet or command
**Why it matters**: Impact on future work (1 line)
```

### What to Include

**Universal (always present):**
- **Entry Format** — Every entry must follow: Context (1 line), Principle (2-3 lines), Example (short snippet), Why it matters (1 line)
- **Code Structure** — Modularization patterns, responsibility separation, circular import prevention, leaf vs internal modules
- **Quality** — Error handling types, fix strategies; Testing patterns (syntax checks, unit tests, integration tests, test-coordination patterns); State management (in-memory vs persistent, recovery, queue management)
- **Operations** — Configuration patterns, environment setup, non-interactive execution, version control patterns
- **Process** — Debugging process, documentation methodology, skills/workflow methodology, AI-assisted development patterns
- **Meta** — Session Lessons Learned: cross-cutting process meta-lessons that don't fit named categories

**Optional (include only if applicable):**
- **UI/Frontend Practices** — UI patterns, JS/TS module rules, React/SPA conventions (only for projects with frontend code)

### What NOT to Include

| Document | Scope | Audience | Content Type | Canonical Source Of |
|----------|-------|----------|--------------|-------------------|
| **README.md** | User-facing setup, usage, features, installation | End users, new developers | User-facing | Install/run commands, user-facing features, quick-start |
| **ARCHITECTURE.md** | Technical structure, modules, file tree, implementation, data flow | Developers, AI agents | Technical | Module descriptions, import graph, design decisions (technical) |
| **SPECIFICATIONS.md** | Product vision, user journey, problem statement, Out of Scope | Product owners, devs, AI agents | Product / Vision | Product vision, user journey, feature rationale, Out of Scope |
| **AGENTS.md** | Agent behavioral rules, file ownership, operational constraints | AI agents | Operational | Agent behavioral rules, file ownership table, commands, failure triage, test suite conventions |
| **PROJECT_BEST_PRACTICES.md** | Universal coding patterns, best practices, lessons learned | All developers, AI agents | Educational | Universal coding practices, skill methodologies |
| **DOCUMENT_GUIDELINES.md** | Doc scope, content boundaries, governance | Developers, AI agents | Governance | Document metadata, content boundaries |

**Anti-duplication:**
- One purpose per document — if content fits two documents, choose the PRIMARY purpose
- Cross-reference, don't copy — use `See <DOC>.md` links instead of duplicating
- If content belongs elsewhere, note it with `→ Redirect to <filename>` — do not include it in this document

---

## Universal Template

The skeleton below is used for every project's `PROJECT_BEST_PRACTICES.md`. Markers like `<!-- FILL: name -->` indicate where project-specific content is injected. The Entry Format (Context + Principle + Example + Why it matters) is fixed.

```markdown
# [Project Name] Best Practices

> Derived from real-world development — applies to ALL projects

## [Category Name — e.g., "Code Structure", "Quality", "Operations", "Process"]

### X.Y Practice Name
**Context**: When/where this applies
**Principle**: The universal rule
**Example**: Short code snippet or command
**Why it matters**: Impact on future work

<!-- FILL: categories -->
```

Optional categories (include only if applicable): UI/Frontend Practices (for projects with frontend code).

---

## Phase 0: Prerequisites

- [ ] Review session conversation for new lessons learned
- [ ] Review changed files for observable patterns
- [ ] Read existing PROJECT_BEST_PRACTICES.md — understand current practices
- [ ] Read skills directory for methodology patterns

## Workflow

> **Investigation Protocol:** Investigation compares the current document against the current codebase and session — not just against previous session changes. Pre-existing discrepancies (missing practices, stale entries, format violations) are gaps to flag regardless of when they were introduced. Session changes are one source, not the only trigger.

### Phase 1: Plan (read-only)

#### 1. Investigate
Read sources in this priority order:

1. Existing `PROJECT_BEST_PRACTICES.md` — compare every section against current codebase reality
2. Session conversation — extract new lessons
3. Skills directory — extract methodology patterns
4. Plan files — design rationale
5. Changed files — observable patterns

#### 2. Read the Current Document
- Check if `refs/PROJECT_BEST_PRACTICES.md` exists — create it if not

#### 3. Identify Gaps and Issues
For each **What to Include** category and each existing entry: is it still accurate? Are there missing entries? Are existing entries stale?

#### 4. Present Candidates

### Gate: User Confirmation

### Phase 2: Implement

#### 5. Assemble or Update the Document

**If PROJECT_BEST_PRACTICES.md doesn't exist (create from scratch):**
1. Start with the **Universal Template** from this skill
2. Replace `<!-- FILL: categories -->` with applicable categories from **What to Include**
3. For each category, add entries following the **Entry Format** (Context + Principle + Example + Why it matters)
4. Verify no `<!-- FILL:` markers remain
5. Write the result to `refs/PROJECT_BEST_PRACTICES.md`

**If PROJECT_BEST_PRACTICES.md already exists (surgical update):**
- For each changed category: update only the entries that changed — add new, remove stale, improve existing
- For each optional category (UI/Frontend): add if applicable and missing, remove if no longer applicable
- Never rewrite the whole file — use targeted edits on changed entries only
- Follow the triage: existing entries get improved (merged or tightened) over creating duplicates

#### 6. Verify

**Integrity & Scope:**
- [ ] Every piece of content belongs in this document per the What NOT to Include table — redirect if it belongs elsewhere
- [ ] No content duplicated from another document — use `See <DOC>.md` cross-references instead
- [ ] All claims traceable to session or codebase evidence — not inferred
- [ ] Every entry passes the litmus test defined in Quality Gates
- [ ] Document omits everything a developer on a new project doesn't need — no speculative, aspirational, or unverifiable content

**Document-Specific Checks:**
- [ ] All new entries follow the Entry Format (Context + Principle + Example + Why it matters)
- [ ] Conciseness applied — no multi-sentence stories, each entry is a tight rule
- [ ] **Universality check** — the principle works on any project, framed generically
- [ ] No duplication with existing entries — improve existing instead of creating new
- [ ] If content spans multiple categories, assigned to the PRIMARY category
- [ ] "Session Lessons Learned" contains only genuinely cross-cutting lessons — not overflow from other categories

#### 7. Route Skill Improvements
If this session identified improvements to `update-best-practices-md/SKILL.md` itself:

- **Minor gaps** (wording, format tweaks, missing edge cases) → fix in-place, list the changes in your output
- **Significant gaps** (structural changes, missing phases, broken workflow) → do not fix in-place. Present as candidates in the Gate summary so the user can decide.