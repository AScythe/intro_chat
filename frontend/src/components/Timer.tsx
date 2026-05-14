// Timer.tsx
// Description: Timer display component showing MM:SS with warning/danger visual states

import { CONFIG } from '@/config/constants';

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
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  const classNames = ['timer'];
  if (timeLeft <= dangerThreshold) {
    classNames.push('timer-danger');
  } else if (timeLeft <= warningThreshold) {
    classNames.push('timer-warning');
  }

  return (
    <div className={classNames.join(' ')}>
      <span>{minutes}</span>:<span>{seconds.toString().padStart(2, '0')}</span>
    </div>
  );
}
