# AGENTS.md - IntroChat

## Project Overview
IntroChat is a lightweight Flask+SQLite web app for anonymous, 2-minute micro-chat matching at events. Users create events, join via QR code/code, select rooms, and get real-time matches with nearby available users.

## Architecture
- **Backend:** Single-file `app.py` (Flask + Flask-SocketIO)
- **Database:** SQLite (`introchat.db`) - auto-created on first run
- **Frontend:** Vanilla JS in `templates/` + `static/`
- **Real-time:** WebSocket matching via SocketIO room broadcasts
- **QR:** Generated on-the-fly via `/api/qr/<event_id>`

## File Ownership
| Location | Role |
|---------|------|
| `app.py` | Production: routes, matching, cleanup thread |
| `templates/*.html` | Jinja2 with `utils.js`, `room.js`, `chat.js` |
| `static/*.js` | `utils.js` (shared), `room.js`, `chat.js` (page-specific) |
| `introchat.db` | **Maintained** - run `python test_app.py` after modifications |
| `test_*.py` | Regression tests (not production) |

## Core Development Commands

### Setup
```bash
pip install -r requirements.txt
python app.py  # or use `if __name__ == '__main__'` entry
```

### Test
```bash
python test_app.py        # Backend/database checks
python test_js_modules.py # JS module validation
```

### Deploy to Render/Railway
```bash
# Build command
pip install -r requirements.txt

# Start command  
python app.py
```
*Note: Production should disable debug and handle CORS origins*

## Critical Gotchas

### ⚠️ WebSocket
- **Development:** `http://` only, SocketIO needs unencrypted connections
- **Production:** Set `CORS` origins explicitly

### ⚠️ Database Persistence
- **Do not delete** - data persists across restarts
- Use `test_app.py` to verify data integrity after code changes
- In-memory dicts: `active_users`, `active_matches`, `waiting_queue`

### ⚠️ Frontend Modules
- **No inline scripts** in `templates/`
- **Config via** `window.roomEventId`, `window.chatMatchId`
- **Utilities:** `utils.js` - all shared modules import from here

## API Quick Reference

| Endpoint | Method | Purpose |
|---------------|-----------|--------|
| `/api/events` | POST | Create event (+ 8 default rooms) |
| `/api/events/<id>/rooms` | GET | List/create rooms |
| `/api/qr/<event_id>` | GET | Generate QR code |
| `/api/events/<id>/join` | POST | Join event → get user ID |
| `/api/users/<id>/room` | POST | Select room |
| `/api/users/<id>/available` | POST | Toggle availability |
| `/api/matches/<id>` | GET | Match details |
| `/api/matches/<id>/connect` | POST | Exchange preferences |

## Customization

- **Room defaults:** Edit `rooms` variable in `app.py`
- **Prompts:** Edit `CONVERSATION_PROMPTS` (lines 85-96)

## Privacy
- 🚫 No sharing of user accounts, photos, or stored messages
- 🚫 Matches expire after 5 minutes
- 📍 Room-level location only
