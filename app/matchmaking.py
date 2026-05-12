# matchmaking.py
# Description: Async match-finding algorithm that pairs available users in the same room, creates match records in the database, and sends match_found events via WebSocket
# ====
from .state import active_users, active_matches, waiting_queue
from .connection_manager import manager
from .config import DB_PATH
import aiosqlite
import uuid
from datetime import datetime, timedelta
import time

async def find_match(user_id):
    if user_id not in active_users:
        return
    user = active_users[user_id]
    room_id = user['room_id']
    if not room_id:
        return
    available_users = []
    for uid, u in active_users.items():
        if (uid != user_id and
            u['room_id'] == room_id and
            u['is_available'] and
            uid in waiting_queue and
            uid not in active_matches):
            available_users.append(uid)
    if available_users:
        match_user_id = available_users[0]
        await create_match(user_id, match_user_id, room_id)
    else:
        waiting_queue[user_id] = {
            'room_id': room_id,
            'timestamp': time.time()
        }

async def create_match(user1_id, user2_id, room_id):
    from .state import MATCH_EXPIRY_MINUTES
    match_id = str(uuid.uuid4())[:8]
    expires_at = datetime.now() + timedelta(minutes=MATCH_EXPIRY_MINUTES)
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute('''
            INSERT INTO matches (id, user1_id, user2_id, room_id, expires_at)
            VALUES (?, ?, ?, ?, ?)
        ''', (match_id, user1_id, user2_id, room_id, expires_at))
        await db.commit()
    active_matches[match_id] = {
        'user1_id': user1_id,
        'user2_id': user2_id,
        'room_id': room_id,
        'created_at': time.time()
    }
    if user1_id in waiting_queue:
        del waiting_queue[user1_id]
    if user2_id in waiting_queue:
        del waiting_queue[user2_id]
    active_users[user1_id]['is_available'] = False
    active_users[user2_id]['is_available'] = False
    await manager.broadcast_to_users(
        [user1_id, user2_id],
        {
            'type': 'match_found',
            'match_id': match_id,
            'room_id': room_id,
            'user1_username': active_users[user1_id]['username'],
            'user2_username': active_users[user2_id]['username']
        }
    )
