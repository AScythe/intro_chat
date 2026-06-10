// PeoplePage.tsx
// Description: Nearby people matching — person cards, request/accept flow, match countdown

import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSocket } from '@/hooks/useSocket';
import { fetchJSON } from '@/api/client';
import { useChatRequest } from '@/hooks/useChatRequest';
import { useUser } from '@/hooks/useUser';
import { MatchCountdown } from '@/components/MatchCountdown';
import { Button } from '@/components/ui/button';
import { CONFIG } from '@/config/constants';
import { NearbyUsersView, WaitingResponseView, AcceptedView, IncomingRequestView } from '@/components/PeoplePageViews';
import type { UserData } from '@/types/api';
import type { RoomUsersResponse, EventConfigResponse } from '@/types/api';
import { SAMPLE_USERS } from '@/utils/demoData';

export function PeoplePage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const socket = useSocket();
  const { user } = useUser();
  const userId = user?.userId || '';
  const { requestedPerson, personResponse, yourReady, theirReady, requestChat, imReady, cancelRequest } = useChatRequest({
    userId,
    eventId: eventId || '',
    socket,
  });

  const locationState = location.state as { roomName?: string } | null;
  const roomName = locationState?.roomName;

  const [nearbyUsers, setNearbyUsers] = useState<UserData[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<UserData | null>(null);
  const [viewState, setViewState] = useState<'showing' | 'waitingResponse' | 'accepted' | 'matchFound'>('showing');
  const [matchUsername, setMatchUsername] = useState('');
  const [matchId, setMatchId] = useState('');
  const [countdown, setCountdown] = useState<number>(CONFIG.MATCH_FOUND_COUNTDOWN);
  const [incomingRequest, setIncomingRequest] = useState<{ requester_id: string; requester_name: string; room_id: string } | null>(null);

  useEffect(() => {
    if (!roomName && eventId) {
      navigate(`/room/${eventId}`, { replace: true });
    }
  }, [roomName, eventId, navigate]);

  useEffect(() => {
    if (!roomName || !eventId) return;
    let cancelled = false;
    (async () => {
      try {
        const config = await fetchJSON<EventConfigResponse>(`/api/events/${eventId}/config`);
        const room = config.rooms.find((r) => r.name === roomName);
        if (!room) throw new Error('Room not found in config');
        const res = await fetchJSON<RoomUsersResponse>(`/api/events/${eventId}/rooms/${room.id}/users`);
        if (!cancelled) {
          setNearbyUsers(res.users);
        }
      } catch {
        if (!cancelled) {
          const fallback = (SAMPLE_USERS[roomName || ''] ?? []).map((u) => ({ ...u, id: u.id || '' }));
          setNearbyUsers(fallback);
        }
      }
    })();
    return () => { cancelled = true; };
  }, [roomName, eventId]);

  function handlePersonClick(person: UserData) {
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
    const mid = personResponse?.match_id || requestedPerson?.id || '';
    navigate(`/chat/${mid}?event_id=${eventId}`);
  }

  function handleCancelRequest() {
    cancelRequest();
    setViewState('showing');
    setSelectedPerson(null);
  }

  useEffect(() => {
    if (personResponse?.accepted) {
      setViewState('accepted');
    } else if (personResponse && !personResponse.accepted) {
      setViewState('showing');
      setSelectedPerson(null);
    }
  }, [personResponse]);

  function handleChangeRoom() {
    navigate(`/room/${eventId}`);
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

  useEffect(() => {
    const unsub = socket.subscribe<{ type: string; requester_id: string; requester_name: string; room_id: string }>(
      'chat_request',
      (data) => {
        setIncomingRequest(data);
      },
    );
    return unsub;
  }, [socket]);

  useEffect(() => {
    const unsub = socket.subscribe<Record<string, unknown>>(
      'chat_request_declined',
      () => {
        setViewState('showing');
        setSelectedPerson(null);
        cancelRequest();
      },
    );
    return unsub;
  }, [socket, cancelRequest]);

  async function handleAcceptIncomingRequest() {
    if (!incomingRequest || !userId) return;
    try {
      await fetchJSON<{ accepted: boolean; match_id: string }>(`/api/users/${userId}/accept-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requester_id: incomingRequest.requester_id }),
      });
    } catch {
      // Error handled by WS event
    }
    setIncomingRequest(null);
  }

  async function handleDeclineIncomingRequest() {
    if (!incomingRequest || !userId) return;
    try {
      await fetchJSON<{ accepted: boolean }>(`/api/users/${userId}/decline-request`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requester_id: incomingRequest.requester_id }),
      });
    } catch {
      // Error handled by WS event
    }
    setIncomingRequest(null);
  }

  if (!roomName) {
    return null;
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-app flex-col px-5 pb-8">
      <header className="mb-8 mt-6 text-center">
        <div className="mb-2 text-left">
          <Button variant="link" className="p-0" onClick={() => navigate(`/room/${eventId}`)}>
            ← Back to Room
          </Button>
        </div>
        <h1 className="font-heading text-4xl text-foreground">Find Chat Partners</h1>
        <p className="mt-2 text-muted-foreground">
          See who's nearby and request a chat
        </p>
      </header>

      <main className="flex-1 space-y-5">
        {incomingRequest && (
          <IncomingRequestView
            requesterName={incomingRequest.requester_name}
            requesterId={incomingRequest.requester_id}
            onAccept={handleAcceptIncomingRequest}
            onDecline={handleDeclineIncomingRequest}
          />
        )}

        {viewState === 'showing' && !incomingRequest && (
          <NearbyUsersView
            roomName={roomName}
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
            roomName={roomName}
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
