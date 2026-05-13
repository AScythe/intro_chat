# 🎬 IntroChat Demo Guide

> **Last verified:** 2026-05-13 against commit `30f409e`

## 🚀 Quick Start Demo

### Step 1: Start the Application
```bash
python -m app
```

### Step 2: Open in Browser
- Go to `http://localhost:5000`
- You should see the IntroChat homepage with the beautiful gradient design

### Step 3: Create an Event (Event Organizer)
1. Enter an event name (e.g., "Hackathon 2024")
2. Click "Create Event"
3. You'll see a QR code and event code
4. Note the event code (e.g., "ABC12345")

### Step 4: Join Event (Attendee)
1. Enter the event code from Step 3
2. Click "Join Event"
3. You'll be taken to the user info page

### Step 5: Set Up Profile
1. Enter your LinkedIn URL and/or Slack handle (both optional)
2. Click "Save" — your user profile is created
3. The "Select Room/Area" button becomes enabled
4. Click "Select Room/Area"

### Step 6: Select Room
1. Choose a room from the dropdown (e.g., "Table 1")
2. Click "Select Room"
3. You'll see the room interface with a "Need a 2-min chat?" button

### Step 7: Test Matching (Two Devices)
1. **Device 1**: Tap "Need a 2-min chat?" and wait
2. **Device 2**: Join the same event, select the same room, tap "Need a 2-min chat?"
3. Both devices should instantly show "Match Found!" with a countdown
4. Click "Go to Chat" on both devices

### Step 8: Experience the Chat
1. You'll see a 2-minute timer
2. Conversation prompts will appear automatically
3. Use "Next Prompt" to cycle through questions
4. When time is up, choose whether to exchange contact info

## 🎯 Key Features to Demonstrate

### ✨ Beautiful UI
- Gradient backgrounds
- Smooth animations
- Mobile-responsive design
- Clean, modern interface

### 🔄 Real-time Matching
- Instant notifications when matches are found
- WebSocket-powered live updates
- No page refresh needed

### 💬 Guided Conversations
- 2-minute timer with visual countdown
- Rotating conversation prompts
- No awkward silences

### 🔒 Privacy-First Design
- Completely anonymous
- Social info (LinkedIn/Slack) stored but never shared without double opt-in
- Easy to opt-out

### 📱 Mobile-Friendly
- Works on any device with a browser
- Touch-optimized interface
- Responsive design

## 🧪 Testing Scenarios

### Scenario 1: Single Device Demo
1. Create event → Join event → Save profile → Select room
2. Click "Need a 2-min chat?" — shows waiting state
3. Click a demo person (e.g., "Alex from Table 1") to simulate a match
4. Chat interface loads with timer and prompts — no second device needed

### Scenario 2: Two-User Matching
1. Two devices, same event, same room
2. Both request chat → Instant match
3. Show the chat interface and timer

### Scenario 3: Connection Exchange
1. Complete a chat
2. Both choose "End chat and connect"
3. Usernames are exchanged so they can find each other

### Scenario 4: Privacy Features
1. Show anonymous usernames
2. Demonstrate easy cancellation
3. Social info collected but never shared without double opt-in

## 🔄 Reset Instructions

After completing a demo run, reset for the next run:
1. Close both browser tabs/windows
2. Reopen the app at `http://localhost:5000`
3. Create a new event name (e.g., "Demo Round 2")
4. Join with a new user on each device
5. Proceed through Room → Chat flow again

Session state resets on page refresh — no manual cleanup needed.

---

## 🛠️ Fallback Options

### Only One Device Available
- Use demo mode: after selecting a room, tap "Need a 2-min chat?" then click any person card to simulate a match
- Full chat flow works without a second device or browser

### QR Code Won't Scan
- Share the event code (8-character alphanumeric) verbally or type it on the second device
- Both entry methods work identically

### Chat Timer Expired
- Both users see the connection exchange prompt
- Each can choose "End chat and connect" or "End chat" independently
- If one declines, chat closes for both — no stranded state

## 🎨 UI Highlights

### Homepage
- Hero section with compelling tagline
- Event creation and joining
- QR code generation
- Feature grid explanation

### User Info Page
- Clean LinkedIn/Slack input form
- "Save" button creates profile
- "Select Room/Area" activates after save

### Room Selection
- Clean room dropdown
- Nearby users visualization (with demo person cards)
- Clear call-to-action button

### Chat Interface
- Prominent timer display
- Conversation prompts in cards
- Smooth animations
- Connection exchange flow

## 🔧 Technical Features to Highlight

### Backend
- Python FastAPI with native WebSocket support
- SQLite database (auto-created via aiosqlite)
- Real-time matching algorithm
- QR code generation

### Frontend
- Vanilla JavaScript (no frameworks)
- Responsive CSS with gradients
- WebSocket integration
- Mobile-optimized

### Architecture
- Event-based room system
- Anonymous user management
- Temporary match storage
- Clean API design

## 🎪 Demo Tips

### For Judges
1. **Start with the problem**: "At every tech event, introverts struggle to connect..."
2. **Show the solution**: "IntroChat makes it safe and easy with just one button"
3. **Demonstrate the flow**: Create event → Join → Match → Chat
4. **Highlight the tech**: "Built with Python FastAPI (modular `app/` package), native WebSockets, and zero frontend frameworks"
5. **Emphasize impact**: "This could help thousands of introverts at every event"

### For Users
1. **Emphasize simplicity**: "Just one button, two minutes, zero pressure"
2. **Show the beauty**: "Look how clean and modern this interface is"
3. **Demonstrate privacy**: "No accounts, no data stored, completely anonymous"
4. **Highlight the prompts**: "Never run out of things to talk about"

---

*Ready to change how introverts connect at events? Let's demo IntroChat!* 🌟
