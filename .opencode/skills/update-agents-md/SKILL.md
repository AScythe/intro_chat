---
name: update-agents-md
description: 'Analyze the current codebase and update `AGENTS.md` to be accurate, complete, and within its defined scope. Trigger when the user says "update agents", "sync agents doc", "agents.md is outdated", or similar.'
---

## Purpose

Guide for updating `AGENTS.md` — the authoritative reference for agent behavioral rules, file ownership, commands, and operational constraints. This skill combines a **universal template** (sections identical across all projects) with **project-specific discovery** (extracted by analyzing the current project).

The result is a project-specific `AGENTS.md` that accurately reflects that project's file ownership, commands, test suite, and operational constraints — while sharing the common SDD workflow and cross-phase rules with all other projects.

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
- **Universal sections are fixed:** The universal template sections must not be modified per-project. If a rule doesn't apply to a project, omit it from the project-specific AGENTS.md rather than changing the general rule.

### What to Include
- **Scope** — brief definition of what AGENTS.md covers
- **File ownership table** — location, role, agent policy (⚠️ caution / ❌ forbidden). Include only files with non-default policies — omit ✅ safe files
- **Universal Template** — start from the reusable template with `<!-- FILL: -->` markers for project-specific injection
- **SDD Workflow Rules** — phase order table with explicit always/never directives
- **Cross-Phase Universal Rules** — Smart Tool Selection, Process Discipline, Documentation Discipline, Failure Triage
- **Project-specific behavioral rules** — extract from the project's entry points, configuration files, and operational constraints. Cover: modification constraints, resource management, configuration conventions
- **Commands reference** — exact CLI commands for common operations (build, run, test, deploy, clean up)
- **Test Suite** — if the project has a `tests/` directory, document: naming convention, file-to-module table with approach column, conventions, and run command
- **Failure Triage table** — project-specific failure patterns, classified by symptom and actionable. Use generic descriptions
- **Documentation Structure table** — file-to-location map so agents know where each doc lives
- **MCP/tooling rules** — document the project's specific tooling conventions as behavioral rules, not tool names

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
- Cross-reference, don't copy — use `See <DOC>.md` links instead of duplicating
- If content belongs elsewhere, note it with `→ Redirect to <filename>` — do not include it in this document

---

## Universal Template

The skeleton below is used for every project's `AGENTS.md`. Markers like `<!-- FILL: name -->` indicate where project-specific content is injected. Sections without markers are included verbatim.

```markdown
# AGENTS.md

## Scope
... → [ARCHITECTURE.md](ARCHITECTURE.md) | [SPECIFICATIONS.md](SPECIFICATIONS.md) | `.opencode/skills/<skill-name>/SKILL.md`

### File Ownership
| Location | Role | Agent Policy |
|----------|------|--------------|
<!-- FILL: file-ownership-rows -->
<!-- BOILERPLATE: docs/PLAN_*.md, archive/, .opencode/skills/, opencode.json, .cocoindex_code/, graphify-out/ -->

## SDD Workflow — Phase Order
[Standard 9-phase table + 4 ordering rules]

## Cross-Phase Universal Rules
[Smart Tool Selection | Process Discipline | Documentation Discipline | Failure Triage]
<!-- FILL: project-failure-triage -->

<!-- FILL: commands-section -->
<!-- FILL: test-suite-section -->
<!-- FILL: documentation-structure-section -->
<!-- FILL: behavioral-rules-section -->
<!-- FILL: tooling-section -->
```

---

## Phase 0: Prerequisites

- [ ] Verify that `graphify-out/graph.json` exists — if so, query it for architecture overview first
- [ ] Read the current `AGENTS.md` end-to-end if it exists
- [ ] Read project config files (e.g., `pyproject.toml`, `package.json`, `Cargo.toml`, `go.mod`) for test commands and structure
- [ ] Scan `tests/` directory for test files and conventions
- [ ] Scan `.opencode/skills/*/SKILL.md` for behavioral rules that appear in multiple skills (universalization candidates)

---

## Workflow

> **Investigation Protocol:** Investigation compares the current document against the current codebase — not against previous session changes. Pre-existing discrepancies (outdated file ownership, missing sections, wrong commands, stale behavioral rules) are gaps to flag regardless of when they were introduced.

### 1. Investigate the Codebase
Read in priority order:
1. Project entry points and their sub-modules — extract behavioral patterns, modification constraints, resource management rules
2. Configuration files — extract constants, flags, environment variable bindings
3. Core infrastructure modules — extract loading/unloading or lifecycle patterns
4. Build, test, lint, CI configs — extract exact CLI commands
5. `.opencode/skills/*/SKILL.md` — extract behavioral rules that appear in multiple skills
6. Scan `tests/` for test files — note naming convention, approach per file, test count

For each **What to Include** item, collect the data. This fills the `<!-- FILL: -->` markers in the Universal Template:
- **File ownership** — files with ⚠️/❌ policies only; omit safe defaults
- **Commands** — install, run, build, test, lint, cleanup
- **Test Suite** — naming convention, file-to-module table with approach (Pure / `sys.modules` patch / mock), run command
- **Documentation Structure** — scan `docs/`, `refs/`, root for `.md` files
- **Behavioral rules** — domain-specific constraints (pipeline, memory, config, data safety)
- **Failure Triage** — project-specific symptom→cause→action rows
- **Tooling** — knowledge graph, search index invocation and update commands

### 2. Read the Current Document
- Check if `AGENTS.md` exists at the project root — create if not
- Flag outdated or missing items

### 3. Identify Gaps and Issues
For each **What to Include** item and each **Universal Template** marker: does it exist? Is it accurate?

**Cross-reference checks:**
- Does the file ownership table account for all files added or removed since last sync? Cross-reference every entry against current filesystem
- Does the test suite structure match actual test files on disk? Verify every entry in the test table exists in the filesystem

### 4. Assemble or Update the Document

**If AGENTS.md doesn't exist (create from scratch):**
1. Start with the **Universal Template** from this skill
2. Replace each `<!-- FILL: name -->` marker with discovered project-specific content
3. Omit markers for sections that don't apply (no tests → remove `<!-- FILL: test-suite-section -->`)
4. Verify no `<!-- FILL:` markers remain
5. Write the result to `AGENTS.md`

**If AGENTS.md already exists (surgical update):**
- For each `<!-- FILL: -->` section in the Universal Template: replace the corresponding section in AGENTS.md with freshly discovered data (e.g., replace the Commands block, update the Test Suite table, refresh File Ownership rows)
- Keep universal template sections as-is — they're identical across projects and should not drift
- Remove sections that no longer apply, add any that are missing
- Never rewrite the whole file — use targeted edits on changed sections only

### 5. Verify

**Integrity & Scope:**
- [ ] Every piece of content belongs in this document per the What NOT to Include table — redirect if it belongs elsewhere
- [ ] No content duplicated from another document — use `See <DOC>.md` cross-references instead
- [ ] All claims verified against executable sources (code, config, workflows), not just docs
- [ ] Every line passes the litmus test — "Would an agent miss this?"
- [ ] Document omits everything an agent doesn't need — no speculative, aspirational, or unverifiable content
- [ ] No `<!-- FILL:` markers remain in the final output
- [ ] Universal template sections are unmodified from the skill's template (only project-specific sections differ)

**Document-Specific Checks:**
- [ ] File ownership table covers all files with non-default policies (⚠️ / ❌) — accurate and complete
- [ ] File ownership table cross-referenced against current filesystem — no missing entries for new files, no stale entries for removed files
- [ ] Test suite structure matches actual test files on disk — every test file entry in the table verified against filesystem
- [ ] All commands are accurate and runnable with exact syntax
- [ ] Agent behavioral rules are imperative — "always/never", not "consider" or "try to"
- [ ] Cross-phase universal rules are not duplicated in phase-specific skill files
- [ ] Project-specific behavioral rules are captured — modification constraints, resource management, config conventions
- [ ] Failure Triage table reflects actual project failure patterns (use generic symptom categories, not tool names)
- [ ] Test Suite section includes: file naming convention, file-to-module table with approach per file, test conventions, and run command
- [ ] Documentation Structure table lists all project docs with correct relative paths
- [ ] Tooling conventions documented as behavioral rules, not tool names
- [ ] Cross-references between documents are accurate (use relative paths)
