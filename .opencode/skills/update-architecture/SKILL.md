---
name: update-architecture
description: Analyze the current codebase and update `ARCHITECTURE.md` to be accurate, complete, and within its defined scope. Trigger when the user says "update architecture", "sync architecture doc", "architecture is outdated", or similar.
---

## What I do
- Read the existing `docs/ARCHITECTURE.md` (if it exists)
- Mine the entire codebase and session history to understand the current technical structure, including modules, data flow, and design rationale
- Identify outdated, missing, or out-of-scope content
- Don't rewrite the entire document — only update sections that are outdated or missing content
- Update the document to reflect the current technical structure of the project
- Write or update `docs/ARCHITECTURE.md` in standardized format
- Redirect any out-of-scope content to the correct document

---

## Scope
Technical structure reference. Answers "How is it built?", "What are the modules?", "How do I modify it?".

---

## Audience
- Developers working on the codebase
- AI agents making code changes
- Technical reviewers

---

## Content Scope

### ✅ What to Include
- Complete project file tree with descriptions
- Module descriptions (internal logic, not user benefits)
- Key functionalities list (technical focus)
- Data flow — MUST include API endpoints and WebSocket events
- Key design decisions — why certain patterns were chosen
- Import structure and dependency graph
- Running instructions (technical)
- Modifying instructions (how to add routes, events, etc.)
- Critical implementation details (match expiry, default rooms, cleanup thread, etc.)

### ❌ What NOT to Include — Redirect Instead
```
Is it about...
├── Actual content from any document? → The document itself
├── User-facing setup instructions/usage/feature/benefits? Installation or setup instructions? → README.md
├── Technical structure/modules/file tree? Project-specific implementation ? Data flow with endpoint names? Module descriptions? → ARCHITECTURE.md ✅
├── Product vision/pitch/user journey? Problem statement? → SPECIFICATIONS.md
├── Demo presentation? Detailed demo walkthrough? Demo step-by-step instructions? → DEMO_GUIDE.md
├── AI agent permissions? Agent operational rules? AI agent file ownership? → AGENTS.md
├── Universal coding patterns? Best practices? Lessons learned? → PROJECT_BEST_PRACTICES.md
└── Doc scope or content boundaries? → DOCUMENT_GUIDELINES.md
```
**Developer context clarification:** 
Developers needing *product context* (what to build and why) → SPECIFICATIONS.md. 
Developers needing *implementation context* (how to build it, endpoints, modules) → ARCHITECTURE.md.

If content belongs elsewhere, note it with: `→ Redirect to <filename>` — do not include it in `ARCHITECTURE.md`.

---

## Content Boundaries
- **Module Descriptions:** Internal logic only — not user benefits or marketing language
- **Data Flow:** MUST include API endpoints (e.g., `POST /api/events`) and WebSocket events
- **Key Functionalities:** Technical list — not marketing language
- **Design Decisions:** Include the *why*, not just the *what*

---

## Steps

### 1. Read the Codebase
Scan all source files to understand the current technical structure:
- What modules exist and what does each do?
- What are all current API endpoints and WebSocket events?
- What are the import dependencies between modules?
- What critical implementation details exist (expiry logic, thread behavior, in-memory state, etc.)?
- What design decisions are visible in the code structure?

### 2. Check Session History for Design Rationale
Review the current conversation for:
- Explanations of *why* a pattern was chosen (not just what was built)
- Trade-offs discussed that aren't reflected in code comments
- Decisions made during debugging that reveal architectural intent

Capture only rationale — not session-specific debugging details.

### 3. Read the Current Document
- Check if `ARCHITECTURE.md` exists — create it if not
- Read existing content section by section
- Flag anything outdated, missing, or out of scope

### 4. Identify Gaps and Issues
For each section in ✅ What to Include:
- Does it exist in the current document?
- Is it accurate against the codebase?
- Is the file tree current? Are all modules described?
- Does the data flow reflect all current endpoints and events?

For each existing section in the document:
- Does it belong here per the ❌ table?
- If not → mark for redirect

### 5. Update the Document
- Add missing sections
- Fix outdated content to match the codebase
- Remove or redirect out-of-scope content
- Keep language technical — internal logic, not user benefits
- File tree must reflect actual directory structure
- Data flow must reference actual endpoint names
- Don't rewrite the entire document — only update sections that are outdated or missing content
- Keep it concise - avoid unnecessary detail, but ensure all critical technical information is included

### 6. Verify
Read back the updated document and confirm:
- [ ] File tree matches actual project structure
- [ ] All modules are described with internal logic (not benefits)
- [ ] Data flow includes all current API endpoints and WebSocket events
- [ ] Design decisions include the *why*, not just the *what*
- [ ] No user-facing benefit language — technical audience only
- [ ] No ❌ content remains — redirected if needed
- [ ] Modifying instructions are accurate for the current codebase
- [ ] Conciseness is applied — no unnecessary detail, but all critical technical information is included

---

## Anti-Duplication Rules
1. **One purpose per document** — if content fits two documents, choose the PRIMARY purpose
2. **Cross-reference, don't copy** — use `[See README.md](README.md)` for user-facing setup instead of duplicating
3. **Summary here, details there** — README.md gets summary tables; ARCHITECTURE.md gets detailed descriptions
4. **Audience-first** — if audience overlaps, choose the document with the MOST RELEVANT audience

---

## Checklist Before Adding Content
- [ ] I've identified the PRIMARY purpose of the content
- [ ] I've checked the ❌ What NOT to Include section
- [ ] I've verified the content doesn't already exist in another document
- [ ] I've used the Decision Tree to confirm it belongs in ARCHITECTURE.md
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