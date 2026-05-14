// useUser.ts
// Description: Context and hook for user session data (userId, eventId, username)

import { createContext, useContext } from 'react';

export interface UserData {
  userId: string;
  eventId: string;
  username: string;
  linkedinUrl?: string;
  slackHandle?: string;
}

interface UserContextValue {
  user: UserData | null;
  setUser: (data: UserData) => void;
  clearUser: () => void;
  isLoggedIn: boolean;
}

export const UserContext = createContext<UserContextValue | null>(null);

export function useUser(): UserContextValue {
  const ctx = useContext(UserContext);
  if (!ctx) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return ctx;
}
