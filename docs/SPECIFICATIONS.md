# 🌟 IntroChat: The Secret Icebreaker for Introverts at Events

> *"IntroChat doesn't make introverts talk more — it makes them feel safe enough to talk once. And sometimes, that one conversation changes everything."*

---

> **Last verified:** 2026-05-31 20:15 EDT

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
2. **Sets up their profile** — optionally enters a display name, LinkedIn URL, and/or Slack handle (stored but never shared without double opt-in). Also selects interests/topics from a chip-based selection to help others find conversation starters. If name is left blank, an anonymous `User_XXXXX` username is auto-generated.
3. **Selects a room** (Main Hall, Table 1-5, Quiet Corner, Coffee Area) via dropdown
4. **Browses nearby people and requests a chat** — sees who's in the same room, selects a person, and sends a chat request
5. **Waits for acceptance** — the other person receives the request and accepts (or declines). Once accepted, both tap "I'm Ready to Chat!" and then "Start Chat - Both Ready!" to proceed
6. **Match found!** → 60-second countdown → auto-redirect to chat page
7. **30-second timed chat** with guided conversation prompts
8. **Time's up** → option to extend the chat (one additional 30-second round) or end and proceed to connection exchange
9. **Connection exchange** → navigated to a dedicated Connect page where both users independently choose Yes/No on a connection card. If both opt in, usernames are exchanged in real time via WebSocket; if either declines, the chat ends respectfully with a decline message

---

## Core Features

1. **Event creation** — unique 8-character event codes with 8 default rooms auto-created
2. **QR code generation** — one-click event joining
3. **Room/table selection** — coarse location-based matching at the room level
4. **Matchmaking** — pairs available users in the same room automatically
5. **Timed conversation** — 30-second guided chat with rotating prompts
6. **Chat extension** — extend by the configured duration or continue indefinitely
7. **Double opt-in connection** — both users must consent before social info is exchanged
8. **Dark mode** — full light/dark theme toggle persisted in localStorage, respects system `prefers-color-scheme`
9. **Background cleanup** — expired matches auto-purged every 60 seconds

---

## 🔒 Privacy First

| Feature | Detail |
|--------|--------|
| Identity | Fully anonymous — auto-generated usernames by default. Users may optionally enter a display name. No emails or photos. |
| Location | Room-level only (manual select) |
| Data | Chats are never stored. Social info (LinkedIn/Slack) stored but never shared without double opt-in. Match records expire after 30 seconds with background cleanup. |
| Control | Cancel anytime. Session resets on page refresh (user ID in `localStorage`). |

### Hard Constraints
These are non-negotiable — enforced at the implementation level:
- **No message storage** — chat content exists only in memory during the session, never written to disk
- **No identity exposure** — auto-generated usernames by default (e.g., `User_ABC12`); users may optionally enter a display name; emails and photos never collected
- **No single opt-in** — connection details (LinkedIn/Slack) require both parties to consent; one "no" means no exchange
- **No IP logging** — users identified by UUIDs only; no IP addresses stored
- **Match expiry enforced** — 30-second initial expiry with 5-minute background cleanup
- **Session reset on page refresh** — closing or refreshing the page clears the session state

---

## 🚫 Out of Scope
The following are explicitly NOT implemented and should not be built unless the user explicitly requests them:
- User authentication or accounts
- Database swaps (PostgreSQL, MySQL, etc.)
- Frontend frameworks beyond React (Vue, Svelte, etc.)
- Chat message storage
- GPS/Bluetooth proximity detection
- Push notifications
- Admin dashboards

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

### Architecture Overview

**Frontend (React SPA)** — Browser-based UI with Tailwind CSS + shadcn/ui. **Backend (FastAPI + WebSocket)** — Python API server for events, users, and real-time matching. **Data Model** — Four entities (Events, Rooms, Users, Matches) with temporary match lifecycle. See the technology table below for details.

| Layer | Technology | Why? |
|-------|------------|------|
| **Frontend** | React 19 + TypeScript + Vite | Component-based SPA with type safety, built via Vite pipeline. |
| **Styling** | Tailwind CSS + PostCSS + shadcn/ui | Utility-first CSS with radix-based primitives; fast iteration and consistent design tokens. |
| **Design System** | CSS custom properties + Tailwind config | "Warm Sanctuary" palette (sage greens, warm neutrals, cream paper) with `.dark` class toggle. Dark mode persisted in localStorage, falls back to `prefers-color-scheme`. |
| **Animations** | `motion` (React) + Tailwind keyframes | Fade/slide page transitions via AnimatePresence; pulse loading animations; soft card shadows. |
| **Icons** | `lucide-react` | Consistent icon set for theme toggle, UI actions. |
| **Toasts** | `sonner` | Lightweight toast system for success/error notifications. |
| **Backend** | Python + FastAPI | Modern ASGI framework, native WebSocket support, automatic OpenAPI docs. |
| **Real-Time** | Native WebSocket via FastAPI | Live match notifications without polling. |
| **Data Storage** | SQLite | Zero setup, portable. Active matches stored in memory for speed. |
| **Location** | Manual room selection ("Main Hall", "Table 7", etc.) | MVP-friendly. Avoids complex geolocation. |
| **QR Codes** | `qrcode` Python library | Generate event-specific QR codes for quick access. |
| **Typography** | Sora (UI), DM Serif Display (headings) — Google Fonts | Warm, approachable text hierarchy. |

### Product Decisions

| Decision | Why? |
|----------|------|
| Anonymous by default | Zero friction sign-up; no email or password needed |
| SQLite over PostgreSQL | Zero setup, portable, sufficient for event-scale traffic |
| Native WebSocket over SocketIO | No extra dependency; FastAPI has built-in WS support |
| Room-level location over GPS | Privacy-preserving; no location permissions needed |
| In-memory matches + DB persistence | Speed for active matches; durability for user profiles |
| 30-second chat timer | Low commitment reduces anxiety; easy to extend if desired |
| Double opt-in connection | Both parties must consent before contact info is shared |
| Dark mode via CSS variables + localStorage | Respects system preference; persists across sessions |

---

## 💬 Sample User Flow (Perfect for Demo)

> *Alex, an introverted developer, sits alone between sessions at a hackathon. They scroll through their phone, feeling out of place.*
>
> They open their browser, navigate to the event link (or scan a QR code — QR generation is supported; scanning is not yet implemented, so they enter the event code manually).
>
> They land on their profile page, optionally add their LinkedIn URL and Slack handle (safe — never shared without permission), then click *"Select Room"*.
>
> Select: *"Hall 3"* → They're taken to a list of nearby people.
>
> They spot *CodeCalm_42* — sounds interesting! They tap the card and click *"Request 2-min chat"*. The request is sent.
>
> CodeCalm_42 accepts. Both tap *"I'm Ready to Chat!"* and then *"Start Chat - Both Ready!"* → 60-second match countdown begins.
>
> ✅ *"Matched with CodeCalm_42 at Hall 3. Head over now!"*
>
> Alex walks over. 30-second timer starts.
> Prompt: *"What's your favorite debugging story?"*
>
> They laugh. Share a story about a bug that took 6 hours to fix.
> Timer ends. Alex taps *"End chat and connect"*, which takes them to the connection page.
>
> Both independently choose *"Yes, exchange usernames!"* → connection exchanged!
> `Alex_99` ↔ `CodeCalm_42`
>
> Alex leaves feeling connected — not drained.

---

## 🏆 Why Users Will Love It

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
---

## 📣 Final Pitch Line (Say This Loud & Proud)

> **"IntroChat doesn't make introverts talk more — it makes them feel safe enough to talk once. And sometimes, that one conversation changes everything."**

---

> 💡 **Built for Hackathons. Designed for Humans. Powered by Python.**

---

### 🖥️ Demo Setup Instructions (For Judges)
1. Open two browsers (or two phones) on the same network.
2. Run the server with `uv run python -m app`.
3. Visit `http://localhost:5000` — create a new event.
4. In both browsers, enter the same event code → pick the same room → both tap *"I'm Ready"*
5. Watch them match in real time!
6. Show the 30-second timer, conversation prompts, and the anonymous connection exchange.

> 🧪 **No account needed. No signup. No data saved. Pure empathy in code.**
