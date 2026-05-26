# Graph Report - intro_chat  (2026-05-21)

## Corpus Check
- 105 files · ~79,574 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 1352 nodes · 1478 edges · 84 communities (80 shown, 4 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 5 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `43673973`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 49|Community 49]]
- [[_COMMUNITY_Community 50|Community 50]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]
- [[_COMMUNITY_Community 54|Community 54]]
- [[_COMMUNITY_Community 55|Community 55]]
- [[_COMMUNITY_Community 56|Community 56]]
- [[_COMMUNITY_Community 57|Community 57]]
- [[_COMMUNITY_Community 58|Community 58]]
- [[_COMMUNITY_Community 59|Community 59]]
- [[_COMMUNITY_Community 60|Community 60]]
- [[_COMMUNITY_Community 61|Community 61]]
- [[_COMMUNITY_Community 62|Community 62]]
- [[_COMMUNITY_Community 63|Community 63]]
- [[_COMMUNITY_Community 64|Community 64]]
- [[_COMMUNITY_Community 65|Community 65]]
- [[_COMMUNITY_Community 66|Community 66]]
- [[_COMMUNITY_Community 67|Community 67]]
- [[_COMMUNITY_Community 68|Community 68]]
- [[_COMMUNITY_Community 69|Community 69]]
- [[_COMMUNITY_Community 70|Community 70]]
- [[_COMMUNITY_Community 72|Community 72]]
- [[_COMMUNITY_Community 73|Community 73]]
- [[_COMMUNITY_Community 74|Community 74]]
- [[_COMMUNITY_Community 75|Community 75]]
- [[_COMMUNITY_Community 76|Community 76]]
- [[_COMMUNITY_Community 77|Community 77]]
- [[_COMMUNITY_Community 78|Community 78]]
- [[_COMMUNITY_Community 79|Community 79]]
- [[_COMMUNITY_Community 81|Community 81]]
- [[_COMMUNITY_Community 83|Community 83]]
- [[_COMMUNITY_Community 86|Community 86]]
- [[_COMMUNITY_Community 89|Community 89]]

## God Nodes (most connected - your core abstractions)
1. `7. Session Lessons Learned` - 27 edges
2. `compilerOptions` - 19 edges
3. `🌟 IntroChat - The Secret Icebreaker for Introverts` - 16 edges
4. `Frontend Modules (React SPA)` - 16 edges
5. `6. Documentation` - 15 edges
6. `main()` - 15 edges
7. `8. Automation & Process Design` - 14 edges
8. `Module Descriptions` - 14 edges
9. `Task Breakdown` - 13 edges
10. `🌟 IntroChat: The Secret Icebreaker for Introverts at Events` - 13 edges

## Surprising Connections (you probably didn't know these)
- `test_matchmaking_lifecycle()` --calls--> `create_match()`  [INFERRED]
  tests/test_app.py → app/matchmaking.py
- `test_database()` --calls--> `init_db()`  [INFERRED]
  tests/test_app.py → app/database.py
- `reset_database()` --calls--> `init_db()`  [INFERRED]
  tests/test_db.py → app/database.py
- `on_startup()` --calls--> `init_db()`  [INFERRED]
  app/__init__.py → app/database.py
- `set_availability()` --calls--> `find_match()`  [INFERRED]
  app/routes.py → app/matchmaking.py

## Communities (84 total, 4 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (43): 7.10 Interactive Walkthrough with Skip Confirmation, 7.11 Presence Check Over Re-Probe, 7.12 Triage Routing, 7.13 Preserve File Description Comments, 7.14 Windows Shell Quoting Workaround, 7.15 Matchmaking Queue Filter Direction, 7.16 Root Pattern Extraction, 7.17 Sequential Numbering for Plan Files (+35 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (14): ConnectionManager, create_match(), find_match(), set_availability(), CreateEventRequest, ExchangeConnectionRequest, JoinEventRequest, SetAvailabilityRequest (+6 more)

### Community 2 - "Community 2"
Cohesion: 0.05
Nodes (39): Architecture, Backend, ✨ Beautiful UI, Chat Interface, Chat Timer Expired, code:bash (uv run python -m app), 🎪 Demo Tips, 🛠️ Fallback Options (+31 more)

### Community 3 - "Community 3"
Cohesion: 0.07
Nodes (36): init_db(), on_startup(), main(), Test that all required files exist, Test database initialization and basic operations, Test conversation prompts, Test that state constants are correctly defined, Test that all modular components can be imported (+28 more)

### Community 4 - "Community 4"
Cohesion: 0.17
Nodes (12): 1.1 Module Responsibility Pattern, 1.2 Separation of Concerns, 1.3 Frontend Modularization, 1.4 Module Communication, 1.5 When to Split a Module, 1. Modularization Techniques, code:block1 (app/), code:block2 (Configuration  → config.py / state.py (constants)) (+4 more)

### Community 5 - "Community 5"
Cohesion: 0.07
Nodes (30): `app/config.py` (Configuration), `app/connection_manager.py` (WebSocket Manager), `app/database.py` (Database Schema), `app/__init__.py` (Orchestrator), `app/__main__.py` (Entry Point), `app/matchmaking.py` (Match Logic), `app/routes.py` (HTTP Routes + WebSocket), `app/schemas.py` (Request Models) (+22 more)

### Community 6 - "Community 6"
Cohesion: 0.07
Nodes (29): Architecture (Simplified), code:bash (# Clone the repository), code:block2 (React SPA (frontend/) ←→ FastAPI Backend (app/) ←→ SQLite Da), code:bash (# Type-check frontend (run after TypeScript changes before t), Common Issues, Contributing, Deployment, Features (+21 more)

### Community 7 - "Community 7"
Cohesion: 0.07
Nodes (27): Adding a New Documentation File, Adding a New Route, Adding a New WebSocket Message Type, Architecture - IntroChat, Changing Timer Durations, code:block1 (intro_chat/), code:python (['Main Hall', 'Table 1', 'Table 2', 'Table 3', 'Table 4', 'T), code:block3 (app/) (+19 more)

### Community 8 - "Community 8"
Cohesion: 0.07
Nodes (26): dependencies, react, react-dom, react-router-dom, devDependencies, jsdom, @playwright/test, @testing-library/jest-dom (+18 more)

### Community 9 - "Community 9"
Cohesion: 0.07
Nodes (29): 8.10 Batch by Logical Concern, Not Line Count, 8.11 Persistent Decision Artifacts, 8.1 Permission Control, 8.2 Executable Sources of Truth, 8.3 Filename as Stable Key, 8.4 Preserve Manual, Regenerate Auto, 8.5 Diff Logging for Automation, 8.6 Cross-Language Extraction Pattern (+21 more)

### Community 10 - "Community 10"
Cohesion: 0.10
Nodes (21): 6.10 Verify Presence and Quality, Not Absence, 6.11 Single Canonical Location for Artifacts, 6.14 Documentation Conciseness & Anti-Bloat, 6.1 One Purpose Per Document, 6.2 Key Differentiator Per Document, 6.3 Quality Gates Before Content, 6.4 Routing Table Over Decision Tree, 6.5 Document Boundary Tensions (+13 more)

### Community 11 - "Community 11"
Cohesion: 0.08
Nodes (26): Components, Frontend Modules (React SPA), `frontend/src/api/client.ts` (API Client), `frontend/src/components/ConnectionCard.tsx`, `frontend/src/components/MatchCountdown.tsx`, `frontend/src/components/PersonCard.tsx`, `frontend/src/components/PromptCard.tsx`, `frontend/src/components/QRDisplay.tsx` (+18 more)

### Community 12 - "Community 12"
Cohesion: 0.08
Nodes (25): Archive Plan (on success), Boundaries, Check Git Status, Check Test Quality, code:bash (uv run python tests/test_app.py), code:bash (cd frontend && npm run build), code:bash (cd frontend && npx tsc --noEmit), Documents to Read (+17 more)

### Community 13 - "Community 13"
Cohesion: 0.08
Nodes (25): 1.5 Extract Descriptions from Source Files, 1.75 Extract Per-Function Details, 1. Investigate the Codebase, 2. Read the Current Document, 3. Identify Gaps and Issues, 4. Update the Document, 5. Verify, Audience (+17 more)

### Community 14 - "Community 14"
Cohesion: 0.15
Nodes (18): PersonCard(), PersonCardProps, { container }, defaultPerson, onClick, PersonResponse, useChatRequest(), id (+10 more)

### Community 15 - "Community 15"
Cohesion: 0.08
Nodes (23): Approach & Design Decisions, Architecture, code:block1 (Browser ──GET /──→ FastAPI (catch-all) ──→ frontend/dist/ind), code:block2 (### Dimension: SPEC conflict resolution), Create (`frontend/`), Edge Cases, Files to Create, Modify, or Remove, Grill Outcomes (+15 more)

### Community 16 - "Community 16"
Cohesion: 0.08
Nodes (23): Approach & Design Decisions, Edge Cases, Grill Outcomes, Implementation Plan, PLAN_2026_05_14_010, Readiness Gate Results, Requirements / Problem, Solution (+15 more)

### Community 17 - "Community 17"
Cohesion: 0.12
Nodes (16): fetchJSON(), fetchWithTimeout(), parseJSON(), QRDisplay(), QRDisplayProps, img, HomePage(), input (+8 more)

### Community 18 - "Community 18"
Cohesion: 0.16
Nodes (22): main(), Test that util files export all expected functions, Test that hooks export all expected functions, Test that all components export their expected React components, Test that all required frontend source files exist, Test that page components are exported, Test that App.tsx references all pages and contexts, Test code quality — no console.log stmts in production code, strict mode (+14 more)

### Community 19 - "Community 19"
Cohesion: 0.09
Nodes (21): Approach & Design Decisions, code:block1 (review-implementation (1st pass)), Dimension: Alternatives, Dimension: Assumptions, Dimension: Consistency, Dimension: Dependencies, Dimension: Edge Cases, Dimension: Risks (+13 more)

### Community 20 - "Community 20"
Cohesion: 0.09
Nodes (21): Design Decisions, Dimension: Database management, Dimension: Match detection for chat test, Dimension: Server management, E2E Test Scenarios, Edge Cases, Files to Create, Files to Modify (+13 more)

### Community 21 - "Community 21"
Cohesion: 0.09
Nodes (21): compilerOptions, allowImportingTsExtensions, forceConsistentCasingInFileNames, isolatedModules, jsx, lib, module, moduleDetection (+13 more)

### Community 22 - "Community 22"
Cohesion: 0.09
Nodes (21): Batch Flags, Boundaries, code:python (def create_session(now=None, new_id=None):), Documents to Read, Exit Declaration, Failure Triage, General Methodology, Hand-off (+13 more)

### Community 23 - "Community 23"
Cohesion: 0.09
Nodes (21): 1. Understand Existing Tests, 2. Scan Codebase for Candidates, 3. Compile Candidate List, Batching Rules, Boundaries, Change-Log (verbal, no file), code:block1 ([DEAD] <file:line> — <symbol> — <evidence> → Recommend: <Rem), code:block2 ([CLEANUP]: short_reason — what changed) (+13 more)

### Community 24 - "Community 24"
Cohesion: 0.10
Nodes (20): Approach & Design Decisions, Dimension: Alternatives, Dimension: Assumptions, Dimension: Consistency, Dimension: Dependencies, Dimension: Edge Cases, Dimension: Risks, Files to Create, Modify, or Remove (+12 more)

### Community 25 - "Community 25"
Cohesion: 0.10
Nodes (20): Approach & Design Decisions, Dimension: Alternatives, Dimension: Assumptions, Dimension: Consistency, Dimension: Dependencies, Dimension: Edge Cases, Dimension: Risks, Files to Create, Modify, or Remove (+12 more)

### Community 26 - "Community 26"
Cohesion: 0.10
Nodes (20): 1. Investigate, 2. Read the Current Document, 3. Identify Gaps and Issues, 4. Present Candidates (Gate Preparation), 5. Update the Document, 6. Verify, 7. Route Skill Improvements, Audience (+12 more)

### Community 27 - "Community 27"
Cohesion: 0.10
Nodes (19): Approach & Design Decisions, Edge Cases, Files to Create, Modify, or Remove, Grill Outcomes, Implementation Plan, Phase 1: Update AGENTS.md, Phase 2: Transfer unique content to destination docs, Phase 3: Sync referencing docs (+11 more)

### Community 28 - "Community 28"
Cohesion: 0.10
Nodes (19): 1. Gather Changes, 2. Categorize, 3. Present Groups, 4. Commit and Push Each Group, 5. Done, Auto-Generated Commit Messages, Boundaries, code:block1 (<action> <group description>) (+11 more)

### Community 29 - "Community 29"
Cohesion: 0.11
Nodes (18): Batch 1: Dependencies & App Bootstrap, Batch 2: Async Database Layer, Batch 3: WebSocket Connection Manager (New File), Batch 4: HTTP Routes Migration, Batch 5: WebSocket Endpoint, Batch 6: Matchmaking + Route Emit Updates, Batch 7: Frontend WebSocket Migration, Batch 8: HTML Template Updates (+10 more)

### Community 30 - "Community 30"
Cohesion: 0.11
Nodes (18): Approach & Design Decisions, Dimension: Alternatives, Dimension: Dependencies, Dimension: Edge Cases, Dimension: Risks, Edge Cases, Files to Create, Modify, or Remove, Grill Outcomes (+10 more)

### Community 31 - "Community 31"
Cohesion: 0.11
Nodes (18): Boundaries (gate-driven phase), code:markdown (# PLAN_YYYY_MM_DD_XXX), code:markdown (## Readiness Gate Results), Exit Declaration (fail), Exit Declaration (pass), Hand-off, Next Step (fail), Next Step (pass) (+10 more)

### Community 32 - "Community 32"
Cohesion: 0.19
Nodes (11): PromptCard(), PromptCardProps, { container }, { container }, Timer(), TimerProps, CONFIG, FALLBACK_PROMPTS (+3 more)

### Community 33 - "Community 33"
Cohesion: 0.11
Nodes (17): Approach & Design Decisions, Dimension: Exit Declarations, Dimension: Grill Output Format, Dimension: Plan File Ownership, Dimension: Review Phase Verification, Dimension: Skill Naming, Dimension: Workflow Scope, Edge Cases (+9 more)

### Community 34 - "Community 34"
Cohesion: 0.11
Nodes (17): Approach & Design Decisions, Dimension: Assumptions, Dimension: Edge Cases, Dimension: Risks, Edge Cases, Files to Create, Modify, or Remove, Grill Outcomes, Implementation Plan (+9 more)

### Community 35 - "Community 35"
Cohesion: 0.15
Nodes (10): SocketProvider(), Subscription, SocketContext, SocketContextValue, handler, mock, msg, { result } (+2 more)

### Community 36 - "Community 36"
Cohesion: 0.12
Nodes (16): Approach & Design Decisions, code:block1 ([comment-marker] [filename]), Edge Cases, Files to Modify, Phase 1: Source Files, Phase 2: Tests, Phase 3: Config + CSS, Phase 4: Workflow Rules (+8 more)

### Community 37 - "Community 37"
Cohesion: 0.12
Nodes (16): Architecture Overview, 🚀 Bonus Features (If Time Allows), Core Features, 🖥️ Demo Setup Instructions (For Judges), 📣 Final Pitch Line (Say This Loud & Proud), Hard Constraints, ✅ How It Works (Core Logic Flow), 🌟 IntroChat: The Secret Icebreaker for Introverts at Events (+8 more)

### Community 38 - "Community 38"
Cohesion: 0.17
Nodes (8): { result }, UserProvider(), UserContext, UserContextValue, UserData, useUser(), mockResponse, UserInfoPage()

### Community 39 - "Community 39"
Cohesion: 0.12
Nodes (16): Architecture Improvement Workflow, Boundaries, code:block1 (P0: app/static/css/style.css — frontend CSS in backend packa), code:block2 ([ARCH]: short_reason — what/why), Documents to Read, Exit Declaration, Failure Handling, Gate: User Approval (+8 more)

### Community 40 - "Community 40"
Cohesion: 0.12
Nodes (15): Approach & Design Decisions, Edge Cases, Files to Create, Modify, or Remove, Grill Outcomes, Implementation Plan, PLAN_2026_05_15_014, Readiness Gate Results, Requirements / Problem (+7 more)

### Community 41 - "Community 41"
Cohesion: 0.12
Nodes (15): Boundaries (read-only phase), code:block1 (### Dimension: [name]), Documents to Read, Exit Declaration, General Methodology, Hand-off, How to Grill, Next Step (+7 more)

### Community 42 - "Community 42"
Cohesion: 0.13
Nodes (14): 1. Investigate the Codebase, 2. Read the Current Document, 3.5 Extract Cross-Phase Patterns from Skills, 3.6 Extract Universal Best Practices from PROJECT_BEST_PRACTICES.md, 3. Identify Gaps and Issues, 4. Update the Document, 5. Verify, Audience (+6 more)

### Community 43 - "Community 43"
Cohesion: 0.13
Nodes (14): Boundaries, Content Rules, Document Update Workflow, Exit Declaration, Hand-off, Next Step, Output, Outputs & Triggers (+6 more)

### Community 44 - "Community 44"
Cohesion: 0.14
Nodes (13): Approach & Design Decisions, Batch 1 — CSS Relocation, Batch 2 — pyproject.toml, Batch 3 — Constants Relocation, Batch 4 — `@/` Alias Conversion, Edge Cases, Implementation Plan, PLAN_2026_05_13_007 (+5 more)

### Community 45 - "Community 45"
Cohesion: 0.14
Nodes (13): 1. Install Playwright (if missing), 2. Build the SPA, 3. Run E2E Tests, 4. Report Results, code:bash (cd frontend && npm install -D @playwright/test && npx playwr), code:bash (cd frontend && npm run build), code:bash (cd frontend && npx playwright test), Documents to Read (+5 more)

### Community 46 - "Community 46"
Cohesion: 0.35
Nodes (9): loadUserFromStorage(), saveUserToStorage(), generateRandomString(), generateUsername(), clearUserId(), getData(), getUserId(), storeData() (+1 more)

### Community 47 - "Community 47"
Cohesion: 0.15
Nodes (12): Boundaries (read-only phase), Exit Declaration, Guidelines, Hand-off, Next Step, Output, Outputs & Triggers, Phase 1: Analyze (agent only) (+4 more)

### Community 48 - "Community 48"
Cohesion: 0.15
Nodes (12): 1. Investigate the App, 2. Read the Current Document, 3. Identify Gaps and Issues, 4. Update the Document, 5. Verify, Audience, Content Rules, Purpose (+4 more)

### Community 49 - "Community 49"
Cohesion: 0.15
Nodes (12): 1. Investigate the Codebase, 2. Read the Current Document, 3. Identify Gaps and Issues, 4. Update the Document, 5. Verify, Audience, Content Rules, Purpose (+4 more)

### Community 50 - "Community 50"
Cohesion: 0.15
Nodes (12): 1. Investigate the Codebase, 2. Read the Current Document, 3. Identify Gaps and Issues, 4. Update the Document, 5. Verify, Audience, Content Rules, Purpose (+4 more)

### Community 51 - "Community 51"
Cohesion: 0.17
Nodes (11): Approach & Design Decisions, Edge Cases, Files to Create, Modify, or Remove, Grill Outcomes, Implementation Plan, PLAN_2026_05_12_003, Readiness Gate Results, Requirements / Problem (+3 more)

### Community 52 - "Community 52"
Cohesion: 0.17
Nodes (11): Approach & Design Decisions, Edge Cases, Files to Create, Modify, or Remove, Grill Outcomes, Implementation Plan, PLAN_2026_05_13_004, Readiness Gate Results, Requirements / Problem (+3 more)

### Community 53 - "Community 53"
Cohesion: 0.24
Nodes (8): ChatTimerControls, onComplete, onTick, { result }, TimerCallbacks, TimerControls, useChatTimer(), useTimerBase()

### Community 54 - "Community 54"
Cohesion: 0.20
Nodes (8): Context Window Discipline, Cross-Phase Universal Rules, Documentation Discipline, Failure Triage, File Ownership, Process Discipline, Scope, SDD Workflow — Phase Order

### Community 55 - "Community 55"
Cohesion: 0.22
Nodes (9): 6. PROJECT_BEST_PRACTICES.md, Audience, code:block1 (**[Practice Name]**), Content Boundaries, Entry Format, Key Differentiator, Scope, What NOT to Include (+1 more)

### Community 56 - "Community 56"
Cohesion: 0.29
Nodes (7): 1. README.md, Audience, Content Boundaries, Key Differentiator, Scope, What NOT to Include, What to Include

### Community 57 - "Community 57"
Cohesion: 0.29
Nodes (7): 2. ARCHITECTURE.md, Audience, Content Boundaries, Key Differentiator, Scope, What NOT to Include, What to Include

### Community 58 - "Community 58"
Cohesion: 0.29
Nodes (7): 3. SPECIFICATIONS.md, Audience, Content Boundaries, Key Differentiator, Scope, What NOT to Include, What to Include

### Community 59 - "Community 59"
Cohesion: 0.29
Nodes (7): 4. DEMO_GUIDE.md, Audience, Content Boundaries, Key Differentiator, Scope, What NOT to Include, What to Include

### Community 60 - "Community 60"
Cohesion: 0.29
Nodes (7): 5. AGENTS.md, Audience, Content Boundaries, Key Differentiator, Scope, What NOT to Include, What to Include

### Community 61 - "Community 61"
Cohesion: 0.29
Nodes (7): 7. DOCUMENT_GUIDELINES.md (this document), Audience, Content Boundaries, Key Differentiator, Scope, What NOT to Include, What to Include

### Community 62 - "Community 62"
Cohesion: 0.40
Nodes (4): ConnectionCard(), ConnectionCardProps, onNo, onYes

### Community 63 - "Community 63"
Cohesion: 0.50
Nodes (3): MatchCountdown(), MatchCountdownProps, onGoToChat

### Community 64 - "Community 64"
Cohesion: 0.40
Nodes (4): Anti-Duplication Rules, Checklist Before Adding Content, Document Guidelines - IntroChat, Quick Reference Table

### Community 65 - "Community 65"
Cohesion: 0.40
Nodes (5): 8. Workflow-to-Document Dependency, code:block2 (review-implementation (1st pass)), Core Pipeline, Doc Sync Steps (Post-Implementation), Reading Pattern

### Community 66 - "Community 66"
Cohesion: 0.50
Nodes (3): dependencies, @opencode-ai/plugin, opencode-ast-grep

### Community 70 - "Community 70"
Cohesion: 0.20
Nodes (9): command, type, command, type, mcp, cocoindex-code, graphify, plugin (+1 more)

### Community 72 - "Community 72"
Cohesion: 0.14
Nodes (13): 1. Install OpenCode CLI, 2. Configure OpenCode Global Permissions, 3. Install MCP Servers, 4. Add uv Tool Binaries to PATH, 5. Set Default Embedding Model for cocoindex-code, code:powershell (npm install -g opencode-ai), code:powershell (opencode --version), code:json ({) (+5 more)

### Community 73 - "Community 73"
Cohesion: 0.14
Nodes (13): 1. Scan Global State, 2. Scan Project State, 3. Read the Current Document, 4. Identify Gaps and Issues, 5. Update the Document, 6. Verify, Audience, Content Rules (+5 more)

### Community 74 - "Community 74"
Cohesion: 0.17
Nodes (12): code:json ({), code:gitignore (node_modules), Configuration Reference, Gitignore Configuration, Global Configuration Files, Global Tool Installations, Nested `.opencode/.gitignore`, opencode.json (Project Root) (+4 more)

### Community 75 - "Community 75"
Cohesion: 0.18
Nodes (11): 1. Clone and Install App Dependencies, 2. Install OpenCode Plugin Dependencies, 3. Initialize cocoindex-code Index, 4. Build the Knowledge Graph, 5. Register Graphify with OpenCode, code:powershell (cd .opencode), code:powershell (ccc init), code:powershell (graphify .) (+3 more)

### Community 76 - "Community 76"
Cohesion: 0.18
Nodes (11): code:powershell (# Install Python 3.10+ from https://python.org), code:powershell (uv tool install 'cocoindex-code[full]'), code:powershell (git clone <repository-url>), code:powershell (ccc init), First-Time Flow From Scratch, Step 1: Install System Prerequisites, Step 2: Set Up MCP Servers, Step 3: Install OpenCode Global Config (+3 more)

### Community 77 - "Community 77"
Cohesion: 0.20
Nodes (9): 2.1 Server Binding for Browser Access, 2. Configuration, 3. Error Handling, 4. State Management, code:python (if user_id not in active_users:), code:python (# ❌ Bad), code:python (# ✅ Local dev — browser-ready), code:python (if not input: return {'error': 'No data'}, 400) (+1 more)

### Community 78 - "Community 78"
Cohesion: 0.22
Nodes (8): Agent Development Environment Setup, code:powershell (# OpenCode), Custom Commands, Prerequisites, `/scaffold`, Table of Contents, Verification, What This Covers

### Community 79 - "Community 79"
Cohesion: 0.22
Nodes (10): `ccc mcp` fails on OpenCode startup, `ccc` or `graphify` command not found, `.cocoindex_code/settings.yml` doesn't exist, code:powershell ([Environment]::SetEnvironmentVariable("Path", "$env:Path;$en), code:powershell (pip install 'graphifyy[mcp]'), code:json ("cocoindex-code": {), code:powershell (graphify .), Graph is stale or has no data (+2 more)

### Community 81 - "Community 81"
Cohesion: 0.25
Nodes (8): 5.1 TestClient Over Live Server, 5.2 TDD Tests Are Permanent Regression Tests, 5.3 Test References Updated in Same Batch as Code Changes, 5. Testing, code:bash (uv run python -c "from app import app"  # Syntax check), code:python (# ✅ Use TestClient — no server process needed), code:block13 (# ✅ Each TDD batch produces code AND a saved test), code:block14 (✅ Same batch: rename getUser → fetchUser in source + update )

### Community 83 - "Community 83"
Cohesion: 0.33
Nodes (6): code:block58, code:block59, code:block60, code:block61, code:block62, Pin: fastapi==0.115.0 (never fastapi without version)

### Community 86 - "Community 86"
Cohesion: 0.50
Nodes (4): 6.12 File Description Convention Across All Languages, code:typescript (// Timer.tsx), code:python (# matchmaking.py), code:css (/* style.css */)

## Knowledge Gaps
- **822 isolated node(s):** `Table of Contents`, `What This Covers`, `Prerequisites`, `code:powershell (npm install -g opencode-ai)`, `code:powershell (opencode --version)` (+817 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Universal Project Best Practices` connect `Community 77` to `Community 0`, `Community 4`, `Community 9`, `Community 10`, `Community 81`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Why does `7. Session Lessons Learned` connect `Community 0` to `Community 77`?**
  _High betweenness centrality (0.008) - this node is a cross-community bridge._
- **Why does `8. Automation & Process Design` connect `Community 9` to `Community 77`?**
  _High betweenness centrality (0.006) - this node is a cross-community bridge._
- **What connects `Table of Contents`, `What This Covers`, `Prerequisites` to the rest of the system?**
  _851 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.046511627906976744 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06463414634146342 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.05 - nodes in this community are weakly interconnected._