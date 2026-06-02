// useDemoSimulation.ts [CLEANUP]
// Description: Hook providing demo/simulation logic gated by VITE_ENABLE_DEMO feature flag
// Replaces useDemoMode.ts — renamed to reflect full scope (5 methods, not just toggle)

import { useMemo } from 'react';
import { generateRandomString } from '@/utils/random';
import { CONFIG } from '@/config/constants';
import type { SampleUserData } from '@/types/api';
import { SAMPLE_USERS, RESPONSES } from '@/utils/demoData';

export function useDemoSimulation(enabled?: boolean) {
  return useMemo(() => {
    const isEnabled = enabled ?? false;

    return {
      isDemo: isEnabled,

      addSampleUsers(roomName: string): SampleUserData[] {
        if (!isEnabled) return [];
        return SAMPLE_USERS[roomName] ?? [];
      },

      simulatePersonResponse(personName: string): { accepted: boolean; message: string } | null {
        if (!isEnabled) return null;
        return RESPONSES[personName] ?? { accepted: true, message: "Sure! Let's chat!" };
      },

      simulateDelay(ms: number = CONFIG.DEMO_LOADING_DELAY_MS): Promise<void> {
        if (!isEnabled) return Promise.resolve();
        return new Promise((resolve) => setTimeout(resolve, ms));
      },

      createDemoMatchId(): string {
        return 'demo_' + generateRandomString(8);
      },
    };
  }, []);
}
