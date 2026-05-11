# Architecture - IntroChat
===================================================

## Project Structure

```
intro_chat/
├── app/                          # Python package (Flask application)
│   ├── __init__.py            # App orchestrator: Flask init, SocketIO init, wires modules
│   ├── state.py               # Shared in-memory state: active_users, active_matches, etc.
│   ├── database.py            # Database schema initialization (init_db())
│   ├── routes.py              # All HTTP route handlers (@app.route)
│   ├── matchmaking.py         # Match finding and creation logic
│   ├── socket_events.py       # SocketIO event handlers (connect, disconnect, join_room)
│   └── tasks.py               # Background cleanup thread
│
├── app/templates/                # Jinja2 HTML templates
│   ├── index.html             # Homepage: event creation/joining
│   ├── room.html              # Room selection page
│   ├── chat.html              # Chat interface with timer/prompts
│   └── user_info.html         # User profile form (LinkedIn/Slack)
│
├── app/static/                    # Static assets (organized by type)
│   ├── css/
│   │   └── style.css           # Main stylesheet (unified styles)
│   └── js/
│       ├── config.js             # Timer configuration constants (CHAT_DURATION, etc.)
│       ├── utils.js              # Shared utilities (showError, getElementById, etc.)
│       ├── dom-utils.js          # DOM helper functions
│       ├── api-utils.js          # API call utilities (fetchJSON, etc.)
│       ├── timer-utils.js        # Timer functions (createChatTimer, createCountdown)
│       ├── home.js               # Homepage logic (event creation, QR codes)
│       ├── user-info.js          # User profile page logic (save social info)
│       ├── room.js               # Room selection & user matching logic
│       └── chat.js               # Chat interface logic (timer, prompts, connection)
│
├── tests/                        # Test suite
│   ├── test_app.py            # Backend, database, and modular architecture tests
│   ├── test_js_modules.py     # JavaScript module validation tests
│   ├── test_fixes.py          # API endpoint integration tests
│   └── test_db.py             # Database utility & verification
│
├── docs/                         # Documentation
│   ├── README.md              # Main project README (features, setup, deployment)
│   ├── ARCHITECTURE.md        # This file (project structure reference)
│   ├── SPECIFICATIONS.md       # Product specification (problem, solution, user flow)
│   ├── DEMO_GUIDE.md          # Demo guide for judges/users
│   ├── AGENTS.md              # Agent guidelines (file ownership, commands, rules)
│   ├── PROJECT_BEST_PRACTICES.md # Universal coding best practices
│   └── DOCUMENT_GUIDELINES.md # Document scope & governance
│
├── data/                         # Data files
│   └── introchat.db           # SQLite database (auto-created)
│
├── requirements.txt               # Python dependencies (Flask, Flask-SocketIO, etc.)
└── .gitignore                     # Git ignore rules
```

---

## Module Descriptions

### `app/__init__.py` (Orchestrator)
Flask/SocketIO app factory that initializes the server, creates the database, registers HTTP routes and SocketIO handlers, and starts the background cleanup thread.

- Initializes Flask and SocketIO
- Calls `init_db()` to set up database
- Registers HTTP routes via `register_routes(app)`
- Registers SocketIO handlers via `register_handlers(socketio)`
- Starts background cleanup thread
- **Run command:** `python -m app` (or `python app/__init__.py`)

### `app/state.py` (Shared State)
Server-global in-memory state — active users, active matches, waiting queue, conversation prompts, and timer configuration constants shared across all modules.

- `active_users = {}` — tracks online users, rooms, availability
- `active_matches = {}` — tracks active chat matches
- `waiting_queue = {}` — users waiting for matches
- `CONVERSATION_PROMPTS = [...]` — list of conversation prompts
- Timer constants: `MATCH_EXPIRY_MINUTES`, `CLEANUP_INTERVAL_SECONDS`, `CLEANUP_THRESHOLD_SECONDS`

#### Data Structures
- `active_users = {}` — `{user_id: {event_id, username, room_id, linkedin_url, slack_handle, is_available, last_seen}}`
- `active_matches = {}` — `{match_id: {user1_id, user2_id, room_id, created_at}}`
- `waiting_queue = {}` — `{user_id: {room_id, timestamp}}`
- `USER_TEMPLATE = {}` — `{event_id: None, username: None, room_id: None, linkedin_url: '', slack_handle: '', is_available: False, last_seen: None}` — default skeleton for new user entries

#### Constants
- `CONVERSATION_PROMPTS` — array of 10 icebreaker strings
- `MATCH_EXPIRY_MINUTES = 2` — how long a match is valid in DB
- `CLEANUP_INTERVAL_SECONDS = 60` — how often cleanup thread checks for expired matches
- `CLEANUP_THRESHOLD_SECONDS = 300` — remove matches older than this (5 minutes)

### `app/database.py` (Database Schema)
SQLite database initialization creating events, users, rooms, and matches tables with migration handling for social profile columns.

- `init_db()` — creates 4 tables: `events`, `rooms`, `users`, `matches`
- Uses SQLite (`introchat.db` in `data/` folder)

#### Functions
- `init_db(db_path)` — initializes SQLite database, creates all 4 tables, runs ALTER TABLE migration for social columns

#### Tables
| Table | Columns |
|-------|---------|
| `events` | `id` (TEXT PK), `name` (TEXT NOT NULL), `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP), `is_active` (BOOLEAN DEFAULT 1) |
| `rooms` | `id` (TEXT PK), `event_id` (TEXT FK → events), `name` (TEXT NOT NULL) |
| `users` | `id` (TEXT PK), `event_id` (TEXT FK), `room_id` (TEXT FK), `username` (TEXT), `linkedin_url` (TEXT DEFAULT ''), `slack_handle` (TEXT DEFAULT ''), `is_available` (BOOLEAN DEFAULT 0), `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP), `last_seen` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP) |
| `matches` | `id` (TEXT PK), `user1_id` (TEXT FK), `user2_id` (TEXT FK), `room_id` (TEXT FK), `status` (TEXT DEFAULT 'active'), `created_at` (TIMESTAMP DEFAULT CURRENT_TIMESTAMP), `expires_at` (TIMESTAMP) |

### `app/routes.py` (HTTP Routes)
All HTTP route handlers for page rendering (index, user info, room, chat) plus REST API endpoints for events, users, rooms, matches, QR codes, and conversation prompts.

- `register_routes(app)` — registers all `@app.route` handlers
- Endpoints: `/`, `/join/<event_id>`, `/room/<id>`, `/chat/<id>`, `/api/events`, `/api/events/<id>/join`, etc.

#### Functions
- `register_routes(app)` — registers all HTTP route handlers on the Flask app instance
- `index()` — `GET /` → renders landing page (`index.html`)
- `user_info(event_id)` — `GET /join/<event_id>` → renders user profile form
- `room_selection(event_id)` — `GET /room/<event_id>` → renders room selection page
- `chat_room(match_id)` — `GET /chat/<match_id>` → renders chat page
- `create_event()` — `POST /api/events` → creates event + 8 default rooms, returns event_id
- `get_rooms(event_id)` — `GET /api/events/<event_id>/rooms` → lists rooms (fallback creation if none found)
- `join_event(event_id)` — `POST /api/events/<event_id>/join` → creates user with optional linkedin/slack
- `set_user_room(user_id)` — `POST /api/users/<user_id>/room` → assigns user to a room
- `set_availability(user_id)` — `POST /api/users/<user_id>/available` → toggles availability, triggers `find_match()`
- `get_match(match_id)` — `GET /api/matches/<match_id>` → gets match details with usernames
- `exchange_connection(match_id)` — `POST /api/matches/<match_id>/connect` → double opt-in connection, emits SocketIO event
- `generate_qr(event_id)` — `GET /api/qr/<event_id>` → generates QR code image as base64
- `get_prompts()` — `GET /api/prompts` → returns `CONVERSATION_PROMPTS` array

### `app/matchmaking.py` (Match Logic)
Match-finding algorithm that pairs available users in the same room, creates match records in the database, and emits match_found events via SocketIO.

- `find_match(user_id)` — finds available users in the same room
- `create_match(user1_id, user2_id, room_id)` — creates match, notifies users via SocketIO

#### Functions
- `find_match(user_id)` — scans `active_users` for available users in same room; calls `create_match()` if found, otherwise adds to `waiting_queue`
- `create_match(user1_id, user2_id, room_id)` — inserts match into DB + `active_matches`, removes from `waiting_queue`, sets both to unavailable, emits `match_found` via SocketIO

### `app/socket_events.py` (WebSocket Handlers)
SocketIO event handlers for real-time communication — connect, disconnect, and room joining; registered via register_handlers().

- `register_handlers(socketio)` — registers `@socketio.on` handlers
- Events: `connect`, `disconnect`, `join_room`

#### Functions
- `register_handlers(socketio)` — registers all SocketIO event handlers on the given socketio instance
- `handle_connect()` — SocketIO `connect` → logs "Client connected"
- `handle_disconnect()` — SocketIO `disconnect` → logs "Client disconnected"
- `handle_join_room(data)` — SocketIO `join_room` → joins the SocketIO room `room_{room_id}`

### `app/tasks.py` (Background Tasks)
Daemon background thread that periodically checks for and removes expired matches from in-memory state to prevent stale data accumulation.

- `cleanup_expired_matches()` — removes matches older than threshold
- `start_cleanup_thread()` — starts cleanup as daemon thread

#### Functions
- `cleanup_expired_matches()` — infinite loop: sleeps `CLEANUP_INTERVAL_SECONDS` (60), removes matches older than `CLEANUP_THRESHOLD_SECONDS` (300) from `active_matches`
- `start_cleanup_thread()` — creates and starts a daemon thread targeting `cleanup_expired_matches`, returns thread reference

### `app/__main__.py` (Entry Point)
Application entry point that launches the SocketIO server on 0.0.0.0:5000 with debug mode enabled.

---

### Frontend Modules

#### `app/static/js/config.js` (Configuration)
Central configuration object defining timer durations, countdown thresholds, and demo mode delays — single source of truth consumed by chat.js and room.js.

#### Configuration Constants
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

#### `app/static/js/utils.js` (Shared Utilities)
Shared browser utility functions — error display via alert, URL parameter extraction, page navigation, clipboard copy, and DOM helpers used across all pages.

#### Functions
- `showError(message)` — displays error message via `alert()`
- `getUrlParameter(name)` — extracts URL query parameter value
- `formatTime(seconds)` — formats seconds as `M:SS`
- `initSocket()` — initializes Socket.IO connection, returns socket instance
- `generateRandomString(length)` — generates random alphanumeric string (default 8 chars)
- `generateUsername()` — generates `User_XXXXX` random username
- `storeUserId(userId)` — stores user ID in localStorage under `introchat_user_id`
- `getUserId()` — retrieves user ID from localStorage
- `clearUserId()` — removes user ID from localStorage
- `storeData(key, value)` — generic localStorage setter
- `getData(key)` — generic localStorage getter
- `clearData(key)` — generic localStorage remover

#### `app/static/js/dom-utils.js` (DOM Utilities)
Null-safe DOM manipulation helpers — getElementById with console warnings, setTextContent, show/hide/toggle visibility, and createElement for dynamic UI construction.

#### Functions
- `getElementById(id)` — safe element lookup with console warning on missing element
- `setTextContent(elementId, text)` — safe textContent setter with null check
- `setDisplay(elementId, display)` — safe display style setter with null check
- `addEventListenerSafe(elementId, event, handler)` — safe event listener registration with console warning

#### `app/static/js/api-utils.js` (API Utilities)
Thin fetch wrapper with timeout via AbortController, exposing typed HTTP methods (apiGet, apiPost, apiPut, apiDelete) with consistent error handling.

#### Functions
- `fetchWithTimeout(url, options, timeout)` — fetch with AbortController timeout (default 10000ms)
- `parseJSON(response)` — checks `response.ok`, parses JSON, throws on HTTP error
- `fetchJSON(url, options)` — combined `fetchWithTimeout` + `parseJSON` helper

#### `app/static/js/timer-utils.js` (Timer Utilities)
Timer factory providing createChatTimer() for extendable countdown with tick/complete callbacks and createCountdown() for redirect-on-expiry displays.

#### Functions
- `createChatTimer(duration, onTick, onComplete)` — creates extendable countdown timer; returns `{start, clear, extend, getTimeLeft}`
- `createCountdown(duration, onTick, onComplete)` — creates simple countdown timer; returns `{start, clear, getTimeLeft}`

#### `app/static/js/home.js` (Home Controller)
Landing page controller for event code input submission, QR code file upload/scanning, and event creation via modal dialog with API integration.

#### Functions
- `joinEvent()` — validates 8-char event code, redirects to `/join/<code>`
- `createEvent()` — POSTs to `/api/events`, generates QR, shows event created card
- `generateQRCode(eventId)` — fetches QR from `/api/qr/<event_id>`, displays image
- `joinCreatedEvent()` — redirects to join the newly created event
- `handleQRUpload(event)` — shows "QR scanning not implemented" message, resets file input

*Button state management (wired in DOMContentLoaded):* join button disabled until 8-char event code entered; create button disabled until event name entered; both wired via `input` event listeners.

#### `app/static/js/user-info.js` (Profile Controller)
User profile form controller handling LinkedIn URL and Slack handle input, profile data persistence via API, and navigation to room selection on success.

No named function declarations — all logic is in anonymous `DOMContentLoaded` and button click callbacks. Calls utils functions: `generateUsername()`, `fetchJSON()`, `storeUserId()`, `showError()`.

#### `app/static/js/room.js` (Room Controller)
Room selection page controller handling room creation/joining, user availability toggling, match-finding initiation, match-found countdown, and connection exchange.

#### Functions
- `initRoomPage(eventId)` — initializes socket, adds sample users, ensures user exists, loads rooms, sets up listeners
- `ensureUserExists()` — checks localStorage for user ID, creates via API if needed (with fallback)
- `loadRooms()` — fetches rooms from API, populates dropdown (with fallback on error)
- `setupEventListeners()` — wires room select, select room, request chat, cancel, change room, socket `match_found` listener
- `selectRoom()` — POSTs user/room assignment, emits `join_room` via socket, updates UI with nearby users
- `requestChat()` — POSTs `/api/users/<id>/available` to true (legacy)
- `cancelWaiting()` — POSTs availability to false (legacy)
- `changeRoom()` — resets UI back to room selection
- `handleMatchFound(data)` — shows match found card with usernames, starts countdown
- `startCountdown()` — starts `MATCH_FOUND_COUNTDOWN` (60s) timer, redirects to chat on expiry
- `goToChat()` — navigates to `/chat/<matchId>`
- `addSampleUsers()` — stores 18 demo users across 8 rooms with availability status
- `updateNearbyUsers(roomName)` — displays person cards with availability indicators, enables selection
- `requestChatWithPerson()` — shows "Waiting for response" UI, triggers simulated response after delay
- `simulatePersonResponse(personName)` — shows acceptance/rejection UI with ready-status flow and "I'm Ready" button
- `cancelRequest()` — returns to person selection from waiting state
- `testFunction()` — debug function checking sample users in console
- `checkIfBothReady()` — nested: checks both user and partner ready status, enables "Start Chat" button

#### `app/static/js/chat.js` (Chat Controller)
Chat page controller managing SocketIO connection, message sending/receiving, timer countdown with extend support, conversation prompts display, and leave/exit flow.

#### Functions
- `initChatPage(matchId)` — initializes socket, loads match info and prompts, sets up listeners
- `loadMatchInfo()` — detects demo (prefix `demo_`) vs real match, loads data from API or simulates
- `loadPrompts()` — fetches from `/api/prompts` with fallback hardcoded prompts
- `setupEventListeners()` — wires next prompt, extend 2min, extend indefinite, end chat, connect yes/no, new chat; socket listeners
- `startChatTimer()` — creates chat timer with `CONFIG.CHAT_DURATION`, starts countdown
- `updateTimerDisplay(timeLeft)` — updates MM:SS display, applies warning/danger CSS thresholds
- `displayCurrentPrompt()` — shows current prompt in scrollable container with auto-scroll
- `nextPrompt()` — cycles to next prompt (wraps around)
- `showTimeUp()` — hides chat card, shows "Time's Up" card with extend/end options
- `extendChat(additionalTime)` — extends by `CHAT_DURATION` or indefinite (-1)
- `startExtendedChatTimer()` — starts a new timer for extended chat period
- `updateExtendedTimerDisplay(timeLeft)` — updates extended timer display with formatTime
- `showSlackConnection()` — shows connection exchange card with yes/no buttons
- `setConnectionPreference(connectPreference)` — demo simulates; real mode POSTs to `/api/matches/<id>/connect`
- `showWaitingForConnection()` — shows waiting state after submitting preference
- `handleConnectionExchanged(data)` — shows exchanged usernames on successful double opt-in
- `handleConnectionDeclined()` — shows "Chat Complete" message when connection declined

---

### Templates

#### `app/templates/index.html`
Landing page template with hero section and tagline, event code input form, create-event modal dialog, and QR code file upload for scanning.

#### `app/templates/user_info.html`
User profile template with LinkedIn URL and Slack handle input fields, save button with success confirmation card, and navigation back to home.

#### `app/templates/room.html`
Room selection template with interactive location grid, create-room option, match-status message area, and loading overlay during matchmaking.

#### `app/templates/chat.html`
Chat page template with timer display, conversation prompts list, scrollable message area, text input field, leave button, and user info card with social links.

---

### Tests

#### `tests/test_app.py`
End-to-end integration test suite that tests page rendering, API endpoints, matchmaking flow, profile updates, and QR generation.

#### Functions
- `test_imports()` — verifies all modular components import correctly (Flask, SocketIO, QRCode, SQLite3, all app modules)
- `test_file_structure()` — checks 25 required files exist
- `test_database()` — tests DB init, 4 tables exist, insert/delete operations
- `test_conversation_prompts()` — checks prompts list is non-empty
- `test_state_constants()` — verifies `MATCH_EXPIRY_MINUTES=2`, `CLEANUP_INTERVAL_SECONDS=60`, `CLEANUP_THRESHOLD_SECONDS=300`
- `test_home_page()` — `GET /` returns 200 with "IntroChat" in body
- `test_api_endpoints()` — tests create event, get rooms (8), join, select room, toggle availability, QR, prompts (10)
- `test_social_info()` — verifies `linkedin_url` and `slack_handle` saved to `active_users`
- `test_error_paths()` — tests 404 for missing user/match, empty list for missing event rooms
- `test_matchmaking_lifecycle()` — full lifecycle: create users, match via `create_match()`, retrieve via API, double opt-in connection, cleanup
- `main()` — runs all test functions in sequence

#### `tests/test_js_modules.py`
JavaScript module validation suite using static regex analysis — checks file existence, JSDoc coverage on exported functions, function name conventions, and cross-file import references.

#### Functions
- `test_js_files_exist()` — checks 8 required JS files exist
- `test_utils_functions()` — checks 21 functions across utils/dom-utils/api-utils/timer-utils
- `test_room_js_functions()` — checks 14 functions in room.js + 11 utils imports
- `test_chat_js_functions()` — checks 17 functions in chat.js + 8 utils imports
- `test_config_js()` — checks 8 CONFIG properties defined
- `test_home_js_functions()` — checks 5 functions + DOMContentLoaded wrapper
- `test_index_html()` — checks 4 JS includes, no inline functions
- `test_html_templates()` — checks room.html, chat.html, user_info.html have correct JS includes and window globals
- `test_user_info_js_functions()` — checks 4 utils functions used + linkedin/slack/button logic
- `test_code_quality()` — counts console.log, checks JSDoc comments and strict mode
- `main()` — runs all test functions in sequence

#### `tests/test_db.py`
Standalone database debugging utility that tests SQLite connection, lists table schemas, and prints column information — run via `python tests/test_db.py`.

#### Functions
- `test_db_connection()` — checks database exists, lists expected tables, shows row counts
- `reset_database()` — deletes existing database file and recreates via `init_db()`

---
## Critical Implementation Details

### Match Expiry
- **Initial expiry:** 2 minutes (set in `create_match()` function)
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
- **Development:** `cors_allowed_origins="*"` (line 15 of `__init__.py`)
- **Production:** Change to explicit origins and add `async_mode='eventlet'`

### Frontend Module Rules
- No inline `<script>` in templates — all logic in `app/static/js/*.js`
- Pass Jinja2 data to JS via `window` globals only
- Shared utilities go in `utils.js`

---

## Key Functionalities

1. **Event creation** with unique event codes (8 default rooms auto-created)
2. **QR code generation** for easy event joining (`/api/qr/<event_id>`)
3. **Room/table selection** for location-based matching
4. **Person selection** from sample/demo users (demo mode)
5. **Matchmaking system** finds available users in same room (`matchmaking.py`)
6. **Timed chat** with conversation prompts (duration configurable via `app/static/js/config.js`, default: 30s)
7. **Chat extension** - Extend by configured duration or continue indefinitely
8. **Connection exchange** after chat (double opt-in)
9. **Background cleanup** of expired matches every 60 seconds (`tasks.py`)

---

## Data Flow (Technical)

1. User creates/joins event → `POST /api/events` or `POST /api/events/<id>/join` → gets event_id
2. User fills profile (LinkedIn/Slack) on `/join/<event_id>` → `POST /api/events/<id>/join` with social fields → gets user_id
3. User selects room → `POST /api/users/<id>/room` → joins SocketIO room via `join_room` event
4. User selects person → `POST /api/users/<id>/available` → triggers `find_match()` in `matchmaking.py`
5. Match found → `match_found` WebSocket event → 60s countdown → redirect to `/chat/<match_id>`
6. Chat starts → timer from `CONFIG.CHAT_DURATION` (default: 30s, configurable via `app/static/js/config.js`) + prompts from `GET /api/prompts`
7. After chat → `POST /api/matches/<id>/connect` → `connection_exchanged` or `connection_declined` event

---

## Key Design Decisions

### Why `app/` Package (Not Flat)?
- Standard Flask pattern for larger applications
- Separates Python code from templates, static files, tests, docs
- Relative imports (`from .state import X`) prevent circular imports
- Clear separation of concerns

### Why Organized `static/`?
- `css/` and `js/` subfolders follow web development conventions
- Easier to find and manage assets as project grows
- HTML templates reference with: `{{ url_for('static', filename='css/style.css') }}`

### Why `data/` Folder?
- Isolates database file from application code
- Easy to backup, ignore in git, or switch to different storage
- Update `database.py` connections to: `sqlite3.connect('data/introchat.db')`

### Why `tests/` and `docs/`?
- **Tests:** Isolated from application code, easy to run: `python tests/test_app.py`
- **Docs:** Separated from code, clean root directory, easy to browse documentation

---

## Import Structure

```
app/
├── __init__.py       ← imports from .state, .database, .routes, .socket_events, .tasks
├── state.py          ← no internal imports (leaf module)
├── database.py       ← no internal imports (leaf module)
├── routes.py         ← imports from .state, .matchmaking, .database
├── matchmaking.py    ← imports from .state, .database; imports socketio from .
├── socket_events.py  ← imports from .state; takes socketio as argument
└── tasks.py          ← imports from .state
```

**Rule:** Use relative imports (`from .state import X`) within the `app` package.

---

## Running the Application

```bash
# Install dependencies
pip install -r requirements.txt

# Run the application (from project root)
python -m app

# Or run __init__.py directly
python app/__init__.py

# Open browser
http://localhost:5000
```

---

## Modifying the Architecture

### Adding a New Route
1. Open `app/routes.py`
2. Add new `@app.route` function inside `register_routes(app):`
3. Run `python tests/test_app.py` to verify

### Adding a New SocketIO Event
1. Open `app/socket_events.py`
2. Add new handler inside `register_handlers(socketio):`
3. Update `AGENTS.md` WebSocket Events table

### Changing Timer Durations
1. Edit `app/static/js/config.js` (for frontend timers)
2. Edit `app/state.py` (for backend constants)
3. Run tests to verify

### Adding a New Documentation File
1. Create in `docs/` folder
2. Update `docs/ARCHITECTURE.md` if adding new section
3. Reference from `README.md` if relevant
