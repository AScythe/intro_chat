// useChipSelection.ts [CLEANUP]
// Description: Generic hook for managing chip-based multi-selection with add/remove/toggle — used by OrganizeEventPage for rooms and topics
import { useState } from 'react';

export interface ChipItem {
  id: string;
  name: string;
  selected: boolean;
  is_default: boolean;
}

export function useChipSelection() {
  const [items, setItems] = useState<ChipItem[]>([]);
  const [newItem, setNewItem] = useState('');

  function toggle(id: string) {
    setItems((prev) => prev.map((item) => item.id === id ? { ...item, selected: !item.selected } : item));
  }

  function add() {
    const name = newItem.trim();
    if (!name) return;
    setItems((prev) => {
      const match = prev.find((item) => item.is_default && item.name === name);
      if (match) {
        return prev.map((item) => item.id === match.id ? { ...item, selected: !item.selected } : item);
      }
      return [...prev, { id: `new_${Date.now()}`, name, selected: true, is_default: false }];
    });
    setNewItem('');
  }

  function handleClick(item: ChipItem) {
    if (item.is_default) {
      toggle(item.id);
    } else {
      setItems((prev) => prev.filter((i) => i.id !== item.id));
    }
  }

  return { items, setItems, newItem, setNewItem, add, toggle, handleClick } as const;
}
