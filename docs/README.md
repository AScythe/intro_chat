# 🌟 IntroChat - The Secret Icebreaker for Introverts

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)]()
[![Flask](https://img.shields.io/badge/flask-2.3.3-black.svg)]()

> *"IntroChat doesn't make introverts talk more — it makes them feel safe enough to talk once. And sometimes, that one conversation changes everything."*

---

## Table of Contents

- [What is IntroChat?](#what-is-introchat)
- [Features](#features)
- [Quick Start](#quick-start)
- [How to Use](#how-to-use)
- [Technical Details](#technical-details)
- [Testing](#testing)
- [Deployment](#deployment)
- [Privacy & Security](#privacy--security)
- [Contributing](#contributing)
- [License](#license)
- [Troubleshooting](#troubleshooting)

---

## What is IntroChat?

IntroChat is a lightweight, browser-based web app that lets introverts initiate low-pressure, 2-minute face-to-face micro-chats with nearby attendees at events — no awkward approaches required.

Think of it as *Tinder for 120-second conversations* — but only when you're physically near someone else who's also ready to chat.

---

## Features

- **🎯 Event-based**: Join events with simple codes or QR codes
- **📍 Room Selection**: Choose your location to find nearby chat partners
- **🤝 Smart Matching**: Real-time matching with people in the same room
- **💬 Guided Conversations**: 2-minute timer with conversation prompts
- **🔒 Privacy First**: Fully anonymous, no data stored, opt-in only
- **📱 Mobile Friendly**: Works on any device with a browser
- **⚡ Real-time**: WebSocket-powered instant notifications

---

## Quick Start

### Prerequisites
- Python 3.10 or higher
- pip (Python package installer)

### Installation & Run
```bash
# Clone the repository
git clone <repository-url>
cd introchat

# Install dependencies
pip install -r requirements.txt

# Run the application
python -m app

# Open your browser
# Go to http://localhost:5000
```

---

## How to Use

### For Event Organizers
1. **Create an Event**
   - Open `http://localhost:5000`
   - Enter an event name (e.g., "Hackathon 2024")
   - Click "Create Event"
   - Share the generated QR code or event code with attendees

### For Attendees
1. **Join an Event**
   - Scan the QR code or enter the event code
   - Select your room/table location
   - Tap "Request 2-min chat" when ready
   - Get matched with someone nearby!

2. **Have a Micro-Chat**
   - Meet at the specified location
   - Use the conversation prompts to guide your chat
   - Timer runs for exactly 2 minutes
   - Choose whether to exchange contact info

---

## Technical Details

### Tech Stack
- **Backend**: Python Flask + Flask-SocketIO (`app/` package)
- **Frontend**: HTML5 + CSS3 + Vanilla JavaScript
- **Database**: SQLite (`data/introchat.db`)
- **Real-time**: WebSocket connections via SocketIO
- **QR Codes**: Python qrcode library

### Architecture (Simplified)
```
Frontend (Browser) ←→ Flask Backend (app/) ←→ SQLite Database (data/)
     ↓                          ↓
WebSocket IO ←→ Real-time Matching Engine
```

For full architecture details, see [ARCHITECTURE.md](ARCHITECTURE.md).

### Key Components
- **`app/`**: Python package with all backend logic
  - `__init__.py`: App orchestrator
  - `state.py`: Shared state and constants
  - `routes.py`: HTTP route handlers
  - `matchmaking.py`: Match logic
  - `socket_events.py`: WebSocket handlers
  - `tasks.py`: Background cleanup
- **`templates/`**: HTML templates for all pages
- **`static/`**: Organized assets (`css/`, `js/`)
- **`tests/`**: Test suite (`test_app.py`, `test_js_modules.py`)
- **`docs/`**: Documentation (README, AGENTS, etc.)

---

## API Endpoints

For full API documentation, see [API.md](API.md).

| Method | Endpoint | Purpose |
|--------|----------|---------|
| `POST` | `/api/events` | Create event + 8 default rooms |
| `GET` | `/api/events/<id>/rooms` | List rooms |
| `POST` | `/api/events/<id>/join` | Join event |
| `GET` | `/api/qr/<event_id>` | Generate QR code |
| `POST` | `/api/users/<id>/room` | Select room |
| `POST` | `/api/users/<id>/available` | Toggle availability |
| `GET` | `/api/matches/<id>` | Get match details |
| `POST` | `/api/matches/<id>/connect` | Submit connection preference |
| `GET` | `/api/prompts` | Get conversation prompts |

---

## Testing

### Local Testing
1. Run the application: `python -m app`
2. Open two browser tabs/windows
3. Create an event in one tab
4. Join the event in the other tab
5. Select the same room in both
6. Request chat in both
7. Watch them match and start chatting!

### Automated Tests
```bash
# Backend and database checks
python tests/test_app.py

# JS module validation
python tests/test_js_modules.py
```

---

## Deployment

### Render.com (Recommended)
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `python -m app`
5. Deploy!

### Other Platforms
- Railway.app
- Heroku
- DigitalOcean App Platform
- AWS Elastic Beanstalk
- Any platform that supports Python Flask

---

## Privacy & Security

- **No user accounts**: Completely anonymous
- **No data storage**: Chats are never saved
- **Room-level location**: Only general location, not precise coordinates
- **Opt-in only**: Users can cancel anytime
- **Temporary matches**: All data expires after 5 minutes

---

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

For detailed contributing guidelines, see [CONTRIBUTING.md](CONTRIBUTING.md).

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

## Troubleshooting

### Common Issues

**"Module not found" errors**
- Make sure you've installed all requirements: `pip install -r requirements.txt`

**"Port already in use" error**
- Change the port in `app/__init__.py`: `socketio.run(app, debug=True, host='0.0.0.0', port=5001)`

**WebSocket connection failed**
- Make sure you're using `http://` not `https://` for local testing
- Check firewall settings

**Database errors**
- Delete `introchat.db` and restart the application
- The database will be recreated automatically

### Getting Help
- Check the console for error messages
- Make sure all dependencies are installed
- Try refreshing the page
- Restart the application

---

## Why IntroChat?

IntroChat solves a real problem that affects millions of people at events:

- ❌ **"I don't know how to start talking"** → Guided prompts do the work
- ❌ **"I'm scared of awkward silence"** → Timer + questions eliminate dead air
- ❌ **"What if they're rude?"** → Only 2 minutes — easy to walk away
- ❌ **"I don't want to be 'networking'"** → Feels like a game, not a chore
- ❌ **"Too many people — where do I start?"** → Matches you with someone right here

**Built for Hackathons. Designed for Humans. Powered by Python.**

---

*Made with ❤️ for introverts everywhere*
