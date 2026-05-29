// Timer.tsx
// Description: Timer display component showing MM:SS with warning/danger visual states

import { CONFIG } from '@/config/constants';
import { formatTime } from '@/utils/format';
import { cn } from '@/lib/utils';

interface TimerProps {
  timeLeft: number;
  warningThreshold?: number;
  dangerThreshold?: number;
}

export function Timer({
  timeLeft,
  warningThreshold = CONFIG.TIMER_WARNING_THRESHOLD,
  dangerThreshold = CONFIG.TIMER_DANGER_THRESHOLD,
}: TimerProps) {
  const isDanger = timeLeft <= dangerThreshold;
  const isWarning = timeLeft <= warningThreshold && !isDanger;

  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-[12px] border px-6 py-3 backdrop-blur-sm transition-all duration-300',
        isDanger
          ? 'bg-destructive/20 border-destructive/50 animate-pulse'
          : isWarning
            ? 'bg-[rgba(212,184,106,0.2)] border-[rgba(212,184,106,0.5)]'
            : 'bg-white/20 border-white/30',
        'timer',
        isWarning && 'timer-warning',
        isDanger && 'timer-danger',
      )}
    >
      <span className="text-3xl font-bold tracking-tight">
        {formatTime(timeLeft)}
      </span>
    </div>
  );
}
