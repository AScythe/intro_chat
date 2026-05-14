// HomePage.tsx
// Description: Landing page — event code input, create/join event, QR display

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchJSON } from '@/api/client';
import { QRDisplay } from '@/components/QRDisplay';
import type { CreateEventResponse, QRResponse } from '@/types/api';

export function HomePage() {
  const navigate = useNavigate();
  const [eventCode, setEventCode] = useState('');
  const [eventName, setEventName] = useState('');
  const [creating, setCreating] = useState(false);
  const [createdEvent, setCreatedEvent] = useState<{
    id: string;
    name: string;
    qrCode: string;
  } | null>(null);

  function handleJoin() {
    const code = eventCode.trim().toUpperCase();
    if (code.length !== 8) return;
    navigate(`/join/${code}`);
  }

  async function handleCreate() {
    if (!eventName.trim()) return;
    setCreating(true);
    try {
      const event = await fetchJSON<CreateEventResponse>('/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: eventName.trim() }),
      });
      const qr = await fetchJSON<QRResponse>(`/api/qr/${event.event_id}`);
      setCreatedEvent({ id: event.event_id, name: eventName.trim(), qrCode: qr.qr_code });
    } catch {
      setCreating(false);
    }
  }

  return (
    <div className="container">
      <header className="hero">
        <h1 className="hero-title">IntroChat</h1>
        <p className="hero-subtitle">The Secret Icebreaker for Introverts at Events</p>
        <p className="hero-description">
          "IntroChat doesn't make introverts talk more — it makes them feel safe enough to talk once.
          And sometimes, that one conversation changes everything."
        </p>
      </header>

      <main className="main-content">
        <div className="card">
          <h2>Join an Event</h2>
          <p className="card-description">Enter an event code or scan the QR code to get started</p>

          <div className="input-group">
            <input
              type="text"
              id="eventCode"
              placeholder="Enter event code (e.g., ABC123)"
              maxLength={8}
              value={eventCode}
              onChange={(e) => setEventCode(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleJoin} disabled={eventCode.trim().length !== 8}>
              Join Event
            </button>
          </div>

          <div className="divider">
            <span>or</span>
          </div>

          <div className="qr-section">
            <button className="btn btn-secondary"> Scan QR Code</button>
          </div>
        </div>

        {!createdEvent && (
          <div className="card">
            <h2>Create New Event</h2>
            <p className="card-description">Set up a new IntroChat event for your venue</p>

            <div className="input-group">
              <input
                type="text"
                id="eventName"
                placeholder="Event name (e.g., Hackathon 2024)"
                maxLength={50}
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
              <button
                className="btn btn-primary"
                onClick={handleCreate}
                disabled={creating || !eventName.trim()}
              >
                {creating ? 'Creating...' : 'Create Event'}
              </button>
            </div>
          </div>
        )}

        {createdEvent && (
          <QRDisplay qrCode={createdEvent.qrCode} eventCode={createdEvent.id} eventName={createdEvent.name} />
        )}

        {createdEvent && (
          <div className="card">
            <button className="btn btn-primary" onClick={() => navigate(`/join/${createdEvent.id}`)}>
              Join This Event
            </button>
          </div>
        )}

        <div className="features">
          <h3>How It Works</h3>
          <div className="feature-grid">
            <div className="feature-item">
              <div className="feature-icon">🎯</div>
              <h4>Join Event</h4>
              <p>Enter event code or scan QR</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">📍</div>
              <h4>Select Room</h4>
              <p>Choose your location</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">🤝</div>
              <h4>Get Matched</h4>
              <p>Find someone ready to chat</p>
            </div>
            <div className="feature-item">
              <div className="feature-icon">💬</div>
              <h4>2-Min Chat</h4>
              <p>Guided conversation prompts</p>
            </div>
          </div>
        </div>

        <div className="privacy-notice">
          <h4>Privacy First</h4>
          <ul>
            <li>Fully anonymous — no real names or photos</li>
            <li>Room-level location only</li>
            <li>Chats are never stored</li>
            <li>Cancel anytime, no pressure</li>
          </ul>
        </div>
      </main>
    </div>
  );
}
