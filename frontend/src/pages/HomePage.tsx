// HomePage.tsx
// Description: Landing page — event code input, create/join event, QR display

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { fetchJSON } from '@/api/client';
import { QRDisplay } from '@/components/QRDisplay';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { CreateEventResponse, QRResponse } from '@/types/api';

export function HomePage() {
  const navigate = useNavigate();
  const [eventCode, setEventCode] = useState('');
  const [editCode, setEditCode] = useState('');
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

  function handleEdit() {
    const code = editCode.trim();
    if (code.length !== 8) {
      toast.error('Please enter a valid 8-character event code.');
      return;
    }
    navigate(`/organize/${code}`);
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
      toast.error('Failed to create event. Please try again.');
      setCreating(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-app flex-col px-5 pb-8">
      <header className="mb-8 mt-6 text-center">
        <h1 className="font-heading text-5xl text-foreground">
          IntroChat
        </h1>
        <p className="mt-3 text-lg text-muted-foreground">
          The Secret Icebreaker for Introverts at Events
        </p>
      </header>

      <main className="flex-1 space-y-5">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-2xl">Join an Event</CardTitle>
            <CardDescription>Enter an event code to get started</CardDescription>
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
          </CardContent>
        </Card>

        {!createdEvent && (
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-2xl">Create New Event</CardTitle>
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
          <QRDisplay
            qrCode={createdEvent.qrCode}
            eventCode={createdEvent.id}
            eventName={createdEvent.name}
            onOrganize={() => navigate(`/organize/${createdEvent.id}`)}
          />
        )}

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-2xl">Edit an Event</CardTitle>
            <CardDescription>Enter your event code to edit rooms, topics, and configuration</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3">
              <Input
                type="text"
                id="editEventCode"
                placeholder="Enter event code"
                maxLength={8}
                value={editCode}
                onChange={(e) => setEditCode(e.target.value)}
              />
              <div className="flex gap-2">
                <Button onClick={handleEdit} disabled={editCode.trim().length !== 8}>
                  Edit Event
                </Button>
                <Button variant="outline" onClick={() => navigate(`/join/${editCode.trim()}`)} disabled={editCode.trim().length !== 8}>
                  Test This Event
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <section className="py-6">
          <h3 className="mb-8 text-center font-heading text-3xl text-foreground">
            How It Works
          </h3>
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl">
                🎯
              </div>
              <h4 className="mb-1 font-semibold text-foreground">Join Event</h4>
              <p className="text-sm text-muted-foreground">Enter event code</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl">
                📍
              </div>
              <h4 className="mb-1 font-semibold text-foreground">Select Room</h4>
              <p className="text-sm text-muted-foreground">Choose your location</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl">
                🤝
              </div>
              <h4 className="mb-1 font-semibold text-foreground">Get Matched</h4>
              <p className="text-sm text-muted-foreground">Find someone ready to chat</p>
            </div>
            <div className="text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl">
                💬
              </div>
              <h4 className="mb-1 font-semibold text-foreground">2-Min Chat</h4>
              <p className="text-sm text-muted-foreground">Guided conversation prompts</p>
            </div>
          </div>
        </section>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-2xl">Privacy First</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {[
                'Fully anonymous — no real names or photos',
                'Room-level location only',
                'Chats are never stored',
                'Cancel anytime, no pressure',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 text-xs text-primary">
                    ✓
                  </span>
                  <span className="text-sm text-muted-foreground">{item}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
