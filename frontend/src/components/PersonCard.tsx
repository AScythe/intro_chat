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
        'group flex items-center gap-3 rounded-[12px] border-2 bg-card p-4 shadow-soft transition-all duration-300 cursor-pointer',
        selected
          ? 'border-sage bg-sage/10 shadow-md selected'
          : 'border-border hover:border-primary hover:-translate-y-0.5 hover:shadow-md',
      )}
      onClick={onClick}
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary/70 text-sm font-bold text-primary-foreground">
        {person.name.charAt(0)}
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-semibold text-foreground truncate">{person.name}</div>
        <div className="text-sm text-muted-foreground italic truncate">
          {person.status}
        </div>
      </div>
      <div
        className={cn(
          'text-xs font-medium',
          selected ? 'text-sage opacity-100' : 'text-primary opacity-0 group-hover:opacity-100',
        )}
      >
        {selected ? 'Selected' : 'Select'}
      </div>
    </div>
  );
}
