// QRDisplay.tsx
// Description: QR code image display with event code shown below

interface QRDisplayProps {
  qrCode: string;
  eventCode: string;
  eventName: string;
}

export function QRDisplay({ qrCode, eventCode, eventName }: QRDisplayProps) {
  return (
    <div className="card">
      <h2>✅ Event Created!</h2>
      <p className="card-description">Share this QR code with attendees</p>
      <div className="qr-display">
        <img src={qrCode} alt="QR Code" />
      </div>
      <div className="event-info">
        <p>
          <strong>Event Code:</strong> <span>{eventCode}</span>
        </p>
        <p>
          <strong>Event Name:</strong> <span>{eventName}</span>
        </p>
      </div>
    </div>
  );
}
