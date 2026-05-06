from flask import jsonify, render_template, request
from .state import active_users, active_matches, waiting_queue, CONVERSATION_PROMPTS
import sqlite3
import uuid
import os
import time

def register_routes(app):
    print(f"Registering routes. Available routes will include: /api/users/<user_id>/room")

    @app.route('/')
    def index():
        return render_template('index.html')

    @app.route('/room/<event_id>')
    def room_selection(event_id):
        return render_template('room.html', event_id=event_id)

    @app.route('/chat/<match_id>')
    def chat_room(match_id):
        return render_template('chat.html', match_id=match_id)

    @app.route('/api/events', methods=['POST'])
    def create_event():
        data = request.get_json()
        event_id = str(uuid.uuid4())[:8]
        db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'introchat.db')
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute('INSERT INTO events (id, name) VALUES (?, ?)',
                       (event_id, data.get('name', 'IntroChat Event')))
        rooms = ['Main Hall', 'Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5', 'Quiet Corner', 'Coffee Area']
        for room_name in rooms:
            room_id = str(uuid.uuid4())[:8]
            cursor.execute('INSERT INTO rooms (id, event_id, name) VALUES (?, ?, ?)',
                           (room_id, event_id, room_name))
        conn.commit()
        conn.close()
        return jsonify({'event_id': event_id, 'rooms': rooms})

    @app.route('/api/events/<event_id>/rooms')
    def get_rooms(event_id):
        try:
            db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'introchat.db')
            conn = sqlite3.connect(db_path)
            cursor = conn.cursor()
            cursor.execute('SELECT id, name FROM rooms WHERE event_id = ?', (event_id,))
            rooms = [{'id': row[0], 'name': row[1]} for row in cursor.fetchall()]
            if not rooms:
                cursor.execute('SELECT id, name FROM rooms WHERE LOWER(event_id) = LOWER(?)', (event_id,))
                rooms = [{'id': row[0], 'name': row[1]} for row in cursor.fetchall()]
            if not rooms:
                default_rooms = ['Main Hall', 'Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5', 'Quiet Corner', 'Coffee Area']
                for room_name in default_rooms:
                    room_id = str(uuid.uuid4())[:8]
                    cursor.execute('INSERT INTO rooms (id, event_id, name) VALUES (?, ?, ?)',
                                   (room_id, event_id, room_name))
                conn.commit()
                cursor.execute('SELECT id, name FROM rooms WHERE event_id = ?', (event_id,))
                rooms = [{'id': row[0], 'name': row[1]} for row in cursor.fetchall()]
            conn.close()
            return jsonify(rooms)
        except Exception as e:
            print(f'Error loading rooms: {e}')
            return jsonify([])

    @app.route('/api/events/<event_id>/join', methods=['POST'])
    def join_event(event_id):
        data = request.get_json()
        user_id = str(uuid.uuid4())[:8]
        username = data.get('username', f'User_{user_id}')
        db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'introchat.db')
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute('INSERT INTO users (id, event_id, username) VALUES (?, ?, ?)',
                       (user_id, event_id, username))
        conn.commit()
        conn.close()
        active_users[user_id] = {
            'event_id': event_id,
            'username': username,
            'room_id': None,
            'is_available': False,
            'last_seen': time.time()
        }
        return jsonify({'user_id': user_id, 'username': username})

    @app.route('/api/users/<user_id>/room', methods=['POST'])
    def set_user_room(user_id):
        data = request.get_json()
        room_id = data.get('room_id')
        db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'introchat.db')
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        cursor.execute('SELECT id, event_id, username FROM users WHERE id = ?', (user_id,))
        user_data = cursor.fetchone()
        if not user_data:
            conn.close()
            return jsonify({'error': 'User not found'}), 404
        if user_id not in active_users:
            active_users[user_id] = {
                'event_id': user_data[1],
                'username': user_data[2],
                'room_id': None,
                'is_available': False,
                'last_seen': time.time()
            }
        active_users[user_id]['room_id'] = room_id
        cursor.execute('UPDATE users SET room_id = ? WHERE id = ?', (room_id, user_id))
        conn.commit()
        conn.close()
        return jsonify({'success': True})

    @app.route('/api/users/<user_id>/available', methods=['POST'])
    def set_availability(user_id):
        from .state import active_users, waiting_queue
        from .matchmaking import find_match
        data = request.get_json()
        is_available = data.get('available', False)
        if user_id not in active_users:
            return jsonify({'error': 'User not found'}), 404
        active_users[user_id]['is_available'] = is_available
        active_users[user_id]['last_seen'] = time.time()
        if is_available:
            find_match(user_id)
        elif user_id in waiting_queue:
            del waiting_queue[user_id]
        return jsonify({'success': True})

    @app.route('/api/matches/<match_id>')
    def get_match(match_id):
        from .state import active_matches, active_users
        if match_id not in active_matches:
            return jsonify({'error': 'Match not found'}), 404
        match = active_matches[match_id]
        user1 = active_users.get(match['user1_id'], {})
        user2 = active_users.get(match['user2_id'], {})
        return jsonify({
            'match_id': match_id,
            'user1_username': user1.get('username', 'Unknown'),
            'user2_username': user2.get('username', 'Unknown'),
            'room_id': match['room_id']
        })

    @app.route('/api/matches/<match_id>/connect', methods=['POST'])
    def exchange_connection(match_id):
        from .state import active_matches, active_users
        from . import socketio
        from flask_socketio import emit
        data = request.get_json()
        user_id = data.get('user_id')
        wants_to_connect = data.get('wants_to_connect', False)
        if match_id not in active_matches:
            return jsonify({'error': 'Match not found'}), 404
        match = active_matches[match_id]
        if 'connections' not in match:
            match['connections'] = {}
        match['connections'][user_id] = wants_to_connect
        if len(match['connections']) == 2:
            both_want = all(match['connections'].values())
            if both_want:
                user1 = active_users.get(match['user1_id'], {})
                user2 = active_users.get(match['user2_id'], {})
                socketio.emit('connection_exchanged', {
                    'user1_username': user1.get('username', 'Unknown'),
                    'user2_username': user2.get('username', 'Unknown')
                }, room=f"room_{match['room_id']}")
            else:
                socketio.emit('connection_declined', {}, room=f"room_{match['room_id']}")
        return jsonify({'success': True})

    @app.route('/api/qr/<event_id>')
    def generate_qr(event_id):
        import qrcode
        import io
        import base64
        qr = qrcode.QRCode(version=1, box_size=10, border=5)
        qr.add_data(f"http://localhost:5000/room/{event_id}")
        qr.make(True)
        img = qr.make_image(fill_color="black", back_color="white")
        buffer = io.BytesIO()
        img.save(buffer, format='PNG')
        buffer.seek(0)
        img_str = base64.b64encode(buffer.getvalue()).decode()
        return jsonify({'qr_code': f"data:image/png;base64,{img_str}"})

    @app.route('/api/prompts')
    def get_prompts():
        return jsonify(CONVERSATION_PROMPTS)
