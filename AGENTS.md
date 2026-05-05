# AGENTS.md - IntroChat

## Project Overview
IntroChat is an anonymous 2-minute micro-chat matching at events. Organizers create events and set up rooms. Users join via QR code or event code, select rooms, and get real-time matched with nearby available users. No accounts needed, no persistent messages, no stored identity.

---

## Architechture
- **Backend:** Flask + Flask-SocketIO (`app.py`)
- **Database:** SQLite (`introchat.db`) — 4 tables: `events`, `rooms`, `users`, `matches`
- **Frontend:** Vanilla JS + Jinja2 (`templates/`, `static/`)
- **Real-time:** WebSocket via SocketIO with room-based broadcasting
- **In-memory state** (reset on restart): `active_users`, `active_matches`, `waiting_queue`

---

## Environment
- **Python:** 3.10+
- **Setup:** `python -m venv venv && source venv/bin/activate` (Windows: `venv\Scripts\activate`)
- **Production env vars:** `FLASK_ENV=production`, `SECRET_KEY=<strong-random-key>`, `CORS_ORIGINS=https://yourdomain.com`

---

## File Ownership

| Location | Role | Agent Policy |
|----------|------|--------------|
| `app.py` | Routes, matching logic, cleanup thread | ✅ Safe to edit |
| `templates/*.html` | Jinja2 UI pages | ✅ Safe to edit |
| `static/*.js` | Client logic (`utils.js`, `room.js`, `chat.js`) | ✅ Safe to edit |
| `introchat.db` | Persistent data store | ⚠️ Never delete without explicit user confirmation |
| `test_*.py` | Regression tests | ⚠️ Run only — do not modify unless asked |

---

## Core Commands
```bash
# Setup
pip install -r requirements.txt
python app.py

# Test (run after every change)
python test_app.py          # Backend and database checks
python test_js_modules.py   # JS module validation
```

---

## Agent Rules
These rules are non-negotiable. Follow them on every task without exception.

### Always
- Run `python test_app.py` after changes to `app.py` or database logic
- Run `python test_js_modules.py` after changes to `static/*.js`
- **A task is not complete until both test files pass with 0 errors**
- Search by identifier **name**, not line number
- Preserve double opt-in for connection exchange
- Keep WebSocket events consistent between backend and frontend

### Never
- Delete any codes or database (`introchat.db`) without explicit user confirmation
- Log/store chat message content or raw IPs (use UUIDs only)
- Add authentication/accounts unless explicitly requested
- Modify `test_*.py` files unless asked
- Use `cors_allowed_origins="*"` in production

---

## Critical Implementation Details

### Match Expiry
- **Initial expiry:** 2 minutes (set in `create_match()` function)
- **Cleanup threshold:** 5 minutes (cleanup thread runs every 60 seconds)
- Cleanup thread is daemonized and starts automatically

### Default Rooms
Defined inline in `app.py` (not a constant):
```python
['Main Hall', 'Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5', 'Quiet Corner', 'Coffee Area']
```

### Conversation Prompts
Constant `CONVERSATION_PROMPTS` exists in `app.py` — safe to edit

### Websocket Configuration
- **Development:** `cors_allowed_origins="*"` (line 15)
- **Production:** Change to explicit origins and add `async_mode='eventlet'`

### Frontend Module Rules
- No inline `<script>` in templates — all logic in `static/*.js`
- Pass Jinja2 data to JS via `window` globals only
- Shared utilities go in `utils.js`

---

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/events` | Create event + 8 default rooms |
| `GET` | `/api/events/<id>/rooms` | List rooms |
| `POST` | `/api/events/<id>/join` | Join event (optional: `username`) |
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

## Out of Scope
Do not implement any of the following unless the user explicitly requests it:
- User authentication or accounts
- Database swaps (PostgreSQL, MySQL, etc.)
- Frontend frameworks (React, Vue, etc.)
- Chat message storage
- GPS/Bluetooth proximity detection
- Push notifications
- Admin dashboards

---

## Privacy Requirements
These are hard requirements — not optional:
- No message storage
- No identity exposure (auto-generated usernames only)
- No single opt-in (double opt-in required)
- No IP logging (UUIDs only)
- Match expiry enforced (2-min initial, 5-min cleanup)
- Session reset on page refresh
