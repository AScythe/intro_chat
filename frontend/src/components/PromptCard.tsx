// PromptCard.tsx
// Description: Conversation prompt display with fade transition

interface PromptCardProps {
  prompt: string;
}

export function PromptCard({ prompt }: PromptCardProps) {
  return <div className="prompt-item">{prompt}</div>;
}
