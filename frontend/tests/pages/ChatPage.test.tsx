// ChatPage.test.tsx
// Description: Tests for ChatPage — chat flow, timer, prompts, connection exchange

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { UserProvider } from '@/context/UserContext';
import { SocketProvider } from '@/context/SocketContext';
import { ChatPage } from '@/pages/ChatPage';

function renderWithProviders(matchId = 'demo_test1234', eventId = 'TEST1234', partnerName?: string) {
  const partnerParam = partnerName ? `&partner=${partnerName}` : '';
  return render(
    <UserProvider>
      <SocketProvider>
        <MemoryRouter initialEntries={[`/chat/${matchId}?event_id=${eventId}${partnerParam}`]}>
          <Routes>
            <Route path="/chat/:matchId" element={<ChatPage />} />
          </Routes>
        </MemoryRouter>
      </SocketProvider>
    </UserProvider>
  );
}

describe('ChatPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    localStorage.clear();
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve([]),
    });
  });

  it('renders chat header', () => {
    renderWithProviders();
    expect(screen.getByText('Micro-Chat')).toBeInTheDocument();
  });

  it('shows loading state initially', () => {
    renderWithProviders();
    expect(screen.getByText(/setting up your chat/i)).toBeInTheDocument();
  });

  it('shows fallback partner name when no partner param', async () => {
    renderWithProviders('demo_test1234');
    await waitFor(() => {
      expect(screen.getByText(/Dan_DevOps/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('shows partner name from URL param when provided', async () => {
    const partnerName = 'Sarah_Dev';
    renderWithProviders('demo_test1234', 'TEST1234', partnerName);
    await waitFor(() => {
      expect(screen.getByText(new RegExp(partnerName, 'i'))).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('shows conversation prompts section', async () => {
    renderWithProviders('demo_test1234');
    await waitFor(() => {
      expect(screen.getByText(/Conversation Prompts/i)).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('shows next prompt button', async () => {
    renderWithProviders('demo_test1234');
    await waitFor(() => {
      expect(screen.getByText('Next Prompt')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  it('shows back to home button', () => {
    renderWithProviders();
    expect(screen.getByText(/Back to Home/i)).toBeInTheDocument();
  });
});
