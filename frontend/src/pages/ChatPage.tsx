// ChatPage.tsx
// Description: Chat interface — timed conversation with prompts, timer, and extend options

import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { fetchJSON } from '@/api/client';
import { useSocket } from '@/hooks/useSocket';
import { useUser } from '@/hooks/useUser';
import { useChatTimer } from '@/hooks/useTimer';
import { Timer } from '@/components/Timer';
import { Button } from '@/components/ui/button';
import { CONFIG } from '@/config/constants';
import { formatDuration } from '@/utils/format';
import { ErrorView, ChatLoadingView, ChattingView, TimeUpView, ExtendedView } from '@/components/ChatPageViews';

const FALLBACK_PROMPTS = [
  "What's one thing you're excited about this weekend?",
  "What's your favorite snack at hackathons?",
  "If you could steal one skill from another hacker, what would it be?",
  "What's your favorite debugging story?",
  "What's the most interesting project you've worked on recently?",
];

type ChatState = 'loading' | 'chatting' | 'timeUp' | 'extended';

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

  function loadMatchInfo() {
    if (isDemo) {
      setTimeout(() => {
        setPartnerName(searchParams.get('partner') || 'Dan_DevOps');
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
    timer.extend(seconds);
    setState('extended');
  }

  function handleEndChat() {
    navigate(`/connect/${matchId}?event_id=${eventId}`);
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-app flex-col px-5 pb-8">
      <header className="mb-6 mt-6 flex items-center justify-between">
        <h1 className="font-heading text-3xl text-foreground">Micro-Chat</h1>
        <Timer timeLeft={timer.timeLeft} />
      </header>

      <main className="flex-1 space-y-5">
        {error && (
          <ErrorView error={error} onBack={() => navigate('/')} />
        )}

        {state === 'loading' && !error && (
          <ChatLoadingView durationLabel={formatDuration(CONFIG.CHAT_DURATION)} />
        )}

        {state === 'chatting' && partnerName && !error && (
          <ChattingView
            partnerName={partnerName}
            prompts={prompts}
            currentPromptIndex={currentPromptIndex}
            onNextPrompt={handleNextPrompt}
          />
        )}

        {state === 'timeUp' && !error && (
          <TimeUpView
            onExtend={handleExtend}
            onEndChat={handleEndChat}
          />
        )}

        {state === 'extended' && !error && (
          <ExtendedView
            partnerName={partnerName}
            timeLeft={timer.timeLeft}
            isRunning={timer.isRunning}
            onEndChat={handleEndChat}
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
