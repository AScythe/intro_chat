// PromptCard.test.tsx
// Description: Tests for PromptCard — prompt text rendering

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { PromptCard } from '@/components/PromptCard';

describe('PromptCard', () => {
  it('renders prompt text', () => {
    render(<PromptCard prompt="What is your favorite hackathon memory?" />);
    expect(
      screen.getByText('What is your favorite hackathon memory?'),
    ).toBeInTheDocument();
  });

  it('renders with correct structure', () => {
    const { container } = render(<PromptCard prompt="Test prompt" />);
    expect(container.firstChild).toBeInTheDocument();
  });
});
