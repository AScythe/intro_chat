// storage.test.ts
// Description: Tests for storage utilities — localStorage read/write/clear

import { describe, it, expect, beforeEach } from 'vitest';
import { storeUserId, getUserId, clearUserId, storeData, getData } from '@/utils/storage';

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

  describe('storeData / getData', () => {
    it('stores and retrieves arbitrary data', () => {
      storeData('my_key', 'my_value');
      expect(getData('my_key')).toBe('my_value');
    });

    it('returns null for missing key', () => {
      expect(getData('nonexistent')).toBeNull();
    });

    it('overwrites existing data for same key', () => {
      storeData('key', 'first');
      storeData('key', 'second');
      expect(getData('key')).toBe('second');
    });

    it('stores different keys independently', () => {
      storeData('a', 'value_a');
      storeData('b', 'value_b');
      expect(getData('a')).toBe('value_a');
      expect(getData('b')).toBe('value_b');
    });
  });
});
