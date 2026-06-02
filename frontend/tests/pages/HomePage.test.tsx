// HomePage.test.tsx
// Description: Tests for HomePage — event creation, join, navigation

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { HomePage } from '@/pages/HomePage';

function renderWithRouter() {
  return render(
    <BrowserRouter>
      <HomePage />
    </BrowserRouter>
  );
}

describe('HomePage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renders hero title and subtitle', () => {
    renderWithRouter();
    expect(screen.getByText('IntroChat')).toBeInTheDocument();
  });

  it('renders event code input and join button', () => {
    renderWithRouter();
    expect(screen.getByPlaceholderText('Enter event code (e.g., ABC123)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Join Event' })).toBeInTheDocument();
  });

  it('renders create event section with name input', () => {
    renderWithRouter();
    expect(screen.getByPlaceholderText(/event name/i)).toBeInTheDocument();
    expect(screen.getByText('Create Event')).toBeInTheDocument();
  });

  it('renders feature grid with 4 items', () => {
    renderWithRouter();
    const joinEventHeaders = screen.getAllByText('Join Event');
    expect(joinEventHeaders.length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('Select Room')).toBeInTheDocument();
    expect(screen.getByText('Get Matched')).toBeInTheDocument();
    expect(screen.getByText('2-Min Chat')).toBeInTheDocument();
  });

  it('renders privacy notice', () => {
    renderWithRouter();
    expect(screen.getByText(/Privacy First/i)).toBeInTheDocument();
  });

  it('navigates to /join/:code when joining with valid code', () => {
    renderWithRouter();
    const input = screen.getByPlaceholderText('Enter event code (e.g., ABC123)');
    fireEvent.change(input, { target: { value: 'ABC12345' } });
    fireEvent.click(screen.getByRole('button', { name: 'Join Event' }));
    expect(window.location.pathname).toBe('/join/ABC12345');
  });

  it('shows QR code after creating event', async () => {
    const mockResponse = { event_id: 'TEST1234', rooms: ['Main Hall'] };
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    renderWithRouter();
    const nameInput = screen.getByPlaceholderText(/event name/i);
    fireEvent.change(nameInput, { target: { value: 'Test Event' } });
    fireEvent.click(screen.getByText('Create Event'));

    await waitFor(() => {
      expect(screen.getByText(/Event Created/i)).toBeInTheDocument();
    });
    expect(screen.getByText('TEST1234')).toBeInTheDocument();
  });

  it('shows Organize Event button after creating event', async () => {
    const mockResponse = { event_id: 'TEST1234', rooms: ['Main Hall'] };
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    renderWithRouter();
    const nameInput = screen.getByPlaceholderText(/event name/i);
    fireEvent.change(nameInput, { target: { value: 'Test Event' } });
    fireEvent.click(screen.getByText('Create Event'));

    await waitFor(() => {
      expect(screen.getByText('Organize Event')).toBeInTheDocument();
    });
  });

  it('Test This Event button appears only in Edit section after creation', async () => {
    const mockResponse = { event_id: 'TEST1234', rooms: ['Main Hall'] };
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: () => Promise.resolve(mockResponse),
    });

    renderWithRouter();
    const nameInput = screen.getByPlaceholderText(/event name/i);
    fireEvent.change(nameInput, { target: { value: 'Test Event' } });
    fireEvent.click(screen.getByText('Create Event'));

    await waitFor(() => {
      expect(screen.getByText('Organize Event')).toBeInTheDocument();
    });
    const buttons = screen.getAllByRole('button', { name: 'Test This Event' });
    expect(buttons.length).toBe(1);
    expect(buttons[0]).toBeDisabled();
  });

  it('shows Test This Event button in Edit section, disabled when input empty', () => {
    renderWithRouter();
    const buttons = screen.getAllByRole('button', { name: 'Test This Event' });
    expect(buttons.length).toBe(1);
    expect(buttons[0]).toBeDisabled();
  });

  it('enables Test This Event button when event code is entered', () => {
    renderWithRouter();
    const input = screen.getByPlaceholderText('Enter event code');
    fireEvent.change(input, { target: { value: 'TEST1234' } });
    const buttons = screen.getAllByRole('button', { name: 'Test This Event' });
    expect(buttons[0]).not.toBeDisabled();
  });

  it('renders Edit an Event section', () => {
    renderWithRouter();
    expect(screen.getByText('Edit an Event')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Enter event code')).toBeInTheDocument();
    expect(screen.getByText('Edit Event')).toBeInTheDocument();
  });
});
