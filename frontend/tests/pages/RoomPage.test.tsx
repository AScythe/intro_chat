// RoomPage.test.tsx
// Description: Tests for RoomPage — room selection, navigation to people matching

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { UserProvider } from '@/context/UserContext';
import { SocketProvider } from '@/context/SocketContext';
import { RoomPage } from '@/pages/RoomPage';

function renderWithProviders(eventId = 'TEST1234') {
  return render(
    <UserProvider>
      <SocketProvider>
        <MemoryRouter initialEntries={[`/room/${eventId}`]}>
          <Routes>
            <Route path="/room/:eventId" element={<RoomPage />} />
          </Routes>
        </MemoryRouter>
      </SocketProvider>
    </UserProvider>
  );
}

const mockRooms = [
  { id: 'room1', name: 'Main Hall' },
  { id: 'room2', name: 'Table 1' },
];

describe('RoomPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockRooms),
    });
  });

  it('renders room selection dropdown', async () => {
    renderWithProviders();
    await waitFor(() => {
      expect(screen.getByText('Select a room or table...')).toBeInTheDocument();
    });
  });

  it('renders page header', () => {
    renderWithProviders();
    expect(screen.getByText(/Select Your Location/i)).toBeInTheDocument();
  });

  it('renders back to home button', () => {
    renderWithProviders();
    expect(screen.getByText(/Back to Home/i)).toBeInTheDocument();
  });

  it('renders back to profile link', () => {
    renderWithProviders();
    expect(screen.getByText(/Back to Profile/i)).toBeInTheDocument();
  });
});
