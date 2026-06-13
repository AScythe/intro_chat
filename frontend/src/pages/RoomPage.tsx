// RoomPage.tsx
// Description: Room selection — dropdown to choose a room, then navigates to people matching

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { fetchJSON } from '@/api/client';
import { useUser } from '@/hooks/useUser';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Room } from '@/types/api';

interface RoomSelectorProps {
  rooms: Room[];
  selectedRoomId: string;
  onSelectRoom: (id: string) => void;
  onConfirm: () => void;
}

function RoomSelector({ rooms, selectedRoomId, onSelectRoom, onConfirm }: RoomSelectorProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-2xl">Where are you?</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select value={selectedRoomId} onValueChange={onSelectRoom}>
          <SelectTrigger>
            <SelectValue placeholder="Select a room or table..." />
          </SelectTrigger>
          <SelectContent>
            {rooms.map((room) => (
              <SelectItem key={room.id} value={room.id}>
                {room.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button disabled={!selectedRoomId} onClick={onConfirm}>
          Select Room
        </Button>
      </CardContent>
    </Card>
  );
}

export function RoomPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();

  const { user } = useUser();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [selectedRoomId, setSelectedRoomId] = useState('');

  useEffect(() => {
    if (!eventId) return;
    fetchJSON<Room[]>(`/api/events/${eventId}/rooms`)
      .then((data) => { setRooms(data); setRoomsLoading(false); })
      .catch(() => { toast.error('Failed to load rooms. Please refresh.'); setRoomsLoading(false); });
  }, [eventId]);

  async function handleSelectRoom() {
    if (!selectedRoomId || !eventId || !user?.userId) return;
    const room = rooms.find((r) => r.id === selectedRoomId);
    if (!room) return;
    try {
      await fetchJSON(`/api/users/${user.userId}/room`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ room_id: selectedRoomId }),
      });
    } catch {
      toast.error('Failed to set room. You may not be able to request chats.');
    }
    navigate(`/people/${eventId}`, { state: { roomName: room.name } });
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-app flex-col px-5 pb-8">
      <header className="mb-8 mt-6 text-center">
        <div className="mb-2 text-left">
          <Button variant="link" className="p-0" onClick={() => navigate(`/join/${eventId}`)}>
            ← Back to Profile
          </Button>
        </div>
        <h1 className="font-heading text-4xl text-foreground">Select Your Location</h1>
        <p className="mt-2 text-muted-foreground">
          Choose where you're sitting to find nearby chat partners
        </p>
      </header>

      <main className="flex-1 space-y-5">
        {roomsLoading ? (
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-2xl">Where are you?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <Skeleton className="h-12 w-32" />
            </CardContent>
          </Card>
        ) : rooms.length === 0 ? (
          <Card>
            <CardHeader>
              <CardTitle className="font-heading text-2xl">No Rooms Available</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                This event hasn't configured any rooms yet. Please check back later.
              </p>
            </CardContent>
          </Card>
        ) : (
          <RoomSelector
            rooms={rooms}
            selectedRoomId={selectedRoomId}
            onSelectRoom={setSelectedRoomId}
            onConfirm={handleSelectRoom}
          />
        )}
      </main>

      <footer className="mt-6 text-center">
        <p className="text-xs text-muted-foreground">
          Make sure you're physically in the room you select for the best matches!
        </p>
        <Button variant="outline" size="sm" className="mt-3" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </footer>
    </div>
  );
}
