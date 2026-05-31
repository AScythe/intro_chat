# matchmaking.py
# Description: Async match-finding algorithm that pairs available users in the same room, creates match records in the database, and sends match_found events via WebSocket
# ====
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

from .state import active_users, active_matches, active_matches_lock, waiting_queue, MatchData, QueueEntry
from .connection_manager import manager
from .config import DB_PATH, MATCH_EXPIRY_SECONDS
import aiosqlite
from datetime import datetime, timedelta
from .helpers import short_id
import time

async def find_match(user_id: str) -> None:
    if user_id not in active_users:
        return
    user = active_users[user_id]
    room_id = user['room_id']
    if not room_id:
        return
    available_users = []
    with active_matches_lock:
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
        waiting_queue[user_id] = QueueEntry(
            room_id=room_id,
            timestamp=time.time()
        )

async def create_match(user1_id: str, user2_id: str, room_id: str) -> None:
    # Idempotency: skip if these two users already have an active match
    with active_matches_lock:
        for _, match in active_matches.items():
            if (match['user1_id'] == user1_id and match['user2_id'] == user2_id) or \
               (match['user1_id'] == user2_id and match['user2_id'] == user1_id):
                return

    match_id = short_id()
    expires_at = datetime.now() + timedelta(seconds=MATCH_EXPIRY_SECONDS)
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute('''
            INSERT INTO matches (id, user1_id, user2_id, room_id, expires_at)
            VALUES (?, ?, ?, ?, ?)
        ''', (match_id, user1_id, user2_id, room_id, expires_at))
        await db.commit()
    with active_matches_lock:
        active_matches[match_id] = MatchData(
            user1_id=user1_id,
            user2_id=user2_id,
            room_id=room_id,
            created_at=time.time()
        )
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
