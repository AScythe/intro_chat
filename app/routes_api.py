# routes_api.py
# Description: REST API route handlers for events, users, rooms, matches, QR codes, and prompts
# ====
import logging
import random
import time
from urllib.parse import urljoin

import sqlite3

import aiosqlite
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse

from .config import DB_PATH, DEFAULT_ROOMS, DEFAULT_TOPICS
from .connection_manager import manager
from .database import init_db
from .helpers import short_id, insert_default_rooms, insert_default_topics, get_rooms_for_event
from .matchmaking import find_or_enqueue_match, persist_match, update_match_state, notify_match_found
from .connection_service import handle_connection_exchange
from .qr_utils import generate_qr_data_uri
from .sample_users import SAMPLE_USERS
from .schemas import (
    CreateEventRequest, JoinEventRequest, SetUserRoomRequest,
    SetAvailabilityRequest, ExchangeConnectionRequest, SaveEventConfigRequest,
    RequestChatRequest, AcceptChatRequest, DeclineChatRequest,
)
from .prompts import CONVERSATION_PROMPTS
from .state import store, UserData, PendingRequest

logger = logging.getLogger(__name__)

router_api = APIRouter()


@router_api.post('/api/events')
async def create_event(data: CreateEventRequest) -> dict:
    event_id = short_id()
    await init_db(DB_PATH)
    async with aiosqlite.connect(DB_PATH) as db:
        event_name = data.name or 'IntroChat Event'
        cursor = await db.execute('SELECT id FROM events WHERE name = ?', (event_name,))
        existing = await cursor.fetchone()
        if existing:
            old_eid = existing[0]
            logger.info('Replacing existing event %s (name="%s")', old_eid, event_name)
            await db.execute(
                'DELETE FROM matches WHERE user1_id IN (SELECT id FROM users WHERE event_id = ?) OR user2_id IN (SELECT id FROM users WHERE event_id = ?)',
                (old_eid, old_eid)
            )
            await db.execute('DELETE FROM user_interests WHERE event_id = ?', (old_eid,))
            await db.execute('DELETE FROM users WHERE event_id = ?', (old_eid,))
            await db.execute('DELETE FROM rooms WHERE event_id = ?', (old_eid,))
            await db.execute('DELETE FROM event_topics WHERE event_id = ?', (old_eid,))
            await db.execute('DELETE FROM events WHERE id = ?', (old_eid,))
        try:
            await db.execute('INSERT INTO events (id, name) VALUES (?, ?)',
                             (event_id, event_name))
        except sqlite3.IntegrityError:
            return JSONResponse(
                status_code=409,
                content={'error': f'Event with name "{event_name}" already exists (race condition)'}
            )
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
                    await db.execute('DELETE FROM users WHERE room_id = ? AND is_sample = 1', (rid,))
            elif name not in data.rooms:
                await db.execute('DELETE FROM users WHERE room_id = ? AND is_sample = 1', (rid,))
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
            cursor = await db.execute('SELECT COUNT(*) FROM users WHERE room_id = ? AND is_sample = 1', (rid,))
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
                    'INSERT INTO users (id, event_id, room_id, username, linkedin_url, slack_handle, is_available, status, is_sample) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)',
                    (sid, event_id, rid, user['name'], user.get('linkedin_url', ''), user.get('slack_handle', ''), 1 if user.get('available') else 0, user.get('status', ''))
                )
                store.add_user(sid, UserData(
                    event_id=event_id,
                    username=user['name'],
                    room_id=rid,
                    linkedin_url=user.get('linkedin_url', ''),
                    slack_handle=user.get('slack_handle', ''),
                    is_available=bool(user.get('available', False)),
                    last_seen=str(time.time()),
                    is_sample=1,
                    status=user.get('status', '')
                ))
            rooms_filled.append(rname)
        await db.commit()
    return {'success': True, 'rooms_filled': rooms_filled}


@router_api.get('/api/events/{event_id}/rooms/{room_id}/users')
async def get_room_users(event_id: str, room_id: str) -> dict:
    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute(
            'SELECT id, username, is_available, status, linkedin_url, slack_handle, is_sample FROM users WHERE room_id = ?',
            (room_id,)
        )
        rows = await cursor.fetchall()
        users = [
            {
                'id': row[0],
                'name': row[1],
                'available': bool(row[2]),
                'status': row[3],
                'linkedin_url': row[4] or '',
                'slack_handle': row[5] or '',
                'is_sample': bool(row[6]),
            }
            for row in rows
        ]
    return {'users': users}


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
        last_seen=str(time.time()),
        is_sample=0,
        status=''
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
                last_seen=str(time.time()),
                is_sample=0,
                status=''
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
        linkedin_url='', slack_handle='', is_available=False, last_seen=None,
        is_sample=0, status='')
    user2 = store.active_users.get(match['user2_id']) or UserData(
        event_id='', username='Unknown', room_id=None,
        linkedin_url='', slack_handle='', is_available=False, last_seen=None,
        is_sample=0, status='')
    return {
        'match_id': match_id,
        'user1_username': user1['username'],
        'user2_username': user2['username'],
        'room_id': match['room_id']
    }


@router_api.post('/api/matches/{match_id}/connect')
async def exchange_connection(match_id: str, data: ExchangeConnectionRequest) -> dict:
    return await handle_connection_exchange(match_id, data.user_id, data.wants_to_connect, store, manager, force_sample_vote=data.force_sample_vote)


@router_api.post('/api/users/{user_id}/request-chat')
async def request_chat(user_id: str, data: RequestChatRequest) -> dict:
    target_id = data.target_user_id

    async with aiosqlite.connect(DB_PATH) as db:
        cursor = await db.execute('SELECT id, event_id, room_id, username, is_sample FROM users WHERE id = ?', (user_id,))
        requester = await cursor.fetchone()
        if not requester:
            raise HTTPException(status_code=404, detail='Requester not found')

        cursor = await db.execute('SELECT id, event_id, room_id, username, is_sample FROM users WHERE id = ?', (target_id,))
        target = await cursor.fetchone()
        if not target:
            raise HTTPException(status_code=404, detail='Target not found')

        if requester[1] != target[1]:
            return {'accepted': False, 'message': 'Users are in different events'}

        if requester[2] != target[2]:
            return {'accepted': False, 'message': 'Users are not in the same room'}

        with store.lock:
            for mid, m in list(store.active_matches.items()):
                if user_id in (m['user1_id'], m['user2_id']):
                    votes = store.connection_statuses.get(mid, {})
                    if len(votes) < 2:
                        return {'accepted': False, 'message': 'You are already in a chat'}
                    store.active_matches.pop(mid, None)
                    store.connection_statuses.pop(mid, None)
                elif target_id in (m['user1_id'], m['user2_id']):
                    votes = store.connection_statuses.get(mid, {})
                    if len(votes) < 2:
                        return {'accepted': False, 'message': 'This person is currently in a chat'}
                    store.active_matches.pop(mid, None)
                    store.connection_statuses.pop(mid, None)

        target_is_sample = bool(target[4])

        if target_is_sample:
            accepted = data.force_accept if data.force_accept is not None else random.random() < 0.6
            if not accepted:
                return {'accepted': False, 'message': 'declined'}

            if not store.get_user(target_id):
                cursor2 = await db.execute(
                    'SELECT id, event_id, room_id, username, linkedin_url, slack_handle, is_available, status FROM users WHERE id = ?',
                    (target_id,)
                )
                su = await cursor2.fetchone()
                if su:
                    store.add_user(su[0], UserData(
                        event_id=su[1], username=su[3], room_id=su[2],
                        linkedin_url=su[4] or '', slack_handle=su[5] or '',
                        is_available=bool(su[6]), last_seen=str(time.time()),
                        is_sample=1, status=su[7] or ''
                    ))

            match_id = await persist_match(user_id, target_id, str(target[2]))
            update_match_state(match_id, user_id, target_id, str(target[2]))

            cursor = await db.execute('SELECT name FROM rooms WHERE id = ?', (target[2],))
            room_name = (await cursor.fetchone())[0]
            new_status = f'Currently in a chat, find directly in {room_name}'
            await db.execute('UPDATE users SET is_available = 0, status = ? WHERE id = ?', (new_status, target_id))
            await db.commit()
            store.update_user(target_id, is_available=False, status=new_status)

            await notify_match_found(match_id, user_id, target_id, str(target[2]))
            return {'accepted': True, 'match_id': match_id}
        else:
            requester_name = str(requester[3])
            target_name = str(target[3])

            store.add_pending_request(
                requester_id=user_id,
                target_id=target_id,
                room_id=str(target[2]),
                requester_name=requester_name,
                target_name=target_name
            )

            await manager.broadcast_to_users(
                [target_id],
                {'type': 'chat_request', 'requester_id': user_id, 'requester_name': requester_name, 'room_id': target[2]}
            )
            return {'accepted': None, 'status': 'pending', 'message': 'Chat request sent'}


@router_api.post('/api/users/{user_id}/accept-request')
async def accept_chat_request(user_id: str, data: AcceptChatRequest) -> dict:
    pending = store.get_pending_request(data.requester_id)
    if not pending or pending['target_id'] != user_id:
        raise HTTPException(status_code=404, detail='No pending request found')

    store.remove_pending_request(data.requester_id)

    match_id = await persist_match(data.requester_id, user_id, pending['room_id'])
    update_match_state(match_id, data.requester_id, user_id, pending['room_id'])
    await notify_match_found(match_id, data.requester_id, user_id, pending['room_id'])

    return {'accepted': True, 'match_id': match_id}


@router_api.post('/api/users/{user_id}/decline-request')
async def decline_chat_request(user_id: str, data: DeclineChatRequest) -> dict:
    pending = store.get_pending_request(data.requester_id)
    if not pending or pending['target_id'] != user_id:
        raise HTTPException(status_code=404, detail='No pending request found')

    store.remove_pending_request(data.requester_id)

    await manager.broadcast_to_users(
        [data.requester_id],
        {'type': 'chat_request_declined', 'message': 'Your chat request was declined'}
    )
    return {'accepted': False}


@router_api.get('/api/qr/{event_id}')
async def generate_qr(event_id: str, request: Request) -> dict:
    origin = f"{request.url.scheme}://{request.url.netloc}/"
    qr_data = urljoin(origin, f"room/{event_id}")
    return {'qr_code': generate_qr_data_uri(qr_data)}


@router_api.get('/api/prompts')
async def get_prompts() -> list[str]:
    return CONVERSATION_PROMPTS
