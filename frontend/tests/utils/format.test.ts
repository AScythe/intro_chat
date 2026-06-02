// format.test.ts
// Description: Tests for format utilities — formatTime edge cases

import { describe, it, expect } from 'vitest';
import { formatTime, formatDuration } from '@/utils/format';

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

describe('formatDuration', () => {
  it('returns "0 seconds" for 0', () => {
    expect(formatDuration(0)).toBe('0 seconds');
  });

  it('formats seconds only', () => {
    expect(formatDuration(30)).toBe('30 seconds');
  });

  it('formats singular second', () => {
    expect(formatDuration(1)).toBe('1 second');
  });

  it('formats minutes only', () => {
    expect(formatDuration(120)).toBe('2 minutes');
  });

  it('formats singular minute', () => {
    expect(formatDuration(60)).toBe('1 minute');
  });

  it('formats minutes and seconds together', () => {
    expect(formatDuration(90)).toBe('1 minute 30 seconds');
    expect(formatDuration(150)).toBe('2 minutes 30 seconds');
    expect(formatDuration(61)).toBe('1 minute 1 second');
  });
});
