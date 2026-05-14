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

---

## Content Rules

### Quality Gates
Every piece of content must pass these four checks:

- **"Would a presenter miss this?" litmus test:** Every step must answer "Would a presenter likely miss this without help?" If not, leave it out.
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

**Ask the user** only when the running app can't answer: demo-specific configuration, expected presenter behavior. One short batch. Never ask what the app makes clear.

### 2. Read the Current Document
- Check if `docs/DEMO_GUIDE.md` exists — create it if not
- Check the currency header — is it stale?
- Read existing content section by section
- Flag any steps that no longer match the current app behavior
- Flag missing sections from **What to Include**
- Flag content that violates the boundary rules above

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
- Add missing sections
- Fix outdated content to match current app behavior
- Remove or redirect out-of-scope content per the **What NOT to Include** table
- Don't rewrite the entire document — only update what's changed
- Update or add the currency header first: "Last verified: [date] against [version/commit]"
- Every step must have a clear expected result ("you should see X")
- Fallback options must be actionable ("if X breaks, do Y"), not vague reassurance
- Demo tips must have separate sections for technical evaluators vs. general audience
- Keep language presenter-focused — assume they are on stage with people watching
- Don't rewrite the entire document — only update outdated or missing sections

### 5. Verify

**Integrity & Scope:**
- [ ] Every piece of content belongs in this document per the What NOT to Include table — redirect if it belongs elsewhere
- [ ] No content duplicated from another document — use `[See <DOC>.md](<DOC>.md)` cross-references instead
- [ ] All steps verified against actual running app behavior — not inferred from code
- [ ] Every line passes the litmus test defined in Quality Gates
- [ ] Document omits everything a presenter under pressure doesn't need — no speculative, aspirational, or unverifiable content

**Document-Specific Checks:**
- [ ] Currency header present and updated: "Last verified: [date] against [version/commit]"
- [ ] Prerequisites are complete and accurate
- [ ] Every demo step has a clear expected result ("you should see X")
- [ ] Fallback options exist for each fragile step and are actionable
- [ ] Reset instructions are present and accurate
- [ ] If features were added/removed/renamed, verify DEMO_GUIDE (demo steps), README (benefits), and SPECS (rationale) are all synced
- [ ] A presenter unfamiliar with the codebase could run this guide successfully under pressure