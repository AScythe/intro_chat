// OrganizeEventPage.tsx [CLEANUP]
// Description: Event organization page — manage rooms and topics with chip-based multi-select, add/remove controls, and save config

import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { fetchJSON } from '@/api/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useChipSelection } from '@/hooks/useChipSelection';
import type { EventConfigResponse, Room, Topic, SaveEventConfigResponse } from '@/types/api';

export function OrganizeEventPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const fetchedRef = useRef(false);

  const rooms = useChipSelection();
  const topics = useChipSelection();

  useEffect(() => {
    if (!eventId) return;
    fetchedRef.current = false;
    fetchJSON<EventConfigResponse>(`/api/events/${eventId}/config`)
      .then((data) => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;
        rooms.setItems(data.rooms.map((r: Room) => ({ id: r.id, name: r.name, selected: r.selected, is_default: r.is_default })));
        topics.setItems(data.topics.map((t: Topic) => ({ id: t.id, name: t.name, selected: t.selected, is_default: t.is_default })));
        setLoading(false);
      })
      .catch(() => {
        if (fetchedRef.current) return;
        fetchedRef.current = true;
        toast.error('Event not found. Redirecting...');
        navigate('/');
      });
  }, [eventId, navigate]);

  async function handleSave() {
    if (!eventId) return;
    const selectedRooms = rooms.items.filter((r) => r.selected).map((r) => r.name);
    const selectedTopics = topics.items.filter((t) => t.selected).map((t) => t.name);

    if (selectedRooms.length === 0) {
      toast.error('At least one room is required.');
      return;
    }
    if (selectedTopics.length === 0) {
      toast.error('At least one topic is required.');
      return;
    }

    setSaving(true);
    try {
      const res = await fetchJSON<SaveEventConfigResponse>(`/api/events/${eventId}/config`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rooms: selectedRooms, topics: selectedTopics }),
      });
      for (const name of res.rooms_filled) {
        toast.success(`${name} filled with sample users!`);
      }
      toast.success('Event configuration saved!');
      navigate('/');
    } catch {
      toast.error('Failed to save configuration. Please try again.');
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="mx-auto flex min-h-screen max-w-app flex-col px-5 pb-8">
        <div className="space-y-5 mt-6">
          <Skeleton className="h-48 w-full" />
          <Skeleton className="h-48 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-app flex-col px-5 pb-8">
      <header className="mb-8 mt-6 text-center">
        <h1 className="font-heading text-4xl text-foreground">Organize Event</h1>
        <p className="mt-2 text-muted-foreground">
          Select which rooms and topics are available for this event
        </p>
      </header>

      <main className="flex-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-2xl">Rooms / Areas</CardTitle>
            <CardDescription>
              Click a room to toggle — defaults switch on/off, custom rooms are removed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {rooms.items.map((room) => (
                <button
                  key={room.id}
                  type="button"
                  onClick={() => rooms.handleClick(room)}
                  className={`rounded-full px-4 py-2 text-sm font-medium shadow-sm transition-colors ${
                    room.selected
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-input bg-background text-muted-foreground opacity-50'
                  }`}
                >
                  {room.name}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Add new room..."
                value={rooms.newItem}
                onChange={(e) => rooms.setNewItem(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && rooms.add()}
              />
              <Button variant="outline" onClick={rooms.add} disabled={!rooms.newItem.trim()}>
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-2xl">Interest Topics</CardTitle>
            <CardDescription>
              Click a topic to toggle — defaults switch on/off, custom topics are removed
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-wrap gap-2">
              {topics.items.map((topic) => (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => topics.handleClick(topic)}
                  className={`rounded-full px-4 py-2 text-sm font-medium shadow-sm transition-colors ${
                    topic.selected
                      ? 'bg-primary text-primary-foreground'
                      : 'border border-input bg-background text-muted-foreground opacity-50'
                  }`}
                >
                  {topic.name}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Add new topic..."
                value={topics.newItem}
                onChange={(e) => topics.setNewItem(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && topics.add()}
              />
              <Button variant="outline" onClick={topics.add} disabled={!topics.newItem.trim()}>
                Add
              </Button>
            </div>
          </CardContent>
        </Card>

        <Button className="w-full" onClick={handleSave} disabled={saving}>
          {saving ? 'Saving...' : 'Save Configuration'}
        </Button>
      </main>

      <footer className="mt-6 text-center">
        <Button variant="outline" size="sm" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </footer>
    </div>
  );
}
