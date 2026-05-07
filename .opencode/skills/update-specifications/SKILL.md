---
name: update-specifications
description: Analyze the current product state and update `SPECIFICATIONS.md` to be accurate, complete, and within its defined scope. Trigger when the user says "update specs", "update specifications", "specs are outdated", or similar.
---

## What I do
- Read the existing `docs/SPECIFICATIONS.md` (if it exists)
- Mine the session conversation and existing code for relevant information to update the product vision, user journey, value proposition, and product context for development
- Identify outdated, missing, or out-of-scope content
- Don't rewrite the entire document — only update sections that are outdated or missing content
- Update the document to reflect the current state of the product
- Write or update `docs/SPECIFICATIONS.md` in standardized format
- Redirect any out-of-scope content to the correct document
- Ensure the document serves as both a product pitch and a product context reference for development decisions

---

## Scope
Product specification and vision. Answers "Why does this exist?", "What problem does it solve?", "How does the user journey work?", "What features should I build that align with the vision?", and "What product decisions guide development?".

---

## Audience
- Product owners and managers
- Developers and AI agents needing product context to develop features aligned with the vision
- Product stakeholders like hackathon judges, investors, or potential users, OR anyone evaluating the product concept

---

## Content Scope

### ✅ What to Include
- Problem statement and context
- Solution description and pitch
- User journey / core logic flow (product-focused, no endpoint names)
- Feature descriptions with purpose and rationale (what each feature does and why it exists)
- Product decisions and rationale (why certain approaches were chosen — e.g., timer duration, anonymity model)
- Target user personas (who the product serves, why they benefit)
- Feature priority and status (what's implemented vs. planned, to guide development)
- Product constraints (what the product explicitly does NOT do and why)
- Privacy and trust model (user-facing framing)
- Problem-solution pairs (why target users benefit)
- Tech stack with rationale ("Why?" column, not implementation detail)
- Sample user flow (narrative story)
- Value proposition for evaluators (judges, stakeholders)
- Future enhancements / bonus features
- Final pitch line
- Brief demo setup (enough for judges to run it, not a full guide)

### ❌ What NOT to Include — Redirect Instead
```
Is it about...
├── Actual content from any document? → The document itself
├── User-facing setup instructions/usage/feature/benefits? Installation or setup instructions? → README.md
├── Technical structure/modules/file tree? Project-specific implementation ? Data flow with endpoint names? Module descriptions? → ARCHITECTURE.md
├── Product vision/pitch/user journey? Problem statement? → SPECIFICATIONS.md ✅
├── Demo presentation? Detailed demo walkthrough? Demo step-by-step instructions? → DEMO_GUIDE.md
├── AI agent permissions? Agent operational rules? AI agent file ownership? → AGENTS.md
├── Universal coding patterns? Best practices? Lessons learned? → PROJECT_BEST_PRACTICES.md
└── Doc scope or content boundaries? → DOCUMENT_GUIDELINES.md
```

**Developer context clarification:** 
Developers needing *product context* (what to build and why) → SPECIFICATIONS.md. 
Developers needing *implementation context* (how to build it, endpoints, modules) → ARCHITECTURE.md.

**Agent context clarification:** 
AI agents needing *product context* (what should I build and why, what is the product vision, who are the users) → SPECIFICATIONS.md.
AI agents needing *operational context* (what files can I touch, what commands can I run, what are my constraints) → AGENTS.md. 

If content belongs elsewhere, note it with: `→ Redirect to <filename>` — do not include it in `SPECIFICATIONS.md`.

---

## Content Boundaries
- **User Journey / Core Logic Flow:** Product-focused — describe steps in plain language, no endpoint names
- **Problem-Solution Pairs:** Focus on user pain and benefit, not implementation details
- **Feature Descriptions:** Product purpose and user benefit, not implementation mechanism
- **Product Decisions:** Vision rationale, not technical trade-offs
- **Target Personas:** Who the user is and why they benefit, not user stories or acceptance criteria
- **Feature Priority/Status:** What state each feature is in, not implementation timeline
- **Tech Stack:** Include "Why?" rationale column — not detailed module descriptions
- **Brief Demo Setup:** Enough for a judge to run it independently — full walkthrough goes in `DEMO_GUIDE.md`

---

## Steps

### 1. Read the Codebase
Scan the project to understand the current product state:
- What does the app do for the user end-to-end?
- What features are live vs. planned?
- What privacy or trust behaviors are implemented?
- Has the user journey changed since the last spec update?

Focus on *what the product does*, not *how it's built*.

### 2. Read the Current Document
- Check if `SPECIFICATIONS.md` exists — create it if not
- Read existing content section by section
- Flag anything outdated, missing, or out of scope

### 3. Identify Gaps and Issues
For each section in ✅ What to Include:
- Does it exist in the current document?
- Is it accurate against the current product state?
- Is it written for the full audience (product owners, developers needing product context, and stakeholders/judges)?

For each existing section in the document:
- Does it belong here per the ❌ table?
- If not → mark for redirect

### 4. Update the Document
- Add missing sections
- Fix outdated content to match current product state
- Remove or redirect out-of-scope content
- Keep language product-focused and pitch-appropriate — no endpoint names, no module internals
- User journey steps should be readable by a non-technical evaluator
- Include product rationale sections that help developers understand design intent (e.g., "Why 30 seconds?", "Why anonymous?")
- Ensure feature descriptions clearly state purpose and benefit so developers can make informed implementation decisions
- Don't rewrite the entire document — only update sections that are outdated or missing content
- Keep it concise — no unnecessary detail, but ensure all critical information for product owners, developers, and stakeholders is included

### 5. Verify
Read back the updated document and confirm:
- [ ] Problem statement is clear and compelling
- [ ] User journey is described in plain language — no endpoint names
- [ ] Tech stack includes a "Why?" rationale column
- [ ] Sample user flow reads as a narrative, not a technical sequence
- [ ] Future enhancements are clearly marked as not yet implemented
- [ ] No ❌ content remains — redirected if needed
- [ ] Language balances pitch-readiness for judges with product clarity for developers
- [ ] Feature descriptions include purpose/rationale suitable for guiding development decisions
- [ ] Product constraints are clearly stated (what the product explicitly doesn't do)
- [ ] Conciseness is applied — no unnecessary detail, but all critical information is included


---

## Anti-Duplication Rules
1. **One purpose per document** — if content fits two documents, choose the PRIMARY purpose
2. **Cross-reference, don't copy** — use `[See DEMO_GUIDE.md](DEMO_GUIDE.md)` for full demo steps instead of duplicating
3. **Summary here, details there** — SPECIFICATIONS.md gets the brief demo setup; DEMO_GUIDE.md gets the full walkthrough
4. **Audience-first** — if audience overlaps, choose the document with the MOST RELEVANT audience

---

## Checklist Before Adding Content
- [ ] I've identified the PRIMARY purpose of the content
- [ ] I've checked the ❌ What NOT to Include section
- [ ] I've verified the content doesn't already exist in another document
- [ ] I've used the Decision Tree to confirm it belongs in SPECIFICATIONS.md
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