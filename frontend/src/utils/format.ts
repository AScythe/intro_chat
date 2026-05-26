// format.ts
// Description: Utility functions for formatting values (time, display strings)

export function formatTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const parts: string[] = [];
  if (minutes > 0) {
    parts.push(`${minutes} ${minutes === 1 ? 'minute' : 'minutes'}`);
  }
  if (secs > 0) {
    parts.push(`${secs} ${secs === 1 ? 'second' : 'seconds'}`);
  }
  if (parts.length === 0) return '0 seconds';
  return parts.join(' ');
}
