---
name: update-agent-setup-md
type: subskill
description: Analyze the current agent development environment (global + project state) and update `docs/AGENT_SETUP.md` to be accurate, complete, and within its defined scope. Trigger when the user says "update agent setup", "sync agent setup", "agent setup is outdated", or similar.
---

## Purpose

Agent development environment setup guide. Answers "How do I reproduce this project's AI coding assistant environment on any machine?"

Mine the global system state and the project codebase, then update or create `docs/AGENT_SETUP.md` so any developer can clone the repo and have the same OpenCode + MCP + skills experience on any device.

---

## Audience

- Developers setting up a new machine for this project
- AI agents needing tooling context to operate correctly
- Teams wanting consistent, reproducible development environments

---

## Content Rules

### Quality Gates

- **"Would a developer setting up a new machine miss this?" litmus test**
- **Verifiable against actual system state:** Every tool version, config path, and command must be verified
- **Cross-platform awareness:** Document platform-specific paths and commands
- **No secrets:** Never capture API keys, tokens, or credentials

### What to Include

- Prerequisites — foundational tools (Python, Node.js, uv, OpenCode CLI) with install commands
- Global tool installations — MCP servers (`cocoindex-code`, `graphifyy`), their versions, install commands
- PATH configuration — where tool executables live, how to add to PATH per platform
- Global config files — OpenCode global permissions (`\~/.config/opencode/opencode.json`), cocoindex global settings (`\~/.cocoindex_code/global_settings.yml`), any global custom commands or skills
- Project config files — `opencode.json`, `.opencode/package.json`, `.opencode/package-lock.json`, `.opencode/.gitignore`, skill directory
- Gitignore configuration — what's ignored and why, how ignore rules map to transferability vs regeneratability
- MCP server configuration — server names, their commands, what each provides
- Plugin configuration — ast-grep and other OpenCode plugins with their npm packages
- Skill inventory — list of all SDD workflow skills with phase mapping
- Custom commands — `/scaffold` and any other global or project-local commands
- One-time global setup steps — what must happen once per machine
- Per-clone project setup steps — what must happen for each repo clone
- First-time flow — complete end-to-end sequence from blank machine to working setup
- Verification steps — commands to confirm each component works after setup
- Troubleshooting — common failures and how to fix them

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
- Setup covers only the agent toolchain (OpenCode, MCP, cocoindex, graphify) — application dependencies and pipeline commands belong in README.md

---

## Phase 0: Prerequisites

- [ ] Verify agent environment is accessible (global config, project config)
- [ ] Read existing AGENT_SETUP.md — understand current documented state
- [ ] Check for new tools/dependencies added since last sync

## Workflow

### 1. Scan Global State
Collect from the developer's system:
- OpenCode global config
- Global commands and skills
- cocoindex global settings
- Tool installations
- PATH check
- graphify platform install

### 2. Scan Project State
Read the project's committed files:
- `opencode.json`
- `.opencode/package.json`
- `.opencode/skills/`
- `.gitignore`
- `.cocoindex_code/settings.yml` (if present)
- `graphify-out/` (if present)

### 3. Read the Current Document
- Check if `docs/AGENT_SETUP.md` exists
- Flag outdated content

### 4. Identify Gaps and Issues
For each **What to Include** item: does it exist? Is it accurate?

### 5. Update the Document
- Add missing sections
- Fix outdated content
- Remove or redirect out-of-scope content
- Keep language instructional
- Include platform notes inline
- Don't rewrite the entire document — only update what's necessary

### 6. Verify

**Integrity & Scope:**
- [ ] Every piece of content belongs in this document per the What NOT to Include table — redirect if it belongs elsewhere
- [ ] No content duplicated from another document — use `[See <DOC>.md](<DOC>.md)` cross-references instead
- [ ] All tool versions and commands verified against actual system state (global scan) or committed files (project scan)
- [ ] Every line passes the litmus test defined in Quality Gates
- [ ] Document omits everything a developer setting up doesn't need — no speculation, no aspirational content

**Document-Specific Checks:**
- [ ] Prerequisites section covers all foundational tools with install commands
- [ ] Global setup steps are clearly separated from project setup steps
- [ ] PATH configuration documented per platform with exact commands
- [ ] MCP server config shows both the config entry and the verification command
- [ ] Skill inventory is complete and matches `.opencode/skills/` directory
- [ ] Custom commands documented with usage syntax and examples
- [ ] First-time flow is a complete end-to-end sequence from blank machine
- [ ] Verification section has runnable commands for each component
- [ ] All configuration file paths are correct (global paths use `\~`, project paths are repo-relative)
- [ ] No secrets, API keys, or credentials captured anywhere
- [ ] Cross-references to README.md and other docs are accurate
- [ ] Gitignore rules are documented per tool — tracked vs ignored files explained with rationale
- [ ] `.opencode/.gitignore` nested config is documented — only `node_modules` and `bun.lock` ignored; `package.json` and `package-lock.json` tracked