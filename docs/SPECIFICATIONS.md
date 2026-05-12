# 🌟 IntroChat: The Secret Icebreaker for Introverts at Events

> *"IntroChat doesn't make introverts talk more — it makes them feel safe enough to talk once. And sometimes, that one conversation changes everything."*

---

## 💡 Problem  
At hackathons, conferences, and meetups, introverts often feel overwhelmed by the pressure to "just go talk to people."  
Traditional networking feels exhausting, performative, and unpredictable — leading many to stay isolated, even when they want to connect.

---

## 🎯 Solution  
**IntroChat** is a lightweight, browser-based web app that lets introverts initiate low-pressure, 30-second face-to-face micro-chats with nearby attendees — no awkward approaches required.

Think of it as *Tinder for 30-second conversations* — but only when you're physically near someone else who's also ready to chat.

---

## ✅ How It Works (Core Logic Flow)

1. **User creates or joins an event** → receives an 8-character event code
2. **Sets up their profile** — optionally adds LinkedIn URL and/or Slack handle (stored but never shared without double opt-in)
3. **Selects a room** (Main Hall, Table 1-5, Quiet Corner, Coffee Area) via dropdown
4. **Toggles "I'm Ready"** to signal availability for matching
5. **Server matches** with another available user in the same room
6. **Match found!** → 60-second countdown → auto-redirect to chat page
7. **30-second timed chat** with guided conversation prompts
8. **Time's up** → option to extend the timer or chat indefinitely
9. **Connection exchange** → both users decide → if both opt in, usernames are exchanged

---

## 🔒 Privacy First
| Feature | Detail |
|--------|--------|
| Identity | Fully anonymous — auto-generated usernames only. No real names, emails, or photos. |
| Location | Room-level only (manual select) |
| Data | Chats are never stored. Social info (LinkedIn/Slack) stored but never shared without double opt-in. Match records expire after 2 minutes with background cleanup. |
| Control | Cancel anytime. Session resets on page refresh (user ID in `localStorage`). |

---

## 🎯 Why Introverts Love It

| Problem | IntroChat Solves It |
|--------|---------------------|
| ❌ "I don't know how to start talking" | Guided prompts do the work for you |
| ❌ "I'm scared of awkward silence" | Timer + questions eliminate dead air |
| ❌ "What if they're rude?" | Only 30 seconds — easy to walk away |
| ❌ "I don't want to be 'networking'" | Feels like a game, not a chore |
| ❌ "Too many people — where do I even start?" | Matches you with someone **right here**, not across the room |
| ❌ "I want to try before real event" | **Demo mode** with sample users and simulated responses |

---

## 🛠️ Tech Stack

| Layer | Technology | Why? |
|-------|------------|------|
| **Frontend** | HTML5 + CSS3 + Vanilla JavaScript | Lightweight, works on any browser. No frameworks needed. |
| **Backend** | Python + FastAPI | Modern ASGI framework, native WebSocket support, automatic OpenAPI docs. |
| **Real-Time** | Native WebSocket via FastAPI | Live match notifications without polling. |
| **Data Storage** | SQLite | Zero setup, portable. Active matches stored in memory for speed. |
| **Location** | Manual room selection ("Main Hall", "Table 7", etc.) | MVP-friendly. Avoids complex geolocation. |
| **QR Codes** | `qrcode` Python library | Generate event-specific QR codes for quick access. |

---

## 💬 Sample User Flow (Perfect for Demo)

> *Alex, an introverted developer, sits alone between sessions at a hackathon. They scroll through their phone, feeling out of place.*
>
> They open their browser, navigate to the event link (or scan a QR code — QR generation is supported; scanning is not yet implemented, so they enter the event code manually).
>
> They land on their profile page, optionally add their LinkedIn URL and Slack handle (safe — never shared without permission), then click *"Select Room"*.
>
> Select: *"Table 3"* → Tap *"I'm Ready"*
>
> 10 seconds later:
> ✅ *"Matched with CodeCalm_42 at Table 3. Head over now!"*
>
> Alex walks over. 30-second timer starts.
> Prompt: *"What's your favorite debugging story?"*
>
> They laugh. Share a story about a bug that took 6 hours to fix.
> Timer ends.
> Both tap: *"Yes"* → exchange usernames: `Alex_99` and `CodeCalm_42`
>
> Alex leaves feeling connected — not drained.

---

## 🏆 Why Judges Will Love It

- ✅ **Solves a real, universal pain point** at every tech event
- ✅ **Incredibly simple UX** — enter code, optional profile, one-click matching, 30 seconds
- ✅ **Respects boundaries** — zero pressure, opt-in only
- ✅ **Built with Python** — clean, readable backend perfect for judging
- ✅ **Scalable** — works for hackathons, job fairs, conferences, campus events
- ✅ **Emotionally intelligent design** — built *with* introverts, not *for* them
- ✅ **100% web-based** — no installs, no app stores, instant access

---

## 🚀 Bonus Features (If Time Allows)

- **👥 Group Micro-Chats**: Match 3 people for a 3-minute roundtable chat (like speed dating, but chill).
- **🧘 Quiet Zone Mode**: Shows empty tables/areas. Gentle nudge: *"You're not missing out. You're recharging."*
- **📊 Post-Event Summary**:
  > *"You had 3 micro-chats today. 2 made you smile. That's progress."*
- **🌙 Night Mode**: Softer colors, reduced animations for sensory sensitivity.

---

## 📣 Final Pitch Line (Say This Loud & Proud)

> **"IntroChat doesn't make introverts talk more — it makes them feel safe enough to talk once. And sometimes, that one conversation changes everything."**

---

> 💡 **Built for Hackathons. Designed for Humans. Powered by Python.**

---

### 🖥️ Demo Setup Instructions (For Judges)
1. Open two browsers (or two phones) on the same network.
2. Run the server with `python -m app`.
3. Visit `http://localhost:5000` — create a new event.
4. In both browsers, enter the same event code → pick the same room → both tap *"I'm Ready"*
5. Watch them match in real time!
6. Show the 30-second timer, conversation prompts, and the anonymous connection exchange.

> 🧪 **No account needed. No signup. No data saved. Pure empathy in code.**
