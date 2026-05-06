from .state import active_users, active_matches, waiting_queue
import sqlite3
import uuid
from datetime import datetime, timedelta
import os
import time

def find_match(user_id):
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
            uid not in waiting_queue and
            uid not in active_matches):
            available_users.append(uid)
    if available_users:
        match_user_id = available_users[0]
        create_match(user_id, match_user_id, room_id)
    else:
        waiting_queue[user_id] = {
            'room_id': room_id,
            'timestamp': time.time()
        }

def create_match(user1_id, user2_id, room_id):
    from .state import MATCH_EXPIRY_MINUTES
    import time
    match_id = str(uuid.uuid4())[:8]
    expires_at = datetime.now() + timedelta(minutes=MATCH_EXPIRY_MINUTES)
    db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'introchat.db')
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO matches (id, user1_id, user2_id, room_id, expires_at)
        VALUES (?, ?, ?, ?, ?)
    ''', (match_id, user1_id, user2_id, room_id, expires_at))
    conn.commit()
    conn.close()
    from .state import active_matches
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
    from . import socketio
    from flask_socketio import emit
    socketio.emit('match_found', {
        'match_id': match_id,
        'room_id': room_id,
        'user1_username': active_users[user1_id]['username'],
        'user2_username': active_users[user2_id]['username']
    }, room=f'room_{room_id}')
