# Architecture - IntroChat
===================================================

> **Last verified:** 2026-05-31 20:15 EDT

## Project Structure

```
intro_chat/
├── app/                       # Python package (FastAPI application)
│   ├── __init__.py            # App orchestrator: FastAPI init, static mount, SPA catch-all, wires modules
│   ├── state.py               # Shared in-memory state: active_users, active_matches, etc.
│   ├── database.py            # Database schema initialization (init_db())
│   ├── config.py              # Central config constants (DB_PATH, HOST, PORT, DEFAULT_ROOMS)
│   ├── prompts.py             # Static conversation prompt data shared across all modules
│   ├── qr_utils.py            # QR code generation — produces base64-encoded PNG data URIs
│   ├── schemas.py             # Pydantic request models for API validation
│   ├── routes.py              # All HTTP route handlers (WS gateway delegates to websocket_handler)
│   ├── websocket_handler.py   # WebSocket endpoint handler — processes JSON messages, room changes, disconnect cleanup
│   ├── helpers.py             # Shared helper utilities (short_id for UUID generation)
│   ├── matchmaking.py         # Match finding and creation logic
│   ├── connection_manager.py  # WebSocket connection tracking and per-user broadcasting
│   └── tasks.py               # Background cleanup thread
│
├── frontend/                  # React SPA (Vite + TypeScript)
│   ├── index.html             # SPA entry HTML (mounts #root)
│   ├── components.json        # shadcn/ui configuration — style, Tailwind integration, path aliases
│   ├── package.json           # Dependencies: react, react-dom, react-router-dom, motion, sonner, lucide-react, tailwindcss, shadcn/ui (radix), vite, vitest, playwright
│   ├── postcss.config.js      # PostCSS configuration — enables Tailwind CSS processing
│   ├── tailwind.config.js     # Tailwind CSS configuration with design tokens — sage/warm palette, Sora/DM Serif fonts, custom animations
│   ├── tsconfig.json          # TypeScript config (strict, jsx: react-jsx)
│   ├── vite.config.ts         # Vite build configuration — React plugin, dev proxy to backend, Vitest integration
│   ├── playwright.config.ts   # Playwright E2E config — chromium, webServer, temp database
│   ├── src/
│   │   ├── main.tsx           # React app entry point — mounts root component and imports global styles
│   │   ├── App.tsx            # Root component — React Router with SocketContext, UserContext, ThemeProvider; progress stepper, animated routes, theme toggle, toast system
│   │   ├── api/
│   │   │   └── client.ts      # Typed fetch wrapper with timeout for backend API calls
│   │   ├── config/
│   │   │   └── constants.ts   # Application configuration constants — chat duration, timer defaults, demo delays
│   │   ├── types/
│   │   │   └── api.ts         # TypeScript interfaces for API request/response payloads
│   │   ├── lib/
│   │   │   └── utils.ts       # shadcn utility — merges Tailwind class names via tailwind-merge + clsx
│   │   ├── utils/
│   │   │   ├── format.ts      # Utility functions for formatting values (time, display strings)
│   │   │   ├── storage.ts     # localStorage wrappers for persisting user session data
│   │   │   ├── random.ts      # Utility functions for random string and username generation
│   │   │   └── demoData.ts    # Demo/simulation data — sample users, fallback prompts, and mock responses
│   │   ├── hooks/
│   │   │   ├── useSocket.ts       # Context and hook for managing a persistent WebSocket connection
│   │   │   ├── useTimer.ts        # Hook providing extendable countdown timer with start/clear/extend callbacks
│   │   │   ├── useDemoMode.ts     # Hook providing demo/simulation logic gated by VITE_ENABLE_DEMO feature flag
│   │   │   ├── useChatRequest.ts  # Hook managing chat request lifecycle — send request, wait for response, ready signaling
│   │   │   └── useUser.ts         # Context and hook for user session data (userId, eventId, username)
│   │   ├── context/
│   │   │   ├── useTheme.tsx       # Theme context and hook — dark/light mode toggling, localStorage persistence, system preference detection
│   │   │   ├── SocketContext.tsx  # WebSocket context provider — connects at app root, persists across routes, auto-reconnects
│   │   │   └── UserContext.tsx    # User session context provider — hydrates from localStorage, writes on change
│   │   ├── components/
│   │   │   ├── ui/                # shadcn/ui primitives
│   │   │   │   ├── button.tsx     # shadcn Button — variants: default, destructive, outline, secondary, ghost, link
│   │   │   │   ├── card.tsx       # shadcn Card — Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter
│   │   │   │   ├── input.tsx      # shadcn Input — styled text input with ring focus
│   │   │   │   ├── label.tsx      # shadcn Label — radix-based form label
│   │   │   │   ├── select.tsx     # shadcn Select — radix-based dropdown with trigger, content, item
│   │   │   │   └── skeleton.tsx   # shadcn Skeleton — animated loading placeholder
│   │   │   ├── Timer.tsx          # Timer display component showing MM:SS with warning/danger visual states
│   │   │   ├── PersonCard.tsx     # Person selector card showing username, availability status, and click-to-select
│   │   │   ├── PromptCard.tsx     # Conversation prompt display with fade transition
│   │   │   ├── MatchCountdown.tsx # 60-second countdown display shown after a match is found before navigating to chat
│   │   │   ├── ConnectionCard.tsx # Post-chat connection card with yes/no buttons for Slack connection exchange
│   │   │   └── QRDisplay.tsx      # QR code image display with event code shown below
│   │   ├── styles/
│   │   │   └── global.css        # Global stylesheet — Tailwind directives, CSS variable design tokens (light + dark), custom utility layers
│   │   └── pages/
│   │       ├── HomePage.tsx       # Landing page — event code input, create/join event, QR display
│   │       ├── UserInfoPage.tsx   # Profile form — optional name, LinkedIn/Slack input, save via API, navigate to room
│   │       ├── RoomPage.tsx       # Room selection — dropdown to choose a room, navigates to people matching
│   │       ├── PeoplePage.tsx     # Nearby people matching — person cards, request/accept flow, match countdown
│   │       ├── ChatPage.tsx       # Chat interface — timed conversation with prompts, timer, and extend options
│   │       └── ConnectPage.tsx    # Post-chat connection exchange — ConnectionCard with yes/no, result view, WS subs
│   ├── tests/
│   │   ├── e2e/
│   │   │   └── userFlow.spec.ts  # Playwright E2E tests — home, join, save, match, chat, full chat lifecycle
│   │   ├── setup.ts           # Vitest test setup — imports jest-dom DOM matchers
│   │   ├── App.test.tsx       # Tests for App root — route rendering and provider integration
│   │   ├── utils/
│   │   │   ├── format.test.ts # Tests for format utilities — formatTime edge cases
│   │   │   └── storage.test.ts # Tests for storage utilities — localStorage read/write/clear
│   │   ├── hooks/
│   │   │   ├── useSocket.test.ts   # Tests for useSocket hook — connect, disconnect, auto-reconnect
│   │   │   ├── useTimer.test.ts    # Tests for useChatTimer hook — tick, extend, clear, onComplete
│   │   │   └── useDemoMode.test.ts # Tests for useDemoMode hook — demo flag toggles simulation behavior
│   │   ├── context/
│   │   │   └── UserContext.test.tsx # Tests for UserContext — session hydration and state updates
│   │   ├── components/
│   │   │   ├── Timer.test.tsx          # Tests for Timer — MM:SS display, warning/danger thresholds
│   │   │   ├── PersonCard.test.tsx     # Tests for PersonCard — rendering, availability, selection
│   │   │   ├── PromptCard.test.tsx     # Tests for PromptCard — prompt text rendering
│   │   │   ├── MatchCountdown.test.tsx # Tests for MatchCountdown — countdown display and navigation
│   │   │   ├── ConnectionCard.test.tsx # Tests for ConnectionCard — yes/no button callbacks
│   │   │   └── QRDisplay.test.tsx      # Tests for QRDisplay — image and event code rendering
│   │   └── pages/
│   │       ├── HomePage.test.tsx     # Tests for HomePage — event creation, join, navigation
│   │       ├── UserInfoPage.test.tsx # Tests for UserInfoPage — form input, save, navigation
│   │       ├── RoomPage.test.tsx     # Tests for RoomPage — room selection, navigation to people matching
│   │       ├── ChatPage.test.tsx     # Tests for ChatPage — chat flow, timer, prompts
│   │       ├── PeoplePage.test.tsx   # Tests for PeoplePage — nearby users, request/accept flow, redirect guard
│   │       └── ConnectPage.test.tsx  # Tests for ConnectPage — connection card, yes/no flow, result display
│   └── dist/
│       ├── index.html          # Built SPA entry HTML served by FastAPI catch-all
│       └── assets/             # Built and optimized JS/CSS bundles
│
├── tests/                        # Backend test suite
│   ├── test_app.py            # Backend, database, and SPA serving tests
│   ├── test_js_modules.py     # Frontend source validation tests
│   ├── test_db.py             # Database utility & verification
│   └── test_agent_guidelines.py # Agent skill/tool routing validation
│
├── .cocoindex_code/               # CocoIndex code index (auto-generated — rebuild via `ccc index`)
├── .opencode/                     # OpenCode configuration
    │   └── skills/                 # 20 agentic workflow and utility skills
│
├── docs/                         # Documentation
│   ├── README.md              # Main project README (features, setup, deployment)
│   ├── ARCHITECTURE.md        # This file (project structure reference)
│   ├── SPECIFICATIONS.md       # Product specification (problem, solution, user flow, out of scope, privacy)
│   └── PLAN_*.md              # Active plan documents (created by check-plan-readiness, moved to archive/ after review)
│
├── archive/                       # Archived plans (completed/reviewed)
│   └── PLAN_*.md              # Archived decision records (moved from docs/ after review)
│
├── refs/                         # Reference documents
│   ├── AGENT_SETUP.md         # Agent development environment setup (tooling, PATH, MCP)
│   ├── DOCUMENT_GUIDELINES.md  # Document scope & governance
│   └── PROJECT_BEST_PRACTICES.md # Universal coding best practices
│
├── graphify-out/                  # Graphify knowledge graph outputs (auto-generated — rebuild via `rebuild-indexes` skill)
│   └── graph.json             # Knowledge graph data
│
├── utility/                       # Maintenance and utility scripts
│   └── cleanup_db.py          # Deduplicates database rows, removes User_* test users
│
├── data/                         # Data files
│   ├── introchat.db           # SQLite database (auto-created)
│   └── e2e_test.db            # E2E test temporary database
│
├── AGENTS.md                      # Agent behavioral rules, file ownership, agentic workflow, commands
├── uv.lock                        # Lockfile (auto-generated by `uv sync`)
├── opencode.json                  # Plugin and MCP server configuration
├── .gitignore                     # Git ignore rules
└── .ignore                        # Context ignore rules (avoids low-signal files)
```

---

## Module Descriptions

### `app/__init__.py` (Orchestrator)
FastAPI app factory that initializes the server, mounts static files, registers routes via APIRouter, starts the background cleanup thread, and initializes the database on startup.

- Initializes FastAPI app with `FastAPI(title="IntroChat")`
- Mounts `/assets` from `frontend/dist/assets/` for built JS bundles (if exists)
- Registers SPA catch-all via 404 exception handler (serves `frontend/dist/index.html` for non-API/non-WS paths)
- Imports and includes `router` from `.routes` via `app.include_router(router)`
- Starts background cleanup thread via `start_cleanup_thread()`
- On startup event: creates `data/` directory, calls `await init_db(DB_PATH)`
- **Run command:** `uv run python -m app`

### `app/state.py` (Shared State)
Server-global in-memory state — active users, active matches, waiting queue, and user template. Timer constants are in `config.py`. Conversation prompts are in `prompts.py` and re-exported here for backward compatibility.

- `active_users = {}` — tracks online users, rooms, availability
- `active_matches = {}` — tracks active chat matches
- `waiting_queue = {}` — users waiting for matches
- `USER_TEMPLATE = {}` — default skeleton for new user entries
- Re-exports `CONVERSATION_PROMPTS` from `app.prompts`

#### TypedDicts
- `UserData` — `{event_id: str, username: str, room_id: str | None, linkedin_url: str, slack_handle: str, is_available: bool, last_seen: str | None}`
- `MatchData` — `{user1_id: str, user2_id: str, room_id: str, created_at: float}`
- `QueueEntry` — `{room_id: str, timestamp: float}`

#### Data Structures
- `active_users: dict[str, UserData]` — `{user_id: UserData}`
- `active_matches: dict[str, MatchData]` — `{match_id: MatchData}`
- `active_matches_lock: Lock` — threading lock for thread-safe match operations
- `waiting_queue: dict[str, QueueEntry]` — `{user_id: QueueEntry}`
- `connection_statuses: dict[str, dict[str, bool]]` — `{match_id: {user_id: wants_to_connect}}`
- `USER_TEMPLATE: UserData` — `{event_id: '', username: '', room_id: None, linkedin_url: '', slack_handle: '', is_available: False, last_seen: None}` — default skeleton for new user entries

#### Data re-export
- `CONVERSATION_PROMPTS` — re-exported from `app.prompts` for backward compatibility (see `app/prompts.py`)

### `app/config.py` (Configuration)
Central configuration constants module defining the database path (supports `DB_PATH` env var override for testing), server host, port, timer intervals, and default room names — imported by database, routes, and the main entry point.

#### Constants
- `BASE_DIR` — absolute path to project root directory
- `FRONTEND_DIST_DIR` — absolute path to `frontend/dist/`
- `DB_PATH` — absolute path to `data/introchat.db` (supports `DB_PATH` env var override)
- `HOST` — server bind address (`127.0.0.1`)
- `PORT` — server port (`5000`)
- `MATCH_EXPIRY_SECONDS = 30` — how long a match is valid in DB
- `CLEANUP_INTERVAL_SECONDS = 60` — how often cleanup thread checks for expired matches
- `CLEANUP_THRESHOLD_SECONDS = 300` — remove matches older than this (5 minutes)
- `DEFAULT_ROOMS` — 8 default room names (Main Hall, Table 1-5, Quiet Corner, Coffee Area)

### `app/database.py` (Database Schema)
Async SQLite database initialization using aiosqlite, creating events, users, rooms, and matches tables with migration handling for social profile columns.

- `init_db()` — async, creates 4 tables: `events`, `rooms`, `users`, `matches`
- Uses aiosqlite (`introchat.db` in `data/` folder)

#### Functions
- `init_db(db_path)` — async function that initializes SQLite database, creates all 4 tables, runs ALTER TABLE migration for social columns

#### Tables
| Table | Columns |
|-------|---------|
| `events` | `id` (TEXT PK), `name` (TEXT NOT NULL), `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP), `is_active` (BOOLEAN DEFAULT 1) |
| `rooms` | `id` (TEXT PK), `event_id` (TEXT FK → events), `name` (TEXT NOT NULL) |
| `users` | `id` (TEXT PK), `event_id` (TEXT FK), `room_id` (TEXT FK), `username` (TEXT), `linkedin_url` (TEXT DEFAULT ''), `slack_handle` (TEXT DEFAULT ''), `is_available` (BOOLEAN DEFAULT 0), `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP), `last_seen` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP) |
| `matches` | `id` (TEXT PK), `user1_id` (TEXT FK), `user2_id` (TEXT FK), `room_id` (TEXT FK), `status` (TEXT DEFAULT 'active'), `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP), `expires_at` (TIMESTAMP) |

### `app/routes.py` (HTTP Routes)
All HTTP route handlers for REST API endpoints (events, users, rooms, matches, QR codes, conversation prompts). The WebSocket gateway at `/ws` delegates to `websocket_handler.py`. SPA page serving is handled by the catch-all in `app/__init__.py`.

- `router = APIRouter()` — defines all route handlers with FastAPI decorators
- Endpoints: `/`, `/api/events`, `/api/events/<id>/join`, `/api/events/<id>/rooms`, etc.
- WebSocket endpoint: `/ws` — accepts JSON messages with `user_id` and `room_id`, dispatches `join_room` type

#### Functions
- `index()` — `GET /` → reads and serves `frontend/dist/index.html` as HTMLResponse
- `create_event(data)` — `POST /api/events` → creates event + 8 default rooms, returns event_id
- `get_rooms(event_id)` — `GET /api/events/<event_id>/rooms` → lists rooms (fallback creation if none found)
- `join_event(event_id, data)` — `POST /api/events/<event_id>/join` → creates user with optional linkedin/slack
- `set_user_room(user_id, data)` — `POST /api/users/<user_id>/room` → assigns user to a room
- `set_availability(user_id, data)` — `POST /api/users/<user_id>/available` → toggles availability, triggers `await find_match()`
- `get_user_match(user_id)` — `GET /api/users/<user_id>/match` → gets current match for user
- `get_match(match_id)` — `GET /api/matches/<match_id>` → gets match details with usernames
- `exchange_connection(match_id, data)` — `POST /api/matches/<match_id>/connect` → double opt-in connection, broadcasts via WebSocket
- `generate_qr(event_id, request)` — `GET /api/qr/<event_id>` → generates QR code image as base64
- `get_prompts()` — `GET /api/prompts` → returns `CONVERSATION_PROMPTS` array
- `websocket_endpoint(websocket)` — `WS /ws` → thin gateway, delegates to `handle_websocket()` in `websocket_handler.py`

### `app/websocket_handler.py` (WebSocket Handler)
Real-time WebSocket message processing — accepts connections, manages room membership changes, and handles disconnection cleanup.

#### Functions
- `handle_websocket(websocket)` — async, accepts WS connection, reads user_id/room_id from initial JSON, registers via `ConnectionManager`, processes `join_room` messages, cleans up on disconnect

### `app/helpers.py` (Shared Helpers)
Shared utility functions used across the application.

#### Functions
- `short_id()` — returns an 8-character hex string from `uuid.uuid4()[:8]`
- `insert_default_rooms(db, event_id)` — inserts 8 default rooms for a given event into the database

### `app/matchmaking.py` (Match Logic)
Async match-finding algorithm that pairs available users in the same room, creates match records in the database (with expiry), and sends match_found events via WebSocket. Uses `active_matches_lock` for thread-safe match operations.

- `find_match(user_id)` — async, finds available users in the same room, acquires `active_matches_lock`
- `create_match(user1_id, user2_id, room_id)` — async, creates match with `MATCH_EXPIRY_SECONDS` expiry, notifies users via WebSocket

#### Functions
- `find_match(user_id)` — async, scans `active_users` under `active_matches_lock` for available users in same room who are also in `waiting_queue`; calls `await create_match()` if found, otherwise adds `QueueEntry` to `waiting_queue`
- `create_match(user1_id, user2_id, room_id)` — async, idempotent check under lock (skips if pair already matched), inserts into DB via `aiosqlite` with `expires_at` = now + `MATCH_EXPIRY_SECONDS`, adds `MatchData` to `active_matches` (under lock), removes both from `waiting_queue`, sets both unavailable, sends `match_found` via `manager.broadcast_to_users()`

### `app/schemas.py` (Request Models)
Pydantic request models for API endpoint validation — event creation, user join, room assignment, availability toggle, and connection exchange.

#### Models
- `CreateEventRequest` — `name: str`
- `JoinEventRequest` — `username: str | None`, `linkedin_url: str | None`, `slack_handle: str | None`
- `SetUserRoomRequest` — `room_id: str`
- `SetAvailabilityRequest` — `available: bool`
- `ExchangeConnectionRequest` — `user_id: str`, `wants_to_connect: bool`

### `app/connection_manager.py` (WebSocket Manager)
`ConnectionManager` class that tracks WebSocket connections keyed by user ID, manages room memberships, and provides per-user and per-room message broadcasting.

- `manager = ConnectionManager()` — singleton instance used by routes and matchmaking

#### Class
- `ConnectionManager` — maps user IDs to WebSocket objects, user IDs to room IDs, and room IDs to user ID sets
- `connect(websocket, user_id, room_id)` — registers a WebSocket for a user in a room
- `disconnect(user_id)` — removes user from all mappings
- `send_to_user(user_id, message)` — sends JSON message to a single user's WebSocket
- `broadcast_to_users(user_ids, message)` — sends JSON message to multiple users
### `app/tasks.py` (Background Tasks)
Daemon background thread that periodically checks for and removes expired matches from in-memory state to prevent stale data accumulation.

- `cleanup_expired_matches()` — removes matches older than threshold
- `start_cleanup_thread()` — starts cleanup as daemon thread

#### Functions
- `cleanup_expired_matches()` — infinite loop: sleeps `CLEANUP_INTERVAL_SECONDS` (60), removes matches older than `CLEANUP_THRESHOLD_SECONDS` (300) from `active_matches`
- `start_cleanup_thread()` — creates and starts a daemon thread targeting `cleanup_expired_matches`, returns thread reference

### `app/__main__.py` (Entry Point)
Application entry point that launches the Uvicorn ASGI server on 127.0.0.1:5000 with hot-reload enabled. Uses `HOST` and `PORT` from `app/config.py`.

### `app/prompts.py` (Conversation Prompts)
Static conversation prompt data — 10 icebreaker strings used by the API endpoint. Re-exported via `state.py` for backward compatibility.

#### Data
- `CONVERSATION_PROMPTS` — array of 10 icebreaker strings

### `app/qr_utils.py` (QR Code Generator)
QR code generation utility that produces base64-encoded PNG data URIs from input text.

#### Functions
- `generate_qr_data_uri(data)` — generates a base64-encoded PNG data URI from an input string

---

### Frontend Modules (React SPA)

The frontend is a React 19 SPA built with Vite + TypeScript + Tailwind CSS + shadcn/ui. All routing is client-side via React Router. The backend serves the built `frontend/dist/index.html` as a catch-all. Dark mode is supported via CSS custom properties with a `.dark` class toggle, persisted in localStorage. Page transitions use `motion`'s `AnimatePresence`. Toast notifications use `sonner`. Icons use `lucide-react`.

#### `frontend/src/lib/utils.ts` (shadcn Utility)
shadcn utility that merges Tailwind class names using `tailwind-merge` + `clsx`. Exports `cn(...inputs: ClassValue[]): string`.

#### `frontend/src/config/constants.ts` (Configuration)
Application configuration constants — chat duration, timer defaults, demo delays.

| Property | Value | Description |
|----------|-------|-------------|
| `CHAT_DURATION` | `30` | Chat timer countdown in seconds |
| `MATCH_FOUND_COUNTDOWN` | `60` | Seconds before auto-redirect to chat after match |
| `TIMER_WARNING_THRESHOLD` | `5` | Seconds remaining for yellow warning state |
| `TIMER_DANGER_THRESHOLD` | `3` | Seconds remaining for red danger state |
| `DEMO_LOADING_DELAY_MS` | `2000` | Demo loading animation delay in ms |
| `DEMO_CONNECTION_DELAY_MS` | `2000` | Demo connection exchange delay in ms |
| `SIMULATE_RESPONSE_DELAY_MS` | `3000` | Simulated person response delay in ms |
| `SIMULATE_READY_DELAY_MS` | `5000` | Simulated ready status delay in ms |

#### `frontend/src/api/client.ts` (API Client)
Typed fetch wrapper with timeout for backend API calls.

#### `frontend/src/utils/format.ts` (Format Utilities)
Utility functions for formatting values (time, display strings).
- `formatTime(seconds: number): string` — formats seconds as `M:SS`

#### `frontend/src/utils/storage.ts` (Storage Wrappers)
localStorage wrappers for persisting user session data.

#### `frontend/src/utils/random.ts` (Random Utilities)
Utility functions for random string and username generation.
- `generateRandomString(length = 8): string` — random alphanumeric string
- `generateUsername(): string` — generates `User_XXXXX` random username

#### `frontend/src/utils/demoData.ts` (Demo Mock Data)
Demo/simulation data — sample users, fallback prompts, and mock responses. Imported by `useDemoMode.ts` and `PersonCard.tsx`.

#### `frontend/src/hooks/useSocket.ts` (WebSocket Hook)
Context and hook for managing a persistent WebSocket connection. Single persistent WS connection at app root. Auto-reconnect with exponential backoff (1s, 2s, 4s, 8s max). All pages consume via `useSocket()`.

#### `frontend/src/hooks/useTimer.ts` (Timer Hooks)
Hook providing extendable countdown timer with start/clear/extend callbacks.
- `useChatTimer(duration, callbacks)` — extendable countdown with `start`, `clear`, `extend`, `getTimeLeft`

#### `frontend/src/hooks/useDemoMode.ts` (Demo Mode)
Hook providing demo/simulation logic gated by `VITE_ENABLE_DEMO` feature flag. Returns `{ isDemo, addSampleUsers, addAllSampleUsers, simulatePersonResponse, simulateDelay, createDemoMatchId, isDemoMatch }`. Mock data (`SamplePerson`, `SAMPLE_USERS`, `RESPONSES`) imported from `utils/demoData.ts`. No-ops when demo is disabled.

#### `frontend/src/hooks/useUser.ts` (User Session)
Context and hook for user session data (userId, eventId, username). Provides `{ userId, eventId, username, setUser, clearUser }`. Hydrates from `localStorage` on app init.

#### `frontend/src/hooks/useChatRequest.ts` (Chat Request Lifecycle)
Hook managing chat request lifecycle — send request, wait for response, ready signaling. Encapsulates `requestedPerson`, `personResponse`, `yourReady`, `theirReady` state. Provides `requestChat(person)`, `imReady()`, `cancelRequest()`. Uses `useDemoMode` for simulated response delays and acceptance logic.

#### `frontend/src/context/useTheme.tsx` (Theme Provider + Hook)
Theme context provider and hook for dark/light mode toggling. Stores preference in `localStorage` under `introchat_theme` key. Detects system preference via `prefers-color-scheme: dark` media query as fallback. Toggles `dark` class on `<html>` element. Provides `{ theme, toggleTheme }` via `useTheme()`.

#### `frontend/src/context/SocketContext.tsx` (WebSocket Provider)
WebSocket context provider — connects at app root, persists across routes, auto-reconnects. Connects on mount, disconnects on unmount. Stores `socket`, `connected` state, and `error` in context.

#### `frontend/src/context/UserContext.tsx` (User Session Provider)
User session context provider — hydrates from localStorage, writes on change. Provides `{ userId, eventId, username, linkedin_url, slack_handle, setUser, clearUser }`.

#### Components

Note: All components use `shadcn/ui` primitives (Button, Card, Input, Label, Select, Skeleton) imported from `@/components/ui/`. Styling uses Tailwind utility classes with design tokens from `global.css`. Page transitions use `motion`. Toasts use `sonner`.

##### `frontend/src/components/Timer.tsx`
Timer display component showing MM:SS with warning/danger visual states. Displays with CSS class `timer-warning` (yellow) when below `TIMER_WARNING_THRESHOLD` and `timer-danger` (red) when below `TIMER_DANGER_THRESHOLD`.

##### `frontend/src/components/PersonCard.tsx`
Person selector card showing username, availability status, and click-to-select. Shows availability dot (green/red), and optional room name. Uses `SamplePerson` interface from `utils/demoData.ts`. Click fires `onSelect` callback.

##### `frontend/src/components/PromptCard.tsx`
Conversation prompt display with fade transition. Receives prompt string as prop.

##### `frontend/src/components/MatchCountdown.tsx`
60-second countdown display shown after a match is found before navigating to chat. Shows number and "seconds" label. Auto-redirects via `navigate()` on expiry.

##### `frontend/src/components/ConnectionCard.tsx`
Post-chat connection card with yes/no buttons for Slack connection exchange. Fires `onYes`/`onNo` callbacks.

##### `frontend/src/components/QRDisplay.tsx`
QR code image display with event code shown below. Receives `qrCode`, `eventCode`, and optional `eventName` as props.

##### `frontend/src/components/PeoplePageViews.tsx`
Composite view components for the PeoplePage — `NearbyUsersView` (person card grid with request button), `WaitingResponseView` (cancel-able request state), `AcceptedView` (ready signaling with mutual acceptance). Exports `PersonResponse` interface.

##### `frontend/src/components/ChatPageViews.tsx`
Composite view components for the ChatPage — `ErrorView` (error with back button), `ChatLoadingView` (loading skeleton with duration label), `ChattingView` (prompt card + next button), `TimeUpView` (extend/end options), `ExtendedView` (extended timer with end chat).

#### Pages

##### `frontend/src/pages/HomePage.tsx`
Landing page — event code input, create/join event, QR display. Features event code input, create event modal, QR display, success card, feature grid, privacy notice. Calls API via `client.ts`, uses `QRDisplay` component.

##### `frontend/src/pages/UserInfoPage.tsx`
Profile form — optional name, LinkedIn/Slack input, save via API, navigate to room. Features input fields, auto-generated username fallback, save via API, success card, navigates to `/room/:eventId`.

##### `frontend/src/pages/RoomPage.tsx`
Room selection — dropdown to choose a room, then navigates to people matching. Features room dropdown with select/confirm flow, loading skeleton. Navigates to `/people/:eventId` with room name in navigation state.

##### `frontend/src/pages/PeoplePage.tsx`
Nearby people matching — person cards, request/accept flow, match countdown. Features `NearbyUsersView` with `PersonCard` grid, `WaitingResponseView`, `AcceptedView` with ready signaling, `MatchCountdown` with 60s auto-redirect. WebSocket listener for `match_found`. Guard: redirects to `/room/:eventId` on direct access without navigation state.

##### `frontend/src/pages/ChatPage.tsx`
Chat interface — timed conversation with prompts, timer, and extend options. Features loading card, chat card with `Timer` + `PromptCard`, time-up card with extend options, extended timer. Navigates to `/connect/:matchId` on "End chat and connect".

##### `frontend/src/pages/ConnectPage.tsx`
Post-chat connection exchange — `ConnectionCard` with yes/no, result view, and WebSocket subscriptions. Features `ConnectionCard` for Slack connection preference, `ResultView` for exchanged/declined outcome. WebSocket listeners for `connection_exchanged`/`connection_declined`. Demo mode simulates connection delay.

---

### SPA Serving

The React SPA is served by the FastAPI backend:
1. **`/` route** in `app/routes.py` reads and returns `frontend/dist/index.html`
2. **`/assets/` mount** in `app/__init__.py` serves built JS bundles from `frontend/dist/assets/`
3. **404 exception handler** in `app/__init__.py` serves `index.html` for all non-API, non-WS paths (client-side routing via React Router)

---

### Tests

#### `tests/test_app.py`
End-to-end integration test suite that tests page rendering, API endpoints, matchmaking flow, profile updates, and QR generation.

#### Functions
- `test_imports()` — verifies all modular components import correctly (FastAPI, Uvicorn, aiosqlite, QRCode, SQLite3, all app modules)
- `test_file_structure()` — checks 27 required files exist
- `test_database()` — tests DB init, 4 tables exist, insert/delete operations
- `test_conversation_prompts()` — checks prompts list is non-empty
- `test_state_constants()` — verifies `MATCH_EXPIRY_SECONDS=30`, `CLEANUP_INTERVAL_SECONDS=60`, `CLEANUP_THRESHOLD_SECONDS=300`
- `test_home_page()` — `GET /` returns 200 with "IntroChat" in body
- `test_api_endpoints()` — tests create event, get rooms (8), join, select room, toggle availability, QR, prompts (10)
- `test_social_info()` — verifies `linkedin_url` and `slack_handle` saved to `active_users`
- `test_error_paths()` — tests 404 for missing user/match, empty list for missing event rooms
- `test_matchmaking_lifecycle()` — full lifecycle: create users, match via `create_match()`, retrieve via API, double opt-in connection, cleanup
- `test_find_match_end_to_end()` — tests `find_match()` via availability toggle (two users, same room, waiting queue, match creation)
- `test_cleanup_expired_matches()` — tests cleanup threshold logic: old matches removed, fresh ones kept
- `test_websocket_connection()` — tests `ConnectionManager` internal mappings, `send_to_user` graceful handling, WebSocket endpoint via `TestClient` with `join_room` and missing user_id rejection
- `test_template_pages()` — tests SPA catch-all renders `index.html` for client-side routes (`/`, `/join/*`, `/room/*`, `/chat/*`)
- `test_helpers_short_id()` — verifies `short_id()` generates valid 8-char hex IDs
- `test_qr_utils()` — verifies `generate_qr_data_uri()` returns valid `data:image/png;base64,` data URI
- `main()` — runs all test functions in sequence

#### `tests/test_js_modules.py`
Frontend source module validation suite using static regex analysis — checks file existence, TypeScript exports (interfaces, types, functions, components), config constants, and cross-file import references.

#### Functions
- `test_frontend_files_exist()` — checks 32 required frontend source files exist (including PeoplePageViews.tsx, ChatPageViews.tsx, useChatRequest.ts)
- `test_api_exports()` — checks 4 API interfaces defined in types/api.ts: `CreateEventResponse`, `Room`, `JoinEventResponse`, `QRResponse`
- `test_demo_data_exports()` — checks `SamplePerson`, `SAMPLE_USERS`, `RESPONSES` exports from utils/demoData.ts
- `test_config()` — checks 8 CONFIG properties in config/constants.ts
- `test_utils_exports()` — checks formatTime, 5 storage functions, generateRandomString, generateUsername
- `test_hook_exports()` — checks exports from useSocket, useTimer, useDemoMode, useUser, useChatRequest
- `test_component_exports()` — checks 8 component exports (Timer, PeoplePageViews, ChatPageViews, PersonCard, PromptCard, MatchCountdown, ConnectionCard, QRDisplay)
- `test_page_exports()` — checks 6 page exports (HomePage, UserInfoPage, RoomPage, ChatPage, PeoplePage, ConnectPage)
- `test_import_references()` — checks App.tsx imports all pages and providers
- `test_client_exports()` — checks client.ts exports fetchJSON and defines fetchWithTimeout, parseJSON
- `test_code_quality()` — counts console.log across all source files
- `main()` — runs all test functions in sequence

#### `tests/test_db.py`
Standalone database debugging utility that tests SQLite connection, lists table schemas, and prints column information — run via `uv run python tests/test_db.py`.

#### Functions
- `test_db_connection()` — checks database exists, lists expected tables, shows row counts
- `reset_database()` — deletes existing database file and recreates via `init_db()`

#### `tests/test_agent_guidelines.py`
Dual-section validation suite. Section 1 (routing): verifies AGENTS.md skill-routing and tool-selection rules match documented trigger keywords via hypothetical messages — no messages executed. Section 2 (integrity): verifies all verifiable claims in AGENTS.md against the actual filesystem — file paths, command targets, doc paths, naming conventions, description headers, tool availability, and skill count.

#### Functions
- `test_skill_routing_hypothetical_messages()` — verifies 20 loadable skills each have description triggers matching hypothetical messages
- `test_tool_selection_hypothetical_queries()` — verifies Three-Tier Classification, Pipeline stages, and hypothetical query-to-tool routing
- `test_skill_no_match_fallback()` — verifies non-matching input (casual/general questions) triggers no skill
- `test_tool_mixed_combines_layers()` — verifies mixed-type queries select combined layers
- `test_skill_loading_priority_chain()` — verifies priority chain defined in AGENTS.md
- `test_file_ownership_paths()` — verifies all source paths, auto-generated paths, dir patterns, and the full `.opencode/skills/*/SKILL.md` set (20 skills) exist on disk
- `test_commands_reference()` — verifies command target files exist and package.json has build/dev/test/test:e2e scripts
- `test_documentation_structure()` — verifies all 8 documented doc paths exist
- `test_test_suite_structure()` — verifies backend `test_*.py`, frontend `*.test.{ts,tsx}`, E2E `*.spec.ts` naming conventions
- `test_utility_skills()` — verifies 4 utility skill files exist (rebuild-indexes, frontend-design, shadcn, run-e2e-tests)
- `test_documentation_discipline()` — verifies all Python files in app/ have `# Description:` header and all TS/TSX files in frontend/src/ have description header
- `test_tooling_rules()` — verifies `uv` and `npm` tools available on PATH
- `main()` — runs all test functions, reports PASS/FAIL count

#### `frontend/tests/e2e/userFlow.spec.ts` (E2E Test Scenarios)
7 Playwright E2E tests that verify the app in a real Chromium browser. Covers: home page load, join page with optional name field, save with auto-generated username, save with custom name, two-user matchmaking with chat page rendering, and full chat lifecycle with connection exchange (both users connect and one declines). Tests 6a/6b use localStorage hydration for user context, real 30s timer wait, random room selection from all 8 default rooms, and the footer "Back to Home" navigation. Run via `npm run test:e2e`. Per-test timeout: 90s (configurable in `playwright.config.ts`).

---

### Maintenance Scripts

#### `utility/cleanup_db.py`
Database maintenance utility that deduplicates rows across all tables and removes auto-generated test users (`User_*` prefix). Operates on both `data/introchat.db` and `data/e2e_test.db`. Run via `uv run python utility/cleanup_db.py`. Idempotent — safe to run multiple times.

#### `utility/enhance_graph_viewer.py`
Post-processes graphify-out/graph.html to add an interactive filtering UI — collapsible panels, search highlighting, and community color-coding for large knowledge graphs.

#### `utility/filter_graph.py`
Filters graphify-out/graph.json into type-specific sub-graphs — splits the combined JSON into separate code (`graph-code.json`) and document (`graph-document.json`) graphs.

---
## Critical Implementation Details

### Match Expiry
- **Initial expiry:** 30 seconds (set via `MATCH_EXPIRY_SECONDS` in `create_match()` function)
- **Cleanup threshold:** 5 minutes (cleanup thread runs every 60 seconds)
- Cleanup thread is daemonized and starts automatically

### Default Rooms
Constant `DEFAULT_ROOMS` in `app/config.py` — imported and used by `app/routes.py`:

### Conversation Prompts
Constant `CONVERSATION_PROMPTS` exists in `app/state.py` — safe to edit.

### WebSocket Configuration
- **Development:** WebSocket endpoint at `/ws`, accepts all origins (FastAPI default)
- **Production:** Add origin restrictions via FastAPI middlewares or WebSocket validator

### Frontend Module Rules
- Theme context (`useTheme.tsx`) lives in `context/` — not `hooks/` — because it provides React context, not just a hook
- All routing via React Router — no page reloads
- Shared state in React Context (`SocketContext`, `UserContext`) — no `window` globals
- Shared utilities in `frontend/src/utils/` — no direct DOM manipulation
- Demo mock data in `utils/demoData.ts` — `SamplePerson`, `SAMPLE_USERS`, `RESPONSES` extracted from `useDemoMode.ts`
- Same CSS class names as original `style.css` — imported once at `main.tsx` root
- Demo logic extracted to `useDemoMode` hook, gated by `VITE_ENABLE_DEMO` env flag
- Single persistent WebSocket in `SocketContext` — survives route changes

---

## Data Flow (Technical)

1. User creates/joins event → `POST /api/events` or `POST /api/events/<id>/join` → gets event_id
2. User fills profile (LinkedIn/Slack) on `/join/<event_id>` → `POST /api/events/<id>/join` with social fields → gets user_id
3. User selects room → `POST /api/users/<id>/room` → opens WebSocket to `/ws` with `join_room` message
4. User selects person → `POST /api/users/<id>/available` → triggers `await find_match()` in `matchmaking.py`
5. Match found → `match_found` WebSocket message via `ConnectionManager` → 60s countdown → redirect to `/chat/<match_id>`
6. Chat starts → timer from `CONFIG.CHAT_DURATION` (default: 30s, configurable via `frontend/src/config/constants.ts`) + prompts from `GET /api/prompts`
7. After chat → `POST /api/matches/<id>/connect` → `connection_exchanged` or `connection_declined` broadcast via `ConnectionManager`

### REST API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/events` | Create event + 8 default rooms |
| `GET` | `/api/events/<id>/rooms` | List rooms |
| `POST` | `/api/events/<id>/join` | Join event + save social info (`linkedin_url`, `slack_handle`) |
| `GET` | `/api/qr/<event_id>` | Generate QR code |
| `POST` | `/api/users/<id>/room` | Select room |
| `POST` | `/api/users/<id>/available` | Toggle availability |
| `GET` | `/api/matches/<id>` | Get match details |
| `POST` | `/api/matches/<id>/connect` | Submit connection preference |
| `GET` | `/api/prompts` | Get conversation prompts |

### WebSocket Events

| Event | Direction | Payload |
|-------|-----------|---------|
| `join_room` | Client → Server | `{room_id}` |
| `match_found` | Server → Client | `{match_id, room_id, user1_username, user2_username}` |
| `connection_exchanged` | Server → Client | `{user1_username, user2_username}` |
| `connection_declined` | Server → Client | — |

---

## Key Design Decisions

### Why `app/` Package (Not Flat)?
- Standard FastAPI pattern for larger applications
- Separates Python code from templates, static files, tests, docs
- Relative imports (`from .state import X`) prevent circular imports
- Clear separation of concerns

### Why `data/` Folder?
- Isolates database file from application code
- Easy to backup, ignore in git, or switch to different storage
- Update `database.py` connections to: `sqlite3.connect('data/introchat.db')`

### Why `tests/` and `docs/`?
- **Tests:** Isolated from application code, easy to run: `uv run python tests/test_app.py`
- **Docs:** Separated from code, clean root directory, easy to browse documentation

---

## Import Structure

```
app/
├── __init__.py       ← imports from .routes, .tasks, .database, .config; includes router
├── state.py          ← imports from .prompts (re-exports CONVERSATION_PROMPTS)
├── config.py         ← no internal imports (leaf module)
├── database.py       ← imports aiosqlite, sqlite3, os (leaf module — no internal imports)
├── schemas.py        ← imports pydantic.BaseModel (leaf module)
├── prompts.py        ← no internal imports (leaf module)
├── qr_utils.py       ← imports qrcode, io, base64 (leaf module)
├── helpers.py        ← imports uuid (leaf module)
├── routes.py         ← imports from .state, .schemas, .connection_manager, .config, .matchmaking, .websocket_handler, .helpers
├── websocket_handler.py  ← imports from .connection_manager; leaf module
├── connection_manager.py  ← imports fastapi.WebSocket (leaf module)
├── matchmaking.py    ← imports from .state, .connection_manager, .config, .helpers
└── tasks.py          ← imports from .state
```

**Rule:** Use relative imports (`from .state import X`) within the `app` package.

---

## Running the Application

```bash
# Install Python dependencies
uv sync

# Build frontend (required before first run and after any frontend changes)
cd frontend
npm install
npm run build
cd ..

# Run the application (from project root)
uv run python -m app

# Open browser
http://localhost:5000

# Development — run frontend dev server with hot reload (separate terminal)
cd frontend
npm run dev        # Starts Vite on port 3000, proxies /api and /ws to backend
```

> **Production:** Set `ENV=production` environment variable and configure CORS origins via FastAPI middlewares in `app/__init__.py`.

---

## Modifying the Architecture

### Adding a New Route
1. Open `app/routes.py`
2. Add new `@router.get/post` async function
3. Run `uv run python tests/test_app.py` to verify

### Adding a New WebSocket Message Type
1. Open `app/routes.py` (WebSocket endpoint at `/ws`)
2. Add a new `if msg_type == ...:` branch in the message loop
3. Update the WebSocket Events table in this document's Data Flow section

### Changing Timer Durations
1. Edit `frontend/src/config/constants.ts` (for frontend timers)
2. Edit `app/config.py` (for backend constants)
3. Run `uv run python tests/test_app.py && uv run python tests/test_js_modules.py` and `cd frontend && npm test` to verify

### Adding a New Documentation File
1. Create in `docs/` folder
2. Update `docs/ARCHITECTURE.md` if adding new section
3. Reference from `README.md` if relevant
