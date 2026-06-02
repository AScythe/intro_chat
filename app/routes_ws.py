# routes_ws.py
# Description: WebSocket route handler for real-time chat
# ====
from fastapi import APIRouter, WebSocket
from .websocket_handler import handle_websocket

router_ws = APIRouter()


@router_ws.websocket('/ws')
async def websocket_endpoint(websocket: WebSocket) -> None:
    await handle_websocket(websocket)
