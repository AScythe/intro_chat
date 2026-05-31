// ChatPageViews.tsx
// Description: Sub-views for ChatPage — error, loading, chatting, time-up, and extended chat states

import { PromptCard } from '@/components/PromptCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatTime, formatDuration } from '@/utils/format';
import { CONFIG } from '@/config/constants';

interface ErrorViewProps {
  error: string;
  onBack: () => void;
}

export function ErrorView({ error, onBack }: ErrorViewProps) {
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

export function ChatLoadingView({ durationLabel }: ChatLoadingViewProps) {
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

export function ChattingView({ partnerName, prompts, currentPromptIndex, onNextPrompt }: ChattingViewProps) {
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

export function TimeUpView({ onExtend, onEndChat }: TimeUpViewProps) {
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
          <Button onClick={() => onExtend(-1)}>
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

export function ExtendedView({ partnerName, timeLeft, isRunning, onEndChat }: ExtendedViewProps) {
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
