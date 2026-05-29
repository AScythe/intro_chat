// RoomPage.tsx
// Description: Room selection and person matching — dropdown, person cards, match countdown

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { fetchJSON } from '@/api/client';
import { useUser } from '@/hooks/useUser';
import { useSocket } from '@/hooks/useSocket';
import { useDemoMode } from '@/hooks/useDemoMode';
import { useChatRequest } from '@/hooks/useChatRequest';
import { PersonCard } from '@/components/PersonCard';
import { MatchCountdown } from '@/components/MatchCountdown';
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
import { CONFIG } from '@/config/constants';
import type { Room, ApiSuccess } from '@/types/api';
import type { SamplePerson } from '@/utils/demoData';

type ViewState = 'selecting' | 'roomSelected' | 'waitingResponse' | 'accepted' | 'matchFound';

interface PersonResponse {
  accepted: boolean;
  message: string;
}

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

interface NearbyUsersViewProps {
  currentRoom: Room;
  nearbyUsers: SamplePerson[];
  selectedPerson: SamplePerson | null;
  onPersonClick: (person: SamplePerson) => void;
  onRequestChat: () => void;
  onChangeRoom: () => void;
}

function NearbyUsersView({ currentRoom, nearbyUsers, selectedPerson, onPersonClick, onRequestChat, onChangeRoom }: NearbyUsersViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-2xl">
          {currentRoom.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-xl bg-muted p-5">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Nearby Users</h3>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
            {nearbyUsers.map((person) => (
              <PersonCard
                key={person.name}
                person={person}
                selected={selectedPerson?.name === person.name}
                onClick={() => onPersonClick(person)}
              />
            ))}
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            <span className="font-medium">{nearbyUsers.filter((u) => u.available).length} available</span> out of{' '}
            {nearbyUsers.length} people
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            disabled={!selectedPerson}
            onClick={onRequestChat}
          >
            Request 2-min chat with {selectedPerson?.name || 'selected person'}
          </Button>
          <Button variant="outline" onClick={onChangeRoom}>
            Change Room
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface WaitingResponseViewProps {
  requestedPerson: SamplePerson;
  onCancel: () => void;
}

function WaitingResponseView({ requestedPerson, onCancel }: WaitingResponseViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-2xl">Request Sent</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="max-w-sm">
          <PersonCard person={requestedPerson} />
        </div>
        <div className="space-y-3 rounded-xl border bg-muted p-5">
          <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-lg">⏳</span>
            <span className="text-sm text-foreground">You: Request sent</span>
          </div>
          <div className="flex animate-pulse items-center gap-3 rounded-lg border bg-card p-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-lg">⏳</span>
            <span className="text-sm text-foreground">{requestedPerson.name}: Waiting for response...</span>
          </div>
        </div>
        <Button variant="outline" onClick={onCancel}>
          Cancel Request
        </Button>
      </CardContent>
    </Card>
  );
}

interface AcceptedViewProps {
  requestedPerson: SamplePerson;
  personResponse: PersonResponse;
  yourReady: boolean;
  theirReady: boolean;
  onImReady: () => void;
  onGoToChat: () => void;
}

function AcceptedView({ requestedPerson, personResponse, yourReady, theirReady, onImReady, onGoToChat }: AcceptedViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-2xl">
          {requestedPerson.name} accepted!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-xl border-l-4 border-primary bg-muted p-5">
          <p className="text-sm text-foreground">
            <span className="font-semibold">{requestedPerson.name} says:</span> "{personResponse.message}"
          </p>
          <p className="mt-3 font-medium text-foreground">You've been matched! Take your time to get ready.</p>
        </div>

        <div className="space-y-3 rounded-xl border bg-muted p-5">
          <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-lg">
              {yourReady ? '✅' : '⏳'}
            </span>
            <span className="text-sm text-foreground">You: {yourReady ? 'Ready!' : 'Getting ready...'}</span>
          </div>
          <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-lg">
              {theirReady ? '✅' : '⏳'}
            </span>
            <span className="text-sm text-foreground">{requestedPerson.name}: {theirReady ? 'Ready!' : 'Getting ready...'}</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {!yourReady && (
            <Button onClick={onImReady}>
              I'm Ready to Chat!
            </Button>
          )}
          <Button
            variant={yourReady && theirReady ? 'default' : 'outline'}
            disabled={!yourReady || !theirReady}
            onClick={onGoToChat}
          >
            {yourReady && theirReady ? 'Start Chat - Both Ready!' : 'Start Chat'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function RoomPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const socket = useSocket();
  const demo = useDemoMode(true);
  const { requestedPerson, personResponse, yourReady, theirReady, requestChat, imReady, cancelRequest } = useChatRequest();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [roomsLoading, setRoomsLoading] = useState(true);
  const [selectedRoomId, setSelectedRoomId] = useState('');
  const [currentRoom, setCurrentRoom] = useState<Room | null>(null);
  const [nearbyUsers, setNearbyUsers] = useState<SamplePerson[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<SamplePerson | null>(null);
  const [viewState, setViewState] = useState<ViewState>('selecting');
  const [matchUsername, setMatchUsername] = useState('');
  const [matchId, setMatchId] = useState('');
  const [countdown, setCountdown] = useState<number>(CONFIG.MATCH_FOUND_COUNTDOWN);

  useEffect(() => {
    if (!eventId) return;
    fetchJSON<Room[]>(`/api/events/${eventId}/rooms`)
      .then((data) => { setRooms(data); setRoomsLoading(false); })
      .catch(() => { toast.error('Failed to load rooms. Please refresh.'); setRoomsLoading(false); });
  }, [eventId]);

  async function handleSelectRoom() {
    if (!selectedRoomId || !eventId) return;
    const room = rooms.find((r) => r.id === selectedRoomId);
    if (!room) return;
    setCurrentRoom(room);
    try {
      if (user) {
        await fetchJSON<ApiSuccess>(`/api/users/${user.userId}/room`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ room_id: selectedRoomId }),
        });
      }
    } catch {}
    if (user) {
      socket.connect(user.userId, selectedRoomId);
    }
    const users = demo.addSampleUsers(room.name);
    setNearbyUsers(users);
    setViewState('roomSelected');
  }

  function handlePersonClick(person: SamplePerson) {
    if (!person.available) return;
    setSelectedPerson(person);
  }

  function handleRequestChat() {
    if (!selectedPerson) return;
    requestChat(selectedPerson);
    setViewState('waitingResponse');
  }

  function handleImReady() {
    imReady();
  }

  function handleGoToChat() {
    const mid = demo.createDemoMatchId();
    navigate(`/chat/${mid}?event_id=${eventId}`);
  }

  function handleCancelRequest() {
    cancelRequest();
    setViewState('roomSelected');
    setSelectedPerson(null);
  }

  useEffect(() => {
    if (personResponse) {
      setViewState('accepted');
    }
  }, [personResponse]);

  function handleChangeRoom() {
    setViewState('selecting');
    setCurrentRoom(null);
    setSelectedRoomId('');
    setNearbyUsers([]);
    setSelectedPerson(null);
  }

  useEffect(() => {
    if (viewState === 'matchFound') {
      const timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            navigate(`/chat/${matchId}?event_id=${eventId}`);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [viewState, matchId, eventId, navigate]);

  useEffect(() => {
    const unsub = socket.subscribe<{ type: string; match_id: string; room_id: string; user2_username: string }>(
      'match_found',
      (data) => {
        setMatchId(data.match_id);
        setMatchUsername(data.user2_username);
        setViewState('matchFound');
        setCountdown(CONFIG.MATCH_FOUND_COUNTDOWN);
      },
    );
    return unsub;
  }, [socket]);

  return (
    <div className="mx-auto flex min-h-screen max-w-app flex-col px-5 pb-8">
      <header className="mb-8 mt-6 text-center">
        <h1 className="font-heading text-4xl text-foreground">Select Your Location</h1>
        <p className="mt-2 text-muted-foreground">
          Choose where you're sitting to find nearby chat partners
        </p>
      </header>

      <main className="flex-1 space-y-5">
        {viewState === 'selecting' && (
          roomsLoading ? (
            <Card>
              <CardHeader>
                <CardTitle className="font-heading text-2xl">Where are you?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-12 w-full" />
                <Skeleton className="h-12 w-32" />
              </CardContent>
            </Card>
          ) : (
            <RoomSelector
              rooms={rooms}
              selectedRoomId={selectedRoomId}
              onSelectRoom={setSelectedRoomId}
              onConfirm={handleSelectRoom}
            />
          )
        )}

        {viewState === 'roomSelected' && currentRoom && (
          <NearbyUsersView
            currentRoom={currentRoom}
            nearbyUsers={nearbyUsers}
            selectedPerson={selectedPerson}
            onPersonClick={handlePersonClick}
            onRequestChat={handleRequestChat}
            onChangeRoom={handleChangeRoom}
          />
        )}

        {viewState === 'waitingResponse' && requestedPerson && (
          <WaitingResponseView
            requestedPerson={requestedPerson}
            onCancel={handleCancelRequest}
          />
        )}

        {viewState === 'accepted' && personResponse && requestedPerson && (
          <AcceptedView
            requestedPerson={requestedPerson}
            personResponse={personResponse}
            yourReady={yourReady}
            theirReady={theirReady}
            onImReady={handleImReady}
            onGoToChat={handleGoToChat}
          />
        )}

        {viewState === 'matchFound' && (
          <MatchCountdown
            username={matchUsername}
            roomName={currentRoom?.name || ''}
            countdown={countdown}
            onGoToChat={() => navigate(`/chat/${matchId}`)}
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
