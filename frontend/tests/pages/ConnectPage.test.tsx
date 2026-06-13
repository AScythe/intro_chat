// ConnectPage.test.tsx
// Description: Tests for ConnectPage — connection card, yes/no flow with submitted state, WS-driven result display

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { UserProvider } from '@/context/UserContext';
import { SocketProvider } from '@/context/SocketContext';
import { ConnectPage } from '@/pages/ConnectPage';

function renderWithProviders(matchId = 'demo_test1234', eventId = 'TEST1234') {
  return render(
    <UserProvider>
      <SocketProvider>
        <MemoryRouter initialEntries={[`/connect/${matchId}?event_id=${eventId}`]}>
          <Routes>
            <Route path="/connect/:matchId" element={<ConnectPage />} />
          </Routes>
        </MemoryRouter>
      </SocketProvider>
    </UserProvider>
  );
}

describe('ConnectPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    localStorage.setItem('introchat_user_id', 'test-user');
    localStorage.setItem('introchat_event_id', 'TEST1234');
    localStorage.setItem('introchat_username', 'Test_User');
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });
  });

  it('renders connect header', () => {
    renderWithProviders();
    expect(screen.getByRole('heading', { level: 1, name: 'Connect' })).toBeInTheDocument();
  });

  it('shows connection card initially', () => {
    renderWithProviders();
    expect(screen.getByText(/Would you like to exchange usernames/i)).toBeInTheDocument();
  });

  it('shows back to home button', () => {
    renderWithProviders();
    expect(screen.getByText(/Back to Home/i)).toBeInTheDocument();
  });

  it('calls connect API when yes is clicked', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ success: true }) });
    globalThis.fetch = mockFetch;
    renderWithProviders('demo_test1234');
    fireEvent.click(screen.getByRole('button', { name: /yes.*connect/i }));
    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith(
        expect.stringContaining('/api/matches/'),
        expect.objectContaining({ method: 'POST' }),
      );
    });
  });

  it('shows waiting text after clicking yes', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ success: true }) });
    globalThis.fetch = mockFetch;
    renderWithProviders('demo_test1234');
    fireEvent.click(screen.getByRole('button', { name: /yes.*connect/i }));
    await waitFor(() => {
      expect(screen.getByText(/Waiting for partner/i)).toBeInTheDocument();
    });
  });

  it('disables buttons after clicking yes', async () => {
    const mockFetch = vi.fn().mockResolvedValue({ ok: true, json: () => Promise.resolve({ success: true }) });
    globalThis.fetch = mockFetch;
    renderWithProviders('demo_test1234');
    fireEvent.click(screen.getByRole('button', { name: /yes.*connect/i }));
    await waitFor(() => {
      const buttons = screen.getAllByRole('button');
      buttons.forEach((btn) => {
        if (btn.textContent?.match(/yes.*connect|no thanks/i)) {
          expect(btn).toBeDisabled();
        }
      });
    });
  });
});
