---
name: update-best-practices-md
type: subskill
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
Practices are organized into 6 category clusters:

**Code Structure**
- **Modularization** — responsibility patterns, circular import prevention, leaf vs internal modules
- **Architecture Decisions** — universal patterns only (e.g., "separate I/O from business logic")

**Quality**
- **Error Handling** — error types encountered, fix strategies, prevention patterns
- **Testing** — syntax checks, unit tests, integration tests, verification steps used, test-coordination patterns (updating tests in same batch as code changes)
- **State Management** — in-memory vs persistent state, recovery patterns, queue management

**Operations**
- **Configuration** — tool configs, environment setup (e.g., `.opencode/opencode.json`), non-interactive execution (use `-y` flags, suppress stdin prompts)
- **Version Control** — commit grouping logic, per-commit push discipline, auto-generated commit messages from change type, rename detection via deleted+untracked pairs, branching, what to never commit

**Process**
- **Debugging Process** — how issues were isolated, tools used (grep, read, bash)
- **Documentation** — doc structure, scope distinctions, cross-referencing, doc generation methodology, auto-extraction patterns from source comments
- **Skills Methodology** — skill architecture patterns (one verb per skill, stage gates, triage routing), workflow patterns (interactive walkthrough, docs-first analysis), handoff patterns (persistent artifacts, file-based stage communication), review methodology patterns (build step, test count diff, escalation routing), cleanup methodology patterns (dead code detection protocol, batch conflict resolution)
- **AI-Assisted Development** — prompting patterns, skill usage, agent behavior, automation safety patterns, idempotent update rules, diff logging for traceability

**UI**
- **Frontend Practices** — UI patterns, JS/TS module rules, React/SPA conventions

**Meta**
- **Session Lessons Learned** — process meta-lessons that are genuinely cross-cutting and don't fit any named category above. Categorize at entry time; only lessons that span multiple categories or describe the development process itself belong here.

### What NOT to Include

| Document | Scope | Audience | Content Type | Canonical Source Of |
|----------|-------|----------|--------------|-------------------|
| **README.md** | User-facing setup, usage, features, installation | End users, new developers | User-facing | Install/run commands, user-facing features, quick-start |
| **ARCHITECTURE.md** | Technical structure, modules, file tree, implementation, data flow | Developers, AI agents | Technical | Module descriptions, import graph, design decisions (technical) |
| **SPECIFICATIONS.md** | Product vision, user journey, problem statement, Out of Scope | Product owners, devs, AI agents | Product / Vision | Product vision, user journey, feature rationale, Out of Scope |
| **DEMO_GUIDE.md** | Demo presentation, walkthrough, step-by-step instructions | Presenters, evaluators | Practical | Demo walkthrough, testing scenarios, fallback options |
| **AGENTS.md** | Agent behavioral rules, file ownership, operational constraints | AI agents | Operational | Agent behavioral rules, file ownership table, commands, failure triage, test suite conventions |
| **PROJECT_BEST_PRACTICES.md** | Universal coding patterns, best practices, lessons learned | All developers, AI agents | Educational | Universal coding practices, skill methodologies |
| **DOCUMENT_GUIDELINES.md** | Doc scope, content boundaries, governance | Developers, AI agents | Governance | Document metadata, content boundaries |

**Anti-duplication:**
- One purpose per document — if content fits two documents, choose the PRIMARY purpose
- Cross-reference, don't copy — use `[See <DOC>.md](<DOC>.md)` links instead of duplicating
- If content belongs elsewhere, note it with `→ Redirect to <filename>` — do not include it in this document

---

## Phase 0: Prerequisites

- [ ] Review session conversation for new lessons learned
- [ ] Review changed files for observable patterns
- [ ] Read existing PROJECT_BEST_PRACTICES.md — understand current practices
- [ ] Read skills directory for methodology patterns

## Workflow

### Phase 1: Plan (read-only)

#### 1. Investigate
Read sources in this priority order:

1. Existing `PROJECT_BEST_PRACTICES.md`
2. Session conversation — extract new lessons
3. Skills directory — extract methodology patterns
4. Plan files — design rationale
5. Changed files — observable patterns

#### 2. Read the Current Document
- Check if `refs/PROJECT_BEST_PRACTICES.md` exists — create it if not

#### 3. Identify Gaps and Issues
For each **What to Include** category: are there new practices from this session?

#### 4. Present Candidates

### Gate: User Confirmation

### Phase 2: Implement

#### 5. Update the Document
- Add missing sections
- Fix outdated content
- Remove or redirect out-of-scope content

#### 6. Verify

**Integrity & Scope:**
- [ ] Every piece of content belongs in this document per the What NOT to Include table — redirect if it belongs elsewhere
- [ ] No content duplicated from another document — use `[See <DOC>.md](<DOC>.md)` cross-references instead
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