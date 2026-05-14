// storage.ts
// Description: localStorage wrappers for persisting user session data

const USER_ID_KEY = 'introchat_user_id';

export function storeUserId(userId: string): void {
  localStorage.setItem(USER_ID_KEY, userId);
}

export function getUserId(): string | null {
  return localStorage.getItem(USER_ID_KEY);
}

export function clearUserId(): void {
  localStorage.removeItem(USER_ID_KEY);
}

export function storeData(key: string, value: string): void {
  localStorage.setItem(key, value);
}

export function getData(key: string): string | null {
  return localStorage.getItem(key);
}


