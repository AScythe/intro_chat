// format.test.ts
// Description: Tests for format utilities — formatTime edge cases

import { describe, it, expect } from 'vitest';
import { formatTime } from '@/utils/format';

describe('formatTime', () => {
  it('formats 0 seconds as 0:00', () => {
    expect(formatTime(0)).toBe('0:00');
  });

  it('formats 30 seconds as 0:30', () => {
    expect(formatTime(30)).toBe('0:30');
  });

  it('formats 60 seconds as 1:00', () => {
    expect(formatTime(60)).toBe('1:00');
  });

  it('formats 90 seconds as 1:30', () => {
    expect(formatTime(90)).toBe('1:30');
  });

  it('formats 150 seconds as 2:30', () => {
    expect(formatTime(150)).toBe('2:30');
  });

  it('pads seconds with leading zero', () => {
    expect(formatTime(5)).toBe('0:05');
    expect(formatTime(3)).toBe('0:03');
  });
});
