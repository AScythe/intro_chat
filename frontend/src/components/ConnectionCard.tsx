// ConnectionCard.tsx
// Description: Post-chat connection card with yes/no buttons for Slack connection exchange

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ConnectionCardProps {
  onYes: () => void;
  onNo: () => void;
  disabled?: boolean;
}

export function ConnectionCard({ onYes, onNo, disabled }: ConnectionCardProps) {
  return (
    <Card className="text-center">
      <CardHeader>
        <CardTitle className="font-heading text-2xl">Connect</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-2xl">
          💬
        </div>
        <p className="text-foreground">Would you like to exchange usernames to connect?</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button onClick={onYes} disabled={disabled}>Yes, let's connect!</Button>
          <Button variant="outline" onClick={onNo} disabled={disabled}>
            No thanks
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
