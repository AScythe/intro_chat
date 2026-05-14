// random.ts
// Description: Utility functions for random string and username generation

export function generateRandomString(length = 8): string {
  return Math.random().toString(36).substring(2, 2 + length);
}

export function generateUsername(): string {
  return 'User_' + generateRandomString(5);
}
