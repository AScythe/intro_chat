// UserInfoPage.tsx
// Description: Profile form — name, LinkedIn/Slack input, save via API, navigate to room

import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchJSON } from '@/api/client';
import { useUser } from '@/hooks/useUser';
import { generateUsername } from '@/utils/random';
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
    <div className="container">
      <header className="page-header">
        <h1>Your Profile</h1>
        <p>Add your information so others can connect with you after chatting</p>
      </header>

      <main className="main-content">
        <div className="card">
          <h2>Connect Details</h2>
          <p className="card-description">
            These will be shared only when both you and your chat partner agree to connect.
          </p>

          <div className="profile-form">
            <div className="input-group" style={{ marginBottom: 15 }}>
              <label style={{ display: 'block', marginBottom: 5, fontWeight: 500, color: '#4a5568' }}>
                Your Name
              </label>
              <input
                type="text"
                id="nameInput"
                placeholder="e.g. Alex"
                maxLength={50}
                style={{ width: '100%' }}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="input-group" style={{ marginBottom: 15 }}>
              <label style={{ display: 'block', marginBottom: 5, fontWeight: 500, color: '#4a5568' }}>
                LinkedIn Profile URL
              </label>
              <input
                type="url"
                id="linkedinInput"
                placeholder="https://linkedin.com/in/yourname"
                style={{ width: '100%' }}
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
              />
            </div>

            <div className="input-group" style={{ marginBottom: 15 }}>
              <label style={{ display: 'block', marginBottom: 5, fontWeight: 500, color: '#4a5568' }}>
                Slack Handle
              </label>
              <input
                type="text"
                id="slackInput"
                placeholder="@username or email@company.slack.com"
                style={{ width: '100%' }}
                value={slackHandle}
                onChange={(e) => setSlackHandle(e.target.value)}
              />
            </div>

            <p className="card-description" style={{ fontSize: '0.9rem', color: '#718096', margin: '10px 0 20px 0' }}>
              Name is optional — leave blank for an anonymous username. LinkedIn and Slack are optional too.
            </p>

            <div className="form-actions" style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? 'Saving...' : 'Save Profile'}
              </button>
              <button
                className="btn btn-affirmative"
                disabled={!saved}
                onClick={() => eventId && navigate(`/room/${eventId}`)}
              >
                Select Room / Area
              </button>
            </div>

            {saved && (
              <div
                style={{
                  marginTop: 15,
                  padding: 10,
                  background: '#f0fff4',
                  border: '1px solid #c6f6d5',
                  borderRadius: 8,
                  textAlign: 'center',
                  color: '#276749',
                }}
              >
                Profile saved! You can now select a room.
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="page-footer">
        <p>
          <strong>Privacy:</strong> Your info is only shared when you opt in after a chat.
        </p>
        <button className="btn btn-secondary" style={{ marginTop: 10 }} onClick={() => navigate('/')}>
          Back to Home
        </button>
      </footer>
    </div>
  );
}
