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
- Initializes Flask and SocketIO
- Calls `init_db()` to set up database
- Registers HTTP routes via `register_routes(app)`
- Registers SocketIO handlers via `register_handlers(socketio)`
- Starts background cleanup thread
- **Run command:** `python -m app` (or `python app/__init__.py`)

### `app/state.py` (Shared State)
- `active_users = {}` — tracks online users, rooms, availability
- `active_matches = {}` — tracks active chat matches
- `waiting_queue = {}` — users waiting for matches
- `CONVERSATION_PROMPTS = [...]` — list of conversation prompts
- Timer constants: `MATCH_EXPIRY_MINUTES`, `CLEANUP_INTERVAL_SECONDS`, `CLEANUP_THRESHOLD_SECONDS`

### `app/database.py` (Database Schema)
- `init_db()` — creates 4 tables: `events`, `rooms`, `users`, `matches`
- Uses SQLite (`introchat.db` in `data/` folder)

### `app/routes.py` (HTTP Routes)
- `register_routes(app)` — registers all `@app.route` handlers
- Endpoints: `/`, `/join/<event_id>`, `/room/<id>`, `/chat/<id>`, `/api/events`, `/api/events/<id>/join`, etc.

### Critical Implementation Details

#### Match Expiry
- **Initial expiry:** 2 minutes (set in `create_match()` function)
- **Cleanup threshold:** 5 minutes (cleanup thread runs every 60 seconds)
- Cleanup thread is daemonized and starts automatically

#### Default Rooms
Defined inline in `app/routes.py` (not a constant):
```python
['Main Hall', 'Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5', 'Quiet Corner', 'Coffee Area']
```

#### Conversation Prompts
Constant `CONVERSATION_PROMPTS` exists in `app/state.py` — safe to edit.

#### WebSocket Configuration
- **Development:** `cors_allowed_origins="*"` (line 15 of `__init__.py`)
- **Production:** Change to explicit origins and add `async_mode='eventlet'`

#### Frontend Module Rules
- No inline `<script>` in templates — all logic in `app/static/js/*.js`
- Pass Jinja2 data to JS via `window` globals only
- Shared utilities go in `utils.js`

### `app/matchmaking.py` (Match Logic)
- `find_match(user_id)` — finds available users in the same room
- `create_match(user1_id, user2_id, room_id)` — creates match, notifies users via SocketIO

### `app/socket_events.py` (WebSocket Handlers)
- `register_handlers(socketio)` — registers `@socketio.on` handlers
- Events: `connect`, `disconnect`, `join_room`

### `app/tasks.py` (Background Tasks)
- `cleanup_expired_matches()` — removes matches older than threshold
- `start_cleanup_thread()` — starts cleanup as daemon thread

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
