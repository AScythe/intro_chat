---
name: update-best-practices
description: Extract universal best practices from the current coding session and existing codebase, then write them into `docs/PROJECT_BEST_PRACTICES.md`. Trigger when the user says "update best practices", "document lessons learned", or similar.
---

## Purpose
Universal best practices collection for future projects. Answers "What lessons were learned?", "What patterns should I reuse in future projects?".

Mine session conversations, codebase, skills, and plan files for reusable, universal lessons, then update or create `docs/PROJECT_BEST_PRACTICES.md` so developers and agents can carry forward proven patterns to new projects.

---

## Audience
- Developers starting new projects
- AI agents learning transferable patterns

---

## Content Rules

### Quality Gates
Every practice entry must pass all four checks:

- **"Would an agent miss this?" litmus test:** Every entry must answer "Would someone likely miss this without help?" If not, leave it out.
- **Universal applicability:** Strip project-specific names and details. Keep only the transferable principle. Example filenames belong only in the **Example** field.
- **Strict format compliance:** Every entry must have Context + Principle + Example + Why it matters — no exceptions.
- **Conciseness check:** No multi-sentence stories. Turn "We encountered a problem where indentation was incorrect in `__init__.py` which caused a syntax error" into "Indentation errors in `__init__.py` — verify after every edit".

### Output Format
Every practice entry must follow this structure — no exceptions:

```markdown
## X. Category

### X.1 Practice Name
**Context**: When/where this was discovered (1 line max)
**Principle**: The universal rule (2-3 lines max)
**Example**: Short code snippet or command — reference project files as context only
**Why it matters**: Impact on future work (1 line)
```

Include both ✅ DO and ❌ DON'T examples where applicable.

### What to Include

**Code Structure**
- **Modularization** — responsibility patterns, circular import prevention, leaf vs internal modules
- **Architecture Decisions** — universal patterns only (e.g., "separate I/O from business logic"); project-specific decisions go in `ARCHITECTURE.md`

**Quality**
- **Error Handling** — error types encountered, fix strategies, prevention patterns
- **Testing** — syntax checks, unit tests, integration tests, verification steps used

**Operations**
- **Configuration** — tool configs, environment setup (e.g., `.opencode/opencode.json`)
- **Version Control** — commit grouping logic, per-commit push discipline, auto-generated commit messages from change type, rename detection via deleted+untracked pairs, branching, what to never commit

**Process**
- **Debugging Process** — how issues were isolated, tools used (grep, read, bash)
- **Documentation** — doc structure, scope distinctions, cross-referencing, doc generation methodology, auto-extraction patterns from source comments
- **Skills Methodology** — skill architecture patterns (one verb per skill, stage gates, triage routing), workflow patterns (interactive walkthrough, docs-first analysis), handoff patterns (persistent artifacts, file-based stage communication)
- **AI-Assisted Development** — prompting patterns, skill usage, agent behavior, automation safety patterns, idempotent update rules, diff logging for traceability

**UI**
- **Frontend Practices** — UI patterns, JS module rules, Jinja2 conventions

**Meta**
- **Session Lessons Learned** — process meta-lessons only. If a practice fits any named category above, put it there instead of here. This is the overflow for lessons that don't belong anywhere else.

### What NOT to Include
| Document | Routes content about | Audience | Update Trigger | Content Type |
|----------|---------------------|----------|----------------|--------------|
| **README.md** | User-facing setup, usage, features, benefits, installation | End users, new developers | Feature or setup change | User-facing, practical |
| **ARCHITECTURE.md** | Technical structure, modules, file tree, implementation, data flow | Developers, AI agents | Code structure change | Technical, implementation |
| **SPECIFICATIONS.md** | Product vision, user journey, problem statement, pitch | Product owners, devs, AI, stakeholders | Product scope change | Product, pitch, vision, spec |
| **DEMO_GUIDE.md** | Demo presentation, walkthrough, step-by-step instructions | Presenters, judges | Demo flow change | Practical, step-by-step |
| **AGENTS.md** | AI agent permissions, rules, file ownership, operational constraints | AI agents (opencode) | File or command change | Operational, constraints |
| **PROJECT_BEST_PRACTICES.md** | Universal coding patterns, best practices, lessons learned ✅ | All developers, AI | After each session | Educational, guidelines |
| **DOCUMENT_GUIDELINES.md** | Doc scope, content boundaries, governance | Developers, AI agents | New doc added | Meta, governance |

**Never include in PROJECT_BEST_PRACTICES.md:**
- Project-specific decisions (module names, route definitions, endpoint details) — those go in ARCHITECTURE.md
- Product vision, user journey, or pitch — those go in SPECIFICATIONS.md
- AI agent operational rules or file permissions — those go in AGENTS.md
- Demo walkthrough or presentation steps — those go in DEMO_GUIDE.md

**Anti-duplication within the document:**
- One practice per entry — if a lesson spans multiple categories, pick the PRIMARY category
- No duplicate entries across categories — check existing entries before adding
- If an existing entry already covers the principle, improve it instead of creating a new one

If content belongs elsewhere, note it with `→ Redirect to <filename>` — do not include it in `PROJECT_BEST_PRACTICES.md`.

---

## Workflow

This skill follows a two-phase approach: **Plan (read-only)** then **Implement (write)**. Always present findings and confirm with the user before writing anything.

---

### Phase 1: Plan (read-only)

Present findings verbally. Do NOT write anything during this phase.

#### 1. Investigate
Read sources in this priority order:

1. **Existing `PROJECT_BEST_PRACTICES.md`** — know what's already covered before looking for new entries
2. **Session conversation** — extract new lessons: decisions made, errors encountered and fixed, testing/verification steps used, anything that caused confusion or required backtracking
3. **Skills directory (`.opencode/skills/*/SKILL.md`)** — skill methodologies evolve across sessions; extract lessons from how the skills themselves were revised
4. **Plan files (`docs/plans/PLAN_*.md`)** — persistent decision artifacts contain design rationale and tradeoff context
5. **Source code** — read relevant files for observable patterns: modularization, imports, error handling, state management
6. **Config files** — tool configs, CI setup, formatter/linter configs for repeatable patterns

This skill itself — `update-best-practices/SKILL.md` — is also a source.

**Push for root pattern extraction:** For every candidate lesson, ask: "Is this the symptom or the root cause?" Surface-level = "Don't accept a WebSocket twice." Root = "When extracting helper functions, check for duplicated lifecycle calls between handler and helper." Extract the root pattern — it IS the universally applicable form. If the root pattern doesn't pass the universal applicability gate (too abstract, not practically useful), step back one level until it does.

#### 2. Read the Current Document
- Check if `docs/PROJECT_BEST_PRACTICES.md` exists — create it if not
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

#### 5. Extract, Filter & Update
For each candidate practice:

1. **Categorize** — assign to one of the category clusters (Code Structure, Quality, Operations, Process, UI, Meta)
2. **Check ✅ scope** — does it belong in PROJECT_BEST_PRACTICES.md?
3. **If not** → redirect to the correct document
4. **If yes** → write in Output Format (Context + Principle + Example + Why it matters)
5. **Apply conciseness check** — strip narrative, keep only the rule
6. **Check existing entries** — if the principle already exists, update the existing entry instead of creating a duplicate
7. **Add to document** — keep universal; project-specific names only in the **Example** field
8. **Update Key Takeaways** — after adding new entries, append corresponding takeaways to the ## Key Takeaways list at the end of the document. Each takeaway is a one-line bold phrase with a short description.

#### 6. Verify
- [ ] Content's PRIMARY purpose identified and routed to the correct document
- [ ] Content doesn't already exist in another document — cross-reference instead of duplicate
- [ ] If content spans multiple categories, assigned to the PRIMARY category
- [ ] All new entries follow Output Format (Context + Principle + Example + Why it matters)
- [ ] Conciseness applied — no multi-sentence stories, each entry is a tight rule
- [ ] **Universality check** — the principle works on any project. It is framed generically: a developer working on a different codebase should be able to apply it without referencing this project's specific files, names, or architecture
- [ ] No duplication with existing entries (improve existing instead of creating new)
- [ ] Every entry passes the "Would someone miss this?" litmus test
- [ ] No excluded content remains — redirected if needed
- [ ] Document is concise — nothing fluff, all signal
- [ ] **Structural integrity** — section numbers are sequential and non-duplicate; no broken numbering gaps
- [ ] **Takeaway coverage** — each new entry has a corresponding entry in ## Key Takeaways
- [ ] **Markdown valid** — no obvious formatting issues (broken code fences, unclosed bold/italic)
- [ ] Key Takeaways updated with new entries if added

#### 7. Route Skill Improvements
If this session identified improvements to `update-best-practices/SKILL.md` itself:

- **Minor gaps** (wording, format tweaks, missing edge cases) → fix in-place, list the changes in your output
- **Significant gaps** (structural changes, missing phases, broken workflow) → do not fix in-place. Present as candidates in the Gate summary so the user can decide
