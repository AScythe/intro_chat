---
name: update-agents-md
type: subskill
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
- **"Would an agent or developer miss this?" litmus test:** Every line must answer "Would an agent or developer likely miss this without help?" If not, leave it out.
- **Executable sources of truth:** Prefer configs, scripts, and CI files over prose documentation. If docs conflict with executable sources, trust the executable source.
- **Conciseness:** Agents read the full file on every task — omit anything an agent could infer, redundant examples, or content that doesn't affect agent behavior.

### What to Include
- **Scope** — brief definition of what AGENTS.md covers
- **File ownership table** — location, role, agent policy (⚠️ caution / ❌ forbidden). Include only files with non-default policies — omit ✅ safe files. Also include non-file assets (data directories, configuration, environment)
- **SDD Workflow Rules** — phase order table with explicit always/never directives
- **Cross-Phase Universal Rules:**
  - Context Window Discipline — structured search tool priority order (knowledge graph → semantic index → pattern search → grep → read), low-signal file or directory exclusions
  - Process Discipline — read-before-write, exit declarations, approval gate, no scope creep, surgical edits, non-interactive execution, baseline checks, audit after restructure, consistency pass
  - Documentation Discipline — cross-referencing, description comment preservation, executable truth precedence
- **Project-specific behavioral rules** — extract from the project's entry points, configuration files, and operational constraints. Cover: modification constraints, resource management, configuration conventions. Name each file by role (e.g., "main config", "entry point") rather than filename
- **Commands reference** — exact CLI commands for common operations (build, run, test, deploy, clean up)
- **Test Suite** — if the project has a `tests/` directory, document: file naming convention (`test_<area>.py`), a table mapping each test file to the module under test (with approach column: `Pure` / `sys.modules patch` / `mock`), test conventions (self-contained with `assert` + `main()` guard; fixture usage), and the exact run command
- **Failure Triage table** — project-specific failure patterns, classified by symptom and actionable. Use generic descriptions (e.g., "resource exhaustion", "missing dependency", "config error") rather than tool-specific names
- **Documentation Structure table** — file-to-location map so agents know where each doc lives
- **MCP/tooling rules** — document the project's specific tooling conventions (knowledge graph usage, search index, code navigation tools) as behavioral rules, not tool names

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

---

## Phase 0: Prerequisites

- [ ] Verify source code (AGENTS.md) exists and is current
- [ ] Read AGENTS.md end-to-end — understand current state
- [ ] Consult AGENTS.md scope rules and AGENTS.md boundaries

## Workflow

### 1. Investigate the Codebase
Read in priority order:

1. Project entry points and their sub-modules — extract behavioral patterns, modification constraints, resource management rules
2. Configuration files — extract constants, flags, environment variable bindings
3. Core infrastructure modules (e.g., model cache, utility layer) — extract loading/unloading or lifecycle patterns
4. Existing `AGENTS.md`, architecture document
5. Build, test, lint, CI configs
6. `.opencode/skills/*/SKILL.md` — extract behavioral rules that appear in multiple skills (universalization candidates)

For each source, extract: files with non-default policies, commands, env vars, boundaries, gotchas, behavioral rules.

**Check session history** for behavioral rule updates, file ownership changes, and any agent-facing decisions.

### 2. Read the Current Document
- Check if `AGENTS.md` exists at the project root — create if not
- Flag outdated or missing items

### 3. Identify Gaps and Issues
For each **What to Include** item: does it exist? Is it accurate?

### 4. Update the Document
- Add missing sections from **What to Include**
- Fix outdated content to match the codebase
- Remove or redirect out-of-scope content per the **What NOT to Include** table
- Keep concise — agents read the full file on every task

### 5. Verify

**Integrity & Scope:**
- [ ] Every piece of content belongs in this document per the What NOT to Include table — redirect if it belongs elsewhere
- [ ] No content duplicated from another document — use `[See <DOC>.md](<DOC>.md)` cross-references instead
- [ ] All claims verified against executable sources (code, config, workflows), not just docs
- [ ] Every line passes the litmus test — "Would an agent miss this?"
- [ ] Document omits everything an agent doesn't need — no speculative, aspirational, or unverifiable content

**Document-Specific Checks:**
- [ ] File ownership table covers all files with non-default policies (⚠️ / ❌) — accurate and complete
- [ ] All commands are accurate and runnable with exact syntax
- [ ] Agent behavioral rules are imperative — "always/never", not "consider" or "try to"
- [ ] Cross-phase universal rules are not duplicated in phase-specific skill files
- [ ] Project-specific behavioral rules are captured — modification constraints, resource management, config conventions
- [ ] Failure Triage table reflects actual project failure patterns (use generic symptom categories, not tool names)
- [ ] Test Suite section includes: file naming convention, file-to-module table with approach per file, test conventions, and run command
- [ ] Documentation Structure table lists all project docs with correct relative paths
- [ ] MCP/tooling conventions documented as behavioral rules, not tool names
- [ ] Cross-references between documents are accurate (use relative paths)