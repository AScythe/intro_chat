// PeoplePage.test.tsx
// Description: Tests for PeoplePage — nearby users, request/accept flow, match countdown

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { UserProvider } from '@/context/UserContext';
import { SocketProvider } from '@/context/SocketContext';
import { PeoplePage } from '@/pages/PeoplePage';

const mockRooms = [
  { id: 'room1', name: 'Main Hall' },
  { id: 'room2', name: 'Table 1' },
];

function renderWithProviders(eventId = 'TEST1234') {
  return render(
    <UserProvider>
      <SocketProvider>
        <MemoryRouter initialEntries={[{ pathname: `/people/${eventId}`, state: { roomName: 'Main Hall' } }]}>
          <Routes>
            <Route path="/people/:eventId" element={<PeoplePage />} />
          </Routes>
        </MemoryRouter>
      </SocketProvider>
    </UserProvider>
  );
}

function renderDirectAccess(eventId = 'TEST1234') {
  return render(
    <UserProvider>
      <SocketProvider>
        <MemoryRouter initialEntries={[`/people/${eventId}`]}>
          <Routes>
            <Route path="/people/:eventId" element={<PeoplePage />} />
            <Route path="/room/:eventId" element={<div>Room Page</div>} />
          </Routes>
        </MemoryRouter>
      </SocketProvider>
    </UserProvider>
  );
}

describe('PeoplePage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockRooms),
    });
  });

  it('renders page header when room name is provided', async () => {
    renderWithProviders();
    await waitFor(() => {
      expect(screen.getByText(/Find Chat Partners/i)).toBeInTheDocument();
    });
  });

  it('renders nearby users section', async () => {
    renderWithProviders();
    await waitFor(() => {
      expect(screen.getByText(/Nearby Users/i)).toBeInTheDocument();
    });
  });

  it('renders back to home button', async () => {
    renderWithProviders();
    await waitFor(() => {
      expect(screen.getByText(/Back to Home/i)).toBeInTheDocument();
    });
  });

  it('redirects to room page on direct access without state', async () => {
    renderDirectAccess('TEST1234');
    await waitFor(() => {
      expect(screen.getByText('Room Page')).toBeInTheDocument();
    });
  });
});
