# websocket_handler.py
# Description: WebSocket endpoint handler for real-time communication — processes JSON messages, manages room membership changes, and handles disconnection cleanup
# ====

from fastapi import WebSocket
from starlette.websockets import WebSocketDisconnect
from .connection_manager import manager


async def handle_websocket(websocket: WebSocket) -> None:
    await websocket.accept()
    user_id = None
    try:
        hello = await websocket.receive_json()
        user_id = hello.get('user_id')
        room_id = hello.get('room_id', '')
        if not user_id:
            await websocket.close(code=1008)
            return
        await manager.connect(websocket, user_id, room_id)
        while True:
            data = await websocket.receive_json()
            msg_type = data.get('type')
            if msg_type == 'join_room':
                new_room = data.get('room_id', '')
                manager.disconnect(user_id)
                await manager.connect(websocket, user_id, new_room)
    except WebSocketDisconnect:
        if user_id:
            manager.disconnect(user_id)
