---
name: update-agents-md
description: Analyze the current codebase and update `AGENTS.md` to be accurate, complete, and within its defined scope. Trigger when the user says "update agents", "sync agents doc", "agents.md is outdated", or similar.
---

## Purpose
Guide for updating `AGENTS.md` — the authoritative reference for agent behavioral rules, file ownership, commands, and operational constraints. Answers "What can agents touch?", "What commands do I use?", "What are my behavioral rules?".

Analyze the codebase and session history, then update or create `AGENTS.md` so agents can operate accurately on every task.

---

## Audience
- AI agents (e.g., opencode)
- Developers setting up agent permissions

---

## Content Rules

### Quality Gates
Every piece of content must pass these checks:

- **"Would an agent or developer miss this?" litmus test:** Every line must answer "Would an agent or developer likely miss this without help?" If not, leave it out.
- **Executable sources of truth:** Prefer configs, scripts, and CI files over prose documentation. If docs conflict with executable sources, trust the executable source.
- **Simple-repo handling:** If the repo is simple, keep the file simple. When in doubt, omit.
- **Conciseness:** Agents read the full file on every task — omit anything an agent could infer, redundant examples, or content that doesn't affect agent behavior.

### What to Include
- File ownership table — location, role, agent policy (⚠️ caution / ❌ forbidden). Include only files with non-default agent policies — omit ✅ safe files.
- SDD Workflow Rules — explicit always/never directives organized by 9 workflow phases. Verification requirements embedded within each phase's rules, not in a separate section.
- Cross-Phase Universal Rules sub-sections:
  - Context Window Discipline — Grep→Read patterns for minimizing context waste.
  - Doc Sync Triggers — table mapping change types to the doc sync skill to run.
  - Documentation Discipline — cross-referencing, description headers, executable truth.
  - Process Discipline — read-before-write, exit declarations, test discipline, failure triage.
  - Failure Triage — classification table for test failures with action for each type.

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
Read in priority order:

1. Project manifests (`README*`, `package.json`, `pyproject.toml`, lockfiles, workspace config)
2. Build, test, lint, typecheck, and CI configs
3. Existing `AGENTS.md`, `ARCHITECTURE.md`, `SPECIFICATIONS.md`
4. Representative source files — entrypoints and wiring (only if architecture is still unclear)

For each source, extract items from **What to Include** — files, commands, env vars, boundaries, gotchas.

**Ask the user** only when the repo can't answer: undocumented team conventions, missing prereqs. One short batch. Never ask what the repo makes clear.

**Check session history** for behavioral rule updates, file ownership changes, and any agent-facing decisions that affect what AGENTS.md should document.

### 2. Read the Current Document
- Check if `AGENTS.md` exists at the project root — create if not
- Read section by section; flag outdated or missing items from **What to Include**
- Flag content that violates the boundary rules above

### 3. Identify Gaps and Issues
For each **What to Include** item: does it exist? Is it accurate?
For each existing section: does it belong here per **What NOT to Include**? If not → redirect.

### 3.5 Extract Cross-Phase Patterns from Skills
Read `.opencode/skills/*/SKILL.md` (all current skills) and identify rules or patterns that appear in two or more skills. These are **universalization candidates** — patterns that should be elevated to Cross-Phase Universal Rules so each skill doesn't duplicate them.

For each candidate:
1. Does it pass the **"Would an agent miss this?"** litmus test? If it's obvious or already well-covered by existing universal rules, skip it.
2. Is the duplicated text word-for-word identical or semantically equivalent across skills? If yes, it's a good candidate.
3. Does it apply to all or most Build phases? If it only applies to one specific skill, leave it phase-specific.

If candidates are found:
- Add them as new Cross-Phase Universal Rules in AGENTS.md
- Prune the redundant copies from individual phase rules (replace with a brief cross-reference or remove if fully covered)

### 3.6 Extract Universal Best Practices from PROJECT_BEST_PRACTICES.md

Read `refs/PROJECT_BEST_PRACTICES.md` and identify entries that are universal agent-behavioral rules suitable for `AGENTS.md`.

**Selection criteria** — promote if ALL apply:
1. The rule governs **how agents should behave** (not project-specific implementation patterns)
2. It passes the **"Would an agent miss this?"** litmus test
3. It is **not already covered** by an existing rule in AGENTS.md

**Routing priority** — place each promoted rule in the most specific section:

1. **First try: a specific Phase** — if the rule only applies during a single workflow phase (e.g., "commit discipline" only applies to Phase 9), add it as a new bullet under that phase's behavioral rules.

2. **Fallback: Cross-Phase sub-section** — if the rule applies across multiple phases, check if it fits an existing sub-section:
   - Documentation-related → `Documentation Discipline`
   - Process-related → `Process Discipline`

3. **Last resort: new sub-section** — if the rule is cross-phase but doesn't fit Documentation Discipline or Process Discipline, create a new H3 sub-section under Cross-Phase Universal Rules with a descriptive name.

**Housekeeping:** Do NOT remove the promoted entries from PROJECT_BEST_PRACTICES.md — the document remains as-is. Only the principle is elevated to AGENTS.md.

### 4. Update the Document
- Add missing sections
- Fix outdated content to match the codebase
- Remove or redirect out-of-scope content per the **What NOT to Include** table
- Don't rewrite the entire document — only update what's changed
- Keep concise — agents read the full file on every task

### 5. Verify

**Integrity & Scope:**
- [ ] Every piece of content belongs in this document per the What NOT to Include table — redirect if it belongs elsewhere
- [ ] No content duplicated from another document — use `[See <DOC>.md](<DOC>.md)` cross-references instead
- [ ] All claims verified against executable sources (code, config, workflows), not just docs
- [ ] Every line passes the litmus test defined in Quality Gates
- [ ] Document omits everything an agent doesn't need — no speculative, aspirational, or unverifiable content

**Document-Specific Checks:**
- [ ] File ownership table covers all files with non-default policies (⚠️ / ❌) — accurate and complete
- [ ] All commands are accurate and runnable with exact syntax
- [ ] Agent behavioral rules are imperative — "always/never", not "consider" or "try to"
- [ ] Cross-phase universal rules are not duplicated in phase-specific sections
- [ ] Cross-references to `ARCHITECTURE.md` and `SPECIFICATIONS.md` are accurate
- [ ] Framework/toolchain quirks are documented if present