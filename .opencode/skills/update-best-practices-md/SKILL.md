---
name: update-best-practices-md
description: Extract universal best practices from the current coding session and existing codebase, then write them into `refs/PROJECT_BEST_PRACTICES.md`. Trigger when the user says "update best practices", "document lessons learned", or similar.
---

## Purpose
Universal best practices collection for future projects. Answers "What lessons were learned?", "What patterns should I reuse in future projects?".

Mine session conversations, changed files, skills, and plan files for reusable, universal lessons, then update or create `refs/PROJECT_BEST_PRACTICES.md` so developers and agents can carry forward proven patterns to new projects.

---

## Audience
- Developers starting new projects
- AI agents learning transferable patterns

---

## Content Rules

### Quality Gates
Every practice entry must pass all four checks:

- **"Would a developer starting a new project miss this?" litmus test:** Every entry must answer "Would a developer starting a new project likely miss this without help?" If not, leave it out.
- **Universal applicability:** Strip project-specific names and details. Keep only the transferable principle. Project-specific filenames belong only in the **Example** field.
- **Strict format compliance:** Every entry must have Context + Principle + Example + Why it matters — no exceptions. See Entry Format below.
- **Conciseness check:** No multi-sentence stories. Turn "We encountered a problem where indentation was incorrect in `__init__.py` which caused a syntax error" into "Indentation errors in `__init__.py` — verify after every edit."

### Entry Format

Every practice entry must follow this structure — no exceptions:

```markdown
### X.Y Practice Name
**Context**: When/where this applies (1 line max)
**Principle**: The universal rule (2-3 lines max)
**Example**: Short code snippet or command — reference project files as context only
**Why it matters**: Impact on future work (1 line)
```

Include both ✅ DO and ❌ DON'T examples where applicable.

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
- If content belongs elsewhere, note it with `→ Redirect to <filename>` — do not include it in this document

---

## Workflow

This skill follows a two-phase approach: **Plan (read-only)** then **Implement (write)**. Always present findings and confirm with the user before writing anything.

> **Workflow note:** This skill uses a 2-phase workflow with a user confirmation gate between Plan and Implement. It maps to the standard 5-step model as follows:
> - Phase 1 (Steps 1-4) = Investigate → Read → Identify → Present (gate prep)
> - Gate = User Confirmation
> - Phase 2 (Steps 5-7) = Update → Verify → Route Improvements

---

### Phase 1: Plan (read-only)

Present findings verbally. Do NOT write anything during this phase.

#### 1. Investigate
Read sources in this priority order:

1. **Existing `PROJECT_BEST_PRACTICES.md`** — know what's already covered before looking for new entries
2. **Session conversation** — extract new lessons: decisions made, errors encountered and fixed, testing/verification steps used, anything that caused confusion or required backtracking
3. **Skills directory (`.opencode/skills/*/SKILL.md`)** — skill methodologies evolve across sessions; extract lessons from how the skills themselves were revised
4. **Plan files (`archive/PLAN_*.md`)** — persistent decision artifacts contain design rationale and tradeoff context
5. **Changed files from this session** — read only files modified during this session, not the full codebase. Look for observable patterns: modularization, imports, error handling, state management, file-description conventions, test-coordination patterns.
   - **Modified skill files**: specifically check for new workflow rules added (e.g., batch conflict resolution, dead code protocol, expanded review checks) — these signal new process patterns to extract as best practices.
6. **Config files** — tool configs, CI setup, formatter/linter configs for repeatable patterns

This skill itself — `update-best-practices-md/SKILL.md` — is also a source.

**Push for root pattern extraction:** For every candidate lesson, ask: "Is this the symptom or the root cause?" Surface-level = "Don't accept a WebSocket twice." Root = "When extracting helper functions, check for duplicated lifecycle calls between handler and helper." Extract the root pattern — it is the universally applicable form. If the root pattern doesn't pass the universal applicability gate (too abstract, not practically useful), step back one level until it does.

**Ask the user** only when session or plan files can't answer: unclear root causes, ambiguous patterns. One short batch. Never ask what the session makes clear.

#### 2. Read the Current Document
- Check if `refs/PROJECT_BEST_PRACTICES.md` exists — create it if not
- Read existing entries to avoid duplication
- Identify gaps based on what the session produced

#### 3. Identify Gaps and Issues
For each item in **What to Include**:
- Are there new practices in this category from the current session?
- Are existing entries still accurate and universally applicable?

For each existing entry:
- Does it belong here per **What NOT to Include**?
- If not → redirect

#### 4. Present Candidates (Gate Preparation)
Compile all candidate practices into a structured summary:

```
## Proposed Additions
1. Practice Name → Category → Root principle (1 sentence)
2. Practice Name → Category → Root principle (1 sentence)

## Proposed Improvements to Existing Entries
- Entry X: reason for update

## This Skill — Self-Improvement Candidates
- Gap found in skill: description
- Improvement proposed: description
```

Do NOT write to any file yet.

---

### Gate: User Confirmation
**Present the candidate summary to the user and ask: "Shall I add these to the document?"**

Wait for explicit approval before proceeding. If the user requests changes, adjust the candidates and re-present.

---

### Phase 2: Implement

#### 5. Update the Document
- Add missing sections
- Fix outdated content to match session and codebase evidence
- Remove or redirect out-of-scope content per the **What NOT to Include** table
- Don't rewrite the entire document — only update what's changed

For each candidate practice:

1. **Categorize** — assign to one of the 6 category clusters (Code Structure, Quality, Operations, Process, UI, Meta)
2. **Check scope** — does it belong in PROJECT_BEST_PRACTICES.md?
3. **If not** → redirect to the correct document
4. **If yes** → write in Entry Format (Context + Principle + Example + Why it matters)
5. **Apply conciseness check** — strip narrative, keep only the rule
6. **Check existing entries** — if the principle already exists, update the existing entry instead of creating a duplicate
7. **Add to document** — keep universal; project-specific names only in the **Example** field
8. **Update Key Takeaways** — after adding new entries, append corresponding takeaways to the `## Key Takeaways` list at the end of the document. Each takeaway is a one-line bold phrase with a short description.

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