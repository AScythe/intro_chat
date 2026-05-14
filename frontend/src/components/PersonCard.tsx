// PersonCard.tsx
// Description: Person selector card showing username, availability status, and click-to-select

import type { SamplePerson } from '@/utils/demoData';

interface PersonCardProps {
  person: SamplePerson;
  selected?: boolean;
  onClick?: () => void;
}

export function PersonCard({ person, selected, onClick }: PersonCardProps) {
  const classNames = ['person-card'];
  if (selected) classNames.push('selected');

  return (
    <div className={classNames.join(' ')} onClick={onClick}>
      <div className="person-avatar">{person.name.charAt(0)}</div>
      <div className="person-info">
        <div className="person-name">{person.name}</div>
        <div className="person-status">{person.status}</div>
      </div>
      <div className="person-select">{selected ? 'Selected' : 'Select'}</div>
    </div>
  );
}
