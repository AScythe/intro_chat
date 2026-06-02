// UserInfoPage.tsx
// Description: Profile form — name, LinkedIn/Slack input, interest selection, save via API, navigate to room

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { fetchJSON } from '@/api/client';
import { useUser } from '@/hooks/useUser';
import { generateUsername } from '@/utils/random';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem } from '@/components/ui/command';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { JoinEventResponse, Topic } from '@/types/api';

export function UserInfoPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [name, setName] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [slackHandle, setSlackHandle] = useState('');
  const [saving, setSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [availableTopics, setAvailableTopics] = useState<Topic[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    if (!eventId) return;
    fetchJSON<Topic[]>(`/api/events/${eventId}/topics`)
      .then(setAvailableTopics)
      .catch(() => {});
  }, [eventId]);

  function toggleInterest(interest: string) {
    setSelectedInterests((prev) =>
      prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
    );
  }

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
          interests: selectedInterests,
        }),
      });
      setUser({
        userId: data.user_id,
        eventId,
        username: data.username,
        linkedinUrl: linkedinUrl || undefined,
        slackHandle: slackHandle || undefined,
      });
      setIsSaved(true);
      setSaving(false);
    } catch {
      toast.error('Failed to save profile. Please try again.');
      setSaving(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-screen max-w-app flex-col px-5 pb-8">
      <header className="mb-8 mt-6 text-center">
        <h1 className="font-heading text-4xl text-foreground">Your Profile</h1>
        <p className="mt-2 text-muted-foreground">
          Add your information so others can connect with you after chatting
        </p>
      </header>

      <main className="flex-1">
        <Card>
          <CardHeader>
            <CardTitle className="font-heading text-2xl">Connect Details</CardTitle>
            <CardDescription>
              These will be shared only when both you and your chat partner agree to connect.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="nameInput">Your Name</Label>
              <Input
                type="text"
                id="nameInput"
                placeholder="e.g. Alex"
                maxLength={50}
                value={name}
                onChange={(e) => { setName(e.target.value); setIsSaved(false); }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="linkedinInput">LinkedIn Profile URL</Label>
              <Input
                type="url"
                id="linkedinInput"
                placeholder="https://linkedin.com/in/yourname"
                value={linkedinUrl}
                onChange={(e) => { setLinkedinUrl(e.target.value); setIsSaved(false); }}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slackInput">Slack Handle</Label>
              <Input
                type="text"
                id="slackInput"
                placeholder="@username or email@company.slack.com"
                value={slackHandle}
                onChange={(e) => { setSlackHandle(e.target.value); setIsSaved(false); }}
              />
            </div>

            <div className="space-y-2">
              <Label>Interest</Label>
              <Popover open={popoverOpen} onOpenChange={setPopoverOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={popoverOpen}
                    className="w-full justify-between"
                  >
                    {selectedInterests.length > 0
                      ? `${selectedInterests.length} selected`
                      : 'Select interests...'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search interests..." />
                    <CommandList>
                      <CommandEmpty>No interests found.</CommandEmpty>
                      <CommandGroup>
                        {availableTopics.map((topic) => (
                          <CommandItem
                            key={topic.id}
                            value={topic.name}
                            onSelect={() => toggleInterest(topic.name)}
                          >
                            <Check
                              className={cn(
                                'mr-2 h-4 w-4',
                                selectedInterests.includes(topic.name) ? 'opacity-100' : 'opacity-0'
                              )}
                            />
                            {topic.name}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {selectedInterests.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {selectedInterests.map((interest) => (
                    <Badge
                      key={interest}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() => toggleInterest(interest)}
                    >
                      {interest} ✕
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            <p className="text-sm text-muted-foreground">
              Name is optional — leave blank for an anonymous username.
            </p>

            <div className="flex flex-col gap-3 pt-2">
              <Button onClick={handleSave} disabled={saving || isSaved}>
                {saving ? 'Saving...' : isSaved ? 'Profile saved! Select a room.' : 'Save Profile'}
              </Button>
              <Button
                variant="outline"
                disabled={!isSaved}
                onClick={() => eventId && navigate(`/room/${eventId}`)}
              >
                Select Room / Area
              </Button>
            </div>

          </CardContent>
        </Card>
      </main>

      <footer className="mt-6 text-center">
        <Button variant="outline" size="sm" className="mt-3" onClick={() => navigate('/')}>
          Back to Home
        </Button>
      </footer>
    </div>
  );
}
