---
name: update-agent-setup-md
description: Analyze the current agent development environment (global + project state) and update `docs/AGENT_SETUP.md` to be accurate, complete, and within its defined scope. Trigger when the user says "update agent setup", "sync agent setup", "agent setup is outdated", or similar.
---

## Purpose

Agent development environment setup guide. Answers "How do I reproduce this project's AI coding assistant environment on any machine?", "What tools are needed globally and per-project?", "How do I verify everything works?"

Mine the global system state and the project codebase, then update or create `docs/AGENT_SETUP.md` so any developer can clone the repo and have the same OpenCode + MCP + skills experience on any device.

---

## Audience

- Developers setting up a new machine for this project
- AI agents needing tooling context to operate correctly
- Teams wanting consistent, reproducible development environments across devices

---

## Content Rules

### Quality Gates

Every piece of content must pass these four checks:

- **"Would a developer setting up a new machine miss this?" litmus test:** Every line must answer "Would a developer likely fail to set up correctly without this instruction?" If not, leave it out.
- **Verifiable against actual system state:** Every tool version, config path, and command must be verified against the live environment or the project's committed files. Never guess or extrapolate.
- **Cross-platform awareness:** Document platform-specific paths and commands inline. Use `\~/.local/bin` as the canonical uv-bin path with a platform note.
- **No secrets:** Never capture API keys, tokens, or credentials. Only document config structure and tool presence.

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
| **README.md** | User-facing setup, usage, features, benefits, installation | End users, new developers | User-facing | Install/run commands, user-facing features, quick-start, troubleshooting |
| **ARCHITECTURE.md** | Technical structure, modules, file tree, implementation, data flow | Developers, AI agents | Technical | API endpoints, WebSocket events, module descriptions, import graph, design decisions (technical) |
| **SPECIFICATIONS.md** | Product vision, user journey, problem statement, pitch, Out of Scope, privacy | Product owners, devs, AI agents, evaluators/stakeholders | Product / Vision | Product vision, user journey, feature rationale, privacy model, design decisions (product), out-of-scope boundaries |
| **DEMO_GUIDE.md** | Demo presentation, walkthrough, step-by-step instructions | Presenters, evaluators | Practical | Demo walkthrough, testing scenarios, fallback options, reset instructions |
| **AGENTS.md** | AI agent permissions, rules, file ownership, operational constraints | AI agents | Operational | Agent behavioral rules, file ownership policies, doc sync triggers, failure triage, cross-phase universal rules |
| **PROJECT_BEST_PRACTICES.md** | Universal coding patterns, best practices, lessons learned | All developers, AI agents | Educational | Universal coding practices, skill methodologies, transferable patterns |
| **DOCUMENT_GUIDELINES.md** | Doc scope, content boundaries, governance | Developers, AI agents | Governance | Document metadata, content boundaries (no dedicated skill) |
| **AGENT_SETUP.md** | Agent dev environment setup, tooling config, cross-machine reproducibility | Developers setting up new machines, AI agents | Setup | Global + project tool config, MCP servers, plugins, skills, PATH, verification |

**Anti-duplication:**
- One purpose per document — if content fits two documents, choose the PRIMARY purpose
- Cross-reference, don't copy — use `[See <DOC>.md](<DOC>.md)` instead of duplicating
- Summary here, details there — each document gets its appropriate level of detail; cross-reference for full content
- Audience-first — if audience overlaps, choose the document with the MOST RELEVANT audience
- If content belongs elsewhere, note it with `→ Redirect to <filename>` — do not include it in this document

---

## Workflow

### 1. Scan Global State

Collect from the developer's system. These are one-time-per-machine configurations.

**Before scanning, ask the user:** "May I read global config directories (\~/.config/opencode/, \~/.cocoindex_code/) to capture your environment?" If declined, skip global scanning and write those sections generically.

If approved, collect:

1. **OpenCode global config** — Read `\~/.config/opencode/opencode.json`. Extract permissions and LSP settings. If the file doesn't exist, note that it should be created.
2. **Global commands** — List the `\~/.config/opencode/commands/` directory. Read each command's frontmatter (description). Document names and purposes.
3. **Global skills** — Check `\~/.config/opencode/skills/` directory. List any global skills with their descriptions.
4. **cocoindex global settings** — Read `\~/.cocoindex_code/global_settings.yml`. Extract embedding provider and model.
5. **Tool installations** — Run `uv tool list` for versioned tool names. Run `npm list -g --depth=0` for global npm packages. Run `pip list 2>$null | Select-String -Pattern "graphifyy"` to verify graphifyy pip install.
6. **PATH check** — Verify whether `\~/.local/bin` (or platform equivalent) is on the system PATH. Check that `ccc` and `graphify` resolve.
7. **graphify platform install** — Check for config files written by `graphify opencode install` (e.g., `\~/.config/opencode/.graphify_prompt` or OpenCode platform instruction files).

### 2. Scan Project State

Read the project's committed files. These are available on every clone.

Read in this priority order:

1. `opencode.json` — plugin list, MCP server commands
2. `.opencode/package.json` — plugin npm dependencies
3. `.opencode/skills/` — list all skill directories; read each `SKILL.md` frontmatter (name, description)
4. `.gitignore` — extract tool-related ignore rules
4a. `.opencode/.gitignore` — validate that essential files (`package.json`, `package-lock.json`) are NOT gitignored. Note the nested ignore strategy (only `node_modules` and `bun.lock` should be ignored).
5. `.cocoindex_code/settings.yml` — if present, read index patterns (created by `ccc init`)
6. `graphify-out/` — check for committed artifacts: `graph.json`, `GRAPH_REPORT.md`, `graph.html`
7. Existing `docs/AGENT_SETUP.md` — read current content for diffing
8. `docs/README.md` — check existing cross-references to AGENT_SETUP.md

For each source, extract:
- Tool names and versions
- Configuration values (structure only — no secrets)
- File paths relative to project root
- Any setup steps implied by the config

### 3. Read the Current Document

- Check if `docs/AGENT_SETUP.md` exists
- Read existing content section by section
- Flag anything outdated (wrong versions, missing tools, stale paths, removed tools)
- Flag missing items from **What to Include**
- Flag content that violates the boundary rules above

### 4. Identify Gaps and Issues

For each item in **What to Include**:
- Does it exist in the current document?
- Is it accurate against actual system/project state?
- Is it written for the right audience (developers setting up a new machine)?
- Does it respect the boundary rules?

For each existing section:
- Does it belong here per **What NOT to Include**?
- If not → mark for redirect to the appropriate document

Additional gaps to check:
- Does the current setup doc explain the gitignore rationale for each tool artifact (tracked vs ignored)?
- Are the nested `.opencode/.gitignore` rules documented alongside the root `.gitignore` rules?

### 5. Update the Document

- Add missing sections
- Fix outdated content to match the current state (versions, paths, tool names)
- Remove or redirect out-of-scope content per the **What NOT to Include** table
- Don't rewrite the entire document — only update what's changed, section by section
- Keep language instructional — clear step-by-step sequences, not marketing prose
- Global configs: say "Create this file:" with content blocks — don't assume the file already exists on the reader's machine
- Project configs: reference the committed files — the reader already has them after cloning (`opencode.json`, `.opencode/package.json`)
- Tool versions: capture actual installed version but write setup steps generically (e.g., `pip install 'graphifyy[mcp]'` without pinning)
- Cross-reference to `docs/README.md` for app setup steps — don't duplicate them
- Include platform notes inline where commands differ (Windows PowerShell vs Linux/Mac bash)
- Document gitignore principle for each tool — for each artifact, state whether it's tracked (cross-device transfer) or gitignored (regeneratable). Cover both root `.gitignore` and nested `.opencode/.gitignore`.
- Keep it concise — a developer setting up should get through it in one sitting

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
