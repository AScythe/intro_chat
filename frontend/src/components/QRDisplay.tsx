// QRDisplay.tsx
// Description: QR code image display with event code shown below

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface QRDisplayProps {
  qrCode: string;
  eventCode: string;
  eventName: string;
}

export function QRDisplay({ qrCode, eventCode, eventName }: QRDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>✅ Event Created!</CardTitle>
        <CardDescription>Share this QR code with attendees</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <img
            src={qrCode}
            alt="QR Code"
            className="max-w-[200px] rounded-[12px] shadow-soft"
          />
        </div>
        <div className="rounded-[12px] bg-muted p-5 space-y-2">
          <p className="text-sm">
            <strong>Event Code:</strong> <span>{eventCode}</span>
          </p>
          <p className="text-sm">
            <strong>Event Name:</strong> <span>{eventName}</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
