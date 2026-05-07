---
name: update-readme
description: Analyze the current codebase and update `README.md` to be accurate, complete, and within its defined scope. Trigger when the user says "update readme", "sync readme", "readme is outdated", or similar.
---

## What I do
- Read the existing `docs/README.md` (if it exists)
- Mine the session conversation and existing code for relevant information to update the project description, features, setup instructions, and usage guidelines
- Identify outdated, missing, or out-of-scope content
- Don't rewrite the entire document — only update sections that are outdated or missing content
- Update the document to reflect the current state of the project
- Write or update `docs/README.md` in standardized format
- Redirect any out-of-scope content to the correct document

---

## Scope
User-facing entry point for anyone discovering the project. Answers "What is it?", "How do I use it?", "How do I run it?".

---

## Audience
- End users (event organizers, attendees)
- New developers joining the project
- Anyone visiting the repository for the first time

---

## Content Scope

### ✅ What to Include
- Project description and tagline
- Feature list (user-facing, benefit-focused)
- Quick start instructions (install, run)
- How to use (step-by-step for each user type)
- Technical details (tech stack, simplified architecture)
- API endpoints table (summary only)
- Testing instructions
- Deployment options
- Privacy & security information
- Troubleshooting common issues
- Contributing guidelines reference
- License information

### ❌ What NOT to Include — Redirect Instead
```
Is it about...
├── Actual content from any document? → The document itself
├── User-facing setup instructions/usage/feature/benefits? Installation or setup instructions? → README.md ✅
├── Technical structure/modules/file tree? Project-specific implementation ? Data flow with endpoint names? Module descriptions? → ARCHITECTURE.md
├── Product vision/pitch/user journey? Problem statement? → SPECIFICATIONS.md
├── Demo presentation? Detailed demo walkthrough? Demo step-by-step instructions? → DEMO_GUIDE.md
├── AI agent permissions? Agent operational rules? AI agent file ownership? → AGENTS.md
├── Universal coding patterns? Best practices? Lessons learned? → PROJECT_BEST_PRACTICES.md
└── Doc scope or content boundaries? → DOCUMENT_GUIDELINES.md
```

If content belongs elsewhere, note it with: `→ Redirect to <filename>` — do not include it in `README.md`.

---

## Content Boundaries
- **Features section:** User-facing benefits, not technical implementation
- **Technical Details:** High-level only (max 2-3 paragraphs)
- **API Endpoints:** Summary table only — no detailed request/response examples

---

## Steps

### 1. Read the Codebase
Scan the project files to understand the current state:
- What does the app do? Has anything changed since the last README update?
- What are the install and run steps based on actual files (`requirements.txt`, `app.py`, etc.)?
- What endpoints exist? What features are live?
- What env vars or config is required?

### 2. Read the Current Document
- Check if `README.md` exists — create it if not
- Read existing content section by section
- Flag anything that is outdated, missing, or out of scope

### 3. Identify Gaps and Issues
For each section in ✅ What to Include:
- Does it exist in the current README?
- Is it accurate against the codebase?
- Is it written for the right audience (user-facing, not technical)?

For each existing section in the README:
- Does it belong here per the ❌ table?
- If not → mark for redirect

### 4. Update the Document
- Add missing sections
- Fix outdated content to match the codebase
- Remove or redirect out-of-scope content
- Keep language user-facing — benefits, not implementation
- Don't rewrite the entire document — only update sections that are outdated or missing content
- Keep it concise — no unnecessary detail, but ensure all critical information for users and new developers is included

### 5. Verify
Read back the updated document and confirm:
- [ ] All ✅ sections are present and accurate against the codebase
- [ ] No ❌ content remains — redirected if needed
- [ ] Features section describes benefits, not internals
- [ ] Technical details are high-level only (max 2-3 paragraphs)
- [ ] API endpoints are summary table only — no request/response detail
- [ ] Install and run steps work based on actual project files
- [ ] Language is appropriate for a non-technical first-time visitor
- [ ] Conciseness is applied — no unnecessary detail, but all critical information is included


---

## Anti-Duplication Rules
1. **One purpose per document** — if content fits two documents, choose the PRIMARY purpose
2. **Cross-reference, don't copy** — use `[See ARCHITECTURE.md](ARCHITECTURE.md)` instead of duplicating
3. **Summary here, details there** — README.md gets summary tables; ARCHITECTURE.md gets detailed descriptions
4. **Audience-first** — if audience overlaps, choose the document with the MOST RELEVANT audience

---

## Checklist Before Adding Content
- [ ] I've identified the PRIMARY purpose of the content
- [ ] I've checked the ❌ What NOT to Include section
- [ ] I've verified the content doesn't already exist in another document
- [ ] I've used the Decision Tree to confirm it belongs in README.md
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