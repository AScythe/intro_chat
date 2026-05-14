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
Every piece of content must pass these five checks:

- **"Would a first-time visitor miss this?" litmus test:** Every line must answer "Would a non-technical first-time visitor likely miss this without help?" If not, leave it out.
- **User-facing language:** Describe benefits and outcomes, not implementation details. A non-technical first-time visitor should understand it.
- **Accuracy against current project:** Every claim about setup, features, and usage must be verifiable against the actual codebase.
- **Minimum necessary detail:** If a non-technical first-time visitor wouldn't care about it, it doesn't belong here.
- **User-friendly formatting:** Emojis are acceptable in feature lists, headings, and success metrics to improve scannability for a non-technical audience.

### What to Include
- Project description and tagline — what it is and why it exists, in one paragraph
- Feature list — user-facing benefits, not technical internals.
- Quick start instructions — condensed only: install dependencies, run the app, minimum steps to get going.
- How to use — step-by-step for each user type (organizer, attendee). Show the workflow from their perspective.
- Technical details — high-level only: tech stack and simplified architecture, max 2-3 paragraphs. One-liner per technology.
- Testing instructions — inline runnable commands for common test suites.
- Deployment options — how to deploy for production use.
- Privacy and security information — user-facing summary only: what data is collected, what is not, and what users control.
- Value proposition and success metrics — user-facing description of what users gain from the product.
- Pitch line — one-sentence summary of the product's core value, expressed in user-facing language.
- Troubleshooting common issues — problems users have encountered and how to resolve them.

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

**Ask the user** only when the codebase can't answer: target audience preferences, expected user expertise level. One short batch. Never ask what the code makes clear.

**Check session history** for user-facing changes reported during the session — feature changes, setup step changes, configuration changes.

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
- Remove or redirect out-of-scope content per the **What NOT to Include** table
- Don't rewrite the entire document — only update what's changed
- Keep language user-facing — benefits, outcomes, not implementation
- Quick start steps must work based on actual project files; include venv setup and path-drift warning where applicable
- Technical details: high-level only (max 2-3 paragraphs), one-liner per technology
- API endpoints: one-line cross-reference to `ARCHITECTURE.md` only — no tables here
- Privacy: user-facing summary only — link to `SPECIFICATIONS.md` for full model
- Keep it concise — all critical information for users and new developers, no implementation detail

### 5. Verify

**Integrity & Scope:**
- [ ] Every piece of content belongs in this document per the What NOT to Include table — redirect if it belongs elsewhere
- [ ] No content duplicated from another document — use `[See <DOC>.md](<DOC>.md)` cross-references instead
- [ ] All claims verified against the current codebase
- [ ] Every line passes the litmus test defined in Quality Gates
- [ ] Document omits everything a non-technical first-time visitor doesn't need — no speculative, aspirational, or unverifiable content

**Document-Specific Checks:**
- [ ] Features section describes user benefits, not technical internals
- [ ] Value proposition and success metrics written in user-facing language
- [ ] Pitch line is a one-sentence user-facing summary
- [ ] Technical details are high-level only (max 2-3 paragraphs, one-liner per technology)
- [ ] Quick start is the canonical source for install/run commands — condensed and accurate
- [ ] Install and run steps work based on actual project files
- [ ] If features were added/removed/renamed, verify README (benefits), SPECS (rationale), and DEMO_GUIDE (demo steps) are all synced
- [ ] Language is appropriate for a non-technical first-time visitor