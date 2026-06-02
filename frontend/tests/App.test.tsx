// App.test.tsx
// Description: Tests for App root — route rendering, provider integration, and dark mode toggle

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import App from '@/App';

describe('App', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    globalThis.fetch = vi.fn().mockImplementation((url: string) => {
      if (url.toString().includes('/api/events/') && url.toString().includes('/config')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            rooms: [{ id: 'r1', name: 'Main Hall', selected: true, is_default: true }, { id: 'r2', name: 'Table 1', selected: true, is_default: true }],
            topics: [{ id: 't1', name: 'AI/ML', selected: true, is_default: true }, { id: 't2', name: 'Web Dev', selected: true, is_default: true }],
          }),
        });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve([]),
      });
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

  it('renders room page at /room/abc123', async () => {
    window.history.pushState({}, '', '/room/abc123');
    render(<App />);
    await act(async () => {});
    expect(screen.getByText(/Select Your Location/i)).toBeInTheDocument();
  });

  it('renders chat page at /chat/abc123', async () => {
    window.history.pushState({}, '', '/chat/abc123');
    render(<App />);
    await act(async () => {});
    expect(screen.getByText(/Micro-Chat/i)).toBeInTheDocument();
  });

  it('renders people page route and redirects to room when no state', async () => {
    window.history.pushState({}, '', '/people/abc123');
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText(/Select Your Location/i)).toBeInTheDocument();
    });
  });

  it('renders connect page at /connect/abc123', () => {
    window.history.pushState({}, '', '/connect/abc123');
    render(<App />);
    expect(screen.getByRole('heading', { level: 1, name: 'Connect' })).toBeInTheDocument();
  });

  it('renders organize event page at /organize/abc123', async () => {
    window.history.pushState({}, '', '/organize/abc123');
    render(<App />);
    await waitFor(() => {
      expect(screen.getByText('Organize Event')).toBeInTheDocument();
    });
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
