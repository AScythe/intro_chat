import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChatRequest } from '@/hooks/useChatRequest';
import { CONFIG } from '@/config/constants';
import type { SampleUserData } from '@/types/api';

const alice: SampleUserData = { name: 'Alice', available: true, status: 'Ready' };
const bob: SampleUserData = { name: 'Bob', available: false, status: 'Busy' };

describe('useChatRequest', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useChatRequest());
    expect(result.current.requestedPerson).toBeNull();
    expect(result.current.personResponse).toBeNull();
    expect(result.current.yourReady).toBe(false);
    expect(result.current.theirReady).toBe(false);
  });

  it('sets requested person on requestChat', () => {
    const { result } = renderHook(() => useChatRequest());
    act(() => {
      result.current.requestChat(alice);
    });
    expect(result.current.requestedPerson).toEqual(alice);
  });

  it('resets state when requesting a different person', () => {
    const { result } = renderHook(() => useChatRequest());
    act(() => {
      result.current.requestChat(alice);
    });
    expect(result.current.requestedPerson).toEqual(alice);
    act(() => {
      result.current.requestChat(bob);
    });
    expect(result.current.requestedPerson).toEqual(bob);
  });

  it('marks yourReady on imReady', () => {
    const { result } = renderHook(() => useChatRequest());
    act(() => {
      result.current.imReady();
    });
    expect(result.current.yourReady).toBe(true);
  });

  it('resets state on cancelRequest', () => {
    const { result } = renderHook(() => useChatRequest());
    act(() => {
      result.current.requestChat(alice);
    });
    expect(result.current.requestedPerson).toEqual(alice);
    act(() => {
      result.current.cancelRequest();
    });
    expect(result.current.requestedPerson).toBeNull();
    expect(result.current.personResponse).toBeNull();
    expect(result.current.yourReady).toBe(false);
    expect(result.current.theirReady).toBe(false);
  });

  it('receives person response after delay', async () => {
    const { result } = renderHook(() => useChatRequest());
    act(() => {
      result.current.requestChat(alice);
    });
    expect(result.current.personResponse).toBeNull();
    await act(async () => {
      vi.advanceTimersByTime(100);
    });
    await act(async () => {
      vi.advanceTimersByTime(CONFIG.SIMULATE_RESPONSE_DELAY_MS);
    });
    expect(result.current.personResponse).not.toBeNull();
    expect(result.current.personResponse?.accepted).toBe(true);
  });

  it('sets theirReady after simulate ready delay', async () => {
    const { result } = renderHook(() => useChatRequest());
    act(() => {
      result.current.requestChat(alice);
    });
    // Outer setTimeout (100ms) → simulateDelay starts
    await act(async () => {
      vi.advanceTimersByTime(100);
    });
    // simulateDelay resolves → personResponse set, theirReady setTimeout starts
    await act(async () => {
      vi.advanceTimersByTime(CONFIG.SIMULATE_RESPONSE_DELAY_MS);
    });
    // theirReady setTimeout fires
    await act(async () => {
      vi.advanceTimersByTime(CONFIG.SIMULATE_READY_DELAY_MS);
    });
    expect(result.current.theirReady).toBe(true);
  });
});
