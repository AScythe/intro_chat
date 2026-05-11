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
- Developers and AI agents needing product context to develop features aligned with the vision
- Product stakeholders — hackathon judges, investors, or anyone evaluating the product concept

---

## Content Rules

### Quality Gates
Every piece of content must pass these three checks:

- **"Would an agent miss this?" litmus test:** Every line must answer "Would an agent likely miss this without help?" If not, leave it out.
- **Product-focused language:** Describe purpose, vision, and user experience in plain language — no endpoint names, no module internals.
- **Actionable for development:** Feature descriptions must include purpose and rationale so developers can make informed implementation decisions.

### What to Include
- Problem statement and context (what pain point exists, why it matters)
- Solution description and pitch (what the product does at a high level)
- User journey / core logic flow — product-focused steps in plain language, no endpoint names
- Feature descriptions with purpose and rationale (what each feature does and why it exists)
- Product decisions and rationale — why certain approaches were chosen (e.g., timer duration, anonymity model)
- Target user personas — who the product serves, why they benefit, not user stories or acceptance criteria
- Feature priority and status — what's implemented vs. planned, to guide development
- Product constraints — what the product explicitly does NOT do and why
- Privacy and trust model — user-facing framing, not implementation details
- Problem-solution pairs — why target users benefit
- Tech stack with rationale — include a "Why?" column, not detailed module descriptions
- Sample user flow — narrative story, not a technical sequence
- Value proposition for evaluators (judges, stakeholders)
- Future enhancements / bonus features (clearly marked as not yet implemented)
- Final pitch line
- Brief demo setup — enough for a judge to run it independently; full walkthrough goes in `DEMO_GUIDE.md`

### What NOT to Include
| Document | Routes content about | Audience | Update Trigger | Content Type |
|----------|---------------------|----------|----------------|--------------|
| **README.md** | User-facing setup, usage, features, benefits, installation | End users, new developers | Feature or setup change | User-facing, practical |
| **ARCHITECTURE.md** | Technical structure, modules, file tree, implementation, data flow | Developers, AI agents | Code structure change | Technical, implementation |
| **SPECIFICATIONS.md** | Product vision, user journey, problem statement, pitch ✅ | Product owners, devs, AI, stakeholders | Product scope change | Product, pitch, vision, spec |
| **DEMO_GUIDE.md** | Demo presentation, walkthrough, step-by-step instructions | Presenters, judges | Demo flow change | Practical, step-by-step |
| **AGENTS.md** | AI agent permissions, rules, file ownership, operational constraints | AI agents (opencode) | File or command change | Operational, constraints |
| **PROJECT_BEST_PRACTICES.md** | Universal coding patterns, best practices, lessons learned | All developers, AI | After each session | Educational, guidelines |
| **DOCUMENT_GUIDELINES.md** | Doc scope, content boundaries, governance | Developers, AI agents | New doc added | Meta, governance |

**Never include in SPECIFICATIONS.md:**
- Endpoint names, route definitions, or any implementation-level detail
- Module descriptions, file trees, or import structure
- Step-by-step demo walkthrough or presentation instructions
- AI agent permissions or operational constraints

**Anti-duplication:**
- One purpose per document — if content fits two documents, choose the PRIMARY purpose
- Cross-reference, don't copy — use `[See DEMO_GUIDE.md](DEMO_GUIDE.md)` for full demo steps instead of duplicating
- Summary here, details there — SPECIFICATIONS.md gets the brief demo setup; DEMO_GUIDE.md gets the full walkthrough
- Audience-first — if audience overlaps, choose the document with the MOST RELEVANT audience

If content belongs elsewhere, note it with `→ Redirect to <filename>` — do not include it in `SPECIFICATIONS.md`.

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

### 2. Read the Current Document
- Check if `docs/SPECIFICATIONS.md` exists — create it if not
- Read existing content section by section
- Flag anything outdated, missing, or out of scope
- Flag feature descriptions that lack purpose/rationale

### 3. Identify Gaps and Issues
For each item in **What to Include**:
- Does it exist in the current document? Is it accurate against the current product state?
- Is it written for the full audience (product owners, developers needing product context, and stakeholders/judges)?

For each existing section:
- Does it belong here per **What NOT to Include**?
- If not → mark for redirect

### 4. Update the Document
- Add missing sections
- Fix outdated content to match current product state
- Remove or redirect out-of-scope content
- Keep language product-focused and pitch-appropriate — no endpoint names, no module internals
- User journey steps should be readable by a non-technical evaluator
- Include product rationale sections that help developers understand design intent (e.g., "Why 30 seconds?", "Why anonymous?")
- Ensure feature descriptions clearly state purpose and benefit so developers can make informed implementation decisions
- Tech stack must include a "Why?" rationale column
- Future enhancements must be clearly marked as not yet implemented
- Don't rewrite the entire document — only update outdated or missing sections
- Keep it concise — ensure all critical information for product owners, developers, and stakeholders is included

### 5. Verify
- [ ] Content's PRIMARY purpose identified and routed to the correct document
- [ ] Content doesn't already exist in another document — cross-reference instead of duplicate
- [ ] If content spans multiple purposes, split appropriately
- [ ] Problem statement is clear and compelling
- [ ] User journey is described in plain language — no endpoint names
- [ ] Tech stack includes a "Why?" rationale column
- [ ] Sample user flow reads as a narrative, not a technical sequence
- [ ] Future enhancements are clearly marked as not yet implemented
- [ ] Language balances pitch-readiness for judges with product clarity for developers
- [ ] Feature descriptions include purpose/rationale suitable for guiding development decisions
- [ ] Product constraints are clearly stated (what the product explicitly doesn't do)
- [ ] No excluded content remains — redirected if needed
- [ ] Document is concise — no unnecessary detail, but all critical product information is included
