// SocketContext.tsx
// Description: WebSocket context provider — connects at app root, persists across routes, auto-reconnects

import { useState, useCallback, useRef, useEffect, type ReactNode } from 'react';
import { SocketContext, type SocketContextValue } from '@/hooks/useSocket';

interface Subscription {
  eventType: string;
  handler: (data: unknown) => void;
}

export function SocketProvider({ children }: { children: ReactNode }) {
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const subsRef = useRef<Subscription[]>([]);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reconnectAttemptRef = useRef(0);
  const pendingConnectRef = useRef<{ userId: string; roomId?: string } | null>(null);

  const clearReconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const connect = useCallback((userId: string, roomId?: string) => {
    pendingConnectRef.current = { userId, roomId };
    reconnectAttemptRef.current = 0;

    if (wsRef.current) {
      wsRef.current.close();
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      setIsConnected(true);
      reconnectAttemptRef.current = 0;
      ws.send(JSON.stringify({ type: 'hello', user_id: userId, room_id: roomId || '' }));
    };

    ws.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data as string) as { type: string };
        subsRef.current
          .filter((s) => s.eventType === data.type)
          .forEach((s) => s.handler(data));
      } catch {
        console.warn('Failed to parse WebSocket message');
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      if (pendingConnectRef.current) {
        const delay = Math.min(1000 * 2 ** reconnectAttemptRef.current, 8000);
        reconnectAttemptRef.current++;
        reconnectTimeoutRef.current = setTimeout(() => {
          const p = pendingConnectRef.current;
          if (p) connect(p.userId, p.roomId);
        }, delay);
      }
    };

    ws.onerror = () => {
      ws.close();
    };
  }, []);

  const disconnect = useCallback(() => {
    pendingConnectRef.current = null;
    clearReconnect();
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
  }, [clearReconnect]);

  const subscribe = useCallback(<T,>(eventType: string, handler: (data: T) => void) => {
    const sub: Subscription = { eventType, handler: handler as (data: unknown) => void };
    subsRef.current.push(sub);
    return () => {
      subsRef.current = subsRef.current.filter((s) => s !== sub);
    };
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  const value: SocketContextValue = {
    isConnected,
    connect,
    disconnect,
    subscribe,
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}
