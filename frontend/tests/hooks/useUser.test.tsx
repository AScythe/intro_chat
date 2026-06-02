import { describe, it, expect } from 'vitest';
import { renderHook } from '@testing-library/react';
import { type ReactNode } from 'react';
import { UserProvider } from '@/context/UserContext';
import { useUser } from '@/hooks/useUser';

function wrapper({ children }: { children: ReactNode }) {
  return <UserProvider>{children}</UserProvider>;
}

describe('useUser', () => {
  it('provides default null user and false isLoggedIn', () => {
    const { result } = renderHook(() => useUser(), { wrapper });
    expect(result.current.user).toBeNull();
    expect(result.current.isLoggedIn).toBe(false);
  });

  it('throws when used outside UserProvider', () => {
    expect(() => renderHook(() => useUser())).toThrow('useUser must be used within a UserProvider');
  });
});
