from flask import Flask, render_template, request, jsonify, send_file
from flask_socketio import SocketIO, emit, join_room, leave_room
import sqlite3
import uuid
import time
import threading
import qrcode
import io
import base64
from datetime import datetime, timedelta
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'introchat_secret_key_2024'
socketio = SocketIO(app, cors_allowed_origins="*")

# Database setup
def init_db():
    conn = sqlite3.connect('introchat.db')
    cursor = conn.cursor()
    
    # Events table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS events (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            is_active BOOLEAN DEFAULT 1
        )
    ''')
    
    # Rooms table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS rooms (
            id TEXT PRIMARY KEY,
            event_id TEXT,
            name TEXT NOT NULL,
            FOREIGN KEY (event_id) REFERENCES events (id)
        )
    ''')
    
    # Users table (temporary, session-based)
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id TEXT PRIMARY KEY,
            event_id TEXT,
            room_id TEXT,
            username TEXT,
            is_available BOOLEAN DEFAULT 0,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (event_id) REFERENCES events (id),
            FOREIGN KEY (room_id) REFERENCES rooms (id)
        )
    ''')
    
    # Matches table
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS matches (
            id TEXT PRIMARY KEY,
            user1_id TEXT,
            user2_id TEXT,
            room_id TEXT,
            status TEXT DEFAULT 'active',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            expires_at TIMESTAMP,
            FOREIGN KEY (user1_id) REFERENCES users (id),
            FOREIGN KEY (user2_id) REFERENCES users (id),
            FOREIGN KEY (room_id) REFERENCES rooms (id)
        )
    ''')
    
    conn.commit()
    conn.close()

# Initialize database
init_db()

# In-memory storage for active sessions
active_users = {}
active_matches = {}
waiting_queue = {}

# Conversation prompts
CONVERSATION_PROMPTS = [
    "What's one thing you're excited about this weekend?",
    "What's your favorite snack at hackathons?",
    "If you could steal one skill from another hacker, what would it be?",
    "What's your favorite debugging story?",
    "What's the most interesting project you've worked on recently?",
    "If you could learn any programming language instantly, what would it be?",
    "What's your go-to coffee order during long coding sessions?",
    "What's the weirdest bug you've ever encountered?",
    "If you could build any app, what would it be?",
    "What's your favorite way to unwind after a long day of coding?"
]

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
    
    conn = sqlite3.connect('introchat.db')
    cursor = conn.cursor()
    
    cursor.execute('INSERT INTO events (id, name) VALUES (?, ?)', 
                   (event_id, data.get('name', 'IntroChat Event')))
    
    # Create default rooms
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
        conn = sqlite3.connect('introchat.db')
        cursor = conn.cursor()
        
        # Try exact match first
        cursor.execute('SELECT id, name FROM rooms WHERE event_id = ?', (event_id,))
        rooms = [{'id': row[0], 'name': row[1]} for row in cursor.fetchall()]
        
        # If no rooms found, try case-insensitive match
        if not rooms:
            cursor.execute('SELECT id, name FROM rooms WHERE LOWER(event_id) = LOWER(?)', (event_id,))
            rooms = [{'id': row[0], 'name': row[1]} for row in cursor.fetchall()]
        
        # If still no rooms found, create default rooms for this event
        if not rooms:
            print(f"No rooms found for event {event_id}, creating default rooms...")
            default_rooms = ['Main Hall', 'Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5', 'Quiet Corner', 'Coffee Area']
            for room_name in default_rooms:
                room_id = str(uuid.uuid4())[:8]
                cursor.execute('INSERT INTO rooms (id, event_id, name) VALUES (?, ?, ?)', 
                               (room_id, event_id, room_name))
            conn.commit()
            
            # Fetch the newly created rooms
            cursor.execute('SELECT id, name FROM rooms WHERE event_id = ?', (event_id,))
            rooms = [{'id': row[0], 'name': row[1]} for row in cursor.fetchall()]
            print(f"Created {len(rooms)} default rooms for event {event_id}")
        
        conn.close()
        
        print(f"Found {len(rooms)} rooms for event {event_id}")
        return jsonify(rooms)
    except Exception as e:
        print(f"Error loading rooms for event {event_id}: {e}")
        return jsonify([])

@app.route('/api/events/<event_id>/join', methods=['POST'])
def join_event(event_id):
    data = request.get_json()
    user_id = str(uuid.uuid4())[:8]
    username = data.get('username', f'User_{user_id}')
    
    # Store user in database
    conn = sqlite3.connect('introchat.db')
    cursor = conn.cursor()
    cursor.execute('INSERT INTO users (id, event_id, username) VALUES (?, ?, ?)', 
                   (user_id, event_id, username))
    conn.commit()
    conn.close()
    
    # Store in active users
    active_users[user_id] = {
        'event_id': event_id,
        'username': username,
        'room_id': None,
        'is_available': False,
        'last_seen': time.time()
    }
    
    return jsonify({'user_id': user_id, 'username': username})

@app.route('/api/users/<user_id>/room', methods=['POST'])
def select_room(user_id):
    data = request.get_json()
    room_id = data.get('room_id')
    
    # Check if user exists in database
    conn = sqlite3.connect('introchat.db')
    cursor = conn.cursor()
    cursor.execute('SELECT id, event_id, username FROM users WHERE id = ?', (user_id,))
    user_data = cursor.fetchone()
    
    if not user_data:
        conn.close()
        return jsonify({'error': 'User not found'}), 404
    
    # If user exists in database but not in active_users, add them
    if user_id not in active_users:
        active_users[user_id] = {
            'event_id': user_data[1],
            'username': user_data[2],
            'room_id': None,
            'is_available': False,
            'last_seen': time.time()
        }
        print(f"Added user {user_id} to active_users from database")
    
    # Update user's room
    active_users[user_id]['room_id'] = room_id
    
    # Update database
    cursor.execute('UPDATE users SET room_id = ? WHERE id = ?', (room_id, user_id))
    conn.commit()
    conn.close()
    
    print(f"User {user_id} selected room {room_id}")
    return jsonify({'success': True})

@app.route('/api/users/<user_id>/available', methods=['POST'])
def set_availability(user_id):
    data = request.get_json()
    is_available = data.get('available', False)
    
    # Check if user exists in database
    conn = sqlite3.connect('introchat.db')
    cursor = conn.cursor()
    cursor.execute('SELECT id, event_id, username FROM users WHERE id = ?', (user_id,))
    user_data = cursor.fetchone()
    
    if not user_data:
        conn.close()
        return jsonify({'error': 'User not found'}), 404
    
    # If user exists in database but not in active_users, add them
    if user_id not in active_users:
        active_users[user_id] = {
            'event_id': user_data[1],
            'username': user_data[2],
            'room_id': None,
            'is_available': False,
            'last_seen': time.time()
        }
        print(f"Added user {user_id} to active_users for availability")
    
    active_users[user_id]['is_available'] = is_available
    active_users[user_id]['last_seen'] = time.time()
    
    # Update database
    cursor.execute('UPDATE users SET is_available = ?, last_seen = CURRENT_TIMESTAMP WHERE id = ?', 
                   (is_available, user_id))
    conn.commit()
    conn.close()
    
    if is_available:
        # Try to find a match
        find_match(user_id)
    else:
        # Remove from waiting queue
        if user_id in waiting_queue:
            del waiting_queue[user_id]
    
    print(f"User {user_id} availability set to {is_available}")
    return jsonify({'success': True})

def find_match(user_id):
    if user_id not in active_users:
        return
    
    user = active_users[user_id]
    room_id = user['room_id']
    
    if not room_id:
        return
    
    # Find other available users in the same room
    available_users = []
    for uid, u in active_users.items():
        if (uid != user_id and 
            u['room_id'] == room_id and 
            u['is_available'] and 
            uid not in waiting_queue and
            uid not in active_matches):
            available_users.append(uid)
    
    if available_users:
        # Match with the first available user
        match_user_id = available_users[0]
        create_match(user_id, match_user_id, room_id)
    else:
        # Add to waiting queue
        waiting_queue[user_id] = {
            'room_id': room_id,
            'timestamp': time.time()
        }

def create_match(user1_id, user2_id, room_id):
    match_id = str(uuid.uuid4())[:8]
    expires_at = datetime.now() + timedelta(minutes=2)
    
    # Store match in database
    conn = sqlite3.connect('introchat.db')
    cursor = conn.cursor()
    cursor.execute('''
        INSERT INTO matches (id, user1_id, user2_id, room_id, expires_at) 
        VALUES (?, ?, ?, ?, ?)
    ''', (match_id, user1_id, user2_id, room_id, expires_at))
    conn.commit()
    conn.close()
    
    # Store in active matches
    active_matches[match_id] = {
        'user1_id': user1_id,
        'user2_id': user2_id,
        'room_id': room_id,
        'created_at': time.time()
    }
    
    # Remove from waiting queue
    if user1_id in waiting_queue:
        del waiting_queue[user1_id]
    if user2_id in waiting_queue:
        del waiting_queue[user2_id]
    
    # Set users as unavailable
    active_users[user1_id]['is_available'] = False
    active_users[user2_id]['is_available'] = False
    
    # Notify both users
    socketio.emit('match_found', {
        'match_id': match_id,
        'room_id': room_id,
        'user1_username': active_users[user1_id]['username'],
        'user2_username': active_users[user2_id]['username']
    }, room=f"room_{room_id}")

@app.route('/api/matches/<match_id>')
def get_match(match_id):
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
    data = request.get_json()
    user_id = data.get('user_id')
    wants_to_connect = data.get('wants_to_connect', False)
    
    if match_id not in active_matches:
        return jsonify({'error': 'Match not found'}), 404
    
    match = active_matches[match_id]
    
    # Store connection preference
    if 'connections' not in match:
        match['connections'] = {}
    
    match['connections'][user_id] = wants_to_connect
    
    # Check if both users want to connect
    if len(match['connections']) == 2:
        both_want = all(match['connections'].values())
        
        if both_want:
            # Exchange usernames
            user1 = active_users.get(match['user1_id'], {})
            user2 = active_users.get(match['user2_id'], {})
            
            socketio.emit('connection_exchanged', {
                'user1_username': user1.get('username', 'Unknown'),
                'user2_username': user2.get('username', 'Unknown')
            }, room=f"room_{match['room_id']}")
        else:
            socketio.emit('connection_declined', {}, room=f"room_{match['room_id']}")
    
    return jsonify({'success': True})

@app.route('/api/prompts')
def get_prompts():
    return jsonify(CONVERSATION_PROMPTS)

@app.route('/api/qr/<event_id>')
def generate_qr(event_id):
    # Generate QR code
    qr = qrcode.QRCode(version=1, box_size=10, border=5)
    qr.add_data(f"{request.url_root}room/{event_id}")
    qr.make(fit=True)
    
    # Create image
    img = qr.make_image(fill_color="black", back_color="white")
    
    # Convert to base64
    buffer = io.BytesIO()
    img.save(buffer, format='PNG')
    buffer.seek(0)
    img_str = base64.b64encode(buffer.getvalue()).decode()
    
    return jsonify({'qr_code': f"data:image/png;base64,{img_str}"})

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

# Cleanup expired matches every minute
def cleanup_expired_matches():
    while True:
        time.sleep(60)  # Check every minute
        current_time = time.time()
        expired_matches = []
        
        for match_id, match in active_matches.items():
            if current_time - match['created_at'] > 300:  # 5 minutes
                expired_matches.append(match_id)
        
        for match_id in expired_matches:
            del active_matches[match_id]

# Start cleanup thread
cleanup_thread = threading.Thread(target=cleanup_expired_matches, daemon=True)
cleanup_thread.start()

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)
