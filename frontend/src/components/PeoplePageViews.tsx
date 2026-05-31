// PeoplePageViews.tsx
// Description: Sub-views for PeoplePage — nearby users list, waiting response, accepted match

import { PersonCard } from '@/components/PersonCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { SamplePerson } from '@/utils/demoData';

export interface PersonResponse {
  accepted: boolean;
  message: string;
}

interface NearbyUsersViewProps {
  roomName: string;
  nearbyUsers: SamplePerson[];
  selectedPerson: SamplePerson | null;
  onPersonClick: (person: SamplePerson) => void;
  onRequestChat: () => void;
  onChangeRoom: () => void;
}

export function NearbyUsersView({ roomName, nearbyUsers, selectedPerson, onPersonClick, onRequestChat, onChangeRoom }: NearbyUsersViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-2xl">
          {roomName}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-xl bg-muted p-5">
          <h3 className="mb-4 text-lg font-semibold text-foreground">Nearby Users</h3>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-3">
            {nearbyUsers.map((person) => (
              <PersonCard
                key={person.name}
                person={person}
                selected={selectedPerson?.name === person.name}
                onClick={() => onPersonClick(person)}
              />
            ))}
          </div>
          <p className="mt-4 text-center text-sm text-muted-foreground">
            <span className="font-medium">{nearbyUsers.filter((u) => u.available).length} available</span> out of{' '}
            {nearbyUsers.length} people
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button
            disabled={!selectedPerson}
            onClick={onRequestChat}
          >
            Request 2-min chat with {selectedPerson?.name || 'selected person'}
          </Button>
          <Button variant="outline" onClick={onChangeRoom}>
            Change Room
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

interface WaitingResponseViewProps {
  requestedPerson: SamplePerson;
  onCancel: () => void;
}

export function WaitingResponseView({ requestedPerson, onCancel }: WaitingResponseViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-2xl">Request Sent</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="max-w-sm">
          <PersonCard person={requestedPerson} />
        </div>
        <div className="space-y-3 rounded-xl border bg-muted p-5">
          <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-lg">⏳</span>
            <span className="text-sm text-foreground">You: Request sent</span>
          </div>
          <div className="flex animate-pulse items-center gap-3 rounded-lg border bg-card p-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-lg">⏳</span>
            <span className="text-sm text-foreground">{requestedPerson.name}: Waiting for response...</span>
          </div>
        </div>
        <Button variant="outline" onClick={onCancel}>
          Cancel Request
        </Button>
      </CardContent>
    </Card>
  );
}

interface AcceptedViewProps {
  requestedPerson: SamplePerson;
  personResponse: PersonResponse;
  yourReady: boolean;
  theirReady: boolean;
  onImReady: () => void;
  onGoToChat: () => void;
}

export function AcceptedView({ requestedPerson, personResponse, yourReady, theirReady, onImReady, onGoToChat }: AcceptedViewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-heading text-2xl">
          {requestedPerson.name} accepted!
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="rounded-xl border-l-4 border-primary bg-muted p-5">
          <p className="text-sm text-foreground">
            <span className="font-semibold">{requestedPerson.name} says:</span> "{personResponse.message}"
          </p>
          <p className="mt-3 font-medium text-foreground">You've been matched! Take your time to get ready.</p>
        </div>

        <div className="space-y-3 rounded-xl border bg-muted p-5">
          <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-lg">
              {yourReady ? '✅' : '⏳'}
            </span>
            <span className="text-sm text-foreground">You: {yourReady ? 'Ready!' : 'Getting ready...'}</span>
          </div>
          <div className="flex items-center gap-3 rounded-lg border bg-card p-3">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-lg">
              {theirReady ? '✅' : '⏳'}
            </span>
            <span className="text-sm text-foreground">{requestedPerson.name}: {theirReady ? 'Ready!' : 'Getting ready...'}</span>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-4">
          {!yourReady && (
            <Button onClick={onImReady}>
              I'm Ready to Chat!
            </Button>
          )}
          <Button
            variant={yourReady && theirReady ? 'default' : 'outline'}
            disabled={!yourReady || !theirReady}
            onClick={onGoToChat}
          >
            {yourReady && theirReady ? 'Start Chat - Both Ready!' : 'Start Chat'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
