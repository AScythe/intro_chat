# AGENTS.md - IntroChat

## AGENTS.md Scope
`AGENTS.md` defines *what* agents work on — project context, tech stack, commands, and file boundaries. The `guidelines` skill defines *how* agents should work — behavioral rules for thinking, implementing, and verifying. The guidelines are layered on top of `AGENTS.md` and take precedence when there is conflict.

> **Key distinction**: If it's about *what* the project is and *what* you can touch → this file. If it's about *how* to behave or *how* to implement → `guidelines` skill.

---

## Project Overview
IntroChat is an anonymous 2-minute micro-chat matching at events. Organizers create events and set up rooms. Users join via QR code or event code, select rooms, and get real-time matched with nearby available users. No accounts needed, no persistent messages, no stored identity.

---

## Architecture
- **Backend:** Flask + Flask-SocketIO (`app/` package)
- **Database:** SQLite (`data/introchat.db`) — 4 tables: `events`, `rooms`, `users`, `matches`
- **Frontend:** Vanilla JS + Jinja2 (`templates/`, `static/`)
- **Real-time:** WebSocket via SocketIO with room-based broadcasting
- **In-memory state** (reset on restart): `active_users`, `active_matches`, `waiting_queue`

For full architecture details, component interactions, and implementation specifics, see [ARCHITECTURE.md](ARCHITECTURE.md).

---

## Environment
- **Python:** 3.10+
- **Setup:** `python -m venv venv && source venv/bin/activate` (Windows: `venv\Scripts\activate`)
- **Production env vars:** `FLASK_ENV=production`, `SECRET_KEY=<strong-random-key>`, `CORS_ORIGINS=https://yourdomain.com`

---

## File Ownership

| Location | Role | Agent Policy |
|----------|------|--------------|
| `app/` | Flask package — routes, matching, WebSocket handlers | ✅ Safe to edit |
| `templates/*.html` | Jinja2 UI pages | ✅ Safe to edit |
| `static/*.js` | Client logic (`utils.js`, `room.js`, `chat.js`) | ✅ Safe to edit |
| `data/introchat.db` | Persistent data store | ⚠️ Never delete without explicit user confirmation |
| `tests/test_*.py` | Regression tests | ⚠️ Run only — do not modify unless asked |
| `docs/PROJECT_BEST_PRACTICES.md` | Best practices guide | ✅ Safe to update with `update-best-practices` skill |

---

## Core Commands
```bash
# Setup
pip install -r requirements.txt
python -m app

# Test (run after every change)
python tests/test_app.py          # Backend and database checks
python tests/test_js_modules.py   # JS module validation
```

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

| Event | Direction | Payload | Defined In |
|-------|-----------|---------|------------|
| `join_room` | Client → Server | `{room_id}` | `app/socket_events.py` |
| `match_found` | Server → Client | `{match_id, room_id, user1_username, user2_username}` | `app/matchmaking.py` |
| `connection_exchanged` | Server → Client | `{user1_username, user2_username}` | `app/routes.py` |
| `connection_declined` | Server → Client | — | `app/routes.py` |

For full API documentation, see [API.md](API.md).

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

---

