// storage.test.ts
// Description: Tests for storage utilities — localStorage read/write/clear

import { describe, it, expect, beforeEach } from 'vitest';
import { storeUserId, getUserId, clearUserId } from '@/utils/storage';

describe('storage', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('userId', () => {
    it('stores and retrieves user ID', () => {
      storeUserId('test123');
      expect(getUserId()).toBe('test123');
    });

    it('returns null when no user ID stored', () => {
      expect(getUserId()).toBeNull();
    });

    it('clears user ID', () => {
      storeUserId('test123');
      clearUserId();
      expect(getUserId()).toBeNull();
    });

    it('overwrites existing user ID', () => {
      storeUserId('first');
      storeUserId('second');
      expect(getUserId()).toBe('second');
    });
  });
});
