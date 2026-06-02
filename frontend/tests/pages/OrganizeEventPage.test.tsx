import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { OrganizeEventPage } from '@/pages/OrganizeEventPage';
import { fetchJSON } from '@/api/client';

vi.mock('@/api/client', () => ({
  fetchJSON: vi.fn(),
}));

function renderWithRouter() {
  return render(
    <MemoryRouter initialEntries={['/organize/test123']}>
      <Routes>
        <Route path="/organize/:eventId" element={<OrganizeEventPage />} />
      </Routes>
    </MemoryRouter>
  );
}

const mockConfig = {
  rooms: [
    { id: 'r1', name: 'Main Hall', selected: true, is_default: true },
    { id: 'r2', name: 'Table 1', selected: true, is_default: true },
  ],
  topics: [
    { id: 't1', name: 'AI/ML', selected: true, is_default: true },
    { id: 't2', name: 'Web Dev', selected: true, is_default: true },
  ],
};

describe('OrganizeEventPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('shows loading state initially', () => {
    vi.mocked(fetchJSON).mockReturnValue(new Promise(() => {}));
    renderWithRouter();
    expect(screen.queryByText('Organize Event')).not.toBeInTheDocument();
  });

  it('renders rooms and topics as chips after loading', async () => {
    vi.mocked(fetchJSON).mockResolvedValue(mockConfig);
    renderWithRouter();
    await waitFor(() => {
      expect(screen.getByText('Main Hall')).toBeInTheDocument();
    });
    expect(screen.getByText('Table 1')).toBeInTheDocument();
    expect(screen.getByText('AI/ML')).toBeInTheDocument();
    expect(screen.getByText('Web Dev')).toBeInTheDocument();
  });

  it('toggles default room chip between selected and unselected', async () => {
    vi.mocked(fetchJSON).mockResolvedValue(mockConfig);
    renderWithRouter();
    await waitFor(() => {
      expect(screen.getByText('Main Hall')).toBeInTheDocument();
    });
    const chip = screen.getByText('Main Hall').closest('button')!;
    expect(chip).toBeInTheDocument();
    fireEvent.click(chip);
    fireEvent.click(screen.getByText('Save Configuration'));
    await waitFor(() => {
      expect(fetchJSON).toHaveBeenLastCalledWith(
        '/api/events/test123/config',
        expect.objectContaining({
          method: 'PUT',
          body: expect.stringContaining('"rooms":["Table 1"]'),
        })
      );
    });
  });

  it('adds a new room chip', async () => {
    vi.mocked(fetchJSON).mockResolvedValue(mockConfig);
    renderWithRouter();
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Add new room...')).toBeInTheDocument();
    });
    const input = screen.getByPlaceholderText('Add new room...');
    fireEvent.change(input, { target: { value: 'New Room' } });
    const addButtons = screen.getAllByRole('button', { name: 'Add' });
    fireEvent.click(addButtons[0]!);
    expect(screen.getByText('New Room')).toBeInTheDocument();
  });

  it('removes a user-added room chip on click', async () => {
    vi.mocked(fetchJSON).mockResolvedValue(mockConfig);
    renderWithRouter();
    await waitFor(() => {
      expect(screen.getByPlaceholderText('Add new room...')).toBeInTheDocument();
    });
    const input = screen.getByPlaceholderText('Add new room...');
    fireEvent.change(input, { target: { value: 'Custom Room' } });
    fireEvent.click(screen.getAllByRole('button', { name: 'Add' })[0]!);
    expect(screen.getByText('Custom Room')).toBeInTheDocument();
    fireEvent.click(screen.getByText('Custom Room'));
    expect(screen.queryByText('Custom Room')).not.toBeInTheDocument();
  });

  it('add toggles a default chip instead of duplicating when name matches', async () => {
    vi.mocked(fetchJSON).mockResolvedValue(mockConfig);
    renderWithRouter();
    await waitFor(() => {
      expect(screen.getByText('Main Hall')).toBeInTheDocument();
    });
    const chip = screen.getByText('Main Hall').closest('button')!;
    fireEvent.click(chip);
    const input = screen.getByPlaceholderText('Add new room...');
    fireEvent.change(input, { target: { value: 'Main Hall' } });
    fireEvent.click(screen.getAllByRole('button', { name: 'Add' })[0]!);
    fireEvent.click(screen.getByText('Save Configuration'));
    await waitFor(() => {
      expect(fetchJSON).toHaveBeenLastCalledWith(
        '/api/events/test123/config',
        expect.objectContaining({
          method: 'PUT',
          body: expect.stringContaining('"rooms":["Main Hall"'),
        })
      );
    });
  });

  it('saves configuration and navigates home', async () => {
    vi.mocked(fetchJSON).mockResolvedValueOnce(mockConfig);
    vi.mocked(fetchJSON).mockResolvedValueOnce({ success: true, rooms_filled: [] });
    renderWithRouter();
    await waitFor(() => {
      expect(screen.getByText('Main Hall')).toBeInTheDocument();
    });
    fireEvent.click(screen.getByText('Save Configuration'));
    await waitFor(() => {
      expect(fetchJSON).toHaveBeenCalledWith(
        '/api/events/test123/config',
        expect.objectContaining({ method: 'PUT' })
      );
    });
  });

  it('shows error toast when fetch fails and redirects', async () => {
    vi.mocked(fetchJSON).mockRejectedValue(new Error('Not found'));
    renderWithRouter();
    await waitFor(() => {
      expect(window.location.pathname).toBe('/');
    });
  });
});
