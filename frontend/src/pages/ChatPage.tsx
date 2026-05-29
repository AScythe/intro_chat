// ChatPage.tsx
// Description: Chat interface — timed conversation with prompts, timer, and extend options

import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { fetchJSON } from '@/api/client';
import { useSocket } from '@/hooks/useSocket';
import { useUser } from '@/hooks/useUser';
import { useChatTimer } from '@/hooks/useTimer';
import { Timer } from '@/components/Timer';
import { PromptCard } from '@/components/PromptCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CONFIG } from '@/config/constants';
import { formatTime, formatDuration } from '@/utils/format';

const FALLBACK_PROMPTS = [
  "What's one thing you're excited about this weekend?",
  "What's your favorite snack at hackathons?",
  "If you could steal one skill from another hacker, what would it be?",
  "What's your favorite debugging story?",
  "What's the most interesting project you've worked on recently?",
];

type ChatState = 'loading' | 'chatting' | 'timeUp' | 'extended';

interface ErrorViewProps {
  error: string;
  onBack: () => void;
}

function ErrorView({ error, onBack }: ErrorViewProps) {
  return (
    <Card>
      <CardContent className="space-y-4 pt-6">
        <p className="text-destructive">{error}</p>
        <Button variant="outline" onClick={onBack}>
          Back to Home
        </Button>
      </CardContent>
    </Card>
  );
}

interface ChatLoadingViewProps {
  durationLabel: string;
}

function ChatLoadingView({ durationLabel }: ChatLoadingViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-2xl">Setting up your chat...</CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <div className="mx-auto mb-6 h-16 w-16 animate-pulse rounded-full bg-primary/20" />
        <p className="text-muted-foreground">Getting everything ready for your {durationLabel} conversation</p>
      </CardContent>
    </Card>
  );
}

interface ChattingViewProps {
  partnerName: string;
  prompts: string[];
  currentPromptIndex: number;
  onNextPrompt: () => void;
}

function ChattingView({ partnerName, prompts, currentPromptIndex, onNextPrompt }: ChattingViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center font-heading text-2xl">
          Chatting with <span className="text-primary">{partnerName}</span>
        </CardTitle>
        <p className="text-center text-sm text-muted-foreground">
          Use the prompts below to guide your conversation
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        <div>
          <h3 className="mb-4 text-center text-lg font-semibold text-foreground">Conversation Prompts</h3>
          <div className="max-h-[200px] overflow-y-auto rounded-xl border-2 bg-muted p-5">
            {prompts.length > 0 && (
              <PromptCard prompt={prompts[currentPromptIndex]!} />
            )}
          </div>
          <div className="mt-4 flex justify-center">
            <Button variant="outline" onClick={onNextPrompt}>
              Next Prompt
            </Button>
          </div>
        </div>

        <div className="rounded-xl bg-muted p-5 text-center">
          <p className="text-foreground">
            <span className="font-semibold">{formatDuration(CONFIG.CHAT_DURATION)}</span> to connect and chat
          </p>
          <p className="mt-1 text-sm text-muted-foreground">No pressure — just be yourself!</p>
        </div>
      </CardContent>
    </Card>
  );
}

interface TimeUpViewProps {
  onExtend: (seconds: number) => void;
  onEndChat: () => void;
}

function TimeUpView({ onExtend, onEndChat }: TimeUpViewProps) {
  return (
    <Card className="text-center">
      <CardHeader>
        <CardTitle className="font-heading text-3xl">Time's Up!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-foreground">Great chat! How would you like to continue?</p>
        <div className="flex flex-wrap justify-center gap-3">
          <Button onClick={() => onExtend(CONFIG.CHAT_DURATION)}>
            Extend for {formatDuration(CONFIG.CHAT_DURATION)}
          </Button>
          <Button variant="outline" onClick={() => onExtend(-1)}>
            Continue indefinitely
          </Button>
          <Button variant="secondary" onClick={onEndChat}>
            End chat and connect
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface ExtendedViewProps {
  partnerName: string;
  timeLeft: number;
  isRunning: boolean;
  onEndChat: () => void;
}

function ExtendedView({ partnerName, timeLeft, isRunning, onEndChat }: ExtendedViewProps) {
  return (
    <Card className="text-center">
      <CardHeader>
        <CardTitle className="font-heading text-2xl">Extended Chat</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <p className="text-foreground">
          Enjoy your continued conversation with <span className="font-semibold text-primary">{partnerName}</span>
        </p>
        <div className="rounded-xl bg-muted p-5">
          <p id="extendedTimerText" className="text-foreground">
            {isRunning ? (
              <>
                <span className="font-semibold">{formatTime(timeLeft)}</span> remaining
              </>
            ) : (
              <>
                <span className="font-semibold">No time limit</span> — chat as long as you want!
              </>
            )}
          </p>
        </div>
        <Button variant="outline" onClick={onEndChat}>
          End chat and connect
        </Button>
      </CardContent>
    </Card>
  );
}

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
