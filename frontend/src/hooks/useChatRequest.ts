// useChatRequest.ts
// Description: Hook managing chat request lifecycle — send request, wait for response, ready signaling

import { useState, useCallback } from 'react';
import { fetchJSON } from '@/api/client';
import { CONFIG } from '@/config/constants';
import type { UserData } from '@/types/api';
import type { RequestChatResponse } from '@/types/api';

interface PersonResponse {
  accepted: boolean;
  message: string;
  match_id?: string;
}

interface UseChatRequestOptions {
  userId: string;
  eventId: string;
  socket?: { subscribe: <T>(type: string, cb: (data: T) => void) => () => void };
}

export function useChatRequest(options: UseChatRequestOptions) {
  const [requestedPerson, setRequestedPerson] = useState<UserData | null>(null);
  const [personResponse, setPersonResponse] = useState<PersonResponse | null>(null);
  const [yourReady, setYourReady] = useState(false);
  const [theirReady, setTheirReady] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState('');

  const requestChat = useCallback(async (person: UserData) => {
    setRequestedPerson(person);
    setPersonResponse(null);
    setYourReady(false);
    setTheirReady(false);
    setError('');

    if (person.is_sample) {
      const resp = await fetchJSON<RequestChatResponse>(`/api/users/${options.userId}/request-chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_user_id: person.id }),
      });

      if (resp.accepted) {
        setPersonResponse({ accepted: true, message: 'Chat request accepted!', match_id: resp.match_id });
        setTimeout(() => setTheirReady(true), CONFIG.SIMULATE_READY_DELAY_MS);
      } else {
        setPersonResponse({ accepted: false, message: resp.message || 'declined' });
      }
    } else {
      setIsPending(true);
      try {
        const resp = await fetchJSON<RequestChatResponse>(`/api/users/${options.userId}/request-chat`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ target_user_id: person.id }),
        });

        if (resp.status === 'pending') {
          // Will receive match_found or chat_request_declined via WS
        }
      } catch {
        setError('Failed to send chat request');
        setIsPending(false);
      }
    }
  }, [options.userId, options.eventId]);

  const imReady = useCallback(() => setYourReady(true), []);
  const cancelRequest = useCallback(() => {
    setRequestedPerson(null);
    setPersonResponse(null);
    setYourReady(false);
    setTheirReady(false);
    setIsPending(false);
    setError('');
  }, []);

  return { requestedPerson, personResponse, yourReady, theirReady, isPending, error, requestChat, imReady, cancelRequest };
}
