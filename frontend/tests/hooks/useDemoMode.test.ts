// useDemoMode.test.ts
// Description: Tests for useDemoMode hook — demo flag toggles simulation behavior

import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useDemoMode } from '@/hooks/useDemoMode';

describe('useDemoMode', () => {
  it('provides sample users by room name when enabled', () => {
    const { result } = renderHook(() => useDemoMode(true));
    const users = result.current.addSampleUsers('Main Hall');
    expect(users).toHaveLength(4);
    expect(users[0]?.name).toBe('Alex_Coder');
    expect(users[1]?.available).toBe(true);
  });

  it('returns empty array for unknown room', () => {
    const { result } = renderHook(() => useDemoMode(true));
    const users = result.current.addSampleUsers('Unknown Room');
    expect(users).toEqual([]);
  });

  it('returns simulated response for known person', () => {
    const { result } = renderHook(() => useDemoMode(true));
    const response = result.current.simulatePersonResponse('Dan_DevOps');
    expect(response?.accepted).toBe(true);
    expect(response?.message).toContain('DevOps');
  });

  it('returns default response for unknown person', () => {
    const { result } = renderHook(() => useDemoMode(true));
    const response = result.current.simulatePersonResponse('Unknown_Person');
    expect(response?.accepted).toBe(true);
    expect(response?.message).toBe("Sure! Let's chat!");
  });

  it('generates demo match IDs', () => {
    const { result } = renderHook(() => useDemoMode(true));
    const id = result.current.createDemoMatchId();
    expect(id.startsWith('demo_')).toBe(true);
    expect(id.length).toBe('demo_'.length + 8);
  });

  it('returns empty when demo is disabled', () => {
    const { result } = renderHook(() => useDemoMode(false));
    expect(result.current.isDemo).toBe(false);
    expect(result.current.addSampleUsers('Main Hall')).toEqual([]);
  });
});
