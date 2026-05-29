---
name: update-agent-setup-md
description: Analyze the current agent development environment (global + project state) and update `refs/AGENT_SETUP.md` to be accurate, complete, and within its defined scope. Trigger when the user says "update agent setup", "sync agent setup", "agent setup is outdated", or similar.
---

## Purpose

Agent development environment setup guide. Answers "How do I reproduce this project's AI coding assistant environment on any machine?"

Mine the global system state and the project codebase, then update or create `refs/AGENT_SETUP.md` so any developer can clone the repo and have the same OpenCode + MCP + skills experience on any device.

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

**Universal (always present):**
- **Prerequisites** — foundational tools (language runtimes, package managers, AI assistant CLI) with install commands
- **Global tool installations** — MCP servers, AI assistant plugins, their install commands
- **PATH configuration** — where tool executables live, how to add to PATH per platform
- **Global config files** — AI assistant global permissions, tool-level global settings, any global custom commands or skills
- **Project config files** — AI assistant root config (`opencode.json`), plugin dependency manifests, skill directories
- **One-time global setup steps** — what must happen once per machine (install AI assistant, install MCP servers, configure global settings, register system-level configs)
- **Per-clone project setup steps** — dependency install, index/build initialization, MCP/server registration
- **First-time flow** — complete end-to-end sequence from blank machine to working setup
- **Verification steps** — commands to confirm each component works after setup (version checks, status commands, connectivity tests)
- **Troubleshooting** — common failures (tool not found, path issues, MCP errors, stale indexes) with actionable fixes

**Optional (include only if applicable):**
- **Configuration reference** — tables of global and project config files with purpose and check-in status
- **Gitignore configuration** — what's ignored and why per tool, tracked vs ignored files with rationale, nested gitignore files
- **Custom commands** — project-specific or global CLI commands with usage syntax and examples
- **Skill/workflow inventory** — list of all agent skills with phase mapping and descriptions

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

**Boundary rules** (document-specific guardrails):
- Setup covers only the agent toolchain (AI assistant CLI, MCP servers, semantic search, knowledge graph, workflow skills) — application dependencies and run commands belong in README.md

---

## Universal Template

The skeleton below is used for every project's `AGENT_SETUP.md`. Markers like `<!-- FILL: name -->` indicate where project-specific content is injected. Sections without markers are included verbatim.

```markdown
# [Project Name] Agent Setup

> **Last verified:** [date]

## What This Covers
| Layer | Tools |

## Prerequisites
| Tool | Version | Install |

## Global Setup (One-Time Per Machine)
[Steps that run once per machine — AI assistant CLI, MCP servers, config files, PATH]

## Project Setup (Per Repository Clone)
[Steps per clone — dependency install, index initialization, MCP registration]

## First-Time Flow From Scratch
[Complete end-to-end sequence from blank machine to working setup]

## Verification
[Commands to confirm each component works — version checks, index status, MCP connectivity]

## Troubleshooting
[Common failures — tool not found, path issues, MCP errors — with actionable fixes]

<!-- FILL: optional-sections -->
```

Optional sections (include only if applicable): Configuration reference (tables of global and project config files), Gitignore explanation (what's tracked vs ignored per tool with rationale), Custom commands (project-specific `/scaffold` or similar), Skill/workflow inventory (agent skills with phase mapping).

---

## Phase 0: Prerequisites

- [ ] Verify agent environment is accessible (global config, project config)
- [ ] Read existing AGENT_SETUP.md — understand current documented state
- [ ] Check for new tools/dependencies added since last sync

## Workflow

> **Investigation Protocol:** Investigation scans the current system and project state, then compares against the current document — not against previous session changes. Pre-existing discrepancies (stale tool versions, wrong PATH config, missing setup steps) are gaps to flag regardless of when they were introduced.

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
- Check if `refs/AGENT_SETUP.md` exists
- Flag outdated content

### 4. Identify Gaps and Issues
For each **What to Include** item: does it exist? Is it accurate?

### 5. Assemble or Update the Document

**If AGENT_SETUP.md doesn't exist (create from scratch):**
1. Start with the **Universal Template** from this skill
2. Replace `<!-- FILL: optional-sections -->` with any applicable optional sections
3. Fill each universal section with discovered tool-specific content
4. Verify no `<!-- FILL:` markers remain
5. Write the result to `refs/AGENT_SETUP.md`

**If AGENT_SETUP.md already exists (surgical update):**
- For each universal section: compare against discovered system state and update only what changed (tool versions, commands, config paths, setup steps)
- For each optional section: add if applicable and missing, remove if no longer applicable, update if stale
- Never rewrite the whole file — use targeted edits on changed sections only

### 6. Verify

**Integrity & Scope:**
- [ ] Every piece of content belongs in this document per the What NOT to Include table — redirect if it belongs elsewhere
- [ ] No content duplicated from another document — use `See <DOC>.md` cross-references instead
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