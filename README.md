# 🌟 IntroChat - The Secret Icebreaker for Introverts at Events

> *"IntroChat doesn't make introverts talk more — it makes them feel safe enough to talk once. And sometimes, that one conversation changes everything."*

## 🎯 What is IntroChat?

IntroChat is a lightweight, browser-based web app that lets introverts initiate low-pressure, 2-minute face-to-face micro-chats with nearby attendees at events — no awkward approaches required.

Think of it as *Tinder for 120-second conversations* — but only when you're physically near someone else who's also ready to chat.

## ✨ Features

- **🎯 Event-based**: Join events with simple codes or QR codes
- **📍 Room Selection**: Choose your location to find nearby chat partners
- **🤝 Smart Matching**: Real-time matching with people in the same room
- **💬 Guided Conversations**: 2-minute timer with conversation prompts
- **🔒 Privacy First**: Fully anonymous, no data stored, opt-in only
- **📱 Mobile Friendly**: Works on any device with a browser
- **⚡ Real-time**: WebSocket-powered instant notifications

## 🚀 Quick Start

### Prerequisites

- Python 3.7 or higher
- pip (Python package installer)

### Installation

1. **Clone or download the project**
   ```bash
   git clone <repository-url>
   cd introchat
   ```

2. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application**
   ```bash
   python app.py
   ```

4. **Open your browser**
   - Go to `http://localhost:5000`
   - Create a new event or join an existing one
   - Start chatting!

## 🎮 How to Use

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
   - Tap "Need a 2-min chat?" when ready
   - Get matched with someone nearby!

2. **Have a Micro-Chat**
   - Meet at the specified location
   - Use the conversation prompts to guide your chat
   - Timer runs for exactly 2 minutes
   - Choose whether to exchange contact info

## 🛠️ Technical Details

### Tech Stack

- **Backend**: Python Flask + Flask-SocketIO
- **Frontend**: HTML5 + CSS3 + Vanilla JavaScript
- **Database**: SQLite (local file)
- **Real-time**: WebSocket connections
- **QR Codes**: Python qrcode library

### Architecture

```
Frontend (Browser) ←→ Flask Backend ←→ SQLite Database
     ↓                    ↓
WebSocket IO ←→ Real-time Matching Engine
```

### Key Components

- **`app.py`**: Main Flask application with API endpoints
- **`templates/`**: HTML templates for all pages
- **`static/`**: CSS and JavaScript files
- **`introchat.db`**: SQLite database (created automatically)

## 🔧 API Endpoints

### Events
- `POST /api/events` - Create new event
- `GET /api/events/{event_id}/rooms` - Get rooms for event
- `GET /api/qr/{event_id}` - Generate QR code for event

### Users
- `POST /api/events/{event_id}/join` - Join event
- `POST /api/users/{user_id}/room` - Select room
- `POST /api/users/{user_id}/available` - Set availability for matching

### Matches
- `GET /api/matches/{match_id}` - Get match details
- `POST /api/matches/{match_id}/connect` - Exchange connection info

### Other
- `GET /api/prompts` - Get conversation prompts

## 🎨 Customization

### Adding New Rooms
Edit the `rooms` list in `app.py`:
```python
rooms = ['Main Hall', 'Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5', 'Quiet Corner', 'Coffee Area']
```

### Adding Conversation Prompts
Edit the `CONVERSATION_PROMPTS` list in `app.py`:
```python
CONVERSATION_PROMPTS = [
    "What's one thing you're excited about this weekend?",
    "What's your favorite snack at hackathons?",
    # Add your own prompts here
]
```

### Styling
Modify `static/style.css` to change colors, fonts, and layout.

## 🧪 Testing

### Local Testing
1. Run the application: `python app.py`
2. Open two browser tabs/windows
3. Create an event in one tab
4. Join the event in the other tab
5. Select the same room in both
6. Tap "Need a 2-min chat?" in both
7. Watch them match and start chatting!

### Mobile Testing
1. Run the application on your computer
2. Find your computer's IP address
3. Open `http://YOUR_IP:5000` on your phone
4. Test the complete flow on mobile

## 🚀 Deployment

### Render.com (Recommended)
1. Connect your GitHub repository to Render
2. Create a new Web Service
3. Set build command: `pip install -r requirements.txt`
4. Set start command: `python app.py`
5. Deploy!

### Railway.app
1. Connect your repository to Railway
2. Add a Python service
3. Railway will auto-detect and deploy

### Other Platforms
- Heroku
- DigitalOcean App Platform
- AWS Elastic Beanstalk
- Any platform that supports Python Flask

## 🔒 Privacy & Security

- **No user accounts**: Completely anonymous
- **No data storage**: Chats are never saved
- **Room-level location**: Only general location, not precise coordinates
- **Opt-in only**: Users can cancel anytime
- **Temporary matches**: All data expires after 5 minutes

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is open source and available under the MIT License.

## 💡 Future Enhancements

- **Group Chats**: 3-person micro-chats
- **Quiet Zones**: Show empty areas for recharging
- **Analytics**: Post-event summary (with permission)
- **Night Mode**: Reduced animations for sensory sensitivity
- **BLE/WiFi**: Automatic room detection
- **Multi-language**: Support for different languages

## 🆘 Troubleshooting

### Common Issues

**"Module not found" errors**
- Make sure you've installed all requirements: `pip install -r requirements.txt`

**"Port already in use" error**
- Change the port in `app.py`: `socketio.run(app, debug=True, host='0.0.0.0', port=5001)`

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

## 🌟 Why IntroChat?

IntroChat solves a real problem that affects millions of people at events:

- ❌ **"I don't know how to start talking"** → Guided prompts do the work
- ❌ **"I'm scared of awkward silence"** → Timer + questions eliminate dead air  
- ❌ **"What if they're rude?"** → Only 2 minutes — easy to walk away
- ❌ **"I don't want to be 'networking'"** → Feels like a game, not a chore
- ❌ **"Too many people — where do I start?"** → Matches you with someone right here

**Built for Hackathons. Designed for Humans. Powered by Python.**

---

*Made with ❤️ for introverts everywhere*
