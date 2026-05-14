// ConnectionCard.tsx
// Description: Post-chat connection card with yes/no buttons for Slack connection exchange

interface ConnectionCardProps {
  onYes: () => void;
  onNo: () => void;
}

export function ConnectionCard({ onYes, onNo }: ConnectionCardProps) {
  return (
    <div className="card">
      <h2>💬 Connect</h2>
      <div className="slack-connection-content">
        <p>Would you like to exchange usernames to connect?</p>
        <div className="connection-options">
          <button className="btn btn-primary" onClick={onYes}>
            Yes, let's connect!
          </button>
          <button className="btn btn-secondary" onClick={onNo}>
            No thanks
          </button>
        </div>
      </div>
    </div>
  );
}
