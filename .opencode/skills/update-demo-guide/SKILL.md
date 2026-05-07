---
name: update-demo-guide
description: Analyze the current app state and update `DEMO_GUIDE.md` to be accurate, complete, and within its defined scope. Trigger when the user says "update demo guide", "sync demo guide", "demo guide is outdated", or similar.
---

## What I do
- Read the existing `docs/DEMO_GUIDE.md` (if it exists)
- Mine the session conversation and existing code for relevant information to update the demo steps, key features to highlight, and testing scenarios
- Verify all demo steps against the actual running app
- Identify outdated, missing, or out-of-scope content
- Don't rewrite the entire document — only update sections that are outdated or missing content
- Update the document so a presenter can run a reliable demo without surprises
- Write or update `docs/DEMO_GUIDE.md` in standardized format
- Redirect any out-of-scope content to the correct document

---

## Scope
Practical demo execution guide. Answers "How do I demonstrate this?", "What should I highlight?", "What are the test scenarios?".

---

## Audience
- Presenters demonstrating the app
- Hackathon judges evaluating the demo
- Users trying the app for the first time

---

## Content Scope

### ✅ What to Include
- Prerequisites — what must be running before demo starts
- Quick start walkthrough — ordered steps to reach a working demo state
- Key features to demonstrate — what to highlight and in what order
- Testing scenarios — discrete flows with exact actions and expected results
- UI highlights — what the runner should point to on screen
- Technical features to highlight — for technical evaluators
- Demo tips — separate guidance for different audience types (judges vs. users)
- Fallback options — what to do if something breaks live
- Reset instructions — how to restore demo state after a run
- Success signals — what the audience should feel or see

### ❌ What NOT to Include — Redirect Instead
```
Is it about...
├── Actual content from any document? → The document itself
├── User-facing setup instructions/usage/feature/benefits? Installation or setup instructions? → README.md
├── Technical structure/modules/file tree? Project-specific implementation ? Data flow with endpoint names? Module descriptions? → ARCHITECTURE.md
├── Product vision/pitch/user journey? Problem statement? → SPECIFICATIONS.md
├── Demo presentation? Detailed demo walkthrough? Demo step-by-step instructions? → DEMO_GUIDE.md ✅
├── AI agent permissions? Agent operational rules? AI agent file ownership? → AGENTS.md
├── Universal coding patterns? Best practices? Lessons learned? → PROJECT_BEST_PRACTICES.md
└── Doc scope or content boundaries? → DOCUMENT_GUIDELINES.md
```

If content belongs elsewhere, note it with: `→ Redirect to <filename>` — do not include it in `DEMO_GUIDE.md`.

---

## Content Boundaries
- **Testing Scenarios:** Step-by-step actions with expected results — not technical implementation
- **Demo Tips:** Must have separate sections for different audience types (judges vs. users)
- **Success Signals:** How the audience feels or what they see — not technical metrics
- **Fallback Options:** Must be actionable — "if X breaks, do Y" — not vague reassurance

---

## Steps

### 1. Read the Codebase
Scan the project to understand the current demo-able state:
- What is the actual startup sequence? (`python app.py`, env vars needed, etc.)
- What features are live and demo-able right now?
- What are the known failure points or fragile flows?
- What does the UI look like at each stage?

### 2. Read the Current Document
- Check if `DEMO_GUIDE.md` exists — create it if not
- Read existing content section by section
- Flag any steps that no longer match the current app behavior
- Flag missing sections from ✅ What to Include

### 3. Identify Gaps and Issues
For each section in ✅ What to Include:
- Does it exist in the current document?
- Are the steps accurate against the current app?
- Are fallback options present for fragile steps?

For each existing section in the document:
- Does it belong here per the ❌ table?
- If not → mark for redirect

### 4. Update the Document
- Add missing sections
- Fix outdated steps to match current app behavior
- Remove or redirect out-of-scope content
- Every step must have a clear expected result ("you should see X")
- Fallback options must be actionable, not vague
- Keep language presenter-focused — assume they are under pressure
- Don't rewrite the entire document — only update sections that are outdated or missing content
- Keep it concise — no unnecessary detail, but ensure all critical demo information is included

### 5. Verify
Read back the updated document and confirm:
- [ ] Prerequisites are complete and accurate
- [ ] Every demo step has a clear expected result
- [ ] Fallback options exist for each fragile step
- [ ] Reset instructions are present and accurate
- [ ] Demo tips have separate sections for judges vs. users
- [ ] No ❌ content remains — redirected if needed
- [ ] A presenter unfamiliar with the codebase could run this guide successfully
- [ ] Conciseness is applied — no unnecessary detail, but all critical demo information is included

---

## Decision Tree: Where Does This Content Go?
```
Is it about...
├── User-facing setup/usage? → README.md
├── Technical structure/modules? → ARCHITECTURE.md
├── Product vision/user journey? → SPECIFICATIONS.md
├── Demo steps/presentation? → DEMO_GUIDE.md ✅
├── AI agent permissions? → AGENTS.md
├── Universal coding patterns? → PROJECT_BEST_PRACTICES.md
└── Doc scope or content boundaries? → DOCUMENT_GUIDELINES.md
```

---

## Anti-Duplication Rules
1. **One purpose per document** — if content fits two documents, choose the PRIMARY purpose
2. **Cross-reference, don't copy** — use `[See SPECIFICATIONS.md](SPECIFICATIONS.md)` for product vision instead of duplicating
3. **Summary here, details there** — SPECIFICATIONS.md gets the brief demo setup; DEMO_GUIDE.md gets the full walkthrough
4. **Audience-first** — if audience overlaps, choose the document with the MOST RELEVANT audience

---

## Checklist Before Adding Content
- [ ] I've identified the PRIMARY purpose of the content
- [ ] I've checked the ❌ What NOT to Include section
- [ ] I've verified the content doesn't already exist in another document
- [ ] I've used the Decision Tree to confirm it belongs in DEMO_GUIDE.md
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