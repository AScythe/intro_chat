// PersonCard.tsx
// Description: Person selector card showing username, availability status, and click-to-select

import type { SamplePerson } from '@/utils/demoData';
import { cn } from '@/lib/utils';

interface PersonCardProps {
  person: SamplePerson;
  selected?: boolean;
  onClick?: () => void;
}

export function PersonCard({ person, selected, onClick }: PersonCardProps) {
  return (
    <div
      className={cn(
        'group flex items-center gap-3 rounded-xl border-2 bg-card p-4 shadow-soft transition-all duration-300 cursor-pointer',
        selected
          ? 'border-primary bg-primary/10 shadow-md'
          : 'border-border hover:border-primary hover:-translate-y-0.5 hover:shadow-md',
      )}
      onClick={onClick}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
        {person.name.charAt(0)}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate font-semibold text-foreground">{person.name}</div>
        <div className="truncate text-sm italic text-muted-foreground">
          {person.status}
        </div>
      </div>
      <div
        className={cn(
          'text-xs font-medium',
          selected ? 'text-primary opacity-100' : 'text-primary opacity-0 group-hover:opacity-100',
        )}
      >
        {selected ? 'Selected' : 'Select'}
      </div>
    </div>
  );
}
