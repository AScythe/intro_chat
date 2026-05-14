// UserContext.test.tsx
// Description: Tests for UserContext — session hydration and state updates

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useUser } from '@/hooks/useUser';
import { UserProvider } from '@/context/UserContext';

describe('UserContext', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with no user when localStorage is empty', () => {
    const { result } = renderHook(() => useUser(), {
      wrapper: UserProvider,
    });

    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.user).toBeNull();
  });

  it('setUser stores data and sets isLoggedIn', () => {
    const { result } = renderHook(() => useUser(), {
      wrapper: UserProvider,
    });

    act(() => {
      result.current.setUser({
        userId: 'abc123',
        eventId: 'event1',
        username: 'User_abc',
        linkedinUrl: 'https://linkedin.com/in/test',
      });
    });

    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.user?.userId).toBe('abc123');
    expect(result.current.user?.eventId).toBe('event1');
    expect(result.current.user?.username).toBe('User_abc');
    expect(result.current.user?.linkedinUrl).toBe('https://linkedin.com/in/test');
  });

  it('persists to localStorage on setUser', () => {
    const { result } = renderHook(() => useUser(), {
      wrapper: UserProvider,
    });

    act(() => {
      result.current.setUser({
        userId: 'persist1',
        eventId: 'event2',
        username: 'User_persist',
      });
    });

    expect(localStorage.getItem('introchat_user_id')).toBe('persist1');
    expect(localStorage.getItem('introchat_event_id')).toBe('event2');
  });

  it('rehydrates from localStorage on mount', () => {
    localStorage.setItem('introchat_user_id', 'rehydrate1');
    localStorage.setItem('introchat_event_id', 'event3');
    localStorage.setItem('introchat_username', 'User_rehydrate');

    const { result } = renderHook(() => useUser(), {
      wrapper: UserProvider,
    });

    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.user?.userId).toBe('rehydrate1');
    expect(result.current.user?.eventId).toBe('event3');
    expect(result.current.user?.username).toBe('User_rehydrate');
  });

  it('clearUser removes data from context and localStorage', () => {
    const { result } = renderHook(() => useUser(), {
      wrapper: UserProvider,
    });

    act(() => {
      result.current.setUser({
        userId: 'clear1',
        eventId: 'event4',
        username: 'User_clear',
      });
    });

    act(() => {
      result.current.clearUser();
    });

    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.user).toBeNull();
    expect(localStorage.getItem('introchat_user_id')).toBeNull();
  });
});
