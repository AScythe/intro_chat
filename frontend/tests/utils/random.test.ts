// random.test.ts
// Description: Tests for random string and username generation utilities

import { describe, it, expect } from 'vitest';
import { generateRandomString, generateUsername } from '@/utils/random';

describe('generateRandomString', () => {
  it('returns a string of the default length (8)', () => {
    const result = generateRandomString();
    expect(result).toHaveLength(8);
  });

  it('returns a string up to the specified length', () => {
    const result12 = generateRandomString(12);
    expect(result12.length).toBeGreaterThanOrEqual(1);
    expect(result12.length).toBeLessThanOrEqual(12);

    const result4 = generateRandomString(4);
    expect(result4.length).toBeGreaterThanOrEqual(1);
    expect(result4.length).toBeLessThanOrEqual(4);
  });

  it('contains only alphanumeric characters', () => {
    const result = generateRandomString(100);
    expect(result).toMatch(/^[a-z0-9]*$/);
  });

  it('produces different values on successive calls', () => {
    const a = generateRandomString(10);
    const b = generateRandomString(10);
    expect(a).not.toBe(b);
  });

  it('returns empty string for length 0', () => {
    expect(generateRandomString(0)).toBe('');
  });
});

describe('generateUsername', () => {
  it('returns a string starting with User_', () => {
    const result = generateUsername();
    expect(result).toMatch(/^User_/);
  });

  it('returns a string of length 10 (User_ + 5 chars)', () => {
    expect(generateUsername()).toHaveLength(10);
  });

  it('produces different values on successive calls', () => {
    const a = generateUsername();
    const b = generateUsername();
    expect(a).not.toBe(b);
  });
});
