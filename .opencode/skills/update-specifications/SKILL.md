---
name: update-specifications
description: Analyze the current product state and update `SPECIFICATIONS.md` to be accurate, complete, and within its defined scope. Trigger when the user says "update specs", "update specifications", "specs are outdated", or similar.
---

## Purpose
Product specification and vision document. Answers "Why does this exist?", "What problem does it solve?", "How does the user journey work?", "What features should I build that align with the vision?".

Mine the codebase and session history, then update or create `docs/SPECIFICATIONS.md` so product owners, developers, and stakeholders share a clear understanding of the product vision and the decisions guiding development.

---

## Audience
- Product owners and managers
- Developers and AI agents needing product context to build features aligned with the vision
- Evaluators and stakeholders — investors, judges, or anyone assessing the product concept

---

## Content Rules

### Quality Gates
Every piece of content must pass these three checks:

- **"Would a product owner, developer, or evaluator miss this?" litmus test:** Every line must answer "Would a product owner, developer, or evaluator likely miss this without help?" If not, leave it out.
- **Product-focused language:** Describe purpose, vision, and user experience in plain language — no endpoint names, no module internals.
- **Actionable for development:** Feature descriptions must include purpose and rationale so developers can make informed implementation decisions.

### What to Include
- Problem statement and context (what pain point exists, who experiences it, why it matters)
- Solution description and pitch (what the product does at a high level, why it solves the problem)
- User journey / core logic flow — product-focused steps in plain language, readable by a non-technical evaluator.
- Feature descriptions with purpose and rationale — what each feature does and **why** it exists.
- Product decisions and rationale — why certain approaches were chosen (e.g., timer duration, anonymity model). Vision rationale.
- Target user personas — who the product serves and why they benefit.
- Feature priority and status — what's implemented vs. planned, to guide what to build next
- Product constraints / Out of Scope — standalone section listing what the product explicitly does NOT do and why.
- Privacy and trust model — user-facing table (identity, location, data, control) plus a "Hard Constraints" sub-section.
- Tech stack with rationale — include a "Why?" column for each technology.
- Future enhancements / bonus features — clearly marked as not yet implemented

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

### 1. Investigate the Codebase
Read highest-value sources first in this priority order:

1. Existing `SPECIFICATIONS.md` (check what needs updating)
2. Source code entrypoints — what does the app do for the user end-to-end?
3. Root manifests (`package.json`, `pyproject.toml`, etc.)
4. `README*` for feature descriptions and user-facing framing

For each source, extract:
- What does the app do for the user end-to-end?
- What features are live vs. planned?
- What privacy or trust behaviors are implemented?
- Has the user journey changed since the last spec update?

Focus on *what the product does and why*, not *how it's built*. Review session history for product rationale, design intent discussions, and decisions that shaped the product direction.

**Ask the user** only when the product state and session can't answer: product vision gaps, priority decisions. One short batch. Never ask what the product makes clear.

### 2. Read the Current Document
- Check if `docs/SPECIFICATIONS.md` exists — create it if not
- Read existing content section by section
- Flag anything outdated, missing, or out of scope
- Flag feature descriptions that lack purpose/rationale

### 3. Identify Gaps and Issues
For each item in **What to Include**:
- Does it exist in the current document? Is it accurate against the current product state?
- Is it written for the full audience (product owners, developers needing product context, and evaluators/stakeholders)?

For each existing section:
- Does it belong here per **What NOT to Include**?
- If not → mark for redirect

### 4. Update the Document
- Add missing sections
- Fix outdated content to match the current product state
- Remove or redirect out-of-scope content per the **What NOT to Include** table
- Don't rewrite the entire document — only update what's changed
- Keep language product-focused — no endpoint names, no module internals
- User journey steps must be readable by a non-technical evaluator
- Feature descriptions must state purpose and benefit so developers can make informed implementation decisions
- Include product rationale (e.g., "Why 30 seconds?", "Why anonymous?") — these help developers understand design intent
- Tech stack must include a "Why?" rationale column
- Privacy section must include both user-facing table AND Hard Constraints sub-section
- Out of Scope must be a standalone section — each item is a hard boundary, not aspirational
- Future enhancements must be clearly marked as not yet implemented
- Phase-specific items (pitch line, value proposition for evaluators) must be marked *(phase-specific: remove or archive post-launch)*
- Don't rewrite the entire document — only update outdated or missing sections

### 5. Verify

**Integrity & Scope:**
- [ ] Every piece of content belongs in this document per the What NOT to Include table — redirect if it belongs elsewhere
- [ ] No content duplicated from another document — use `[See <DOC>.md](<DOC>.md)` cross-references instead
- [ ] All claims verified against the current product state and codebase
- [ ] Every line passes the litmus test defined in Quality Gates
- [ ] Document omits everything a product owner or evaluator doesn't need — no speculative, aspirational, or unverifiable content

**Document-Specific Checks:**
- [ ] Problem statement is clear and compelling
- [ ] User journey described in plain language — no endpoint names
- [ ] Feature descriptions include purpose/rationale suitable for guiding development decisions
- [ ] Product decisions capture vision rationale (not technical trade-offs)
- [ ] Privacy section includes both user-facing table and Hard Constraints sub-section
- [ ] Out of Scope lists hard boundaries only — no aspirational items
- [ ] No endpoint names, route definitions, or implementation-level detail anywhere
- [ ] If features were added/removed/renamed, verify SPECS (rationale), README (benefits), and DEMO_GUIDE (demo steps) are all synced
- [ ] Language appropriate for product owners, developers, and evaluators — not end users