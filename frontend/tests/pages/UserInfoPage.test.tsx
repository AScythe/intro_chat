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
    expect(screen.getByPlaceholderText(/e\.g\. Alex/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/linkedin/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/@username/i)).toBeInTheDocument();
  });

  it('save button is enabled when name is empty', () => {
    renderWithRouter();
    expect(screen.getByText('Save Profile')).not.toBeDisabled();
  });

  it('saves profile with auto-generated username when name is empty', async () => {
    const mockResponse = { user_id: 'user_abc123', username: 'User_abc12' };
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    renderWithRouter();
    fireEvent.click(screen.getByText('Save Profile'));

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringMatching(/"username":"User_[a-z0-9]{5}"/),
        })
      );
    });
    await waitFor(() => {
      const btn = screen.getByText('Profile saved! Select a room.');
      expect(btn).toBeInTheDocument();
      expect(btn).toBeDisabled();
    });
    expect(screen.getByText('Select Room / Area')).not.toBeDisabled();
  });

  it('saves profile with custom name and enables select room', async () => {
    const mockResponse = { user_id: 'user_abc123', username: 'Alex' };
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    renderWithRouter();
    fireEvent.change(screen.getByPlaceholderText(/e\.g\. Alex/i), {
      target: { value: 'Alex' },
    });
    fireEvent.change(screen.getByPlaceholderText(/linkedin/i), {
      target: { value: 'https://linkedin.com/in/test' },
    });
    fireEvent.change(screen.getByPlaceholderText(/@username/i), {
      target: { value: '@testuser' },
    });
    fireEvent.click(screen.getByText('Save Profile'));

    await waitFor(() => {
      expect(globalThis.fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          body: expect.stringContaining('"username":"Alex"'),
        })
      );
    });
    await waitFor(() => {
      const btn = screen.getByText('Profile saved! Select a room.');
      expect(btn).toBeInTheDocument();
      expect(btn).toBeDisabled();
    });
    expect(screen.getByText('Select Room / Area')).not.toBeDisabled();
  });

  it('re-enables save button when form is edited after save', async () => {
    const mockResponse = { user_id: 'user_abc123', username: 'Alex' };
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    renderWithRouter();
    fireEvent.change(screen.getByPlaceholderText(/e\.g\. Alex/i), {
      target: { value: 'Alex' },
    });
    fireEvent.click(screen.getByText('Save Profile'));

    await waitFor(() => {
      expect(screen.getByText('Profile saved! Select a room.')).toBeInTheDocument();
    });

    fireEvent.change(screen.getByPlaceholderText(/e\.g\. Alex/i), {
      target: { value: 'Alexandra' },
    });

    await waitFor(() => {
      const btn = screen.getByText('Save Profile');
      expect(btn).not.toBeDisabled();
    });
    expect(screen.getByText('Select Room / Area')).toBeDisabled();
  });
});
