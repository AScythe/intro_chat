// QRDisplay.test.tsx
// Description: Tests for QRDisplay — image and event code rendering

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QRDisplay } from '@/components/QRDisplay';

describe('QRDisplay', () => {
  it('renders event code and name', () => {
    render(
      <QRDisplay
        qrCode="data:image/png;base64,abc123"
        eventCode="EVENT123"
        eventName="Test Event"
      />,
    );
    expect(screen.getByText('EVENT123')).toBeInTheDocument();
    expect(screen.getByText('Test Event')).toBeInTheDocument();
  });

  it('renders QR image with correct src', () => {
    render(
      <QRDisplay
        qrCode="data:image/png;base64,abc123"
        eventCode="X"
        eventName="Y"
      />,
    );
    const img = screen.getByAltText('QR Code');
    expect(img).toHaveAttribute('src', 'data:image/png;base64,abc123');
  });
});
