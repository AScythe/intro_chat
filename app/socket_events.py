# socket_events.py
# SocketIO event handlers for IntroChat
# ================================================================
# These handlers are registered on the socketio instance.
# Import socketio from app.py and register these handlers.

from flask_socketio import emit, join_room
from .state import active_users

def register_handlers(socketio):
    """Register all SocketIO event handlers on the given socketio instance."""

    @socketio.on('connect')
    def handle_connect():
        print('Client connected')

    @socketio.on('disconnect')
    def handle_disconnect():
        print('Client disconnected')

    @socketio.on('join_room')
    def handle_join_room(data):
        room_id = data.get('room_id')
        if room_id:
            join_room(f"room_{room_id}")
            print(f'User joined room {room_id}')
        else:
            print('No room_id provided for join_room')
