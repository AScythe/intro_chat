// ChatPage.tsx
// Description: Chat interface — timed conversation with prompts, timer, extend, and connection exchange

import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { fetchJSON } from '@/api/client';
import { useSocket } from '@/hooks/useSocket';
import { useUser } from '@/hooks/useUser';
import { useChatTimer } from '@/hooks/useTimer';
import { Timer } from '@/components/Timer';
import { PromptCard } from '@/components/PromptCard';
import { ConnectionCard } from '@/components/ConnectionCard';
import { CONFIG, FALLBACK_PROMPTS } from '@/config/constants';
import { formatTime } from '@/utils/format';

type ChatState = 'loading' | 'chatting' | 'timeUp' | 'extended' | 'connecting' | 'result';

export function ChatPage() {
  const { matchId } = useParams<{ matchId: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const socket = useSocket();

  const isDemo = matchId?.startsWith('demo_');
  const eventId = searchParams.get('event_id') || user?.eventId || '';
  const [state, setState] = useState<ChatState>('loading');
  const [partnerName, setPartnerName] = useState('');
  const [prompts, setPrompts] = useState<string[]>([]);
  const [currentPromptIndex, setCurrentPromptIndex] = useState(0);
  const [connectionResult, setConnectionResult] = useState<'exchanged' | 'declined' | null>(null);
  const [error, setError] = useState('');

  const timer = useChatTimer(CONFIG.CHAT_DURATION, {
    onComplete: () => setState('timeUp'),
  });

  useEffect(() => {
    if (!matchId) return;
    loadMatchInfo();
    loadPrompts();
    connectSocket();
  }, [matchId]);

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

  function loadMatchInfo() {
    if (isDemo) {
      setTimeout(() => {
        setPartnerName('Dan_DevOps');
        setState('chatting');
        timer.start();
      }, CONFIG.DEMO_LOADING_DELAY_MS);
      return;
    }
    fetchJSON<{ match_id: string; user2_username: string }>(`/api/matches/${matchId}`)
      .then((data) => {
        setPartnerName(data.user2_username);
        setState('chatting');
        timer.start();
      })
      .catch(() => {
        setError('Failed to load chat. Please refresh the page.');
      });
  }

  function loadPrompts() {
    fetchJSON<string[]>('/api/prompts')
      .then(setPrompts)
      .catch(() => setPrompts([...FALLBACK_PROMPTS]));
  }

  function connectSocket() {
    if (user && matchId) {
      socket.connect(user.userId);
    }
  }

  function handleNextPrompt() {
    setCurrentPromptIndex((prev) => (prev + 1) % prompts.length);
  }

  function handleExtend(seconds: number) {
    if (seconds === -1) {
      timer.clear();
      setState('extended');
    } else {
      timer.extend(seconds);
      setState('extended');
    }
  }

  function handleEndChat() {
    setState('connecting');
  }

  function handleConnectionPref(pref: boolean) {
    if (isDemo) {
      setTimeout(() => {
        if (pref) {
          setConnectionResult('exchanged');
        } else {
          setConnectionResult('declined');
        }
        setState('result');
      }, CONFIG.DEMO_CONNECTION_DELAY_MS);
      return;
    }
    if (!user || !matchId) return;
    fetchJSON<{ success: boolean }>(`/api/matches/${matchId}/connect`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_id: user.userId, wants_to_connect: pref }),
    }).catch(() => setError('Failed to process connection preference.'));
  }

  return (
    <div className="container">
      <header className="chat-header">
        <h1>Micro-Chat</h1>
        <div className="timer-container">
          <Timer timeLeft={timer.timeLeft} />
        </div>
      </header>

      <main className="main-content">
        {error && (
          <div className="card">
            <p style={{ color: 'red' }}>{error}</p>
            <button className="btn btn-primary" onClick={() => navigate('/')}>
              Back to Home
            </button>
          </div>
        )}

        {state === 'loading' && (
          <div className="card">
            <h2>Setting up your chat...</h2>
            <div className="waiting-animation">
              <div className="pulse-dot"></div>
              <p>Getting everything ready for your 2-minute conversation</p>
            </div>
          </div>
        )}

        {state === 'chatting' && partnerName && (
          <div className="card">
            <div className="chat-partner">
              <h2>
                Chatting with <span>{partnerName}</span>
              </h2>
              <p className="chat-instruction">
                Use the prompts below to guide your conversation
              </p>
            </div>

            <div className="prompts-container">
              <h3>Conversation Prompts</h3>
              <div className="prompts-scroll">
                {prompts.length > 0 && (
                  <PromptCard prompt={prompts[currentPromptIndex]!} />
                )}
              </div>
              <button className="btn btn-secondary" onClick={handleNextPrompt}>
                Next Prompt
              </button>
            </div>

            <div className="chat-timer-info">
              <p>
                <strong>2 minutes</strong> to connect and chat
              </p>
              <p>No pressure — just be yourself!</p>
            </div>
          </div>
        )}

        {state === 'timeUp' && (
          <div className="card">
            <h2>Time's Up!</h2>
            <div className="time-up-content">
              <p>Great chat! How would you like to continue?</p>
              <div className="conversation-options">
                <button
                  className="btn btn-primary"
                  onClick={() => handleExtend(CONFIG.CHAT_DURATION)}
                >
                  Extend for 2 more minutes
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => handleExtend(-1)}
                >
                  Continue indefinitely
                </button>
                <button className="btn btn-secondary" onClick={handleEndChat}>
                  End chat and connect
                </button>
              </div>
            </div>
          </div>
        )}

        {state === 'extended' && (
          <div className="card">
            <h2>Extended Chat</h2>
            <div className="extended-chat-content">
              <p>
                Chat extended! Enjoy your continued conversation with{' '}
                <span>{partnerName}</span>
              </p>
              <div className="extended-timer-info">
                <p id="extendedTimerText">
                  {timer.isRunning ? (
                    <>
                      <strong>{formatTime(timer.timeLeft)}</strong> remaining
                    </>
                  ) : (
                    <>
                      <strong>No time limit</strong> - chat as long as you want!
                    </>
                  )}
                </p>
              </div>
              <div className="extended-actions">
                <button className="btn btn-secondary" onClick={handleEndChat}>
                  End chat and connect
                </button>
              </div>
            </div>
          </div>
        )}

        {state === 'connecting' && (
          <ConnectionCard
            onYes={() => handleConnectionPref(true)}
            onNo={() => handleConnectionPref(false)}
          />
        )}

        {state === 'result' && (
          <div className="card">
            {connectionResult === 'exchanged' && (
              <>
                <h2>Connection Exchanged!</h2>
                <div className="connection-success">
                  <p>You both want to connect!</p>
                </div>
              </>
            )}
            {connectionResult === 'declined' && (
              <>
                <h2>Chat Complete</h2>
                <div className="connection-declined">
                  <p>
                    Thanks for the great chat! Your partner chose not to exchange
                    contact info, and that's perfectly okay.
                  </p>
                </div>
              </>
            )}
            <button
              className="btn btn-primary"
              onClick={() => {
                if (eventId) {
                  navigate(`/room/${eventId}`);
                } else {
                  navigate('/');
                }
              }}
            >
              Start New Chat
            </button>
          </div>
        )}
      </main>

      <footer className="page-footer">
        <p>
          <strong>Remember:</strong> This is a safe space. Be kind, be curious,
          and enjoy the conversation!
        </p>
        <button className="btn btn-secondary" style={{ marginTop: 10 }} onClick={() => navigate('/')}>
          Back to Home
        </button>
      </footer>
    </div>
  );
}
