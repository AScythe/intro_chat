import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChatRequest } from '@/hooks/useChatRequest';
import { fetchJSON } from '@/api/client';
import type { UserData } from '@/types/api';

vi.mock('@/api/client', () => ({
  fetchJSON: vi.fn(),
}));

const alice: UserData = { name: 'Alice', available: true, status: 'Ready', is_sample: true, id: 'user_alice' };
const bob: UserData = { name: 'Bob', available: false, status: 'Busy', is_sample: false, id: 'user_bob' };
const defaultOptions = { userId: 'test_user', eventId: 'test_event' };

describe('useChatRequest', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.mocked(fetchJSON).mockReset();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('initializes with default state', () => {
    const { result } = renderHook(() => useChatRequest(defaultOptions));
    expect(result.current.requestedPerson).toBeNull();
    expect(result.current.personResponse).toBeNull();
    expect(result.current.yourReady).toBe(false);
    expect(result.current.theirReady).toBe(false);
  });

  it('sets requested person on requestChat', () => {
    vi.mocked(fetchJSON).mockResolvedValue({ accepted: true, match_id: 'match1' });
    const { result } = renderHook(() => useChatRequest(defaultOptions));
    act(() => {
      result.current.requestChat(alice);
    });
    expect(result.current.requestedPerson).toEqual(alice);
  });

  it('resets state when requesting a different person', () => {
    vi.mocked(fetchJSON).mockResolvedValue({ accepted: true, match_id: 'match1' });
    const { result } = renderHook(() => useChatRequest(defaultOptions));
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
    const { result } = renderHook(() => useChatRequest(defaultOptions));
    act(() => {
      result.current.imReady();
    });
    expect(result.current.yourReady).toBe(true);
  });

  it('resets state on cancelRequest', () => {
    const { result } = renderHook(() => useChatRequest(defaultOptions));
    act(() => {
      result.current.cancelRequest();
    });
    expect(result.current.requestedPerson).toBeNull();
    expect(result.current.personResponse).toBeNull();
    expect(result.current.yourReady).toBe(false);
    expect(result.current.theirReady).toBe(false);
  });
});
