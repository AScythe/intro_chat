// MatchCountdown.tsx
// Description: 60-second countdown display shown after a match is found before navigating to chat

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface MatchCountdownProps {
  username: string;
  roomName: string;
  countdown: number;
  onGoToChat: () => void;
}

export function MatchCountdown({
  username,
  roomName,
  countdown,
  onGoToChat,
}: MatchCountdownProps) {
  return (
    <Card className="text-center">
      <CardHeader>
        <CardTitle className="font-heading text-3xl">Match Found!</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-3xl">
          🎉
        </div>
        <p className="text-foreground">
          You've been matched with <span className="font-semibold">{username}</span>!
        </p>
        <p className="text-muted-foreground">
          Meet at <span className="font-medium text-foreground">{roomName}</span>
        </p>
        <div className="pt-2">
          <div className="inline-flex h-20 w-20 items-center justify-center rounded-full border-2 border-primary/30 bg-primary/5">
            <span className="text-4xl font-bold text-primary">
              {countdown}
            </span>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">seconds</p>
        </div>
      </CardContent>
      <CardFooter className="justify-center pb-6">
        <Button onClick={onGoToChat}>Go to Chat</Button>
      </CardFooter>
    </Card>
  );
}
