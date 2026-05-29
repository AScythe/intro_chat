// HomePage.tsx
// Description: Landing page — event code input, create/join event, QR display

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchJSON } from '@/api/client';
import { QRDisplay } from '@/components/QRDisplay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
    <div className="mx-auto flex min-h-screen max-w-app flex-col px-5 py-5">
      <header className="mb-8 rounded-[20px] border border-white/30 bg-white/20 p-10 text-center backdrop-blur-sm">
        <h1 className="mb-2 text-5xl font-bold text-foreground drop-shadow-sm">
          IntroChat
        </h1>
        <p className="mb-3 text-lg font-medium text-foreground/90">
          The Secret Icebreaker for Introverts at Events
        </p>
        <p className="mx-auto max-w-md text-base italic text-foreground/80">
          "IntroChat doesn't make introverts talk more — it makes them feel safe enough to talk once.
          And sometimes, that one conversation changes everything."
        </p>
      </header>

      <main className="flex-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Join an Event</CardTitle>
            <CardDescription>Enter an event code or scan the QR code to get started</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Input
                type="text"
                id="eventCode"
                placeholder="Enter event code (e.g., ABC123)"
                maxLength={8}
                value={eventCode}
                onChange={(e) => setEventCode(e.target.value)}
              />
              <Button onClick={handleJoin} disabled={eventCode.trim().length !== 8}>
                Join Event
              </Button>
            </div>

            <div className="relative text-center before:absolute before:left-0 before:right-0 before:top-1/2 before:h-px before:bg-border">
              <span className="relative z-10 bg-card px-5 text-sm text-muted-foreground">
                or
              </span>
            </div>

            <div className="text-center">
              <Button variant="outline">🔳 Scan QR Code</Button>
            </div>
          </CardContent>
        </Card>

        {!createdEvent && (
          <Card>
            <CardHeader>
              <CardTitle>Create New Event</CardTitle>
              <CardDescription>Set up a new IntroChat event for your venue</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Input
                  type="text"
                  id="eventName"
                  placeholder="Event name (e.g., Hackathon 2024)"
                  maxLength={50}
                  value={eventName}
                  onChange={(e) => setEventName(e.target.value)}
                />
                <Button
                  variant="outline"
                  onClick={handleCreate}
                  disabled={creating || !eventName.trim()}
                >
                  {creating ? 'Creating...' : 'Create Event'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {createdEvent && (
          <QRDisplay qrCode={createdEvent.qrCode} eventCode={createdEvent.id} eventName={createdEvent.name} />
        )}

        {createdEvent && (
          <Card>
            <CardContent className="pt-6">
              <Button className="w-full" onClick={() => navigate(`/join/${createdEvent.id}`)}>
                Join This Event
              </Button>
            </CardContent>
          </Card>
        )}

        <div className="py-8">
          <h3 className="mb-8 text-center text-3xl font-semibold text-foreground drop-shadow-sm">
            How It Works
          </h3>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="text-center text-foreground">
              <div className="mb-2 text-4xl">🎯</div>
              <h4 className="mb-1 text-base font-semibold">Join Event</h4>
              <p className="text-sm text-foreground/80">Enter event code or scan QR</p>
            </div>
            <div className="text-center text-foreground">
              <div className="mb-2 text-4xl">📍</div>
              <h4 className="mb-1 text-base font-semibold">Select Room</h4>
              <p className="text-sm text-foreground/80">Choose your location</p>
            </div>
            <div className="text-center text-foreground">
              <div className="mb-2 text-4xl">🤝</div>
              <h4 className="mb-1 text-base font-semibold">Get Matched</h4>
              <p className="text-sm text-foreground/80">Find someone ready to chat</p>
            </div>
            <div className="text-center text-foreground">
              <div className="mb-2 text-4xl">💬</div>
              <h4 className="mb-1 text-base font-semibold">2-Min Chat</h4>
              <p className="text-sm text-foreground/80">Guided conversation prompts</p>
            </div>
          </div>
        </div>

        <div className="rounded-[16px] border border-white/30 bg-white/20 p-6 text-foreground backdrop-blur-sm">
          <h4 className="mb-4 text-xl font-semibold">Privacy First</h4>
          <ul className="space-y-2">
            {[
              'Fully anonymous — no real names or photos',
              'Room-level location only',
              'Chats are never stored',
              'Cancel anytime, no pressure',
            ].map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="mt-0.5 font-bold text-primary">✓</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
