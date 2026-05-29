// ConnectPage.test.tsx
// Description: Tests for ConnectPage — connection card, yes/no flow, result display

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

  it('shows connection exchanged result after yes in demo mode', async () => {
    renderWithProviders('demo_test1234');
    fireEvent.click(screen.getByRole('button', { name: /yes.*connect/i }));
    await waitFor(() => {
      expect(screen.getByText(/Connection Exchanged/i)).toBeInTheDocument();
    }, { timeout: 4000 });
  });

  it('shows chat complete result after no in demo mode', async () => {
    renderWithProviders('demo_test1234');
    fireEvent.click(screen.getByRole('button', { name: /no thanks/i }));
    await waitFor(() => {
      expect(screen.getByText(/Chat Complete/i)).toBeInTheDocument();
    }, { timeout: 4000 });
  });
});
