// MatchCountdown.tsx
// Description: 60-second countdown display shown after a match is found before navigating to chat

interface MatchCountdownProps {
  username: string;
  roomName: string;
  countdown: number;
  onGoToChat: () => void;
}

export function MatchCountdown({
  username,
  roomName,
  countdown,
  onGoToChat,
}: MatchCountdownProps) {
  return (
    <div className="card">
      <h2>🎉 Match Found!</h2>
      <div className="match-info">
        <p>
          You've been matched with <strong>{username}</strong>!
        </p>
        <p className="match-instruction">
          Meet at <strong>{roomName}</strong> in 60 seconds
        </p>
      </div>
      <div className="countdown">
        <span>{countdown}</span>
      </div>
      <button className="btn btn-primary" onClick={onGoToChat}>
        Go to Chat
      </button>
    </div>
  );
}
