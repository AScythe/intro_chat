# 🌟 IntroChat - The Secret Icebreaker for Introverts

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Python 3.10+](https://img.shields.io/badge/python-3.10+-blue.svg)]()
[![FastAPI](https://img.shields.io/badge/fastapi-0.115-blue.svg)]()

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
- [Why IntroChat?](#why-introchat)
- [Success Metrics](#-success-metrics)
- [The Pitch](#-the-pitch)

---

## What is IntroChat?

IntroChat is a lightweight, browser-based web app that lets introverts initiate low-pressure, 30-second face-to-face micro-chats with nearby attendees at events — no awkward approaches required.

Think of it as *Tinder for 30-second conversations* — but only when you're physically near someone else who's also ready to chat.

---

## Features

- **🎯 Event-based**: Join events with simple codes or QR codes
- **📍 Room Selection**: Choose your location for location-based matching
- **🤝 Smart Matching**: Real-time matching with people in the same room
- **💬 Guided Conversations**: Timed conversations (30 seconds by default) with conversation prompts
- **🔄 Chat Extension**: Extend or continue indefinitely
- **💼 Connection Exchange**: Optional username swap after chat (double opt-in required)
- **📱 QR Code**: Quick event joining for attendees
- **🎮 Demo Mode**: Sample users with simulated responses
- **🆔 User Profile**: Optional display name (auto-generates anonymous username if left blank) + LinkedIn/Slack handle collection, stored but never shared without permission
- **🔒 Privacy First**: Fully anonymous, opt-in only, social info collected only for connection exchange

---

## Quick Start

### Prerequisites
- Python 3.10 or higher
- uv (Python package installer — install via `powershell -c "irm https://astral.sh/uv/install.ps1 | iex"`)
- Node.js 18+ and npm
- Virtual environment: `uv venv` (auto-creates `.venv/`)

> For the complete AI-assisted development environment (OpenCode, MCP servers, plugins, skills, and custom commands), see [AGENT_SETUP.md](../refs/AGENT_SETUP.md).

### Installation & Run
```bash
# Clone the repository
git clone <repository-url>
cd introchat

# Install Python dependencies
uv sync

# Install and build frontend
cd frontend
npm install
npm run build
cd ..

# Run the application
uv run python -m app

# Open your browser
# Go to http://localhost:5000
```

> **Note:** Always `cd ..` after navigating into `frontend/` to avoid path drift in the same shell session.

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

2. **Set Up Your Profile**
   - Enter your name (optional — leave blank for an anonymous username like `User_ABC12`)
   - Optionally add your LinkedIn URL and/or Slack handle (safe — never shared without double opt-in)
   - Click "Save" to create your profile
   - Click "Select Room/Area" to proceed

3. **Pick a Room & Chat**
   - Select your room/table location
   - Select a person card, then tap "Request 2-min chat"
   - Get matched with someone nearby!
   - Use the conversation prompts to guide your chat
   - Timer runs for the configured duration (default: 30 seconds, configurable)
   - After time's up, each person independently chooses "End chat and connect" or "End chat"
   - Both must opt in for usernames to be exchanged — one "no" closes for both

---

## Technical Details

### Tech Stack
- **Backend**: Python FastAPI + Uvicorn (`app/` package)
- **Frontend**: React 19 + TypeScript + Vite (SPA with React Router)
- **Database**: SQLite (`data/introchat.db`) via aiosqlite
- **Real-time**: Native WebSocket via FastAPI
- **QR Codes**: Python qrcode library

### Architecture (Simplified)
```
React SPA (frontend/) ←→ FastAPI Backend (app/) ←→ SQLite Database (data/)
       ↓                          ↓
React Router          WebSocket (native) ←→ Real-time Matching Engine
```

For full architecture details, see [ARCHITECTURE.md](ARCHITECTURE.md).

---

## Testing

```bash
# Type-check frontend (run after TypeScript changes before testing)
cd frontend && npm run type-check && cd ..

# Backend and database checks
uv run python tests/test_app.py

# Frontend source validation
uv run python tests/test_js_modules.py

# Vitest component and hook tests
cd frontend && npm test && cd ..

# E2E browser tests (Playwright — auto-installs Chromium)
cd frontend && npm run test:e2e && cd ..
```

---

## Deployment

### Render.com (Recommended)
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `cd frontend && npm install && npm run build && cd .. && uv sync`
4. Set start command: `uv run python -m app`
5. Deploy!

### Other Platforms
- Railway.app
- DigitalOcean App Platform
- AWS Elastic Beanstalk
- Any platform that supports Python ASGI

> **Note:** Set `ENV=production` in production environments. CORS origins should be configured via FastAPI middlewares in `app/main.py`.

---

## Privacy & Security

- **No user accounts**: Anonymous by default — optional display name
- **Chats never stored**: Conversation content is never saved
- **Social info stored safely**: LinkedIn/Slack handles collected but never shared without double opt-in
- **Room-level location**: Only general location, not precise coordinates
- **Opt-in only**: Users can cancel anytime
- **Temporary matches**: All match data expires after 5 minutes

For the full privacy model and hard constraints, see [SPECIFICATIONS.md](SPECIFICATIONS.md).

---

## Contributing

1. Fork the repository
2. Set up your development environment — see [AGENT_SETUP.md](../refs/AGENT_SETUP.md) for the full tooling setup
3. Create a feature branch
4. Make your changes
5. Test thoroughly
6. Submit a pull request

For detailed contributing guidelines, see [ARCHITECTURE.md](ARCHITECTURE.md) (modifying instructions section).

---

## License

This project is open source and available under the [MIT License](LICENSE).

---

## Troubleshooting

### Common Issues

**"Module not found" errors**
- Make sure you've installed all requirements: `uv sync`

**"Port already in use" error**
- Change the port in `app/config.py`: `PORT = 5001`

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
- ❌ **"What if they're rude?"** → Short timebox — easy to walk away
- ❌ **"I don't want to be 'networking'"** → Feels like a game, not a chore
- ❌ **"Too many people — where do I start?"** → Matches you with someone right here

---

## 📊 Success Metrics

After using IntroChat, users should feel:
- ✅ **Safe**: No pressure, easy to opt-out
- ✅ **Confident**: Guided prompts eliminate awkward silences
- ✅ **Connected**: Real conversations with real people
- ✅ **Empowered**: One conversation can change everything

---

## 🎯 The Pitch

> **"IntroChat doesn't make introverts talk more — it makes them feel safe enough to talk once. And sometimes, that one conversation changes everything."**

**Built for Hackathons. Designed for Humans. Powered by Python.**

---

*Made with ❤️ for introverts everywhere*
