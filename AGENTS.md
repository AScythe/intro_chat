# AGENTS.md - IntroChat

## Project Overview

IntroChat is a lightweight Flask+SQLite web app for anonymous, 2-minute micro-chat matching at events. Users create events, join via QR code or event code, select rooms, and get real-time matched with nearby available users. No accounts, no persistent messages, no stored identity.

---

## Architecture

| Layer | Technology | Details |
|-------|------------|---------|
| **Backend** | Flask + Flask-SocketIO | Single-file `app.py` — routes, matching logic, cleanup thread |
| **Database** | SQLite (`introchat.db`) | Auto-created on first run; 4 tables: `events`, `rooms`, `users`, `matches` |
| **Frontend** | Vanilla JS + Jinja2 | Pages in `templates/`; logic in `static/` |
| **Real-time** | WebSocket via SocketIO | Room-based broadcasting; in-memory state dicts |
| **QR Codes** | Python `qrcode` library | Generated on-the-fly at `/api/qr/<event_id>` |

**In-memory state** (lost on restart, non-persistent by design):
- `active_users` — currently online users
- `active_matches` — live match pairs
- `waiting_queue` — users waiting to be matched

---

## Environment

- **Python:** 3.10+
- **Virtual environment** (recommended):
  ```bash
  python -m venv venv
  source venv/bin/activate      # Linux/macOS
  venv\Scripts\activate         # Windows
  ```
- **No `.env` file required** for development
- **Production environment variables:**
  ```
  FLASK_ENV=production
  SECRET_KEY=<generate a strong random key>
  CORS_ORIGINS=https://yourdomain.com
  ```

---

## File Ownership

| Location | Role | Agent Policy |
|----------|------|--------------|
| `app.py` | Routes, matching logic, cleanup thread | ✅ Safe to edit |
| `templates/*.html` | Jinja2 UI pages | ✅ Safe to edit |
| `static/utils.js` | Shared utilities (imported by all pages) | ✅ Safe to edit |
| `static/room.js` | Room page logic | ✅ Safe to edit |
| `static/chat.js` | Chat page logic | ✅ Safe to edit |
| `introchat.db` | Persistent SQLite data store | ⚠️ Never delete without explicit user confirmation |
| `test_app.py` | Backend/database regression tests | ⚠️ Run only — do not modify unless asked |
| `test_js_modules.py` | JS module validation tests | ⚠️ Run only — do not modify unless asked |
| `requirements.txt` | Python dependencies | ⚠️ Only modify if adding a justified dependency |

---

## Core Development Commands

### Setup
```bash
pip install -r requirements.txt
python app.py
```

### Test
```bash
python test_app.py          # Backend and database checks
python test_js_modules.py   # JS module validation
```

### Deploy to Render / Railway
```bash
# Build command
pip install -r requirements.txt

# Start command
python app.py
```

---

## Agent Rules

These rules are non-negotiable. Follow them on every task without exception.

### ✅ Always
- Run `python test_app.py` after any change to `app.py` or database logic
- Run `python test_js_modules.py` after any change to `static/*.js`
- Search for identifiers by **name**, not by line number (line numbers drift)
- Preserve the double opt-in flow for connection exchange — never simplify it
- Keep all WebSocket events consistent between `app.py` and frontend JS

### ❌ Never
- Delete or reset `introchat.db` without explicit user confirmation
- Log, store, or expose chat message content anywhere
- Expose or log raw user IPs — UUIDs only
- Add authentication or user accounts unless explicitly requested
- Change CORS settings without confirming the deployment target first
- Modify `test_*.py` files unless the user explicitly asks
- Reference code by line number — use named identifiers instead

---

## Verification (Required After Every Change)

Run these in order before considering any task complete:

```bash
python test_app.py          # Must pass with 0 errors
python test_js_modules.py   # Must pass with 0 errors
```

If matching logic or WebSocket events were changed, also manually verify:
1. Two users in the same room can match
2. `match_found` event fires on both clients
3. Countdown and redirect to chat work correctly
4. Connection exchange requires both users to opt in

---

## Critical Gotchas

### ⚠️ WebSocket — Development
- Use `http://` only in development — SocketIO requires unencrypted connections locally
- Do not test WebSocket features over `https://` on localhost

### ⚠️ WebSocket — Production
- Use `eventlet` or `gevent` as the async mode:
  ```python
  socketio = SocketIO(app, async_mode='eventlet', cors_allowed_origins=CORS_ORIGINS)
  ```
- Set allowed origins explicitly — do not use `"*"` in production
- Install the async backend: `pip install eventlet`

### ⚠️ Database Persistence
- `introchat.db` persists across restarts — do not delete it casually
- In-memory dicts (`active_users`, `active_matches`, `waiting_queue`) reset on restart — this is intentional
- Always run `test_app.py` after schema or query changes to verify data integrity

### ⚠️ Frontend Module Rules
- No inline `<script>` blocks in `templates/` — all logic lives in `static/*.js`
- Pass data from Jinja2 to JS via `window` globals only:
  ```javascript
  window.roomEventId = "{{ event_id }}";
  window.chatMatchId = "{{ match_id }}";
  ```
- All shared utilities must go through `utils.js` — page scripts import from there

---

## API Quick Reference

### Event Management

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/events` | Create event + 8 default rooms |
| `GET` | `/api/events/<id>/rooms` | List rooms for an event |
| `POST` | `/api/events/<id>/join` | Join event → receive user ID |
| `GET` | `/api/qr/<event_id>` | Generate QR code (base64 PNG) |

### User Management

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/users/<id>/room` | Select room |
| `POST` | `/api/users/<id>/available` | Toggle availability |

### Match Management

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/matches/<id>` | Get match details |
| `POST` | `/api/matches/<id>/connect` | Submit connection preference (double opt-in) |

### Content

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `GET` | `/api/prompts` | Get 10 conversation prompts |

### WebSocket Events (Socket.IO)

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `connect` | Client → Server | — | Client connects |
| `disconnect` | Client → Server | — | Client disconnects, cleans up state |
| `join_room` | Client → Server | `{room_id}` | Subscribe to room channel |
| `match_found` | Server → Client | `{match_id, room_id, user1_username, user2_username}` | Match notification |
| `connection_exchanged` | Server → Client | `{user1_username, user2_username}` | Both users opted in |
| `connection_declined` | Server → Client | — | One or both users declined |

---

## Customization

- **Room defaults:** Find `DEFAULT_ROOMS` list in `app.py` and edit the entries
- **Conversation prompts:** Find `CONVERSATION_PROMPTS` list in `app.py` and edit the entries
- **Match expiry duration:** Find `MATCH_EXPIRY_SECONDS` in `app.py`
- **Cleanup interval:** Find `CLEANUP_INTERVAL_SECONDS` in `app.py`

> Always search by identifier name — never by line number.

---

## Out of Scope

Do not implement any of the following unless the user explicitly requests it:

- User authentication or persistent accounts
- Swapping SQLite for PostgreSQL, MySQL, or any other database
- Rewriting the frontend in React, Vue, or any JS framework
- Storing or logging chat message content
- GPS or Bluetooth-based proximity detection (current design uses manual room selection)
- Push notifications or background sync
- Admin dashboards or moderation tools

---

## Privacy Constraints

These are hard requirements — not optional:

- 🚫 **No message storage** — chat content must never be written to the database or logs
- 🚫 **No identity exposure** — usernames are auto-generated; never collect or store real names, emails, or photos
- 🚫 **No single opt-in** — connection exchange requires both users to confirm; never weaken this to one-sided
- 🚫 **No IP logging** — use UUID-based user IDs exclusively
- ✅ **Match expiry** — matches must auto-expire after 5 minutes; cleanup thread must remain active
- ✅ **Session reset** — refreshing the page must produce a new anonymous session
