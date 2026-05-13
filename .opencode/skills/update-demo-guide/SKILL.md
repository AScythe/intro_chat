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
- Evaluators and reviewers assessing the demo (judges, stakeholders, technical reviewers)

> **Not** first-time users. Users discovering the app read `README.md`. This document is for people presenting or evaluating a prepared demo.

---

## Content Rules

### Quality Gates
Every piece of content must pass these three checks:

- **Actionability:** Every step must have a clear expected result ("you should see X"). Fallback options must be actionable ("if X breaks, do Y"), not vague reassurance.
- **Accuracy against running app:** All steps must be verified against the actual app behavior — never inferred from code alone.
- **Currency:** The document must include a header stating when it was last verified and against which version/commit. Demo guides go stale fast.

### What to Include
- **Document header** — "Last verified: [date] against [version/commit]". Required. Update on every demo flow change.
- Prerequisites — what must be running (services, env vars, data) before demo starts
- Quick start walkthrough — ordered steps to reach a working demo state from scratch
- Key features to demonstrate — what to highlight and in what order for maximum impact
- Testing scenarios — discrete flows with exact actions and expected results. "Click X, expect Y to appear."
- UI highlights — what the presenter should point to on screen at each step
- Technical features to highlight — for technical evaluators who care about implementation
- Demo tips — separate guidance for different audience types (technical evaluators vs. general audience). They care about different things.
- Fallback options — what to do if something breaks live. Must be actionable ("if X breaks, do Y"), not vague reassurance.
- Reset instructions — how to restore demo state after a run so it can be shown again

### What NOT to Include

| Document | Routes content about | Audience | Content Type |
|----------|---------------------|----------|--------------|
| **README.md** | User-facing setup, usage, features, benefits, installation | End users, new developers | User-facing, practical |
| **ARCHITECTURE.md** | Technical structure, modules, file tree, implementation, data flow | Developers, AI agents | Technical, implementation |
| **SPECIFICATIONS.md** | Product vision, user journey, problem statement, pitch, Out of Scope, privacy | Product owners, devs, AI agents, evaluators/stakeholders | Product, pitch, vision, spec, privacy |
| **DEMO_GUIDE.md** | Demo presentation, walkthrough, step-by-step instructions ✅ | Presenters, evaluators | Practical, step-by-step |
| **AGENTS.md** | AI agent permissions, rules, file ownership, operational constraints | AI agents | Operational, constraints |
| **PROJECT_BEST_PRACTICES.md** | Universal coding patterns, best practices, lessons learned | All developers, AI | Educational, guidelines |
| **DOCUMENT_GUIDELINES.md** | Doc scope, content boundaries, governance | Developers, AI agents | Meta, governance |

**Anti-duplication:**
- One purpose per document — if content fits two documents, choose the PRIMARY purpose
- Cross-reference, don't copy — use `[See SPECIFICATIONS.md](SPECIFICATIONS.md)` for product vision instead of duplicating
- Summary here, details there — `SPECIFICATIONS.md` gets 2-3 lines for running it independently; `DEMO_GUIDE.md` gets the full ordered walkthrough
- Audience-first — if audience overlaps, choose the document with the MOST RELEVANT audience
- If content belongs elsewhere, note it with `→ Redirect to <filename>` — do not include it in `DEMO_GUIDE.md`

---

## Workflow

### 1. Investigate the App
Read highest-value sources first in this priority order:

1. Source code entrypoints and UI templates — what does the running app look like at each stage?
2. Existing `DEMO_GUIDE.md` (check what needs updating, verify the currency header)
3. Root manifests (`package.json`, `pyproject.toml`, etc.) and requirements
4. `README*` for setup instructions and feature descriptions

For each source, extract:
- What is the actual startup sequence? (commands, env vars needed)
- What features are live and demo-able right now?
- What are the known failure points or fragile flows?
- What does the UI look like at each stage?
- Has anything changed since the last verified date in the document header?

### 2. Read the Current Document
- Check if `docs/DEMO_GUIDE.md` exists — create it if not
- Check the currency header — is it stale?
- Read existing content section by section
- Flag any steps that no longer match the current app behavior
- Flag missing sections from **What to Include**

### 3. Identify Gaps and Issues
For each item in **What to Include**:
- Does it exist in the current document?
- Are the steps accurate against the current app?
- Are fallback options present and actionable for fragile steps?
- Is the currency header present and current?

For each existing section:
- Does it belong here per **What NOT to Include**?
- If not → mark for redirect

### 4. Update the Document
- Update or add the currency header first: "Last verified: [date] against [version/commit]"
- Add missing sections
- Fix outdated steps to match current app behavior
- Remove or redirect out-of-scope content
- Every step must have a clear expected result ("you should see X")
- Fallback options must be actionable ("if X breaks, do Y"), not vague reassurance
- Demo tips must have separate sections for technical evaluators vs. general audience
- Keep language presenter-focused — assume they are on stage with people watching
- Don't rewrite the entire document — only update outdated or missing sections

### 5. Verify
- [ ] Currency header present and updated: "Last verified: [date] against [version/commit]"
- [ ] Content's PRIMARY purpose identified and routed to the correct document
- [ ] Content doesn't already exist in another document — cross-reference instead of duplicate
- [ ] Prerequisites are complete and accurate
- [ ] Every demo step has a clear expected result ("you should see X")
- [ ] Fallback options exist for each fragile step and are actionable
- [ ] Reset instructions are present and accurate
- [ ] Demo tips have separate sections for technical evaluators vs. general audience
- [ ] Every step verified against actual running app behavior — not inferred from code
- [ ] A presenter unfamiliar with the codebase could run this guide successfully under pressure
- [ ] No excluded content remains — redirected if needed
- [ ] Every line passes the "Would someone miss this?" litmus test
- [ ] Document is concise — no unnecessary detail, but all critical demo information is included