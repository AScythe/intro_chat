---
name: update-demo-guide-md
type: subskill
description: Analyze the current app state and update `docs/DEMO_GUIDE.md` to be accurate, complete, and within its defined scope. Trigger when the user says "update demo guide", "sync demo guide", "demo guide is outdated", or similar.
---

## Purpose
Practical demo execution guide for the project. Answers "How do I demonstrate this?", "What should I highlight?", "What are the test scenarios?".

Verify demo steps against the actual running pipeline, then update or create `docs/DEMO_GUIDE.md` so a presenter can run a reliable demo without surprises.

---

## Audience
- Presenters demonstrating the media pipeline
- Evaluators and reviewers assessing the pipeline output

---

## Content Rules

### Quality Gates
- **"Would a presenter miss this?" litmus test**
- **Actionability:** Every step must have a clear expected result
- **Accuracy against running pipeline:** All steps must be verified against actual behavior
- **Currency:** Include a header stating when it was last verified

### What to Include

**Universal (always present):**
- **Document header** — "Last verified: [date] against [version/commit]". Required. Update on every demo flow change.
- **Quick start walkthrough** — ordered steps to reach a working demo state from scratch, each with expected result
- **Key features to demonstrate** — what to highlight and in what order for maximum impact
- **Demo tips** — separate guidance for different audience types (technical evaluators vs. general audience). They care about different things.
- **Fallback options** — what to do if something breaks live. Must be actionable ("if X breaks, do Y"), not vague reassurance.

**Optional (include only if applicable):**
- **Prerequisites** — what must be running (services, env vars, data) before demo starts
- **Testing scenarios** — discrete flows with exact actions and expected results. "Click X, expect Y to appear."
- **UI highlights** — what the presenter should point to on screen at each step
- **Technical features to highlight** — for technical evaluators who care about implementation
- **Reset instructions** — how to restore demo state after a run so it can be shown again

### What NOT to Include

| Document | Scope | Audience | Content Type | Canonical Source Of |
|----------|-------|----------|--------------|-------------------|
| **README.md** | User-facing setup, usage, features, installation | End users, new developers | User-facing | Install/run commands, user-facing features, quick-start |
| **ARCHITECTURE.md** | Technical structure, modules, file tree, implementation, data flow | Developers, AI agents | Technical | Module descriptions, import graph, design decisions (technical) |
| **SPECIFICATIONS.md** | Product vision, user journey, problem statement, Out of Scope | Product owners, devs, AI agents | Product / Vision | Product vision, user journey, feature rationale, Out of Scope |
| **DEMO_GUIDE.md** | Demo presentation, walkthrough, step-by-step instructions | Presenters, evaluators | Practical | Demo walkthrough, testing scenarios, fallback options |
| **AGENTS.md** | Agent behavioral rules, file ownership, operational constraints | AI agents | Operational | Agent behavioral rules, file ownership table, commands, failure triage, test suite conventions |
| **PROJECT_BEST_PRACTICES.md** | Universal coding patterns, best practices, lessons learned | All developers, AI agents | Educational | Universal coding practices, skill methodologies |
| **DOCUMENT_GUIDELINES.md** | Doc scope, content boundaries, governance | Developers, AI agents | Governance | Document metadata, content boundaries |

**Anti-duplication:**
- One purpose per document — if content fits two documents, choose the PRIMARY purpose
- Cross-reference, don't copy — use `[See <DOC>.md](<DOC>.md)` links instead of duplicating
- If content belongs elsewhere, note it with `→ Redirect to <filename>` — do not include it in this document

**Boundary rules** (document-specific guardrails):
- Demo steps must be presenter-focused with expected outcomes at each step — reference README.md for setup details and ARCHITECTURE.md for implementation internals; do not reproduce them

---

## Universal Template

The skeleton below is used for every project's `DEMO_GUIDE.md`. Markers like `<!-- FILL: name -->` indicate where project-specific content is injected. Sections without markers are included verbatim.

```markdown
# [Project Name] Demo Guide

> **Last verified:** [date]

## Quick Start Demo
[Ordered steps from scratch to working demo, with expected results at each step]

## Key Features to Demonstrate
[What to highlight and in what order]

## Demo Tips
[Separate guidance for different audience types — technical evaluators vs general audience]

## Fallback Options
[Actionable fixes for fragile steps — "if X breaks, do Y"]

<!-- FILL: optional-sections -->
```

Optional sections (include only if applicable): Prerequisites, Testing scenarios (discrete flows with exact actions and expected results), Reset instructions, UI highlights, Technical features to highlight.

---

## Phase 0: Prerequisites

- [ ] Verify pipeline code and sample media are available
- [ ] Read existing DEMO_GUIDE.md — understand current documented walkthrough
- [ ] Run a quick end-to-end test to verify pipeline works

## Workflow

> **Investigation Protocol:** Investigation compares the current document against the current app behavior — not against previous session changes. Session git diff is supplementary context only. Pre-existing discrepancies (wrong demo steps, inaccurate expected results, stale UI descriptions) are gaps to flag regardless of when they were introduced.

### 1. Investigate the Pipeline
Read highest-value sources first:

1. Source code entrypoints — `process_orchestrator.py`, `query_orchestrator.py`
2. Existing `docs/DEMO_GUIDE.md`
3. `README*` for setup instructions

### 2. Read the Current Document
- Check if `docs/DEMO_GUIDE.md` exists — create it if not
- Flag outdated content

### 3. Identify Gaps and Issues
For each **What to Include** item: does it exist? Are steps accurate?

### 4. Assemble or Update the Document

**If DEMO_GUIDE.md doesn't exist (create from scratch):**
1. Start with the **Universal Template** from this skill
2. Replace `<!-- FILL: optional-sections -->` with any applicable optional sections
3. Fill each universal section with discovered project-specific content
4. Keep language presenter-focused; every step must have a clear expected result
5. Write the result to `docs/DEMO_GUIDE.md`

**If DEMO_GUIDE.md already exists (surgical update):**
- For each universal section (quick start, key features, tips, fallbacks): compare against discovered behavior and update only what changed
- For each optional section: add if applicable and missing, remove if no longer applicable, update if stale
- Never rewrite the whole file — use targeted edits on changed sections only

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