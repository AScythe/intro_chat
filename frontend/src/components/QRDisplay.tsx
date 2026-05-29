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
        <CardTitle className="font-heading text-2xl">Event Created!</CardTitle>
        <CardDescription>Share this QR code with attendees</CardDescription>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex justify-center">
          <img
            src={qrCode}
            alt="QR Code"
            className="max-w-[180px] rounded-xl shadow-soft"
          />
        </div>
        <div className="space-y-2 rounded-xl bg-muted p-5">
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Event Code:</span> {eventCode}
          </p>
          <p className="text-sm text-muted-foreground">
            <span className="font-medium text-foreground">Event Name:</span> {eventName}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
