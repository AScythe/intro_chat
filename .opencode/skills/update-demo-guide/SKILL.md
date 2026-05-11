---
name: update-demo-guide
description: Analyze the current app state and update `DEMO_GUIDE.md` to be accurate, complete, and within its defined scope. Trigger when the user says "update demo guide", "sync demo guide", "demo guide is outdated", or similar.
---

## Purpose
Practical demo execution guide for the project. Answers "How do I demonstrate this?", "What should I highlight?", "What are the test scenarios?".

Verify demo steps against the actual running app, then update or create `docs/DEMO_GUIDE.md` so a presenter can run a reliable demo without surprises.

---

## Audience
- Presenters demonstrating the app
- Hackathon judges evaluating the demo
- Users trying the app for the first time

---

## Content Rules

### Quality Gates
Every piece of content must pass these three checks:

- **"Would an agent miss this?" litmus test:** Every line must answer "Would an agent likely miss this without help?" If not, leave it out.
- **Actionability:** Every step must have a clear expected result ("you should see X"). Fallback options must be actionable ("if X breaks, do Y").
- **Accuracy against running app:** All steps must be verified against the actual app behavior — never inferred from code alone.

### What to Include
- Prerequisites — what must be running (services, env vars, data) before demo starts
- Quick start walkthrough — ordered steps to reach a working demo state
- Key features to demonstrate — what to highlight and in what order
- Testing scenarios — discrete flows with exact actions and expected results
- UI highlights — what the runner should point to on screen at each step
- Technical features to highlight — for technical evaluators
- Demo tips — separate guidance for different audience types (judges vs. users)
- Fallback options — what to do if something breaks live ("if X breaks, do Y")
- Reset instructions — how to restore demo state after a run
- Success signals — how the audience feels or what they see, not technical metrics

### What NOT to Include
| Document | Routes content about | Audience | Update Trigger | Content Type |
|----------|---------------------|----------|----------------|--------------|
| **README.md** | User-facing setup, usage, features, benefits, installation | End users, new developers | Feature or setup change | User-facing, practical |
| **ARCHITECTURE.md** | Technical structure, modules, file tree, implementation, data flow | Developers, AI agents | Code structure change | Technical, implementation |
| **SPECIFICATIONS.md** | Product vision, user journey, problem statement, pitch | Product owners, devs, AI, stakeholders | Product scope change | Product, pitch, vision, spec |
| **DEMO_GUIDE.md** | Demo presentation, walkthrough, step-by-step instructions ✅ | Presenters, judges | Demo flow change | Practical, step-by-step |
| **AGENTS.md** | AI agent permissions, rules, file ownership, operational constraints | AI agents (opencode) | File or command change | Operational, constraints |
| **PROJECT_BEST_PRACTICES.md** | Universal coding patterns, best practices, lessons learned | All developers, AI | After each session | Educational, guidelines |
| **DOCUMENT_GUIDELINES.md** | Doc scope, content boundaries, governance | Developers, AI agents | New doc added | Meta, governance |

**Never include in DEMO_GUIDE.md:**
- Product vision, pitch, or user journey narrative
- Detailed module descriptions or implementation internals
- Full installation or setup instructions (reference README.md instead)
- AI agent permissions or operational constraints

**Anti-duplication:**
- One purpose per document — if content fits two documents, choose the PRIMARY purpose
- Cross-reference, don't copy — use `[See SPECIFICATIONS.md](SPECIFICATIONS.md)` for product vision instead of duplicating
- Summary here, details there — SPECIFICATIONS.md gets the brief demo setup; DEMO_GUIDE.md gets the full walkthrough
- Audience-first — if audience overlaps, choose the document with the MOST RELEVANT audience

If content belongs elsewhere, note it with `→ Redirect to <filename>` — do not include it in `DEMO_GUIDE.md`.

---

## Workflow

### 1. Investigate the Codebase
Read highest-value sources first in this priority order:

1. Source code entrypoints and UI templates — what does the running app look like at each stage?
2. Existing `DEMO_GUIDE.md` (check what needs updating)
3. Root manifests (`package.json`, `pyproject.toml`, etc.) and requirements
4. `README*` for setup instructions and feature descriptions

For each source, extract:
- What is the actual startup sequence? (commands, env vars needed)
- What features are live and demo-able right now?
- What are the known failure points or fragile flows?
- What does the UI look like at each stage?

### 2. Read the Current Document
- Check if `docs/DEMO_GUIDE.md` exists — create it if not
- Read existing content section by section
- Flag any steps that no longer match the current app behavior
- Flag missing sections from **What to Include**

### 3. Identify Gaps and Issues
For each item in **What to Include**:
- Does it exist in the current document?
- Are the steps accurate against the current app?
- Are fallback options present for fragile steps?

For each existing section:
- Does it belong here per **What NOT to Include**?
- If not → mark for redirect

### 4. Update the Document
- Add missing sections
- Fix outdated steps to match current app behavior
- Remove or redirect out-of-scope content
- Every step must have a clear expected result ("you should see X")
- Fallback options must be actionable ("if X breaks, do Y"), not vague reassurance
- Demo tips must have separate sections for different audience types (judges vs. users)
- Keep language presenter-focused — assume they are under pressure
- Don't rewrite the entire document — only update outdated or missing sections
- Keep it concise — ensure all critical demo information is included

### 5. Verify
- [ ] Content's PRIMARY purpose identified and routed to the correct document
- [ ] Content doesn't already exist in another document — cross-reference instead of duplicate
- [ ] If content spans multiple purposes, split appropriately
- [ ] Prerequisites are complete and accurate
- [ ] Every demo step has a clear expected result
- [ ] Fallback options exist for each fragile step
- [ ] Reset instructions are present and accurate
- [ ] Demo tips have separate sections for judges vs. users
- [ ] Every step verified against actual running app behavior
- [ ] No excluded content remains — redirected if needed
- [ ] A presenter unfamiliar with the codebase could run this guide successfully
- [ ] Document is concise — no unnecessary detail, but all critical demo information is included
