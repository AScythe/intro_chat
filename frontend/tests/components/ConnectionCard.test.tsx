// ConnectionCard.test.tsx
// Description: Tests for ConnectionCard — yes/no button callbacks, disabled state

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ConnectionCard } from '@/components/ConnectionCard';

describe('ConnectionCard', () => {
  it('renders question text', () => {
    render(<ConnectionCard onYes={vi.fn()} onNo={vi.fn()} />);
    expect(
      screen.getByText('Would you like to exchange usernames to connect?'),
    ).toBeInTheDocument();
  });

  it('fires onYes when yes button clicked', () => {
    const onYes = vi.fn();
    render(<ConnectionCard onYes={onYes} onNo={vi.fn()} />);
    fireEvent.click(screen.getByText("Yes, let's connect!"));
    expect(onYes).toHaveBeenCalledOnce();
  });

  it('fires onNo when no button clicked', () => {
    const onNo = vi.fn();
    render(<ConnectionCard onYes={vi.fn()} onNo={onNo} />);
    fireEvent.click(screen.getByText('No thanks'));
    expect(onNo).toHaveBeenCalledOnce();
  });

  it('disables buttons when disabled is true', () => {
    render(<ConnectionCard onYes={vi.fn()} onNo={vi.fn()} disabled />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => expect(btn).toBeDisabled());
  });

  it('does not fire callbacks when disabled', () => {
    const onYes = vi.fn();
    const onNo = vi.fn();
    render(<ConnectionCard onYes={onYes} onNo={onNo} disabled />);
    const buttons = screen.getAllByRole('button');
    buttons.forEach((btn) => fireEvent.click(btn));
    expect(onYes).not.toHaveBeenCalled();
    expect(onNo).not.toHaveBeenCalled();
  });
});
