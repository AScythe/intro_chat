// PersonCard.test.tsx
// Description: Tests for PersonCard — rendering, availability, and selection

import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PersonCard } from '@/components/PersonCard';

describe('PersonCard', () => {
  const defaultPerson = {
    name: 'Alice_Dev',
    available: true,
    status: 'Ready to chat',
  };

  it('renders person name', () => {
    render(<PersonCard person={defaultPerson} />);
    expect(screen.getByText('Alice_Dev')).toBeInTheDocument();
  });

  it('renders status text', () => {
    render(<PersonCard person={defaultPerson} />);
    expect(screen.getByText('Ready to chat')).toBeInTheDocument();
  });

  it('shows initial letter as avatar', () => {
    render(<PersonCard person={defaultPerson} />);
    expect(screen.getByText('A')).toBeInTheDocument();
  });

  it('renders select indicator text', () => {
    render(<PersonCard person={defaultPerson} />);
    expect(screen.getByText('Select')).toBeInTheDocument();
  });

  it('shows "Selected" when selected', () => {
    render(<PersonCard person={defaultPerson} selected />);
    expect(screen.getByText('Selected')).toBeInTheDocument();
  });

  it('applies selected class when selected', () => {
    const { container } = render(<PersonCard person={defaultPerson} selected />);
    expect(container.firstChild).toHaveClass('selected');
  });

  it('fires onClick when clicked', () => {
    const onClick = vi.fn();
    render(<PersonCard person={defaultPerson} onClick={onClick} />);
    fireEvent.click(screen.getByText('Alice_Dev'));
    expect(onClick).toHaveBeenCalled();
  });
});
