---
name: update-readme-md
description: Analyze the current codebase and update `docs/README.md` to be accurate, complete, and within its defined scope. Trigger when the user says "update readme", "sync readme", "readme is outdated", or similar.
---

## Purpose
User-facing entry point for anyone discovering the project. Answers "What is it?", "How do I use it?", "How do I run it?".

Mine the codebase and session history, then update or create `docs/README.md` so new users and developers can understand, set up, and use the project.

---

## Audience
- End users (media analysts, researchers)
- New developers joining the project
- Anyone visiting the repository for the first time

---

## Content Rules

### Quality Gates
- **"Would a first-time visitor miss this?" litmus test**
- **User-facing language:** Describe benefits and outcomes, not implementation details
- **Accuracy against current project:** Every claim must be verifiable against actual codebase
- **Minimum necessary detail:** If a first-time visitor wouldn't care about it, it doesn't belong here

### What to Include

**Universal sections** (present in every project's README.md):
- **Project description and tagline** — what it is and why it exists, in one paragraph
- **Feature list** — user-facing benefits, not technical internals
- **Quick start instructions** — condensed: install dependencies, run the app, minimum steps to get going
- **How to use** — step-by-step for each user type. Show the workflow from their perspective
- **Tech stack** — high-level only: one-liner per technology, max 2-3 paragraphs
- **Testing instructions** — inline runnable commands for common test suites

**Optional sections** (include only if the project has them):
- **Deployment options** — how to deploy for production use
- **Privacy and security information** — user-facing summary: what data is collected, what is not, what users control
- **Troubleshooting common issues** — problems users have encountered and how to resolve them
- **Requirements** — system dependencies, API keys, environment setup
- **Pipeline or stage breakdown** — table of processing steps (for pipeline-style projects)
- **Documentation links** — references to ARCHITECTURE.md, SPECIFICATIONS.md, etc.
- **Value proposition and success metrics** — user-facing description of what users gain

### What NOT to Include

| Document | Scope | Audience | Content Type | Canonical Source Of |
|----------|-------|----------|--------------|-------------------|
| **README.md** | User-facing setup, usage, features, installation | End users, new developers | User-facing | Install/run commands, user-facing features, quick-start |
| **ARCHITECTURE.md** | Technical structure, modules, file tree, implementation, data flow | Developers, AI agents | Technical | Module descriptions, import graph, design decisions (technical) |
| **SPECIFICATIONS.md** | Product vision, user journey, problem statement, Out of Scope | Product owners, devs, AI agents | Product / Vision | Product vision, user journey, feature rationale, Out of Scope |
| **AGENTS.md** | Agent behavioral rules, file ownership, operational constraints | AI agents | Operational | Agent behavioral rules, file ownership table, commands, failure triage, test suite conventions |
| **PROJECT_BEST_PRACTICES.md** | Universal coding patterns, best practices, lessons learned | All developers, AI agents | Educational | Universal coding practices, skill methodologies |
| **DOCUMENT_GUIDELINES.md** | Doc scope, content boundaries, governance | Developers, AI agents | Governance | Document metadata, content boundaries |

**Anti-duplication:**
- One purpose per document — if content fits two documents, choose the PRIMARY purpose
- Cross-reference, don't copy — use `[See <DOC>.md](<DOC>.md)` links instead of duplicating
- If content belongs elsewhere, note it with `→ Redirect to <filename>` — do not include it in this document

---

## Universal Template

The skeleton below is used for every project's `README.md`. Markers like `<!-- FILL: name -->` indicate where project-specific content is injected. Sections without markers are included verbatim.

```markdown
# [Project Name]

[Project description and tagline]

## Features
[User-facing benefits, not technical internals]

## Quick Start
[Prerequisites + install + run — minimum steps to get going]

## How to Use
[Step-by-step for each user type]

## Tech Stack
[High-level: one-liner per technology]

## Testing
[Inline runnable commands]

<!-- FILL: optional-sections -->
```

Optional sections (include only if applicable): Deployment, Privacy/Security, Troubleshooting, Requirements (system dependencies, API keys), Pipeline stages, Documentation links, Value proposition.

---

## Phase 0: Prerequisites

- [ ] Verify source code and project state are current
- [ ] Read existing README.md — understand current documented state
- [ ] Verify all setup instructions against actual environment

## Workflow

> **Investigation Protocol:** Investigation compares the current document against the current codebase — not against previous session changes. Pre-existing discrepancies (wrong setup steps, outdated feature claims, stale quick-start instructions) are gaps to flag regardless of when they were introduced.

### 1. Investigate the Codebase
Read highest-value sources first:

1. `README*` (if it exists — check what needs updating)
2. Root config files
3. Source code entrypoints — what does the pipeline do end-to-end?
4. Existing `docs/ARCHITECTURE.md`

### 2. Read the Current Document
- Check if `docs/README.md` exists — create it if not
- Flag outdated content

### 3. Identify Gaps and Issues
For each **What to Include** item: does it exist? Is it accurate?

### 4. Assemble or Update the Document

**If README.md doesn't exist (create from scratch):**
1. Start with the **Universal Template** from this skill
2. Replace `<!-- FILL: optional-sections -->` with any applicable optional sections
3. Fill in each section with discovered project-specific content

**If README.md already exists (surgical update):**
- For each universal section: compare against discovered data and update only what changed (description, features, quick start, how to use, tech stack, testing)
- For each optional section: add if applicable and missing, remove if no longer applicable, update if stale
- Never rewrite the whole file — use targeted edits on changed sections only
- Keep language user-facing
- Quick start steps must work based on actual project files

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
- [ ] If features were added/removed/renamed, verify README (benefits) and SPECS (rationale) are both synced
- [ ] Language is appropriate for a non-technical first-time visitor