# connection_manager.py
# Description: WebSocket connection manager that tracks user-to-websocket mappings, room memberships, and provides per-user and per-room message broadcasting
# ====
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

from fastapi import WebSocket
from starlette.websockets import WebSocketDisconnect
class ConnectionManager:
    def __init__(self) -> None:
        self.user_connections: dict[str, WebSocket] = {}
        self.user_rooms: dict[str, str] = {}
        self.room_users: dict[str, set[str]] = {}

    async def connect(self, websocket: WebSocket, user_id: str, room_id: str) -> None:
        self.user_connections[user_id] = websocket
        self.user_rooms[user_id] = room_id
        self.room_users.setdefault(room_id, set()).add(user_id)

    def disconnect(self, user_id: str) -> None:
        self.user_connections.pop(user_id, None)
        room_id = self.user_rooms.pop(user_id, None)
        if room_id and room_id in self.room_users:
            self.room_users[room_id].discard(user_id)
            if not self.room_users[room_id]:
                del self.room_users[room_id]

    async def send_to_user(self, user_id: str, message: dict) -> None:
        ws = self.user_connections.get(user_id)
        if ws is None:
            return
        try:
            await ws.send_json(message)
        except WebSocketDisconnect:
            self.disconnect(user_id)

    async def broadcast_to_users(self, user_ids: list, message: dict) -> None:
        for uid in user_ids:
            await self.send_to_user(uid, message)


manager = ConnectionManager()
