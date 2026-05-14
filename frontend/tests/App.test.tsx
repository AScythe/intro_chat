// App.test.tsx
// Description: Tests for App root — route rendering and provider integration

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '@/App';

describe('App', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });
  });

  it('renders home page at /', () => {
    window.history.pushState({}, '', '/');
    render(<App />);
    expect(screen.getByText(/Join an Event/i)).toBeInTheDocument();
  });

  it('renders user info page at /join/abc123', () => {
    window.history.pushState({}, '', '/join/abc123');
    render(<App />);
    expect(screen.getByText(/Save Profile/i)).toBeInTheDocument();
  });

  it('renders room page at /room/abc123', () => {
    window.history.pushState({}, '', '/room/abc123');
    render(<App />);
    expect(screen.getByText(/Select Your Location/i)).toBeInTheDocument();
  });

  it('renders chat page at /chat/abc123', () => {
    window.history.pushState({}, '', '/chat/abc123');
    render(<App />);
    expect(screen.getByText(/Micro-Chat/i)).toBeInTheDocument();
  });
});
