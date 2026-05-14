// useSocket.ts
// Description: Context and hook for managing a persistent WebSocket connection

import { createContext, useContext } from 'react';

export interface SocketContextValue {
  isConnected: boolean;
  connect: (userId: string, roomId?: string) => void;
  disconnect: () => void;
  subscribe: <T>(eventType: string, handler: (data: T) => void) => () => void;
}

export const SocketContext = createContext<SocketContextValue | null>(null);

export function useSocket(): SocketContextValue {
  const ctx = useContext(SocketContext);
  if (!ctx) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return ctx;
}
