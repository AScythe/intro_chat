---
name: update-readme
description: Analyze the current codebase and update `README.md` to be accurate, complete, and within its defined scope. Trigger when the user says "update readme", "sync readme", "readme is outdated", or similar.
---

## Purpose
User-facing entry point for anyone discovering the project. Answers "What is it?", "How do I use it?", "How do I run it?".

Mine the codebase and session history, then update or create `docs/README.md` so new users and developers can understand, set up, and use the project without digging into internals.

---

## Audience
- End users (event organizers, attendees)
- New developers joining the project
- Anyone visiting the repository for the first time

---

## Content Rules

### Quality Gates
Every piece of content must pass these three checks:

- **"Would an agent miss this?" litmus test:** Every line must answer "Would an agent likely miss this without help?" If not, leave it out.
- **User-facing language:** Describe benefits and outcomes, not implementation details. A non-technical first-time visitor should understand it.
- **Accuracy against current project:** Every claim about setup, features, and usage must be verifiable against the actual codebase.

### What to Include
- Project description and tagline (what it is, why it exists)
- Feature list — user-facing benefits, not technical internals
- Quick start instructions (install dependencies, run the app)
- How to use — step-by-step for each user type (organizer, attendee)
- Technical details — high-level only (tech stack, simplified architecture, max 2-3 paragraphs)
- API endpoints — summary table only, no detailed request/response examples
- Testing instructions (how to run tests)
- Deployment options
- Privacy and security information (user-facing framing)
- Troubleshooting common issues
- Contributing guidelines reference (link, not full content)
- License information

### What NOT to Include
| Document | Routes content about | Audience | Update Trigger | Content Type |
|----------|---------------------|----------|----------------|--------------|
| **README.md** | User-facing setup, usage, features, benefits, installation ✅ | End users, new developers | Feature or setup change | User-facing, practical |
| **ARCHITECTURE.md** | Technical structure, modules, file tree, implementation, data flow | Developers, AI agents | Code structure change | Technical, implementation |
| **SPECIFICATIONS.md** | Product vision, user journey, problem statement, pitch | Product owners, devs, AI, stakeholders | Product scope change | Product, pitch, vision, spec |
| **DEMO_GUIDE.md** | Demo presentation, walkthrough, step-by-step instructions | Presenters, judges | Demo flow change | Practical, step-by-step |
| **AGENTS.md** | AI agent permissions, rules, file ownership, operational constraints | AI agents (opencode) | File or command change | Operational, constraints |
| **PROJECT_BEST_PRACTICES.md** | Universal coding patterns, best practices, lessons learned | All developers, AI | After each session | Educational, guidelines |
| **DOCUMENT_GUIDELINES.md** | Doc scope, content boundaries, governance | Developers, AI agents | New doc added | Meta, governance |

**Never include in README.md:**
- Detailed module descriptions or file trees
- Implementation design decisions or trade-offs
- Product vision, user journey narrative, or pitch
- Demo walkthrough or presentation steps
- AI agent permissions or operational rules

**Anti-duplication:**
- One purpose per document — if content fits two documents, choose the PRIMARY purpose
- Cross-reference, don't copy — use `[See ARCHITECTURE.md](ARCHITECTURE.md)` instead of duplicating
- Summary here, details there — README.md gets summary tables; ARCHITECTURE.md gets detailed descriptions
- Audience-first — if audience overlaps, choose the document with the MOST RELEVANT audience

If content belongs elsewhere, note it with `→ Redirect to <filename>` — do not include it in `README.md`.

---

## Workflow

### 1. Investigate the Codebase
Read highest-value sources first in this priority order:

1. `README*` (if it exists — check what needs updating)
2. Root manifests (`package.json`, `pyproject.toml`, etc.), lockfiles, requirements
3. Source code entrypoints — what does the app do end-to-end?
4. Existing `README.md`, repo-local opencode config (`opencode.json`)

For each source, extract:
- What does the app do for the user? Has anything changed since the last update?
- What are the install and run steps based on actual files?
- What endpoints exist and what features are live?
- What env vars or config is required for setup?

Focus on *what the user experiences*, not *how it's built internally*.

### 2. Read the Current Document
- Check if `docs/README.md` exists — create it if not
- Read existing content section by section
- Flag anything outdated (wrong setup steps, missing features, stale description)
- Flag missing items from **What to Include**

### 3. Identify Gaps and Issues
For each item in **What to Include**:
- Does it exist in the current README? Is it accurate against the codebase?
- Is it written for the right audience (user-facing, not technical)?

For each existing section:
- Does it belong here per **What NOT to Include**?
- If not → mark for redirect

### 4. Update the Document
- Add missing sections
- Fix outdated content to match the codebase
- Remove or redirect out-of-scope content
- Keep language user-facing — benefits, outcomes, not implementation
- Quick start steps must work based on actual project files
- Technical details: high-level only (max 2-3 paragraphs)
- API endpoints: summary table only — no request/response detail
- Don't rewrite the entire document — only update outdated or missing sections
- Keep it concise — ensure all critical information for users and new developers is included

### 5. Verify
- [ ] Content's PRIMARY purpose identified and routed to the correct document
- [ ] Content doesn't already exist in another document — cross-reference instead of duplicate
- [ ] If content spans multiple purposes, split appropriately
- [ ] Features section describes benefits, not internals
- [ ] Technical details are high-level only (max 2-3 paragraphs)
- [ ] API endpoints are summary table only — no request/response detail
- [ ] Install and run steps work based on actual project files
- [ ] Language is appropriate for a non-technical first-time visitor
- [ ] Every claim verified against the current codebase
- [ ] No excluded content remains — redirected if needed
- [ ] Document is concise — no unnecessary detail, but all critical information for users is included
