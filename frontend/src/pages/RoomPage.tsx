// RoomPage.tsx
// Description: Room selection and person matching — dropdown, person cards, match countdown

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchJSON } from '@/api/client';
import { useUser } from '@/hooks/useUser';
import { useSocket } from '@/hooks/useSocket';
import { useDemoMode } from '@/hooks/useDemoMode';
import { useChatRequest } from '@/hooks/useChatRequest';
import { PersonCard } from '@/components/PersonCard';
import { MatchCountdown } from '@/components/MatchCountdown';
import { CONFIG } from '@/config/constants';
import type { Room, ApiSuccess } from '@/types/api';
import type { SamplePerson } from '@/utils/demoData';

type ViewState = 'selecting' | 'roomSelected' | 'waitingResponse' | 'accepted' | 'matchFound';

export function RoomPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { user } = useUser();
  const socket = useSocket();
  const demo = useDemoMode(true);
  const { requestedPerson, personResponse, yourReady, theirReady, requestChat, imReady, cancelRequest } = useChatRequest();

  const [rooms, setRooms] = useState<Room[]>([]);
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
      .then(setRooms)
      .catch(() => {});
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
    <div className="container">
      <header className="page-header">
        <h1>Select Your Location</h1>
        <p>Choose where you're sitting to find nearby chat partners</p>
      </header>

      <main className="main-content">
        {viewState === 'selecting' && (
          <div className="card">
            <h2>Where are you?</h2>
            <div className="room-selection">
              <select
                id="roomSelect"
                className="room-dropdown"
                value={selectedRoomId}
                onChange={(e) => setSelectedRoomId(e.target.value)}
              >
                <option value="">Select a room or table...</option>
                {rooms.map((room) => (
                  <option key={room.id} value={room.id}>
                    {room.name}
                  </option>
                ))}
              </select>
              <button
                className="btn btn-primary"
                disabled={!selectedRoomId}
                onClick={handleSelectRoom}
              >
                Select Room
              </button>
            </div>
          </div>
        )}

        {viewState === 'roomSelected' && currentRoom && (
          <div className="card">
            <h2>
              Room Selected: <span>{currentRoom.name}</span>
            </h2>
            <div className="room-info">
              <p>
                You're now in <strong>{currentRoom.name}</strong>
              </p>
              <div className="nearby-users">
                <h3>Nearby Users</h3>
                <div className="available-people">
                  {nearbyUsers.map((person) => (
                    <PersonCard
                      key={person.name}
                      person={person}
                      selected={selectedPerson?.name === person.name}
                      onClick={() => handlePersonClick(person)}
                    />
                  ))}
                </div>
                <p className="user-count">
                  <strong>{nearbyUsers.filter((u) => u.available).length} available</strong> out of{' '}
                  {nearbyUsers.length} people in {currentRoom.name}
                </p>
              </div>
            </div>

            <div className="action-section">
              <button
                className="btn btn-primary"
                disabled={!selectedPerson}
                onClick={handleRequestChat}
              >
                Request 2-min chat with {selectedPerson?.name || 'selected person'}
              </button>
              <button className="btn btn-secondary" onClick={handleChangeRoom}>
                Change Room
              </button>
            </div>
          </div>
        )}

        {viewState === 'waitingResponse' && requestedPerson && (
          <div className="card">
            {/* [MODIFIED]: Changed heading from "Waiting for response..." to "Request Sent" */}
            <h2>Request Sent</h2>
            {/* [ADDED]: PersonCard for invited user — mirrors accepted state layout */}
            <div className="available-people" style={{ margin: '15px 0' }}>
              <PersonCard person={requestedPerson} />
            </div>
            {/* [ADDED]: Status indicators — mirrors accepted state's .ready-status layout */}
            <div className="ready-status">
              <div className="status-item">
                <div className="status-indicator">⏳</div>
                <span>You: Request sent</span>
              </div>
              {/* [ADDED]: .pending class enables pulse animation on this indicator */}
              <div className="status-item pending">
                <div className="status-indicator">⏳</div>
                <span>{requestedPerson.name}: Waiting for response...</span>
              </div>
            </div>
            <button className="btn btn-secondary" onClick={handleCancelRequest}>
              Cancel Request
            </button>
          </div>
        )}

        {viewState === 'accepted' && personResponse && requestedPerson && (
          <div className="card">
            <h2>
              {requestedPerson.name} accepted!
            </h2>
            <div className="response-message">
              <p>
                <strong>{requestedPerson.name} says:</strong> "{personResponse.message}"
              </p>
              <p>You've been matched! Take your time to get ready.</p>
            </div>
            <div className="ready-status">
              <div className="status-item">
                <div className="status-indicator">{yourReady ? '✅' : '⏳'}</div>
                <span>You: {yourReady ? 'Ready!' : 'Getting ready...'}</span>
              </div>
              <div className="status-item">
                <div className="status-indicator">{theirReady ? '✅' : '⏳'}</div>
                <span>{requestedPerson.name}: {theirReady ? 'Ready!' : 'Getting ready...'}</span>
              </div>
            </div>
            <div className="ready-actions">
              {!yourReady && (
                <button className="btn btn-primary" onClick={handleImReady}>
                  I'm Ready to Chat!
                </button>
              )}
              <button
                className={yourReady && theirReady ? 'btn btn-primary' : 'btn btn-affirmative'}
                disabled={!yourReady || !theirReady}
                onClick={handleGoToChat}
              >
                {yourReady && theirReady ? 'Start Chat - Both Ready!' : 'Start Chat'}
              </button>
            </div>
          </div>
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

      <footer className="page-footer">
        <p>
          <strong>Tip:</strong> Make sure you're physically in the room you select for the best matches!
        </p>
        <button className="btn btn-secondary" style={{ marginTop: 10 }} onClick={() => navigate('/')}>
          Back to Home
        </button>
      </footer>
    </div>
  );
}
