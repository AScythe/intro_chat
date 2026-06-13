// ConnectPage.tsx
// Description: Post-chat connection exchange — ConnectionCard with yes/no, result view, and WS subscriptions

import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { fetchJSON } from '@/api/client';
import { useSocket } from '@/hooks/useSocket';
import { useUser } from '@/hooks/useUser';
import { ConnectionCard } from '@/components/ConnectionCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface ResultViewProps {
  connectionResult: 'exchanged' | 'declined' | null;
  onStartNewChat: () => void;
}

function ResultView({ connectionResult, onStartNewChat }: ResultViewProps) {
  return (
    <Card className="text-center">
      <CardContent className="space-y-5 pt-8">
        {connectionResult === 'exchanged' && (
          <>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl">
              🎉
            </div>
            <h2 className="font-heading text-2xl text-foreground">Connection Exchanged!</h2>
            <p className="text-muted-foreground">You both want to connect!</p>
          </>
        )}
        {connectionResult === 'declined' && (
          <>
            <h2 className="font-heading text-2xl text-foreground">Chat Complete</h2>
            <p className="text-muted-foreground">
              Thanks for the great chat! Your partner chose not to exchange
              contact info, and that's perfectly okay.
            </p>
          </>
        )}
        <Button onClick={onStartNewChat}>
          Start New Chat
        </Button>
      </CardContent>
    </Card>
  );
}

export function ConnectPage() {
  const { matchId } = useParams<{ matchId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const socket = useSocket();

  const eventId = searchParams.get('event_id') || user?.eventId || '';
  const [state, setState] = useState<'connecting' | 'result'>('connecting');
  const [connectionResult, setConnectionResult] = useState<'exchanged' | 'declined' | null>(null);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (user?.userId) {
      socket.connect(user.userId);
    }
  }, [user?.userId]);

  useEffect(() => {
    const unsub = socket.subscribe<{ type: string; user1_username: string; user2_username: string }>(
      'connection_exchanged',
      () => {
        setConnectionResult('exchanged');
        setState('result');
      },
    );
    return unsub;
  }, [socket]);

  useEffect(() => {
    const unsub = socket.subscribe<{ type: string }>(
      'connection_declined',
      () => {
        setConnectionResult('declined');
        setState('result');
      },
    );
    return unsub;
  }, [socket]);

  function handleConnectionPref(pref: boolean) {
    if (!user || !matchId || submitted) return;
    setSubmitted(true);
    fetchJSON<{ success: boolean; both_voted?: boolean; exchanged?: boolean }>(
      `/api/matches/${matchId}/connect`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.userId, wants_to_connect: pref }),
      },
    )
      .then((data) => {
        if (data.both_voted) {
          setConnectionResult(data.exchanged ? 'exchanged' : 'declined');
          setState('result');
        }
      })
      .catch(() => {
        setSubmitted(false);
        setError('Failed to process connection preference.');
      });
  }

  function handleStartNewChat() {
    if (eventId) {
      navigate(`/room/${eventId}`);
    } else {
      navigate('/');
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-app flex-col px-5 pb-8">
      <header className="mb-6 mt-6 flex items-center justify-between">
        <h1 className="font-heading text-3xl text-foreground">Connect</h1>
      </header>

      <main className="flex-1 space-y-5">
        {error && (
          <Card>
            <CardContent className="space-y-4 pt-6">
              <p className="text-destructive">{error}</p>
              <Button variant="outline" onClick={() => navigate('/')}>
                Back to Home
              </Button>
            </CardContent>
          </Card>
        )}

        {!error && state === 'connecting' && (
          <ConnectionCard
            onYes={() => handleConnectionPref(true)}
            onNo={() => handleConnectionPref(false)}
            disabled={submitted}
          />
        )}

        {!error && state === 'connecting' && submitted && (
          <p className="text-center text-muted-foreground">Waiting for partner...</p>
        )}

        {!error && state === 'result' && (
          <ResultView
            connectionResult={connectionResult}
            onStartNewChat={handleStartNewChat}
          />
        )}
      </main>

      <footer className="mt-6 text-center">
        <p className="text-xs text-muted-foreground">
          This is a safe space. Be kind, be curious, and enjoy the conversation!
        </p>
        <Button variant="outline" size="sm" className="mt-3" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </footer>
    </div>
  );
}
