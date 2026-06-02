// useTimer.ts
// Description: Hook providing extendable countdown timer with start/clear/extend callbacks

import { useState, useRef, useCallback, useEffect } from 'react';

interface TimerCallbacks {
  onTick?: (timeLeft: number) => void;
  onComplete?: () => void;
}

interface TimerControls {
  timeLeft: number;
  isRunning: boolean;
  start: () => void;
  clear: () => void;
  getTimeLeft: () => number;
}

interface ChatTimerControls extends TimerControls {
  extend: (seconds: number) => void;
}

interface TimerBaseState {
  timeLeft: number;
  setTimeLeft: React.Dispatch<React.SetStateAction<number>>;
  isRunning: boolean;
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
  intervalRef: React.MutableRefObject<ReturnType<typeof setInterval> | null>;
  callbacksRef: React.MutableRefObject<TimerCallbacks | undefined>;
  clear: () => void;
  getTimeLeft: () => number;
}

function useTimerBase(duration: number, callbacks?: TimerCallbacks): TimerBaseState {
  const [timeLeft, setTimeLeft] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const callbacksRef = useRef(callbacks);
  callbacksRef.current = callbacks;

  const clear = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setIsRunning(false);
  }, []);

  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const getTimeLeft = useCallback(() => timeLeft, [timeLeft]);

  return { timeLeft, setTimeLeft, isRunning, setIsRunning, intervalRef, callbacksRef, clear, getTimeLeft };
}

export function useChatTimer(
  duration: number,
  callbacks?: TimerCallbacks,
): ChatTimerControls {
  const {
    timeLeft, setTimeLeft, isRunning, setIsRunning,
    intervalRef, callbacksRef, clear, getTimeLeft,
  } = useTimerBase(duration, callbacks);

  const tick = useCallback(() => {
    setTimeLeft((prev) => {
      const next = prev - 1;
      callbacksRef.current?.onTick?.(next);
      if (next <= 0) {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
        }
        setIsRunning(false);
        callbacksRef.current?.onComplete?.();
        return 0;
      }
      return next;
    });
  }, [setTimeLeft, setIsRunning]);

  const start = useCallback(() => {
    if (intervalRef.current) return;
    setIsRunning(true);
    intervalRef.current = setInterval(tick, 1000);
  }, [tick, setIsRunning]);

  const extend = useCallback((seconds: number) => {
    if (seconds === -1) {
      clear();
    } else {
      setTimeLeft(seconds);
      callbacksRef.current?.onTick?.(seconds);
    }
  }, [clear, setTimeLeft]);

  return { timeLeft, isRunning, start, clear, extend, getTimeLeft };
}


