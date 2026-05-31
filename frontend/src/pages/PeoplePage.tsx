// PeoplePage.tsx
// Description: Nearby people matching — person cards, request/accept flow, match countdown

import { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useSocket } from '@/hooks/useSocket';
import { useDemoMode } from '@/hooks/useDemoMode';
import { useChatRequest } from '@/hooks/useChatRequest';
import { MatchCountdown } from '@/components/MatchCountdown';
import { Button } from '@/components/ui/button';
import { CONFIG } from '@/config/constants';
import { NearbyUsersView, WaitingResponseView, AcceptedView } from '@/components/PeoplePageViews';
import type { SamplePerson } from '@/utils/demoData';

export function PeoplePage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const socket = useSocket();
  const demo = useDemoMode(true);
  const { requestedPerson, personResponse, yourReady, theirReady, requestChat, imReady, cancelRequest } = useChatRequest();

  const locationState = location.state as { roomName?: string } | null;
  const roomName = locationState?.roomName;

  const [nearbyUsers, setNearbyUsers] = useState<SamplePerson[]>([]);
  const [selectedPerson, setSelectedPerson] = useState<SamplePerson | null>(null);
  const [viewState, setViewState] = useState<'showing' | 'waitingResponse' | 'accepted' | 'matchFound'>('showing');
  const [matchUsername, setMatchUsername] = useState('');
  const [matchId, setMatchId] = useState('');
  const [countdown, setCountdown] = useState<number>(CONFIG.MATCH_FOUND_COUNTDOWN);

  useEffect(() => {
    if (!roomName && eventId) {
      navigate(`/room/${eventId}`, { replace: true });
    }
  }, [roomName, eventId, navigate]);

  useEffect(() => {
    if (!roomName) return;
    const users = demo.addSampleUsers(roomName);
    setNearbyUsers(users);
  }, [roomName, demo]);

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
    navigate(`/chat/${mid}?event_id=${eventId}&partner=${encodeURIComponent(requestedPerson?.name ?? '')}`);
  }

  function handleCancelRequest() {
    cancelRequest();
    setViewState('showing');
    setSelectedPerson(null);
  }

  useEffect(() => {
    if (personResponse) {
      setViewState('accepted');
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
        {viewState === 'showing' && (
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
