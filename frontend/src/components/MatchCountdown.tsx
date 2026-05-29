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
    <Card>
      <CardHeader>
        <CardTitle className="text-center text-3xl">🎉 Match Found!</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p>
          You've been matched with <strong>{username}</strong>!
        </p>
        <p className="text-muted-foreground">
          Meet at <strong>{roomName}</strong> in 60 seconds
        </p>
        <div className="pt-4">
          <span className="text-5xl font-bold text-primary">
            {countdown}
          </span>
        </div>
      </CardContent>
      <CardFooter className="justify-center">
        <Button onClick={onGoToChat}>Go to Chat</Button>
      </CardFooter>
    </Card>
  );
}
