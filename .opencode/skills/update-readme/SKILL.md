---
name: update-readme
description: Analyze the current codebase and update `README.md` to be accurate, complete, and within its defined scope. Trigger when the user says "update readme", "sync readme", "readme is outdated", or similar.
---

## Purpose
User-facing entry point for anyone discovering the project. Answers "What is it?", "How do I use it?", "How do I run it?".

Mine the codebase and session history, then update or create `README.md` so new users and developers can understand, set up, and use the project without digging into internals.

---

## Audience
- End users (event organizers, attendees)
- New developers joining the project
- Anyone visiting the repository for the first time

---

## Content Rules

### Quality Gates
Every piece of content must pass these three checks:

- **User-facing language:** Describe benefits and outcomes, not implementation details. A non-technical first-time visitor should understand it.
- **Accuracy against current project:** Every claim about setup, features, and usage must be verifiable against the actual codebase.
- **Minimum necessary detail:** If a non-technical first-time visitor wouldn't care about it, it doesn't belong here.

### What to Include
- Project description and tagline — what it is and why it exists, in one paragraph
- Feature list — user-facing benefits, not technical internals. Describe what users can do, not how it works.
- Quick start instructions — condensed only: install dependencies, run the app, minimum steps to get going. Link to `ARCHITECTURE.md` for the full technical startup sequence.
- How to use — step-by-step for each user type (organizer, attendee). Show the workflow from their perspective.
- Technical details — high-level only: tech stack and simplified architecture, max 2-3 paragraphs. Enough for a curious user to understand the stack, not enough to build from. One-liner per technology (e.g., "Built with FastAPI + SQLite"). Full tech stack rationale goes in `SPECIFICATIONS.md`.
- API endpoints — one-line cross-reference only: "See [ARCHITECTURE.md](ARCHITECTURE.md) for full endpoint and WebSocket event tables." Do not duplicate endpoint tables here.
- Testing instructions — link to contributing guide; do not own full test documentation here
- Deployment options — how to deploy for production use
- Privacy and security information — user-facing summary only: what data is collected, what is not, and what users control. Full privacy model and hard constraints go in `SPECIFICATIONS.md`.
- Value proposition and success metrics — user-facing description of what users gain from the product and how it makes them feel (e.g., safe, confident, connected)
- Pitch line — one-sentence summary of the product's core value, expressed in user-facing language
- Troubleshooting common issues — problems users have encountered and how to resolve them

### What NOT to Include

| Document | Routes content about | Audience | Content Type |
|----------|---------------------|----------|--------------|
| **README.md** | User-facing setup, usage, features, benefits, installation ✅ | End users, new developers | User-facing, practical |
| **ARCHITECTURE.md** | Technical structure, modules, file tree, implementation, data flow | Developers, AI agents | Technical, implementation |
| **SPECIFICATIONS.md** | Product vision, user journey, problem statement, pitch, Out of Scope, privacy | Product owners, devs, AI agents, evaluators/stakeholders | Product, pitch, vision, spec, privacy |
| **DEMO_GUIDE.md** | Demo presentation, walkthrough, step-by-step instructions | Presenters, evaluators | Practical, step-by-step |
| **AGENTS.md** | AI agent permissions, rules, file ownership, operational constraints | AI agents | Operational, constraints |
| **PROJECT_BEST_PRACTICES.md** | Universal coding patterns, best practices, lessons learned | All developers, AI | Educational, guidelines |
| **DOCUMENT_GUIDELINES.md** | Doc scope, content boundaries, governance | Developers, AI agents | Meta, governance |

**Anti-duplication:**
- One purpose per document — if content fits two documents, choose the PRIMARY purpose
- Cross-reference, don't copy — `[See ARCHITECTURE.md](ARCHITECTURE.md)` instead of duplicating content
- Summary here, details there — README gets summary and navigation-level overviews; other docs get full detail
- Audience-first — if audience overlaps, choose the document with the MOST RELEVANT audience
- If content belongs elsewhere, note it with `→ Redirect to <filename>` — do not include it in `README.md`

---

---

## Workflow

### 1. Investigate the Codebase
Read highest-value sources first in this priority order:

1. `README*` (if it exists — check what needs updating)
2. Root manifests (`package.json`, `pyproject.toml`, etc.), lockfiles, requirements
3. Source code entrypoints — what does the app do for the user end-to-end?
4. Existing `ARCHITECTURE.md`, `SPECIFICATIONS.md` — for accurate cross-references

For each source, extract:
- What does the app do for the user? Has anything changed since the last update?
- What are the install and run steps based on actual files?
- What features are live and user-facing?
- What env vars or config is required for setup?

Focus on *what the user experiences*, not *how it's built internally*.

### 2. Read the Current Document
- Check if `README.md` exists — create it if not
- Read existing content section by section
- Flag anything outdated (wrong setup steps, missing features, stale description)
- Flag missing items from **What to Include**
- Flag content that violates the boundary rules above

### 3. Identify Gaps and Issues
For each item in **What to Include**:
- Does it exist in the current README? Is it accurate against the codebase?
- Is it written for the right audience (user-facing, not technical)?
- Does it respect the boundary rules (not duplicating ARCHITECTURE, SPECS, etc.)?

For each existing section:
- Does it belong here per **What NOT to Include**?
- If not → mark for redirect

### 4. Update the Document
- Add missing sections
- Fix outdated content to match the codebase
- Remove or redirect out-of-scope content
- Keep language user-facing — benefits, outcomes, not implementation
- Quick start steps must work based on actual project files; link to `ARCHITECTURE.md` for full detail
- Technical details: high-level only (max 2-3 paragraphs), one-liner per technology
- API endpoints: one-line cross-reference to `ARCHITECTURE.md` only — no tables here
- Privacy: user-facing summary only — link to `SPECIFICATIONS.md` for full model
- Don't rewrite the entire document — only update outdated or missing sections
- Keep it concise — all critical information for users and new developers, no implementation detail

### 5. Verify
- [ ] Content's PRIMARY purpose identified and routed to the correct document
- [ ] Content doesn't already exist in another document — cross-reference instead of duplicate
- [ ] Features section describes user benefits, not technical internals
- [ ] Value proposition and success metrics written in user-facing language (how the product makes users feel)
- [ ] Pitch line is a one-sentence user-facing summary — not a technical description
- [ ] Technical details are high-level only (max 2-3 paragraphs, one-liner per technology)
- [ ] Quick start is condensed only — links to `ARCHITECTURE.md` for full startup sequence
- [ ] Install and run steps work based on actual project files
- [ ] Language is appropriate for a non-technical first-time visitor
- [ ] Every claim verified against the current codebase
- [ ] No excluded content remains — redirected if needed
- [ ] Every line passes the "Would someone miss this?" litmus test
- [ ] Document is concise — no unnecessary detail, but all critical information for users is included