// UserInfoPage.tsx
// Description: Profile form — name, LinkedIn/Slack input, save via API, navigate to room

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchJSON } from '@/api/client';
import { useUser } from '@/hooks/useUser';
import { generateUsername } from '@/utils/random';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import type { JoinEventResponse } from '@/types/api';

export function UserInfoPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [name, setName] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [slackHandle, setSlackHandle] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    if (!eventId) return;
    setSaving(true);
    try {
      const username = name.trim() || generateUsername();
      const data = await fetchJSON<JoinEventResponse>(`/api/events/${eventId}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          linkedin_url: linkedinUrl,
          slack_handle: slackHandle,
        }),
      });
      setUser({
        userId: data.user_id,
        eventId,
        username: data.username,
        linkedinUrl: linkedinUrl || undefined,
        slackHandle: slackHandle || undefined,
      });
      setSaved(true);
    } catch {
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-app flex-col px-5 py-5">
      <header className="mb-8 text-center text-foreground">
        <h1 className="mb-2 text-4xl font-semibold drop-shadow-sm">Your Profile</h1>
        <p className="text-base text-foreground/90">
          Add your information so others can connect with you after chatting
        </p>
      </header>

      <main className="flex-1">
        <Card>
          <CardHeader>
            <CardTitle>Connect Details</CardTitle>
            <CardDescription>
              These will be shared only when both you and your chat partner agree to connect.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="nameInput">Your Name</Label>
              <Input
                type="text"
                id="nameInput"
                placeholder="e.g. Alex"
                maxLength={50}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedinInput">LinkedIn Profile URL</Label>
              <Input
                type="url"
                id="linkedinInput"
                placeholder="https://linkedin.com/in/yourname"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slackInput">Slack Handle</Label>
              <Input
                type="text"
                id="slackInput"
                placeholder="@username or email@company.slack.com"
                value={slackHandle}
                onChange={(e) => setSlackHandle(e.target.value)}
              />
            </div>

            <p className="text-sm text-muted-foreground">
              Name is optional — leave blank for an anonymous username. LinkedIn and Slack are optional too.
            </p>

            <div className="flex flex-col gap-3 pt-2">
              <Button onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Profile'}
              </Button>
              <Button
                variant="outline"
                disabled={!saved}
                onClick={() => eventId && navigate(`/room/${eventId}`)}
              >
                Select Room / Area
              </Button>
            </div>

            {saved && (
              <div className="rounded-[8px] border border-sage/30 bg-sage/10 p-3 text-center text-sm text-sage">
                Profile saved! You can now select a room.
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      <footer className="mt-auto pt-5 text-center text-sm text-foreground/80">
        <p>
          <strong>Privacy:</strong> Your info is only shared when you opt in after a chat.
        </p>
        <Button variant="outline" size="sm" className="mt-2" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </footer>
    </div>
  );
}
