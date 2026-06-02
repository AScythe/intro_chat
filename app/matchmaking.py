# matchmaking.py
# Description: Async match-finding algorithm that pairs available users in the same room, creates match records in the database, and sends match_found events via WebSocket
# ====
import logging

logger = logging.getLogger(__name__)

from .state import store, MatchData, QueueEntry
from .connection_manager import manager
from .config import DB_PATH, MATCH_EXPIRY_SECONDS
import aiosqlite
from datetime import datetime, timedelta
from .helpers import short_id
import time

async def find_or_enqueue_match(user_id: str) -> None:
    if user_id not in store.active_users:
        return
    user = store.active_users[user_id]
    room_id = user['room_id']
    if not room_id:
        return
    available_users = []
    with store.lock:
        for uid, u in store.active_users.items():
            if (uid != user_id and
                u['room_id'] == room_id and
                u['is_available'] and
                uid in store.waiting_queue and
                uid not in store.active_matches):
                available_users.append(uid)
    if available_users:
        match_user_id = available_users[0]
        await create_match(user_id, match_user_id, room_id)
    else:
        store.add_to_waiting_queue(user_id, QueueEntry(
            room_id=room_id,
            timestamp=time.time()
        ))

async def persist_match(user1_id: str, user2_id: str, room_id: str) -> str:
    """[ARCH] DB insert only — create match record and return match_id."""
    match_id = short_id()
    expires_at = datetime.now() + timedelta(seconds=MATCH_EXPIRY_SECONDS)
    async with aiosqlite.connect(DB_PATH) as db:
        await db.execute('''
            INSERT INTO matches (id, user1_id, user2_id, room_id, expires_at)
            VALUES (?, ?, ?, ?, ?)
        ''', (match_id, user1_id, user2_id, room_id, expires_at))
        await db.commit()
    return match_id


def update_match_state(match_id: str, user1_id: str, user2_id: str, room_id: str) -> None:
    """[ARCH] In-memory state update — active_matches, waiting_queue, availability."""
    store.add_match(match_id, MatchData(
        user1_id=user1_id,
        user2_id=user2_id,
        room_id=room_id,
        created_at=time.time()
    ))
    store.remove_from_waiting_queue(user1_id)
    store.remove_from_waiting_queue(user2_id)
    store.update_user(user1_id, is_available=False)
    store.update_user(user2_id, is_available=False)


async def notify_match_found(match_id: str, user1_id: str, user2_id: str, room_id: str) -> None:
    """[ARCH] WebSocket broadcast only — notify matched users."""
    await manager.broadcast_to_users(
        [user1_id, user2_id],
        {
            'type': 'match_found',
            'match_id': match_id,
            'room_id': room_id,
            'user1_username': store.active_users[user1_id]['username'],
            'user2_username': store.active_users[user2_id]['username']
        }
    )


async def create_match(user1_id: str, user2_id: str, room_id: str) -> None:
    with store.lock:
        for _, match in store.active_matches.items():
            if (match['user1_id'] == user1_id and match['user2_id'] == user2_id) or \
               (match['user1_id'] == user2_id and match['user2_id'] == user1_id):
                return

    match_id = await persist_match(user1_id, user2_id, room_id)
    update_match_state(match_id, user1_id, user2_id, room_id)
    await notify_match_found(match_id, user1_id, user2_id, room_id)
