---
name: update-agents
description: Analyze the current codebase and update `AGENTS.md` to be accurate, complete, and within its defined scope. Trigger when the user says "update agents", "sync agents doc", "agents.md is outdated", or similar.
---

## What I do
- Read the existing `docs/AGENTS.md` (if it exists)
- Mine the codebase and session history to map the operational state: file permissions, commands, API/WebSocket endpoints, env vars, and new failure modes.
- Identify outdated, missing, or out-of-scope content
- Don't rewrite the entire document — only update sections that are outdated or missing content
- Update the document to reflect the current operational guidelines for AI agents in the project so the agents can operate accurately within the project
- Write or update `docs/AGENTS.md` in standardized format
- Redirect any out-of-scope content to the correct document

---

## Scope
AI agent operational guidelines. Answers "What can agents touch?", "What commands do they use?", "What are they forbidden from doing?".

---

## Audience
- AI agents (e.g., opencode)
- Developers setting up agent permissions

---

## Content Scope

### ✅ What to Include
- Project overview (1 paragraph + key functionalities summary)
- Architecture summary (key components only — enough to navigate, not full detail)
- Environment setup (Python version, venv, production env vars)
- File ownership table — location, role, agent policy (✅ safe / ⚠️ caution / ❌ forbidden)
- Core commands (setup + test commands)
- Agent rules — explicit always/never constraints
- Verification requirements — what must pass before a task is done
- API endpoints + WebSocket events tables
- Out of scope list (forbidden implementations)
- Privacy requirements (hard requirements only)

### ❌ What NOT to Include — Redirect Instead
```
Is it about...
├── Actual content from any document? → The document itself
├── User-facing setup instructions/usage/feature/benefits? Installation or setup instructions? → README.md
├── Technical structure/modules/file tree? Project-specific implementation ? Data flow with endpoint names? Module descriptions? → ARCHITECTURE.md
├── Product vision/pitch/user journey? Problem statement? → SPECIFICATIONS.md
├── Demo presentation? Detailed demo walkthrough? Demo step-by-step instructions? → DEMO_GUIDE.md
├── AI agent permissions? Agent operational rules? AI agent file ownership? → AGENTS.md ✅
├── Universal coding patterns? Best practices? Lessons learned? → PROJECT_BEST_PRACTICES.md
└── Doc scope or content boundaries? → DOCUMENT_GUIDELINES.md
```

**Agent context clarification:** 
AI agents needing *operational context* (what files can I touch, what commands can I run, what are my constraints) → AGENTS.md. 
AI agents needing *product context* (what should I build and why, what is the product vision, who are the users) → SPECIFICATIONS.md.

If content belongs elsewhere, note it with: `→ Redirect to <filename>` — do not include it in `AGENTS.md`.

---

## Content Boundaries
- **File Ownership:** MUST include agent policy column (✅ safe, ⚠️ caution, ❌ forbidden) — not just file names
- **Agent Rules:** Explicit always/never — no "consider" or "try to"
- **Out of Scope:** Explicit forbidden items — not suggestions
- **Privacy Requirements:** Hard requirements only — not guidelines
- **Architecture Summary:** Key components only — enough to navigate; full detail goes in `ARCHITECTURE.md`

---

## Steps

### 1. Read the Codebase
Scan the project to understand the current operational state:
- What files exist and which are safe/restricted for agents to edit?
- What are the current setup, run, and test commands?
- What API endpoints and WebSocket events are defined?
- What env vars are required?
- Are there any new gotchas or failure modes introduced since the last update?

### 2. Read the Current Document
- Check if `AGENTS.md` exists — create it if not
- Read existing content section by section
- Flag anything outdated (wrong commands, missing files, stale endpoints)
- Flag anything missing from ✅ What to Include

### 3. Identify Gaps and Issues
For each section in ✅ What to Include:
- Does it exist in the current document?
- Is it accurate against the codebase?
- Does the file ownership table reflect all current files with correct policies?
- Do API endpoint and WebSocket tables match the codebase?

For each existing section in the document:
- Does it belong here per the ❌ table?
- If not → mark for redirect

### 4. Update the Document
- Add missing sections
- Fix outdated content to match the codebase
- Remove or redirect out-of-scope content
- Rules must be imperative and unambiguous — agents cannot interpret vague language
- File ownership policies must be explicit (✅ / ⚠️ / ❌)
- Don't rewrite the entire document — only update sections that are outdated or missing content
- Keep it concise — agents read the entire file on every task

### 5. Verify
Read back the updated document and confirm:
- [ ] File ownership table covers all current files with explicit policies
- [ ] All commands are accurate and runnable against the current project
- [ ] API endpoints and WebSocket events match the codebase
- [ ] Agent rules are imperative — no vague language
- [ ] Out of scope list covers all forbidden implementations
- [ ] Privacy requirements are hard constraints, not guidelines
- [ ] No ❌ content remains — redirected if needed
- [ ] Document is concise enough for an agent to read entirely on each task

---

## Anti-Duplication Rules
1. **One purpose per document** — if content fits two documents, choose the PRIMARY purpose
2. **Cross-reference, don't copy** — use `[See ARCHITECTURE.md](ARCHITECTURE.md)` for full module details instead of duplicating
3. **Summary here, details there** — AGENTS.md gets a navigation-level architecture summary; ARCHITECTURE.md gets full detail
4. **Audience-first** — if audience overlaps, choose the document with the MOST RELEVANT audience

---

## Checklist Before Adding Content
- [ ] I've identified the PRIMARY purpose of the content
- [ ] I've checked the ❌ What NOT to Include section
- [ ] I've verified the content doesn't already exist in another document
- [ ] I've used the Decision Tree to confirm it belongs in AGENTS.md
- [ ] If content spans multiple purposes, I've split it appropriately
- [ ] I've added cross-references instead of duplicating

---

## Quick Reference Table
| Document | Audience | Primary Purpose | Update Trigger | Content Type |
|----------|----------|-----------------|----------------|--------------|
| **README.md** | End users, new developers | Entry point: what, how, setup | Features or setup change | User-facing, practical |
| **ARCHITECTURE.md** | Developers, AI agents | Technical structure reference | Code structure changes | Technical, implementation |
| **SPECIFICATIONS.md** | Product owners, developers, AI agents, stakeholders, judges | Product vision, user flow & product context | Product scope changes | Product, pitch, vision, specification |
| **DEMO_GUIDE.md** | Presenters, judges | Demo execution steps | Demo flow changes | Practical, step-by-step |
| **AGENTS.md** | AI agents (opencode) | Agent permissions & rules | File/command changes | Operational, constraints |
| **PROJECT_BEST_PRACTICES.md** | All developers, AI | Universal best practices | After each session | Educational, guidelines |
| **DOCUMENT_GUIDELINES.md** | Developers, AI agents | Doc scope & boundaries | New doc added | Meta, governance |