# Agent Development Environment Setup

This document captures every global and project-level configuration needed to reproduce this project's AI coding assistant environment on any device.

---

## Table of Contents

- [What This Covers](#what-this-covers)
- [Prerequisites](#prerequisites)
- [Global Setup (One-Time Per Machine)](#global-setup-one-time-per-machine)
- [Project Setup (Per Repository Clone)](#project-setup-per-repository-clone)
- [Configuration Reference](#configuration-reference)
- [Gitignore Configuration](#gitignore-configuration)
- [Custom Commands](#custom-commands)
- [First-Time Flow From Scratch](#first-time-flow-from-scratch)
- [Verification](#verification)
- [Troubleshooting](#troubleshooting)

---

## What This Covers

| Layer | Tools |
|-------|-------|
| AI Assistant | OpenCode CLI |
| Code Search | cocoindex-code (semantic), ast-grep (structural) |
| Knowledge Graph | graphify (project map) |
| Workflow | 16 custom SDD pipeline skills |
| Scaffolding | `/scaffold` command for generating skills and commands |

---

## Prerequisites

| Tool | Version | Install |
|------|---------|---------|
| Python | >= 3.10 | [python.org](https://python.org) |
| Node.js | >= 18 | [nodejs.org](https://nodejs.org) |
| uv | latest | `powershell -c "irm https://astral.sh/uv/install.ps1 \| iex"` |
| OpenCode CLI | latest | See below |

---

## Global Setup (One-Time Per Machine)

These steps run **once per machine** — not per repo. They configure your AI coding assistant and MCP tooling globally.

### 1. Install OpenCode CLI

```powershell
npm install -g opencode-ai
```

Verify:

```powershell
opencode --version
```

### 2. Configure OpenCode Global Permissions

Create `~/.config/opencode/opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "lsp": true,
  "agent": {
    "build": {
      "permission": {
        "edit": "ask",
        "write": "ask",
        "bash": "ask"
      }
    }
  }
}
```

This sets build-mode to ask before editing, writing, or running shell commands.

### 3. Install MCP Servers

**cocoindex-code** (semantic code search):

```powershell
uv tool install 'cocoindex-code[full]'
```

The `[full]` extra bundles local sentence-transformers embeddings (no API key required). The `ccc` CLI is provided by this package.

**graphify** (knowledge graph):

```powershell
pip install 'graphifyy[mcp]'
```

> Note: The PyPI package is `graphifyy` (double-y). The import module is `graphify`. Use `pip install` (not `uv tool install`) so the module is importable by `python -m graphify.serve`.

### 4. Add uv Tool Binaries to PATH

Both `ccc` and `graphify` executables are installed to `~/.local/bin/` by uv, but this directory is not on PATH by default on Windows.

```powershell
[Environment]::SetEnvironmentVariable(
    "Path",
    [Environment]::GetEnvironmentVariable("Path", "User") + ";$env:USERPROFILE\.local\bin",
    "User"
)
```

Open a **new terminal** for this to take effect. Verify:

```powershell
ccc --help
graphify --help
```

### 5. Set Default Embedding Model for cocoindex-code

The file `~/.cocoindex_code/global_settings.yml` is auto-created by `ccc init`. Recommended config (local embeddings, no API key):

```yaml
embedding:
  provider: sentence-transformers
  model: sentence-transformers/all-MiniLM-L6-v2
```

To switch models, edit this file and run `ccc doctor` to verify.

---

## Project Setup (Per Repository Clone)

These steps run for **each clone** of the project.

### 1. Clone and Install App Dependencies

```powershell
git clone <repository-url>
cd introchat

# Python dependencies
uv sync

# Frontend dependencies + build
cd frontend
npm install
npm run build
cd ..
```

### 2. Install OpenCode Plugin Dependencies

```powershell
cd .opencode
npm install
cd ..
```

This installs `@opencode-ai/plugin` and `opencode-ast-grep` — the AST-based structural search and rewrite tool.

### 3. Initialize cocoindex-code Index

```powershell
ccc init
ccc index
```

- `ccc init` creates `.cocoindex_code/settings.yml` with file patterns for indexing
- `ccc index` builds the semantic search index (incremental after first build)
- `.cocoindex_code/` is gitignored — rebuild on each clone

### 4. Build the Knowledge Graph

```powershell
graphify .
```

This creates `graphify-out/` with:
- `graph.json` — full knowledge graph data
- `graph.html` — interactive visualization
- `GRAPH_REPORT.md` — architecture insights

### 5. Register Graphify with OpenCode

```powershell
graphify opencode install
```

This writes a config file that tells OpenCode to consult the knowledge graph for codebase questions.

---

## Configuration Reference

### Global Configuration Files

| File | Purpose |
|------|---------|
| `~/.config/opencode/opencode.json` | OpenCode global permissions (build mode: edit/write/bash = ask) |
| `~/.config/opencode/commands/scaffold.md` | Custom `/scaffold` command for generating skills and commands |
| `~/.cocoindex_code/global_settings.yml` | Default embedding model for semantic search |

### Global Tool Installations

| What | Command | Provides |
|------|---------|----------|
| OpenCode CLI | `npm install -g opencode-ai` | `opencode` command |
| cocoindex-code | `uv tool install 'cocoindex-code[full]'` | `ccc`, `cocoindex-code` commands |
| graphifyy | `pip install 'graphifyy[mcp]'` | `graphify` command, `graphify` Python module |

### Project Configuration Files

| File | Purpose | Checked In? |
|------|---------|-------------|
| `opencode.json` | Plugins (`opencode-ast-grep`) and MCP servers (`ccc mcp`, `python -m graphify.serve`) | Yes |
| `.opencode/package.json` | Plugin npm dependencies | Yes |
| `.opencode/skills/` | 16 SDD workflow skill definitions | Yes |
| `.cocoindex_code/settings.yml` | File patterns for code indexing (auto-generated by `ccc init`) | No (gitignored) |
| `graphify-out/graph.json` | Project knowledge graph | Yes |
| `graphify-out/GRAPH_REPORT.md` | Graph report | Yes |
| `graphify-out/graph.html` | Interactive visualization | Yes |
| `graphify-out/manifest.json` | Cache metadata (not shared) | No (gitignored) |
| `graphify-out/cost.json` | API cost tracking (not shared) | No (gitignored) |
| `.gitignore` | Ignores for tool-generated files | Yes |

### opencode.json (Project Root)

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-ast-grep"],
  "mcp": {
    "cocoindex-code": {
      "type": "local",
      "command": ["ccc", "mcp"]
    },
    "graphify": {
      "type": "local",
      "command": ["python", "-m", "graphify.serve", "graphify-out/graph.json"]
    }
  }
}
```

### SDD Workflow Skills

The `.opencode/skills/` directory contains 16 skills implementing a Specification-Driven Development pipeline:

| Phase | Skill | Mode |
|-------|-------|------|
| 1 | `brainstorm-and-plan` | Plan |
| 2 | `grill-and-refine` | Plan |
| 3 | `check-plan-readiness` | Build |
| 4 | `implement-plan` | Build |
| 5 | `review-implementation` | Plan |
| 6 | `improve-architecture` | Build |
| 7 | `modularize-and-clean` | Build |
| 8 | `update-docs` | Build |
| 9 | `push-to-git` | Build |
| — | `run-e2e-tests` | Build |
| — | `update-agents-md` | Build |
| — | `update-architecture-md` | Build |
| — | `update-best-practices-md` | Build |
| — | `update-demo-guide-md` | Build |
| — | `update-readme-md` | Build |
| — | `update-specifications-md` | Build |

Skills are auto-loaded by OpenCode when the task description matches their `name` and `description` fields.

---

### Gitignore Configuration

**Principle:** Track what's essential for setup (configs, dependencies, manifests). Ignore what's regeneratable (build output, caches, indexes, internal metadata).

#### Root `.gitignore` — Tool-Related Rules

| Rule | Tool | Why Ignored |
|------|------|-------------|
| `.opencode/node_modules/` | OpenCode plugins | Regeneratable via `npm install` in `.opencode/` |
| `/.cocoindex_code/` | cocoindex-code | Platform-specific index tied to local Python env; recreated by `ccc init && ccc index` |
| `graphify-out/manifest.json` | graphify | mtime-based cache metadata — breaks after git clone |
| `graphify-out/cost.json` | graphify | Local API cost tracking — not shareable across machines |
| `graphify-out/cache/` | graphify | Extraction cache — regenerated by `graphify .` |
| `graphify-out/.graphify_labels.json` | graphify | Internal metadata — regenerated on rebuild |
| `graphify-out/.graphify_root` | graphify | Internal metadata — regenerated on rebuild |

#### Nested `.opencode/.gitignore`

```gitignore
node_modules
bun.lock
```

Only `node_modules` and `bun.lock` are ignored here. The files `package.json` and `package-lock.json` are **tracked** — they define the exact plugin dependency versions so every clone gets identical OpenCode plugin behavior.

#### Why Not Commit Generated Files

- `.cocoindex_code/` is tied to your Python environment and absolute file paths — an index built on Windows won't work on Mac or Linux. Run `ccc init && ccc index` on each machine instead.
- `graphify-out/cache/` and metadata files (`.graphify_labels.json`, `.graphify_root`) are extraction artifacts unique to the local environment. The committed graph (`graph.json`, `GRAPH_REPORT.md`, `graph.html`) is the shareable output.
- `graphify-out/manifest.json` stores mtime-based hashes that change after clone — committing it would cause false rebuilds.

---

## Custom Commands

### `/scaffold`

Creates new OpenCode skills and commands from templates. Defined globally at `~/.config/opencode/commands/scaffold.md`.

Usage:

| Command | Creates | Location |
|---------|---------|----------|
| `/scaffold skill <name>` | Skill definition | `.opencode/skills/<name>/SKILL.md` |
| `/scaffold command <name>` | Command prompt | `.opencode/commands/<name>.md` |
| `/scaffold global-skill <name>` | Global skill | `~/.config/opencode/skills/<name>/SKILL.md` |
| `/scaffold global-command <name>` | Global command | `~/.config/opencode/commands/<name>.md` |

Each template includes frontmatter (`name`, `description`) and a base workflow structure. After generation, the file can be edited to customize behavior.

---

## First-Time Flow From Scratch

Complete end-to-end setup on a new machine:

### Step 1: Install System Prerequisites

```powershell
# Install Python 3.10+ from https://python.org
# Install Node.js 18+ from https://nodejs.org

# Install uv
powershell -c "irm https://astral.sh/uv/install.ps1 | iex"

# Install OpenCode CLI
npm install -g opencode-ai

# Reload PATH
$env:Path = [Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [Environment]::GetEnvironmentVariable("Path", "User")
```

### Step 2: Set Up MCP Servers

```powershell
uv tool install 'cocoindex-code[full]'
pip install 'graphifyy[mcp]'

# Add uv tool bin directory to PATH
[Environment]::SetEnvironmentVariable("Path", "$env:Path;$env:USERPROFILE\.local\bin", "User")

# Open a NEW terminal for PATH change to take effect
```

### Step 3: Install OpenCode Global Config

Create `~/.config/opencode/opencode.json` (see [section 2](#2-configure-opencode-global-permissions) above).

### Step 4: Clone and Set Up Project

```powershell
git clone <repository-url>
cd introchat

# App dependencies
uv sync
cd frontend
npm install
npm run build
cd ..

# OpenCode plugin dependencies
cd .opencode
npm install
cd ..
```

### Step 5: Initialize Tooling

```powershell
ccc init
ccc index
graphify .
graphify opencode install
```

### Step 6: Restart OpenCode

Restart your OpenCode session. Both MCP servers should connect automatically.

---

## Verification

After setup, confirm each component works:

```powershell
# OpenCode
opencode --version

# cocoindex-code (semantic search)
ccc mcp --help

# graphify (knowledge graph) via CLI
graphify --version

# graphify (knowledge graph) via MCP
python -m graphify.serve graphify-out/graph.json &

# cocoindex index status
ccc status
```

In OpenCode itself, verify:
- The ast-grep plugin is loaded (structural search works)
- Both MCP servers connect without errors on startup
- Skills are listed (skills matching current task description are suggested)

---

## Troubleshooting

### `ccc` or `graphify` command not found

The uv tool binaries are in `~/.local/bin/` but this directory is not on PATH by default on Windows.

**Fix:** Run once:

```powershell
[Environment]::SetEnvironmentVariable("Path", "$env:Path;$env:USERPROFILE\.local\bin", "User")
```

Then open a **new terminal**.

### `python -m graphify.serve` fails with ModuleNotFoundError

graphifyy was installed via `uv tool install` instead of `pip install`. The `uv tool install` isolates the package from system Python.

**Fix:**

```powershell
pip install 'graphifyy[mcp]'
```

### `ccc mcp` fails on OpenCode startup

**Cause:** OpenCode was started before `~/.local/bin` was added to PATH. Child processes inherit the parent's environment, so even if the user PATH is set in the registry, already-running processes and their children won't see it.

**Fix:** Run `ccc --help` in a new terminal. If it works, the PATH is correct — restart your OpenCode host (Cursor, VS Code, terminal) so it picks up the new environment. If `ccc --help` fails, re-run the PATH setup step in [§4](#4-add-uv-tool-binaries-to-path) and open a fresh terminal.

If you genuinely cannot modify PATH (restricted machine), fall back to an absolute path in `opencode.json`:
```json
"cocoindex-code": {
  "type": "local",
  "command": ["C:\\Users\\<YOUR_USERNAME>\\.local\\bin\\ccc.exe", "mcp"]
}
```
But note: absolute paths are **machine-specific** — they break when the same repository is cloned on a different device. Prefer bare `"ccc"` (PATH-based) for portability.

### Graph is stale or has no data

Run:

```powershell
graphify .
```

This re-extracts the project and rebuilds the knowledge graph.

### `.cocoindex_code/settings.yml` doesn't exist

Run `ccc init` in the project root to create it, then `ccc index` to build the index.

---

*Maintain this file when adding, removing, or upgrading any agent development tooling.*
