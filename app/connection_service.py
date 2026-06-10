# connection_service.py
# Description: [ARCH] Connection-exchange logic extracted from routes_api — handles mutual-opt-in, broadcast, and declined-path
# ====

import random
import aiosqlite

from .state import store, UserData, StateStore
from .connection_manager import ConnectionManager
from .config import DB_PATH


async def handle_connection_exchange(
    match_id: str,
    user_id: str,
    wants_to_connect: bool,
    store: StateStore,
    manager: ConnectionManager,
    force_sample_vote: bool | None = None,
) -> dict:
    """[ARCH] Process a user's connection-exchange decision and broadcast if both users have voted."""
    match = store.get_match(match_id)
    if match is None:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail='Match not found')

    store.init_connection_status(match_id)
    vote_count_before = store.connection_vote_count(match_id)
    if vote_count_before == 2:
        return {'success': True}

    store.set_connection_vote(match_id, user_id, wants_to_connect)
    vote_count_after = store.connection_vote_count(match_id)

    # Auto-vote for sample user if they haven't voted yet
    if vote_count_after == 1:
        other_id = match['user1_id'] if match['user2_id'] == user_id else match['user2_id']
        other_user = store.get_user(other_id)
        if other_user and other_user.get('is_sample', 0):
            sample_wants = force_sample_vote if force_sample_vote is not None else random.random() < 0.6
            store.set_connection_vote(match_id, other_id, sample_wants)
            vote_count_after = 2

    if vote_count_after == 2:
        both_want = store.connection_all_voted_yes(match_id)

        # Restore sample users' original status after match ends
        original_status = match.get('original_user_status', {})
        if original_status:
            async with aiosqlite.connect(DB_PATH) as db:
                for uid, orig in original_status.items():
                    store.update_user(uid, is_available=orig['is_available'], status=orig['status'])
                    await db.execute('UPDATE users SET is_available = ?, status = ? WHERE id = ?',
                                   (1 if orig['is_available'] else 0, orig['status'], uid))
                await db.commit()

        if both_want:
            user1 = store.get_user(match['user1_id']) or UserData(
                event_id='', username='Unknown', room_id=None,
                linkedin_url='', slack_handle='', is_available=False, last_seen=None,
                is_sample=0, status='')
            user2 = store.get_user(match['user2_id']) or UserData(
                event_id='', username='Unknown', room_id=None,
                linkedin_url='', slack_handle='', is_available=False, last_seen=None,
                is_sample=0, status='')
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
