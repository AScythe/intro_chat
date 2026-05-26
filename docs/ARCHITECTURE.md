# Architecture - IntroChat
===================================================

## Project Structure

```
intro_chat/
├── app/                       # Python package (FastAPI application)
│   ├── __init__.py            # App orchestrator: FastAPI init, static mount, SPA catch-all, wires modules
│   ├── state.py               # Shared in-memory state: active_users, active_matches, etc.
│   ├── database.py            # Database schema initialization (init_db())
│   ├── config.py              # Central config constants (DB_PATH, HOST, PORT)
│   ├── schemas.py             # Pydantic request models for API validation
│   ├── routes.py              # All HTTP route handlers and WebSocket endpoint
│   ├── matchmaking.py         # Match finding and creation logic
│   ├── connection_manager.py  # WebSocket connection tracking and broadcasting
│   └── tasks.py               # Background cleanup thread
│
├── frontend/                  # React SPA (Vite + TypeScript)
│   ├── index.html             # SPA entry HTML (mounts #root)
│   ├── package.json           # Dependencies: react, react-dom, react-router-dom, vite, vitest
│   ├── tsconfig.json          # TypeScript config (strict, jsx: react-jsx)
│   ├── vite.config.ts         # Vite build configuration — React plugin, dev proxy to backend, Vitest integration
│   ├── playwright.config.ts   # Playwright E2E config — chromium, webServer, temp database
│   ├── src/
│   │   ├── main.tsx           # React app entry point — mounts root component and imports global styles
│   │   ├── App.tsx            # Root component — React Router setup with SocketContext and UserContext providers
│   │   ├── api/
│   │   │   └── client.ts      # Typed fetch wrapper with timeout for backend API calls
│   │   ├── config/
│   │   │   └── constants.ts   # Application configuration constants — chat duration, timer defaults, demo delays
│   │   ├── types/
│   │   │   └── api.ts         # TypeScript interfaces for API request/response payloads
│   │   ├── utils/
│   │   │   ├── format.ts      # Utility functions for formatting values (time, display strings)
│   │   │   ├── storage.ts     # localStorage wrappers for persisting user session data
│   │   │   ├── random.ts      # Utility functions for random string and username generation
│   │   │   └── demoData.ts    # Demo/simulation data — sample users, fallback prompts, and mock responses
│   │   ├── hooks/
│   │   │   ├── useSocket.ts   # Context and hook for managing a persistent WebSocket connection
│   │   │   ├── useTimer.ts    # Hook providing extendable countdown timer with start/clear/extend callbacks
│   │   │   ├── useDemoMode.ts # Hook providing demo/simulation logic gated by VITE_ENABLE_DEMO feature flag
│   │   │   ├── useChatRequest.ts # Hook managing chat request lifecycle — send request, wait for response, ready signaling
│   │   │   └── useUser.ts     # Context and hook for user session data (userId, eventId, username)
│   │   ├── context/
│   │   │   ├── SocketContext.tsx  # WebSocket context provider — connects at app root, persists across routes, auto-reconnects
│   │   │   └── UserContext.tsx    # User session context provider — hydrates from localStorage, writes on change
│   │   ├── components/
│   │   │   ├── Timer.tsx          # Timer display component showing MM:SS with warning/danger visual states
│   │   │   ├── PersonCard.tsx     # Person selector card showing username, availability status, and click-to-select
│   │   │   ├── PromptCard.tsx     # Conversation prompt display with fade transition
│   │   │   ├── MatchCountdown.tsx # 60-second countdown display shown after a match is found before navigating to chat
│   │   │   ├── ConnectionCard.tsx # Post-chat connection card with yes/no buttons for Slack connection exchange
│   │   │   └── QRDisplay.tsx      # QR code image display with event code shown below
│   │   ├── styles/
│   │   │   └── global.css        # Global stylesheet — imported at `main.tsx` root via `import './styles/global.css'`
│   │   └── pages/
│   │       ├── HomePage.tsx       # Landing page — event code input, create/join event, QR display
│   │       ├── UserInfoPage.tsx   # Profile form — optional name, LinkedIn/Slack input, save via API, navigate to room
│   │       ├── RoomPage.tsx       # Room selection and person matching — dropdown, person cards, match countdown
│   │       └── ChatPage.tsx       # Chat interface — timed conversation with prompts, timer, extend, and connection exchange
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
│   │       ├── RoomPage.test.tsx     # Tests for RoomPage — room selection, person matching, countdown
│   │       └── ChatPage.test.tsx     # Tests for ChatPage — chat flow, timer, prompts, connection exchange
│   └── dist/
│       ├── index.html          # Built SPA entry HTML served by FastAPI catch-all
│       └── assets/             # Built and optimized JS/CSS bundles
│
├── tests/                        # Backend test suite
│   ├── test_app.py            # Backend, database, and SPA serving tests
│   ├── test_js_modules.py     # Frontend source validation tests
│   └── test_db.py             # Database utility & verification
│
├── docs/                         # Documentation
│   ├── README.md              # Main project README (features, setup, deployment)
│   ├── ARCHITECTURE.md        # This file (project structure reference)
│   ├── SPECIFICATIONS.md       # Product specification (problem, solution, user flow, out of scope, privacy)
│   ├── DEMO_GUIDE.md          # Demo guide for judges/users
│   ├── AGENTS.md              # Agent behavioral rules, file ownership, commands, operational constraints
│   └── PLAN_*.md              # Active plan documents (created by check-plan-readiness, moved to archive/ after review)
│
├── archive/                       # Archived plans (completed/reviewed)
│   └── PLAN_*.md              # Archived decision records (moved from docs/ after review)
│
├── refs/                         # Reference documents
│   ├── DOCUMENT_GUIDELINES.md  # Document scope & governance
│   └── PROJECT_BEST_PRACTICES.md # Universal coding best practices
│
├── data/                         # Data files
│   └── introchat.db           # SQLite database (auto-created)
│
├── uv.lock                        # Lockfile (auto-generated by `uv sync`)
└── .gitignore                     # Git ignore rules
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
Server-global in-memory state — active users, active matches, waiting queue, conversation prompts, and timer configuration constants shared across all modules.

- `active_users = {}` — tracks online users, rooms, availability
- `active_matches = {}` — tracks active chat matches
- `waiting_queue = {}` — users waiting for matches
- `CONVERSATION_PROMPTS = [...]` — list of conversation prompts
- Timer constants: `MATCH_EXPIRY_SECONDS`, `CLEANUP_INTERVAL_SECONDS`, `CLEANUP_THRESHOLD_SECONDS`

#### Data Structures
- `active_users = {}` — `{user_id: {event_id, username, room_id, linkedin_url, slack_handle, is_available, last_seen}}`
- `active_matches = {}` — `{match_id: {user1_id, user2_id, room_id, created_at}}`
- `waiting_queue = {}` — `{user_id: {room_id, timestamp}}`
- `USER_TEMPLATE = {}` — `{event_id: None, username: None, room_id: None, linkedin_url: '', slack_handle: '', is_available: False, last_seen: None}` — default skeleton for new user entries

#### Constants
- `CONVERSATION_PROMPTS` — array of 10 icebreaker strings
- `MATCH_EXPIRY_SECONDS = 30` — how long a match is valid in DB
- `CLEANUP_INTERVAL_SECONDS = 60` — how often cleanup thread checks for expired matches
- `CLEANUP_THRESHOLD_SECONDS = 300` — remove matches older than this (5 minutes)

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

### `app/routes.py` (HTTP Routes + WebSocket)
All HTTP route handlers for REST API endpoints (events, users, rooms, matches, QR codes, conversation prompts) and the WebSocket endpoint for real-time communication. SPA page serving is handled by the catch-all in `app/__init__.py`.

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
- `websocket_endpoint(websocket)` — `WS /ws` → accepts connection, registers via `ConnectionManager`, handles `join_room`, listens for messages

### `app/matchmaking.py` (Match Logic)
Async match-finding algorithm that pairs available users in the same room, creates match records in the database, and sends match_found events via WebSocket.

- `find_match(user_id)` — async, finds available users in the same room
- `create_match(user1_id, user2_id, room_id)` — async, creates match, notifies users via WebSocket

#### Functions
- `find_match(user_id)` — async, scans `active_users` for available users in same room; calls `await create_match()` if found, otherwise adds to `waiting_queue`
- `create_match(user1_id, user2_id, room_id)` — async, inserts match into DB + `active_matches`, removes from `waiting_queue`, sets both to unavailable, sends `match_found` via `manager.broadcast_to_users()`

### `app/config.py` (Configuration)
Central configuration constants module defining the database path (supports `DB_PATH` env var override for testing), server host, and port — imported by database, routes, and the main entry point.

#### Constants
- `DB_PATH` — absolute path to `data/introchat.db`
- `HOST` — server bind address (`127.0.0.1`)
- `PORT` — server port (`5000`)

### `app/schemas.py` (Request Models)
Pydantic request models for API endpoint validation — event creation, user join, room assignment, availability toggle, and connection exchange.

#### Models
- `CreateEventRequest` — `name: str`
- `JoinEventRequest` — `username: Optional[str]`, `linkedin_url: Optional[str]`, `slack_handle: Optional[str]`
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
- `broadcast_to_room(room_id, message)` — sends JSON message to all users in a room

### `app/tasks.py` (Background Tasks)
Daemon background thread that periodically checks for and removes expired matches from in-memory state to prevent stale data accumulation.

- `cleanup_expired_matches()` — removes matches older than threshold
- `start_cleanup_thread()` — starts cleanup as daemon thread

#### Functions
- `cleanup_expired_matches()` — infinite loop: sleeps `CLEANUP_INTERVAL_SECONDS` (60), removes matches older than `CLEANUP_THRESHOLD_SECONDS` (300) from `active_matches`
- `start_cleanup_thread()` — creates and starts a daemon thread targeting `cleanup_expired_matches`, returns thread reference

### `app/__main__.py` (Entry Point)
Application entry point that launches the Uvicorn ASGI server on 127.0.0.1:5000 with hot-reload enabled. Uses `HOST` and `PORT` from `app/config.py`.

---

### Frontend Modules (React SPA)

The frontend is a React 19 SPA built with Vite + TypeScript. All routing is client-side via React Router. The backend serves the built `frontend/dist/index.html` as a catch-all.

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

#### `frontend/src/context/SocketContext.tsx` (WebSocket Provider)
WebSocket context provider — connects at app root, persists across routes, auto-reconnects. Connects on mount, disconnects on unmount. Stores `socket`, `connected` state, and `error` in context.

#### `frontend/src/context/UserContext.tsx` (User Session Provider)
User session context provider — hydrates from localStorage, writes on change. Provides `{ userId, eventId, username, linkedin_url, slack_handle, setUser, clearUser }`.

#### Components

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

#### Pages

##### `frontend/src/pages/HomePage.tsx`
Landing page — event code input, create/join event, QR display. Features event code input, create event modal, QR display, success card, feature grid, privacy notice. Calls API via `client.ts`, uses `QRDisplay` component.

##### `frontend/src/pages/UserInfoPage.tsx`
Profile form — optional name, LinkedIn/Slack input, save via API, navigate to room. Features input fields, auto-generated username fallback, save via API, success card, navigates to `/room/:eventId`.

##### `frontend/src/pages/RoomPage.tsx`
Room selection and person matching — dropdown, person cards, match countdown. Features nearby users grid, `PersonCard` selection, chat request flow, match-found display with `MatchCountdown`, 60s countdown → navigate to `/chat/:matchId`. Uses `useChatRequest` for request-accept-ready lifecycle and `useDemoMode` for demo flows.

##### `frontend/src/pages/ChatPage.tsx`
Chat interface — timed conversation with prompts, timer, extend, and connection exchange. Features loading card, chat card with `Timer` + `PromptCard`, time-up card with extend options, extended timer, `ConnectionCard`, connection result. WebSocket listener for `connection_exchanged`/`connection_declined`.

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
- `test_file_structure()` — checks 25 required files exist
- `test_database()` — tests DB init, 4 tables exist, insert/delete operations
- `test_conversation_prompts()` — checks prompts list is non-empty
- `test_state_constants()` — verifies `MATCH_EXPIRY_SECONDS=30`, `CLEANUP_INTERVAL_SECONDS=60`, `CLEANUP_THRESHOLD_SECONDS=300`
- `test_home_page()` — `GET /` returns 200 with "IntroChat" in body
- `test_api_endpoints()` — tests create event, get rooms (8), join, select room, toggle availability, QR, prompts (10)
- `test_social_info()` — verifies `linkedin_url` and `slack_handle` saved to `active_users`
- `test_error_paths()` — tests 404 for missing user/match, empty list for missing event rooms
- `test_matchmaking_lifecycle()` — full lifecycle: create users, match via `create_match()`, retrieve via API, double opt-in connection, cleanup
- `main()` — runs all test functions in sequence

#### `tests/test_js_modules.py`
Frontend source module validation suite using static regex analysis — checks file existence, TypeScript exports (interfaces, types, functions, components), config constants, and cross-file import references.

#### Functions
- `test_frontend_files_exist()` — checks 25 required frontend source files exist
- `test_api_exports()` — checks 5 API interfaces defined in types/api.ts
- `test_config()` — checks 8 CONFIG properties and FALLBACK_PROMPTS in config/constants.ts
- `test_utils_exports()` — checks formatTime, 5 storage functions, generateRandomString, generateUsername, SamplePerson, SAMPLE_USERS, RESPONSES
- `test_hook_exports()` — checks exports from useSocket, useTimer, useDemoMode, useUser
- `test_component_exports()` — checks 6 component exports
- `test_page_exports()` — checks 4 page exports
- `test_import_references()` — checks App.tsx imports all pages and providers
- `test_code_quality()` — counts console.log across all source files
- `main()` — runs all test functions in sequence

#### `tests/test_db.py`
Standalone database debugging utility that tests SQLite connection, lists table schemas, and prints column information — run via `uv run python tests/test_db.py`.

#### Functions
- `test_db_connection()` — checks database exists, lists expected tables, shows row counts
- `reset_database()` — deletes existing database file and recreates via `init_db()`

#### `frontend/tests/e2e/userFlow.spec.ts` (E2E Test Scenarios)
7 Playwright E2E tests that verify the app in a real Chromium browser. Covers: home page load, join page with optional name field, save with auto-generated username, save with custom name, two-user matchmaking with chat page rendering, and full chat lifecycle with connection exchange (both users connect and one declines). Tests 6a/6b use localStorage hydration for user context, real 30s timer wait, random room selection from all 8 default rooms, and the footer "Back to Home" navigation. Run via `npm run test:e2e`. Per-test timeout: 90s (configurable in `playwright.config.ts`).

---
## Critical Implementation Details

### Match Expiry
- **Initial expiry:** 30 seconds (set via `MATCH_EXPIRY_SECONDS` in `create_match()` function)
- **Cleanup threshold:** 5 minutes (cleanup thread runs every 60 seconds)
- Cleanup thread is daemonized and starts automatically

### Default Rooms
Defined inline in `app/routes.py` (not a constant):
```python
['Main Hall', 'Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5', 'Quiet Corner', 'Coffee Area']
```

### Conversation Prompts
Constant `CONVERSATION_PROMPTS` exists in `app/state.py` — safe to edit.

### WebSocket Configuration
- **Development:** WebSocket endpoint at `/ws`, accepts all origins (FastAPI default)
- **Production:** Add origin restrictions via FastAPI middlewares or WebSocket validator

### Frontend Module Rules
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

### Why Organized `static/`?
- `css/` subfolder follows web development conventions
- Served at `/static/css/style.css` — imported by React SPA at build time

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
├── state.py          ← no internal imports (leaf module)
├── database.py       ← imports aiosqlite, sqlite3, os (leaf module — no internal imports)
├── config.py         ← no internal imports (leaf module)
├── schemas.py        ← imports pydantic.BaseModel, typing.Optional (leaf module)
├── routes.py         ← imports from .state, .schemas, .connection_manager, .config, .matchmaking
├── connection_manager.py  ← imports fastapi.WebSocket, typing (leaf module)
├── matchmaking.py    ← imports from .state, .connection_manager, .config
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
2. Edit `app/state.py` (for backend constants)
3. Run `uv run python tests/test_app.py && uv run python tests/test_js_modules.py` and `cd frontend && npm test` to verify

### Adding a New Documentation File
1. Create in `docs/` folder
2. Update `docs/ARCHITECTURE.md` if adding new section
3. Reference from `README.md` if relevant
