// PromptCard.tsx
// Description: Conversation prompt display with fade transition and left accent border

import { cn } from '@/lib/utils';

interface PromptCardProps {
  prompt: string;
}

export function PromptCard({ prompt }: PromptCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl border-l-4 border-primary bg-card p-5 shadow-soft text-lg leading-relaxed text-foreground',
        'prompt-item',
      )}
    >
      {prompt}
    </div>
  );
}
