// ConnectionCard.tsx
// Description: Post-chat connection card with yes/no buttons for Slack connection exchange

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface ConnectionCardProps {
  onYes: () => void;
  onNo: () => void;
}

export function ConnectionCard({ onYes, onNo }: ConnectionCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">💬 Connect</CardTitle>
      </CardHeader>
      <CardContent className="text-center space-y-4">
        <p>Would you like to exchange usernames to connect?</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button onClick={onYes}>Yes, let's connect!</Button>
          <Button variant="outline" onClick={onNo}>
            No thanks
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
