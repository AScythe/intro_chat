# routes_api.py
# Description: REST API route handlers for events, users, rooms, matches, QR codes, and prompts
# ====
import logging
import random
import time
from urllib.parse import urljoin

import aiosqlite
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse

from .config import DB_PATH, DEFAULT_ROOMS, DEFAULT_TOPICS
from .connection_manager import manager
from .database import init_db
from .helpers import short_id, insert_default_rooms, insert_default_topics, get_rooms_for_event
from .matchmaking import find_or_enqueue_match
from .connection_service import handle_connection_exchange
from .qr_utils import generate_qr_data_uri
from .sample_users import SAMPLE_USERS
from .schemas import (
    CreateEventRequest, JoinEventRequest, SetUserRoomRequest,
    SetAvailabilityRequest, ExchangeConnectionRequest, SaveEventConfigRequest,
)
from .prompts import CONVERSATION_PROMPTS
from .state import store, UserData

logger = logging.getLogger(__name__)

router_api = APIRouter()


@router_api.post('/api/events')
async def create_event(data: CreateEventRequest) -> dict:
    event_id = short_id()
    await init_db(DB_PATH)
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute('INSERT INTO events (id, name) VALUES (?, ?)',
                         (event_id, data.name or 'IntroChat Event'))
        await insert_default_rooms(db, event_id)
        await insert_default_topics(db, event_id)
        await db.commit()
    return {'event_id': event_id, 'rooms': DEFAULT_ROOMS}


@router_api.get('/api/events/{event_id}/rooms', response_model=None)
async def get_rooms(event_id: str) -> list[dict[str, str]] | JSONResponse:
    try:
        async with aiosqlite.connect(DB_PATH) as db:
            return await get_rooms_for_event(db, event_id)
    except Exception as e:
        logger.error(f'Error loading rooms: {e}', exc_info=True)
        return JSONResponse(content=[])


@router_api.get('/api/events/{event_id}/config')
async def get_event_config(event_id: str) -> dict:
    await init_db(DB_PATH)
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute('SELECT id FROM events WHERE LOWER(id) = LOWER(?)', (event_id,))
        if not await cursor.fetchone():
            raise HTTPException(status_code=404, detail='Event not found')

        cursor = await db.execute('SELECT id, name, selected FROM rooms WHERE LOWER(event_id) = LOWER(?)', (event_id,))
        rooms = [
            {'id': row[0], 'name': row[1], 'selected': bool(row[2]), 'is_default': row[1] in DEFAULT_ROOMS}
            for row in await cursor.fetchall()
        ]
        if not rooms:
            await insert_default_rooms(db, event_id)
            cursor = await db.execute('SELECT id, name, selected FROM rooms WHERE LOWER(event_id) = LOWER(?)', (event_id,))
            rooms = [
                {'id': row[0], 'name': row[1], 'selected': bool(row[2]), 'is_default': row[1] in DEFAULT_ROOMS}
                for row in await cursor.fetchall()
            ]

        cursor = await db.execute('SELECT id, name, selected FROM event_topics WHERE LOWER(event_id) = LOWER(?)', (event_id,))
        topics = [
            {'id': row[0], 'name': row[1], 'selected': bool(row[2]), 'is_default': row[1] in DEFAULT_TOPICS}
            for row in await cursor.fetchall()
        ]
        if not topics:
            await insert_default_topics(db, event_id)
            cursor = await db.execute('SELECT id, name, selected FROM event_topics WHERE LOWER(event_id) = LOWER(?)', (event_id,))
            topics = [
                {'id': row[0], 'name': row[1], 'selected': bool(row[2]), 'is_default': row[1] in DEFAULT_TOPICS}
                for row in await cursor.fetchall()
            ]

        await db.commit()
    return {'rooms': rooms, 'topics': topics}


@router_api.put('/api/events/{event_id}/config')
async def save_event_config(event_id: str, data: SaveEventConfigRequest) -> dict:
    if not data.rooms:
        raise HTTPException(status_code=400, detail='At least one room is required')
    if not data.topics:
        raise HTTPException(status_code=400, detail='At least one topic is required')
    await init_db(DB_PATH)
    rooms_filled: list[str] = []
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute('SELECT id, name FROM rooms WHERE LOWER(event_id) = LOWER(?)', (event_id,))
        existing_rooms = {row[1]: row[0] for row in await cursor.fetchall()}
        for name, rid in existing_rooms.items():
            if name in DEFAULT_ROOMS:
                selected = 1 if name in data.rooms else 0
                await db.execute('UPDATE rooms SET selected = ? WHERE id = ?', (selected, rid))
                if name not in data.rooms:
                    await db.execute('DELETE FROM room_sample_users WHERE room_id = ?', (rid,))
            elif name not in data.rooms:
                await db.execute('DELETE FROM room_sample_users WHERE room_id = ?', (rid,))
                await db.execute('DELETE FROM rooms WHERE id = ?', (rid,))
        for name in data.rooms:
            if name not in existing_rooms and name not in DEFAULT_ROOMS:
                rid = short_id()
                await db.execute('INSERT INTO rooms (id, event_id, name, selected) VALUES (?, ?, ?, 1)',
                                 (rid, event_id, name))

        cursor = await db.execute('SELECT id, name FROM event_topics WHERE LOWER(event_id) = LOWER(?)', (event_id,))
        existing_topics = {row[1]: row[0] for row in await cursor.fetchall()}
        for name, tid in existing_topics.items():
            if name in DEFAULT_TOPICS:
                selected = 1 if name in data.topics else 0
                await db.execute('UPDATE event_topics SET selected = ? WHERE id = ?', (selected, tid))
            elif name not in data.topics:
                await db.execute('DELETE FROM event_topics WHERE id = ?', (tid,))
        for name in data.topics:
            if name not in existing_topics and name not in DEFAULT_TOPICS:
                tid = short_id()
                await db.execute('INSERT INTO event_topics (id, event_id, name, selected) VALUES (?, ?, ?, 1)',
                                 (tid, event_id, name))

        # Fill un-filled selected rooms with sample users
        cursor = await db.execute('SELECT id, name FROM rooms WHERE LOWER(event_id) = LOWER(?) AND name IN ({})'.format(
            ','.join('?' * len(data.rooms))), [event_id] + list(data.rooms))
        selected_rooms = [(row[0], row[1]) for row in await cursor.fetchall()]
        for rid, rname in selected_rooms:
            cursor = await db.execute('SELECT COUNT(*) FROM room_sample_users WHERE room_id = ?', (rid,))
            count = (await cursor.fetchone())[0]
            if count > 0:
                continue
            count_available = 0
            chosen: list[dict] = []
            sample_pool = list(SAMPLE_USERS)
            random.shuffle(sample_pool)
            target = random.randint(3, 5)
            for user in sample_pool:
                if len(chosen) >= target:
                    break
                chosen.append(user)
                if user.get('available'):
                    count_available += 1
            if count_available < 1 and chosen:
                chosen[0]['available'] = True
            for user in chosen:
                sid = short_id()
                await db.execute(
                    'INSERT INTO room_sample_users (id, room_id, user_name, available, status, linkedin_url, slack_handle) VALUES (?, ?, ?, ?, ?, ?, ?)',
                    (sid, rid, user['name'], 1 if user.get('available') else 0, user.get('status', ''), user.get('linkedin_url', ''), user.get('slack_handle', ''))
                )
            rooms_filled.append(rname)
        await db.commit()
    return {'success': True, 'rooms_filled': rooms_filled}


@router_api.get('/api/events/{event_id}/rooms/{room_id}/users')
async def get_room_users(event_id: str, room_id: str) -> dict:
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute(
            'SELECT user_name, available, status, linkedin_url, slack_handle FROM room_sample_users WHERE room_id = ?',
            (room_id,)
        )
        rows = await cursor.fetchall()
        sample_users = [
            {
                'name': row[0],
                'available': bool(row[1]),
                'status': row[2],
                'linkedin_url': row[3] or '',
                'slack_handle': row[4] or '',
            }
            for row in rows
        ]
    return {'sample_users': sample_users}


@router_api.get('/api/events/{event_id}/topics')
async def get_event_topics(event_id: str) -> list[dict[str, str]]:
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute('SELECT id, name FROM event_topics WHERE LOWER(event_id) = LOWER(?) AND selected = 1', (event_id,))
        topics = [{'id': row[0], 'name': row[1]} for row in await cursor.fetchall()]
    return topics


@router_api.post('/api/events/{event_id}/join')
async def join_event(event_id: str, data: JoinEventRequest) -> dict:
    user_id = short_id()
    username = data.username or f'User_{user_id}'
    linkedin_url = data.linkedin_url or ''
    slack_handle = data.slack_handle or ''
    interests = data.interests or []
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute('INSERT INTO users (id, event_id, username, linkedin_url, slack_handle) VALUES (?, ?, ?, ?, ?)',
                         (user_id, event_id, username, linkedin_url, slack_handle))
        for interest in interests:
            await db.execute('INSERT OR IGNORE INTO user_interests (user_id, event_id, interest) VALUES (?, ?, ?)',
                             (user_id, event_id, interest))
        await db.commit()
    store.add_user(user_id, UserData(
        event_id=event_id,
        username=username,
        room_id=None,
        linkedin_url=linkedin_url,
        slack_handle=slack_handle,
        is_available=False,
        last_seen=str(time.time())
    ))
    return {'user_id': user_id, 'username': username}


@router_api.post('/api/users/{user_id}/room')
async def set_user_room(user_id: str, data: SetUserRoomRequest) -> dict:
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute(
            'SELECT id, event_id, username, linkedin_url, slack_handle FROM users WHERE id = ?', (user_id,))
        user_data = await cursor.fetchone()
        if not user_data:
            raise HTTPException(status_code=404, detail='User not found')
        if user_id not in store.active_users:
            store.add_user(user_id, UserData(
                event_id=str(user_data[1]),
                username=str(user_data[2]),
                room_id=None,
                linkedin_url=str(user_data[3] or ''),
                slack_handle=str(user_data[4] or ''),
                is_available=False,
                last_seen=str(time.time())
            ))
        store.update_user(user_id, room_id=data.room_id)
        await db.execute('UPDATE users SET room_id = ? WHERE id = ?', (data.room_id, user_id))
        await db.commit()
    return {'success': True}


@router_api.post('/api/users/{user_id}/available')
async def set_availability(user_id: str, data: SetAvailabilityRequest) -> dict:
    if store.get_user(user_id) is None:
        raise HTTPException(status_code=404, detail='User not found')
    store.update_user(user_id, is_available=data.available, last_seen=str(time.time()))
    if data.available:
        await find_or_enqueue_match(user_id)
    else:
        store.remove_from_waiting_queue(user_id)
    return {'success': True}


@router_api.get('/api/users/{user_id}/match')
async def get_user_match(user_id: str) -> dict:
    with store.lock:
        for match_id, match in store.active_matches.items():
            if match['user1_id'] == user_id or match['user2_id'] == user_id:
                return {'match_id': match_id}
    raise HTTPException(status_code=404, detail='No match found for this user')


@router_api.get('/api/matches/{match_id}')
async def get_match(match_id: str) -> dict:
    with store.lock:
        if match_id not in store.active_matches:
            raise HTTPException(status_code=404, detail='Match not found')
        match = store.active_matches[match_id]
    user1 = store.active_users.get(match['user1_id']) or UserData(
        event_id='', username='Unknown', room_id=None,
        linkedin_url='', slack_handle='', is_available=False, last_seen=None)
    user2 = store.active_users.get(match['user2_id']) or UserData(
        event_id='', username='Unknown', room_id=None,
        linkedin_url='', slack_handle='', is_available=False, last_seen=None)
    return {
        'match_id': match_id,
        'user1_username': user1['username'],
        'user2_username': user2['username'],
        'room_id': match['room_id']
    }


@router_api.post('/api/matches/{match_id}/connect')
async def exchange_connection(match_id: str, data: ExchangeConnectionRequest) -> dict:
    return await handle_connection_exchange(match_id, data.user_id, data.wants_to_connect, store, manager)


@router_api.get('/api/qr/{event_id}')
async def generate_qr(event_id: str, request: Request) -> dict:
    origin = f"{request.url.scheme}://{request.url.netloc}/"
    qr_data = urljoin(origin, f"room/{event_id}")
    return {'qr_code': generate_qr_data_uri(qr_data)}


@router_api.get('/api/prompts')
async def get_prompts() -> list[str]:
    return CONVERSATION_PROMPTS
