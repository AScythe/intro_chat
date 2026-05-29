// useChatRequest.ts
// Description: Hook managing chat request lifecycle — send request, wait for response, ready signaling

import { useState, useCallback } from 'react';
import { useDemoMode } from '@/hooks/useDemoMode';
import { CONFIG } from '@/config/constants';
import type { SamplePerson } from '@/utils/demoData';

interface PersonResponse {
  accepted: boolean;
  message: string;
}

export function useChatRequest() {
  const demo = useDemoMode(true);
  const [requestedPerson, setRequestedPerson] = useState<SamplePerson | null>(null);
  const [personResponse, setPersonResponse] = useState<PersonResponse | null>(null);
  const [yourReady, setYourReady] = useState(false);
  const [theirReady, setTheirReady] = useState(false);

  const requestChat = useCallback((person: SamplePerson) => {
    setRequestedPerson(person);
    setPersonResponse(null);
    setYourReady(false);
    setTheirReady(false);

    setTimeout(async () => {
      await demo.simulateDelay(CONFIG.SIMULATE_RESPONSE_DELAY_MS);
      const response = demo.simulatePersonResponse(person.name);
      if (response) {
        setPersonResponse(response);
        setTimeout(() => {
          setTheirReady(true);
        }, CONFIG.SIMULATE_READY_DELAY_MS);
      }
    }, 100);
  }, [demo]);

  const imReady = useCallback(() => {
    setYourReady(true);
  }, []);

  const cancelRequest = useCallback(() => {
    setRequestedPerson(null);
    setPersonResponse(null);
    setYourReady(false);
    setTheirReady(false);
  }, []);

  return {
    requestedPerson,
    personResponse,
    yourReady,
    theirReady,
    requestChat,
    imReady,
    cancelRequest,
  };
}
