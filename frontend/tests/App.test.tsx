// App.test.tsx
// Description: Tests for App root — route rendering, provider integration, and dark mode toggle

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '@/App';

describe('App', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });
  });

  afterEach(() => {
    document.documentElement.classList.remove('dark');
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

  it('toggles dark mode class on html element', () => {
    window.history.pushState({}, '', '/');
    render(<App />);
    const toggle = screen.getByRole('button', { name: /switch to dark mode/i });
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    fireEvent.click(toggle);
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('introchat_theme')).toBe('dark');
    fireEvent.click(toggle);
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('introchat_theme')).toBe('light');
  });
});
