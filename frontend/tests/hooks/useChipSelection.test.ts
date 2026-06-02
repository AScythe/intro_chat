// useChipSelection.test.ts
// Description: Tests for useChipSelection hook — toggle, add, handleClick, state stability

import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useChipSelection } from '@/hooks/useChipSelection';

const defaultItems = [
  { id: '1', name: 'Main Hall', selected: false, is_default: true },
  { id: '2', name: 'Table 1', selected: true, is_default: true },
  { id: '3', name: 'Custom Room', selected: false, is_default: false },
];

describe('useChipSelection', () => {
  beforeEach(() => {
    // reset is implicit per renderHook call
  });

  it('toggles selected state by id', () => {
    const { result } = renderHook(() => useChipSelection());
    act(() => { result.current.setItems(defaultItems); });

    act(() => { result.current.toggle('1'); });
    expect(result.current.items.find((i) => i.id === '1')?.selected).toBe(true);

    act(() => { result.current.toggle('1'); });
    expect(result.current.items.find((i) => i.id === '1')?.selected).toBe(false);
  });

  it('toggles only the targeted item', () => {
    const { result } = renderHook(() => useChipSelection());
    act(() => { result.current.setItems(defaultItems); });

    act(() => { result.current.toggle('2'); });
    expect(result.current.items.find((i) => i.id === '2')?.selected).toBe(false);
    expect(result.current.items.find((i) => i.id === '1')?.selected).toBe(false);
    expect(result.current.items.find((i) => i.id === '3')?.selected).toBe(false);
  });

  it('add creates a new custom item', () => {
    const { result } = renderHook(() => useChipSelection());
    act(() => { result.current.setItems(defaultItems); });

    act(() => { result.current.setNewItem('New Topic'); });
    act(() => { result.current.add(); });

    const added = result.current.items.find((i) => i.name === 'New Topic');
    expect(added).toBeDefined();
    expect(added?.selected).toBe(true);
    expect(added?.is_default).toBe(false);
    expect(result.current.newItem).toBe('');
  });

  it('add toggles default item by name instead of creating duplicate', () => {
    const { result } = renderHook(() => useChipSelection());
    act(() => { result.current.setItems(defaultItems); });

    act(() => { result.current.setNewItem('Main Hall'); });
    act(() => { result.current.add(); });

    const items = result.current.items;
    expect(items.filter((i) => i.name === 'Main Hall')).toHaveLength(1);
    expect(items.find((i) => i.name === 'Main Hall')?.selected).toBe(true);
  });

  it('add ignores empty name', () => {
    const { result } = renderHook(() => useChipSelection());
    act(() => { result.current.setItems(defaultItems); });

    act(() => { result.current.add(); });

    expect(result.current.items).toHaveLength(3);
  });

  it('handleClick toggles default items', () => {
    const { result } = renderHook(() => useChipSelection());
    act(() => { result.current.setItems(defaultItems); });

    const mainHall = defaultItems[0]!;
    act(() => { result.current.handleClick(mainHall); });
    expect(result.current.items.find((i) => i.id === '1')?.selected).toBe(true);
  });

  it('handleClick removes custom items', () => {
    const { result } = renderHook(() => useChipSelection());
    act(() => { result.current.setItems(defaultItems); });

    const customRoom = defaultItems[2]!;
    act(() => { result.current.handleClick(customRoom); });
    expect(result.current.items.find((i) => i.id === '3')).toBeUndefined();
  });

  it('state stability on re-render — toggle does not mutate previous state', () => {
    const { result, rerender } = renderHook(() => useChipSelection());
    act(() => { result.current.setItems(defaultItems); });

    act(() => { result.current.toggle('1'); });
    const selectedState1 = result.current.items.map((i) => i.selected);
    rerender();
    const selectedState2 = result.current.items.map((i) => i.selected);
    expect(selectedState2).toEqual(selectedState1);
  });
});
