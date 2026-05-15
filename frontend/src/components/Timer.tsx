// Timer.tsx
// Description: Timer display component showing MM:SS with warning/danger visual states

import { CONFIG } from '@/config/constants';
import { formatTime } from '@/utils/format';

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
  const classNames = ['timer'];
  if (timeLeft <= dangerThreshold) {
    classNames.push('timer-danger');
  } else if (timeLeft <= warningThreshold) {
    classNames.push('timer-warning');
  }

  return (
    <div className={classNames.join(' ')}>
      {formatTime(timeLeft)}
    </div>
  );
}
