// UserContext.tsx
// Description: User session context provider — hydrates from localStorage, writes on change

import { useState, useCallback, type ReactNode } from 'react';
import { UserContext, type UserData } from '@/hooks/useUser';
import { storeUserId, getUserId, clearUserId, storeData, getData } from '@/utils/storage';

const EVENT_ID_KEY = 'introchat_event_id';
const USERNAME_KEY = 'introchat_username';

function loadUserFromStorage(): UserData | null {
  const userId = getUserId();
  const eventId = getData(EVENT_ID_KEY);
  const username = getData(USERNAME_KEY);

  if (!userId || !eventId) return null;

  return { userId, eventId, username: username || `User_${userId}` };
}

function saveUserToStorage(data: UserData): void {
  storeUserId(data.userId);
  storeData(EVENT_ID_KEY, data.eventId);
  storeData(USERNAME_KEY, data.username);
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserData | null>(loadUserFromStorage);

  const setUser = useCallback((data: UserData) => {
    setUserState(data);
    saveUserToStorage(data);
  }, []);

  const clearUser = useCallback(() => {
    setUserState(null);
    clearUserId();
    storeData(EVENT_ID_KEY, '');
    storeData(USERNAME_KEY, '');
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, clearUser, isLoggedIn: user !== null }}>
      {children}
    </UserContext.Provider>
  );
}
