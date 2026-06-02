// OrganizeEventPage.chip-stability.test.tsx
// Description: Tests verifying chip selection state remains stable when typing in input fields

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
    { id: 'r3', name: 'Quiet Corner', selected: false, is_default: true },
    { id: 'r4', name: 'Coffee Area', selected: false, is_default: true },
  ],
  topics: [
    { id: 't1', name: 'AI Development', selected: true, is_default: true },
    { id: 't2', name: 'DevOps', selected: true, is_default: true },
    { id: 't3', name: 'Swimming', selected: false, is_default: true },
    { id: 't4', name: 'Anime', selected: false, is_default: true },
  ],
};

describe('OrganizeEventPage chip state stability', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('preserves chip toggle state when typing in add-room input', async () => {
    vi.mocked(fetchJSON).mockResolvedValue(mockConfig);
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Main Hall')).toBeInTheDocument();
    });

    const mainHallChip = screen.getByText('Main Hall').closest('button')!;
    expect(mainHallChip.className).toContain('bg-primary');

    fireEvent.click(mainHallChip);
    expect(mainHallChip.className).toContain('border');

    const input = screen.getByPlaceholderText('Add new room...');
    fireEvent.change(input, { target: { value: 'T' } });
    expect(mainHallChip.className).toContain('border');

    fireEvent.change(input, { target: { value: 'Table 1' } });
    expect(mainHallChip.className).toContain('border');
  });

  it('preserves chip toggle state when typing in add-topic input', async () => {
    vi.mocked(fetchJSON).mockResolvedValue(mockConfig);
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('AI Development')).toBeInTheDocument();
    });

    const aiChip = screen.getByText('AI Development').closest('button')!;
    expect(aiChip.className).toContain('bg-primary');

    fireEvent.click(aiChip);
    expect(aiChip.className).toContain('border');

    const topicInput = screen.getByPlaceholderText('Add new topic...');
    fireEvent.change(topicInput, { target: { value: 'Rust' } });
    expect(aiChip.className).toContain('border');
  });

  it('does not flip chip states after multiple input changes', async () => {
    vi.mocked(fetchJSON).mockResolvedValue(mockConfig);
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Main Hall')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Main Hall').closest('button')!);
    fireEvent.click(screen.getByText('Quiet Corner').closest('button')!);

    const mainHall = screen.getByText('Main Hall').closest('button')!;
    const quietCorner = screen.getByText('Quiet Corner').closest('button')!;

    expect(mainHall.className).toContain('border');
    expect(quietCorner.className).toContain('bg-primary');

    const input = screen.getByPlaceholderText('Add new room...');
    fireEvent.change(input, { target: { value: 'M' } });
    fireEvent.change(input, { target: { value: 'Ma' } });
    fireEvent.change(input, { target: { value: 'Mai' } });
    fireEvent.change(input, { target: { value: 'Main' } });
    fireEvent.change(input, { target: { value: 'Main ' } });
    fireEvent.change(input, { target: { value: 'Main Hall' } });

    expect(mainHall.className).toContain('border');
    expect(quietCorner.className).toContain('bg-primary');
  });

  it('chip states remain consistent after rapid room and topic input changes', async () => {
    vi.mocked(fetchJSON).mockResolvedValue(mockConfig);
    renderWithRouter();

    await waitFor(() => {
      expect(screen.getByText('Main Hall')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('Table 1').closest('button')!);
    fireEvent.click(screen.getByText('DevOps').closest('button')!);

    const table1 = screen.getByText('Table 1').closest('button')!;
    const devops = screen.getByText('DevOps').closest('button')!;
    expect(table1.className).toContain('border');
    expect(devops.className).toContain('border');

    const roomInput = screen.getByPlaceholderText('Add new room...');
    const topicInput = screen.getByPlaceholderText('Add new topic...');

    fireEvent.change(roomInput, { target: { value: 'X' } });
    fireEvent.change(topicInput, { target: { value: 'Y' } });
    fireEvent.change(roomInput, { target: { value: '' } });
    fireEvent.change(topicInput, { target: { value: '' } });

    expect(table1.className).toContain('border');
    expect(devops.className).toContain('border');
  });
});
