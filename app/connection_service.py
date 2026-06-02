# connection_service.py
# Description: [ARCH] Connection-exchange logic extracted from routes_api — handles mutual-opt-in, broadcast, and declined-path
# ====

from .state import store, UserData, StateStore
from .connection_manager import ConnectionManager


async def handle_connection_exchange(
    match_id: str,
    user_id: str,
    wants_to_connect: bool,
    store: StateStore,
    manager: ConnectionManager,
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

    if vote_count_after == 2:
        both_want = store.connection_all_voted_yes(match_id)
        if both_want:
            user1 = store.get_user(match['user1_id']) or UserData(
                event_id='', username='Unknown', room_id=None,
                linkedin_url='', slack_handle='', is_available=False, last_seen=None)
            user2 = store.get_user(match['user2_id']) or UserData(
                event_id='', username='Unknown', room_id=None,
                linkedin_url='', slack_handle='', is_available=False, last_seen=None)
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
