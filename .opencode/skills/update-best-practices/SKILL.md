---
name: update-best-practices
description: Extract universal best practices from the current coding session and existing codebase, then write them into `docs/PROJECT_BEST_PRACTICES.md`. Trigger when the user says "update best practices", "document lessons learned", or similar.
---

## What I do
- Read the existing `docs/PROJECT_BEST_PRACTICES.md` (if it exists)
- Mine the session conversation and existing code for reusable, universal lessons
- Categorize extracted practices against the defined content scope
- Identify outdated, missing, or out-of-scope content
- Don't rewrite the entire document — only update sections that are outdated or missing content
- Update the document to improve and refine the current best practices for the project
- Write or update `docs/PROJECT_BEST_PRACTICES.md` in standardized format
- Redirect any out-of-scope content to the correct document

---

## Output Format

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

---

## Content Scope

### ✅ What to Include
Extract practices from these categories (include only what the session produced):
- **Modularization** — responsibility patterns, circular import prevention, leaf vs internal modules
- **Configuration** — tool configs, environment setup (e.g., `.opencode/opencode.json`)
- **Error Handling** — error types encountered, fix strategies, prevention patterns
- **State Management** — how state is structured, passed, or isolated
- **Testing** — syntax checks, unit tests, integration tests, verification steps used
- **Documentation** — doc structure, scope distinctions, cross-referencing
- **Debugging Process** — how issues were isolated, tools used (grep, read, bash)
- **Architecture Decisions** — universal patterns only (e.g., "separate I/O from business logic"); project-specific decisions go in `ARCHITECTURE.md`
- **AI-Assisted Development** — prompting patterns, skill usage, agent behavior
- **Frontend Practices** — UI patterns, JS module rules, Jinja2 conventions
- **Version Control** — commit discipline, branching, what to never commit
- **Session Lessons Learned** — must include Context + Why it matters

### ❌ What NOT to Include — Redirect Instead
```
├── Actual content from any document? → The document itself
├── User-facing setup instructions/usage/feature/benefits? Installation or setup instructions? → README.md
├── Technical structure/modules/file tree? Project-specific implementation ? Data flow with endpoint names? Module descriptions? → ARCHITECTURE.md
├── Product vision/pitch/user journey? Problem statement? → SPECIFICATIONS.md
├── Demo presentation? Detailed demo walkthrough? Demo step-by-step instructions? → DEMO_GUIDE.md
├── AI agent permissions? Agent operational rules? AI agent file ownership? → AGENTS.md
├── Universal coding patterns? Best practices? Lessons learned? → PROJECT_BEST_PRACTICES.md ✅
└── Doc scope or content boundaries? → DOCUMENT_GUIDELINES.md
```

If content belongs elsewhere, note it with: `→ Moved to <filename>` — do not include it in `PROJECT_BEST_PRACTICES.md`.

---

## Steps

### 1. Analyze the Session
Review the conversation for:
- Decisions made (structure, patterns, tools)
- Errors encountered and how they were fixed
- Testing or verification steps used
- Anything that caused confusion or required backtracking

Generalize everything to universal principles — strip project-specific names and details.

### 2. Analyze Existing Code Structure
Read relevant source files and look for patterns worth capturing:
- What modularization or import patterns does the code reveal?
- What error handling or state management approaches are observable?
- What structural decisions appear intentional and repeatable?

Extract any universal lessons not already in the doc.

### 3. Read Current Document
- Check if `docs/PROJECT_BEST_PRACTICES.md` exists — create it if not
- Read existing content to avoid duplication
- Identify gaps based on what the session produced

### 4. Extract & Filter Practices
For each candidate practice:
1. Check it against ✅ scope — does it belong here?
2. If not → redirect to the correct document (see ❌ table)
3. If yes → write it in the output format above
4. Apply conciseness check:
   - ❌ "We encountered a problem where indentation was incorrect in `__init__.py` which caused a syntax error"
   - ✅ "Indentation errors in `__init__.py` — verify after every edit"

### 5. Update Document
- Add new sections or update existing ones in `docs/PROJECT_BEST_PRACTICES.md`
- Keep all principles universal — use "your module", not specific file names, except in Examples
- One purpose per entry — no duplication across sections
- Don't rewrite the entire document — only update sections that are outdated or missing content
- Remove or redirect out-of-scope content
- Keep it concise 

### 6. Verify
Read back the updated document and confirm:
- [ ] All new entries follow the output format (Context + Principle + Example + Why it matters)
- [ ] No project-specific content leaked in (architecture, vision, permissions)
- [ ] No duplication with existing entries
- [ ] Examples are accurate and reference project files as context only
- [ ] No ❌ content remains — redirected if needed
- [ ] Each entry is concise — no unnecessary detail, but all critical information is included