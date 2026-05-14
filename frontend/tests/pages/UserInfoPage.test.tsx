// UserInfoPage.test.tsx
// Description: Tests for UserInfoPage — form input, save, navigation

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { UserInfoPage } from '@/pages/UserInfoPage';
import { UserProvider } from '@/context/UserContext';

function renderWithRouter(eventId = 'TEST1234') {
  return render(
    <UserProvider>
      <MemoryRouter initialEntries={[`/join/${eventId}`]}>
        <Routes>
          <Route path="/join/:eventId" element={<UserInfoPage />} />
        </Routes>
      </MemoryRouter>
    </UserProvider>
  );
}

describe('UserInfoPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
  });

  it('renders profile header and form fields', () => {
    renderWithRouter();
    expect(screen.getByText('Your Profile')).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/linkedin/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/@username/i)).toBeInTheDocument();
  });

  it('renders save profile and select room buttons', () => {
    renderWithRouter();
    expect(screen.getByText('Save Profile')).toBeInTheDocument();
    const selectRoomBtn = screen.getByText('Select Room / Area');
    expect(selectRoomBtn).toBeDisabled();
  });

  it('saves profile and enables select room button', async () => {
    const mockResponse = { user_id: 'user_abc123', username: 'User_abc123' };
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    renderWithRouter();
    fireEvent.change(screen.getByPlaceholderText(/linkedin/i), {
      target: { value: 'https://linkedin.com/in/test' },
    });
    fireEvent.change(screen.getByPlaceholderText(/@username/i), {
      target: { value: '@testuser' },
    });
    fireEvent.click(screen.getByText('Save Profile'));

    await waitFor(() => {
      expect(screen.getByText(/Profile saved/i)).toBeInTheDocument();
    });
    expect(screen.getByText('Select Room / Area')).not.toBeDisabled();
  });
});
