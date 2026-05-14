// MatchCountdown.test.tsx
// Description: Tests for MatchCountdown — countdown display and navigation

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MatchCountdown } from '@/components/MatchCountdown';

describe('MatchCountdown', () => {
  it('renders username and room name', () => {
    render(
      <MatchCountdown
        username="Alice_Dev"
        roomName="Main Hall"
        countdown={45}
        onGoToChat={vi.fn()}
      />,
    );
    expect(screen.getByText('Alice_Dev')).toBeInTheDocument();
    expect(screen.getByText('Main Hall')).toBeInTheDocument();
  });

  it('renders countdown number', () => {
    render(
      <MatchCountdown
        username="Bob"
        roomName="Table 1"
        countdown={30}
        onGoToChat={vi.fn()}
      />,
    );
    expect(screen.getByText('30')).toBeInTheDocument();
  });

  it('fires onGoToChat when button clicked', () => {
    const onGoToChat = vi.fn();
    render(
      <MatchCountdown
        username="Alice"
        roomName="Hall"
        countdown={10}
        onGoToChat={onGoToChat}
      />,
    );
    fireEvent.click(screen.getByText('Go to Chat'));
    expect(onGoToChat).toHaveBeenCalledOnce();
  });
});
