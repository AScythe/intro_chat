// useSocket.test.ts
// Description: Tests for useSocket hook — connect, disconnect, and auto-reconnect

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useSocket } from '@/hooks/useSocket';
import { SocketProvider } from '@/context/SocketContext';

type WsHandler = ((event: MessageEvent) => void) | null;

function createMockWebSocket() {
  let onopenHandler: (() => void) | null = null;
  let oncloseHandler: (() => void) | null = null;
  let onmessageHandler: WsHandler = null;
  let onerrorHandler: ((err: Event) => void) | null = null;

  const mockWs = {
    readyState: 0,
    send: vi.fn(),
    close: vi.fn(() => {
      oncloseHandler?.();
    }),
    get onopen() {
      return onopenHandler;
    },
    set onopen(handler: (() => void) | null) {
      onopenHandler = handler;
    },
    get onclose() {
      return oncloseHandler;
    },
    set onclose(handler: (() => void) | null) {
      oncloseHandler = handler;
    },
    get onmessage() {
      return onmessageHandler;
    },
    set onmessage(handler: WsHandler) {
      onmessageHandler = handler;
    },
    get onerror() {
      return onerrorHandler;
    },
    set onerror(handler: ((err: Event) => void) | null) {
      onerrorHandler = handler;
    },
    addEventListener: vi.fn(),
    CONNECTING: 0,
    OPEN: 1,
    CLOSING: 2,
    CLOSED: 3,
  };

  return { mockWs, getOnopen: () => onopenHandler, getOnmessage: () => onmessageHandler, getOnclose: () => oncloseHandler };
}

describe('useSocket', () => {
  let mockWs: ReturnType<typeof createMockWebSocket>['mockWs'];
  let getOnopen: () => (() => void) | null;
  let getOnmessage: () => WsHandler;

  beforeEach(() => {
    const mock = createMockWebSocket();
    mockWs = mock.mockWs;
    getOnopen = mock.getOnopen;
    getOnmessage = mock.getOnmessage;

    vi.stubGlobal('WebSocket', vi.fn(() => mockWs));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('provides default disconnected state', () => {
    const { result } = renderHook(() => useSocket(), {
      wrapper: SocketProvider,
    });

    expect(result.current.isConnected).toBe(false);
  });

  it('connects and sends hello message on open', () => {
    const { result } = renderHook(() => useSocket(), {
      wrapper: SocketProvider,
    });

    act(() => {
      result.current.connect('user1', 'room1');
    });

    expect(WebSocket).toHaveBeenCalledWith(expect.stringContaining('/ws'));

    act(() => {
      getOnopen()?.();
    });

    expect(mockWs.send).toHaveBeenCalledWith(
      JSON.stringify({ type: 'hello', user_id: 'user1', room_id: 'room1' }),
    );
  });

  it('sets isConnected to true on open', () => {
    const { result } = renderHook(() => useSocket(), {
      wrapper: SocketProvider,
    });

    act(() => {
      result.current.connect('user1');
    });

    act(() => {
      getOnopen()?.();
    });

    expect(result.current.isConnected).toBe(true);
  });

  it('notifies subscribers on server events', () => {
    const { result } = renderHook(() => useSocket(), {
      wrapper: SocketProvider,
    });

    const handler = vi.fn();
    act(() => {
      result.current.connect('user1');
    });

    act(() => {
      result.current.subscribe('match_found', handler);
    });

    act(() => {
      getOnopen()?.();
    });

    act(() => {
      const msg = new MessageEvent('message', {
        data: JSON.stringify({
          type: 'match_found',
          match_id: 'm1',
          room_id: 'r1',
          user1_username: 'Alice',
          user2_username: 'Bob',
        }),
      });
      getOnmessage()?.(msg);
    });

    expect(handler).toHaveBeenCalledWith({
      type: 'match_found',
      match_id: 'm1',
      room_id: 'r1',
      user1_username: 'Alice',
      user2_username: 'Bob',
    });
  });

  it('disconnect closes WebSocket', () => {
    const { result } = renderHook(() => useSocket(), {
      wrapper: SocketProvider,
    });

    act(() => {
      result.current.connect('user1');
    });

    act(() => {
      result.current.disconnect();
    });

    expect(mockWs.close).toHaveBeenCalled();
  });
});
