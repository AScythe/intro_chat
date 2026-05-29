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
        'inline-flex items-center justify-center rounded-xl border-2 px-5 py-2.5 transition-all duration-300',
        isDanger
          ? 'border-destructive/50 bg-destructive/20 animate-pulse'
          : isWarning
            ? 'border-[rgba(212,184,106,0.5)] bg-[rgba(212,184,106,0.2)]'
            : 'border-border bg-card/80',
        'timer',
        isWarning && 'timer-warning',
        isDanger && 'timer-danger',
      )}
    >
      <span className="text-2xl font-bold tracking-tight text-foreground">
        {formatTime(timeLeft)}
      </span>
    </div>
  );
}
