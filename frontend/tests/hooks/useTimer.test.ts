// useTimer.test.ts
// Description: Tests for useChatTimer hook — tick, extend, clear, and onComplete

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChatTimer } from '@/hooks/useTimer';

describe('useChatTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('starts with the given duration', () => {
    const { result } = renderHook(() => useChatTimer(120));
    expect(result.current.timeLeft).toBe(120);
    expect(result.current.isRunning).toBe(false);
  });

  it('ticks down every second after start', () => {
    const { result } = renderHook(() => useChatTimer(5));

    act(() => {
      result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });
    expect(result.current.timeLeft).toBe(4);

    act(() => {
      vi.advanceTimersByTime(2000);
    });
    expect(result.current.timeLeft).toBe(2);
  });

  it('calls onTick with remaining time each second', () => {
    const onTick = vi.fn();
    const { result } = renderHook(() => useChatTimer(3, { onTick }));

    act(() => {
      result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(onTick).toHaveBeenCalledWith(2);
    expect(onTick).toHaveBeenCalledWith(1);
    expect(onTick).toHaveBeenCalledWith(0);
  });

  it('calls onComplete when time reaches 0', () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() => useChatTimer(2, { onComplete }));

    act(() => {
      result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(onComplete).toHaveBeenCalledOnce();
  });

  it('stops at 0 and does not go negative', () => {
    const { result } = renderHook(() => useChatTimer(1));

    act(() => {
      result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.timeLeft).toBe(0);
    expect(result.current.isRunning).toBe(false);
  });

  it('extend sets timer to the given seconds', () => {
    const onTick = vi.fn();
    const { result } = renderHook(() => useChatTimer(2, { onTick }));

    act(() => {
      result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    act(() => {
      result.current.extend(10);
    });

    expect(result.current.timeLeft).toBe(10);

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current.timeLeft).toBe(9);
  });

  it('extend with -1 stops the timer (indefinite)', () => {
    const onComplete = vi.fn();
    const { result } = renderHook(() => useChatTimer(2, { onComplete }));

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.extend(-1);
    });

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current.timeLeft).toBe(2);
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('clear stops the timer', () => {
    const { result } = renderHook(() => useChatTimer(5));

    act(() => {
      result.current.start();
    });

    act(() => {
      result.current.clear();
    });

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.timeLeft).toBe(5);
  });

  it('getTimeLeft returns current timeLeft', () => {
    const { result } = renderHook(() => useChatTimer(10));

    expect(result.current.getTimeLeft()).toBe(10);

    act(() => {
      result.current.start();
    });

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.getTimeLeft()).toBe(7);
  });

  it('isRunning reflects timer state', () => {
    const { result } = renderHook(() => useChatTimer(5));

    expect(result.current.isRunning).toBe(false);

    act(() => {
      result.current.start();
    });
    expect(result.current.isRunning).toBe(true);

    act(() => {
      result.current.clear();
    });
    expect(result.current.isRunning).toBe(false);
  });
});

