// Timer.test.tsx
// Description: Tests for Timer — MM:SS display, warning/danger thresholds

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Timer } from '@/components/Timer';

describe('Timer', () => {
  it('renders minutes and seconds', () => {
    render(<Timer timeLeft={90} />);
    expect(screen.getByText('1:30')).toBeInTheDocument();
  });

  it('renders colon separator', () => {
    render(<Timer timeLeft={0} />);
    expect(screen.getByText('0:00')).toBeInTheDocument();
  });

  it('pads seconds with leading zero', () => {
    render(<Timer timeLeft={5} />);
    expect(screen.getByText('0:05')).toBeInTheDocument();
  });

  it('applies timer class', () => {
    const { container } = render(<Timer timeLeft={120} />);
    expect(container.firstChild).toHaveClass('timer');
  });

  it('applies warning class when below warning threshold', () => {
    const { container } = render(<Timer timeLeft={5} warningThreshold={10} />);
    expect(container.firstChild).toHaveClass('timer-warning');
  });

  it('applies danger class when below danger threshold', () => {
    const { container } = render(<Timer timeLeft={2} dangerThreshold={3} />);
    expect(container.firstChild).toHaveClass('timer-danger');
  });

  it('does not apply warning class above threshold', () => {
    const { container } = render(<Timer timeLeft={20} warningThreshold={10} />);
    expect(container.firstChild).not.toHaveClass('timer-warning');
  });
});
