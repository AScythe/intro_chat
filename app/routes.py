# routes.py
# Description: FastAPI APIRouter with all HTTP route handlers for page rendering (index, user info, room, chat) plus REST API endpoints and WebSocket handler for events, users, rooms, matches, QR codes, and conversation prompts
# ====
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

import os
import time
from urllib.parse import urljoin

import aiosqlite
from fastapi import APIRouter, Request, HTTPException, WebSocket
from fastapi.responses import HTMLResponse, JSONResponse

from .config import DB_PATH, DEFAULT_ROOMS, FRONTEND_DIST_DIR
from .connection_manager import manager
from .helpers import short_id, insert_default_rooms
from .matchmaking import find_match
from .qr_utils import generate_qr_data_uri
from .schemas import CreateEventRequest, JoinEventRequest, SetUserRoomRequest, SetAvailabilityRequest, ExchangeConnectionRequest
from .state import active_users, active_matches, active_matches_lock, waiting_queue, connection_statuses, CONVERSATION_PROMPTS, USER_TEMPLATE, UserData
from .websocket_handler import handle_websocket

router = APIRouter()

@router.get('/')
async def index() -> HTMLResponse:
    with open(os.path.join(FRONTEND_DIST_DIR, 'index.html')) as f:
        return HTMLResponse(content=f.read())

@router.post('/api/events')
async def create_event(data: CreateEventRequest) -> dict:
    event_id = short_id()
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute('INSERT INTO events (id, name) VALUES (?, ?)',
                         (event_id, data.name or 'IntroChat Event'))
        await insert_default_rooms(db, event_id)
        await db.commit()
    return {'event_id': event_id, 'rooms': DEFAULT_ROOMS}

@router.get('/api/events/{event_id}/rooms', response_model=None)
async def get_rooms(event_id: str) -> list[dict[str, str]] | JSONResponse:
    try:
        async with aiosqlite.connect(DB_PATH) as db:
            cursor = await db.execute('SELECT id, name FROM rooms WHERE event_id = ?', (event_id,))
            rows = await cursor.fetchall()
            rooms = [{'id': row[0], 'name': row[1]} for row in rows]
            if not rooms:
                cursor = await db.execute('SELECT id, name FROM rooms WHERE LOWER(event_id) = LOWER(?)', (event_id,))
                rows = await cursor.fetchall()
                rooms = [{'id': row[0], 'name': row[1]} for row in rows]
            if not rooms:
                await insert_default_rooms(db, event_id)
                await db.commit()
                cursor = await db.execute('SELECT id, name FROM rooms WHERE event_id = ?', (event_id,))
                rows = await cursor.fetchall()
                rooms = [{'id': row[0], 'name': row[1]} for row in rows]
            return rooms
    except Exception as e:
        logger.error(f'Error loading rooms: {e}', exc_info=True)
        return JSONResponse(content=[])

@router.post('/api/events/{event_id}/join')
async def join_event(event_id: str, data: JoinEventRequest) -> dict:
    user_id = short_id()
    username = data.username or f'User_{user_id}'
    linkedin_url = data.linkedin_url or ''
    slack_handle = data.slack_handle or ''
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute('INSERT INTO users (id, event_id, username, linkedin_url, slack_handle) VALUES (?, ?, ?, ?, ?)',
                         (user_id, event_id, username, linkedin_url, slack_handle))
        await db.commit()
    active_users[user_id] = UserData(
        event_id=event_id,
        username=username,
        room_id=None,
        linkedin_url=linkedin_url,
        slack_handle=slack_handle,
        is_available=False,
        last_seen=str(time.time())
    )
    return {'user_id': user_id, 'username': username}

@router.post('/api/users/{user_id}/room')
async def set_user_room(user_id: str, data: SetUserRoomRequest) -> dict:
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute('SELECT id, event_id, username FROM users WHERE id = ?', (user_id,))
        user_data = await cursor.fetchone()
        if not user_data:
            raise HTTPException(status_code=404, detail='User not found')
        if user_id not in active_users:
            active_users[user_id] = UserData(
                event_id=str(user_data[1]),
                username=str(user_data[2]),
                room_id=None,
                linkedin_url='',
                slack_handle='',
                is_available=False,
                last_seen=str(time.time())
            )
        active_users[user_id]['room_id'] = data.room_id
        await db.execute('UPDATE users SET room_id = ? WHERE id = ?', (data.room_id, user_id))
        await db.commit()
    return {'success': True}

@router.post('/api/users/{user_id}/available')
async def set_availability(user_id: str, data: SetAvailabilityRequest) -> dict:
    if user_id not in active_users:
        raise HTTPException(status_code=404, detail='User not found')
    active_users[user_id]['is_available'] = data.available
    active_users[user_id]['last_seen'] = str(time.time())
    if data.available:
        await find_match(user_id)
    elif user_id in waiting_queue:
        del waiting_queue[user_id]
    return {'success': True}

@router.get('/api/users/{user_id}/match')
async def get_user_match(user_id: str) -> dict:
    with active_matches_lock:
        for match_id, match in active_matches.items():
            if match['user1_id'] == user_id or match['user2_id'] == user_id:
                return {'match_id': match_id}
    raise HTTPException(status_code=404, detail='No match found for this user')

@router.get('/api/matches/{match_id}')
async def get_match(match_id: str) -> dict:
    with active_matches_lock:
        if match_id not in active_matches:
            raise HTTPException(status_code=404, detail='Match not found')
        match = active_matches[match_id]
    user1 = active_users.get(match['user1_id']) or {}
    user2 = active_users.get(match['user2_id']) or {}
    return {
        'match_id': match_id,
        'user1_username': user1.get('username', 'Unknown'),
        'user2_username': user2.get('username', 'Unknown'),
        'room_id': match['room_id']
    }

@router.post('/api/matches/{match_id}/connect')
async def exchange_connection(match_id: str, data: ExchangeConnectionRequest) -> dict:
    with active_matches_lock:
        if match_id not in active_matches:
            raise HTTPException(status_code=404, detail='Match not found')
        match = active_matches[match_id]
    if match_id not in connection_statuses:
        connection_statuses[match_id] = {}
    connection_statuses[match_id][data.user_id] = data.wants_to_connect
    if len(connection_statuses[match_id]) == 2:
        both_want = all(connection_statuses[match_id].values())
        if both_want:
            user1 = active_users.get(match['user1_id']) or {}
            user2 = active_users.get(match['user2_id']) or {}
            await manager.broadcast_to_users(
                [match['user1_id'], match['user2_id']],
                {
                    'type': 'connection_exchanged',
                    'user1_username': user1.get('username', 'Unknown'),
                    'user2_username': user2.get('username', 'Unknown')
                }
            )
        else:
            await manager.broadcast_to_users(
                [match['user1_id'], match['user2_id']],
                {'type': 'connection_declined'}
            )
    return {'success': True}

@router.get('/api/qr/{event_id}')
async def generate_qr(event_id: str, request: Request) -> dict:
    origin = f"{request.url.scheme}://{request.url.netloc}/"
    qr_data = urljoin(origin, f"room/{event_id}")
    return {'qr_code': generate_qr_data_uri(qr_data)}

@router.get('/api/prompts')
async def get_prompts() -> list[str]:
    return CONVERSATION_PROMPTS

@router.websocket('/ws')
async def websocket_endpoint(websocket: WebSocket) -> None:
    await handle_websocket(websocket)
