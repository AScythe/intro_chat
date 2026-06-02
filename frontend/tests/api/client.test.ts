// client.test.ts
// Description: Tests for fetchJSON wrapper — timeout, HTTP errors, and successful fetch

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { fetchJSON } from '@/api/client';

describe('fetchJSON', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('fetches and parses JSON successfully', async () => {
    const data = { id: 1, name: 'test' };
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(data),
    });

    const promise = fetchJSON<typeof data>('/api/test');
    await vi.runAllTimersAsync();
    const result = await promise;
    expect(result).toEqual(data);
    expect(globalThis.fetch).toHaveBeenCalledWith('/api/test', expect.any(Object));
  });

  it('throws on HTTP error (non-ok)', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: () => Promise.resolve({}),
    });

    const promise = fetchJSON('/api/not-found');
    await vi.runAllTimersAsync();
    await expect(promise).rejects.toThrow('HTTP error! status: 404');
  });

  it('rejects on timeout', async () => {
    globalThis.fetch = vi.fn().mockImplementation(
      () => new Promise((_, reject) => {
        setTimeout(() => reject(new DOMException('The operation was aborted', 'AbortError')), 100);
      })
    );

    const promise = fetchJSON('/api/slow');
    vi.advanceTimersByTime(10000);
    await expect(promise).rejects.toThrow();
  });

  it('passes options through to fetch', async () => {
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve({}),
    });

    const promise = fetchJSON('/api/test', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key: 'value' }),
    });
    await vi.runAllTimersAsync();
    await promise;

    expect(globalThis.fetch).toHaveBeenCalledWith(
      '/api/test',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ key: 'value' }),
      }),
    );
  });
});
