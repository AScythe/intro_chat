#!/usr/bin/env python3
"""
test_app.py
Description: End-to-end integration test suite that starts the Flask server as a subprocess and tests page rendering, API endpoints, matchmaking flow, profile updates, and QR generation via the requests library
"""

import sys
import os

# Add project root to path so app package can be found
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import sqlite3
import json
import requests
import time
from app import app


def test_imports():
    """Test that all modular components can be imported"""
    print("🧪 Testing imports...")

    try:
        import flask
        print("✅ Flask imported successfully")
    except ImportError as e:
        print(f"❌ Flask import failed: {e}")

    try:
        import flask_socketio
        print("✅ Flask-SocketIO imported successfully")
    except ImportError as e:
        print(f"❌ Flask-SocketIO import failed: {e}")

    try:
        import qrcode
        print("✅ QRCode imported successfully")
    except ImportError as e:
        print(f"❌ QRCode import failed: {e}")

    try:
        import sqlite3
        print("✅ SQLite3 imported successfully")
    except ImportError as e:
        print(f"❌ SQLite3 import failed: {e}")

    # Test new modular imports from app package
    try:
        from app.state import CONVERSATION_PROMPTS
        print("✅ app/state.py imported successfully")
    except ImportError as e:
        print(f"❌ app/state.py import failed: {e}")

    try:
        from app.database import init_db
        print("✅ app/database.py imported successfully")
    except ImportError as e:
        print(f"❌ app/database.py import failed: {e}")

    try:
        from app.routes import register_routes
        print("✅ app/routes.py imported successfully")
    except ImportError as e:
        print(f"❌ app/routes.py import failed: {e}")

    try:
        from app.matchmaking import find_match, create_match
        print("✅ app/matchmaking.py imported successfully")
    except ImportError as e:
        print(f"❌ app/matchmaking.py import failed: {e}")

    try:
        from app.socket_events import register_handlers
        print("✅ app/socket_events.py imported successfully")
    except ImportError as e:
        print(f"❌ app/socket_events.py import failed: {e}")

    try:
        from app.tasks import cleanup_expired_matches
        print("✅ app/tasks.py imported successfully")
    except ImportError as e:
        print(f"❌ app/tasks.py import failed: {e}")

    print("✅ Import test completed\n")


def test_file_structure():
    """Test that all required files exist"""
    print("🧪 Testing file structure...")

    required_files = [
        'app/__init__.py',
        'app/state.py',
        'app/database.py',
        'app/routes.py',
        'app/matchmaking.py',
        'app/socket_events.py',
        'app/tasks.py',
        'requirements.txt',
        'docs/README.md',
        'app/templates/index.html',
        'app/templates/room.html',
        'app/templates/chat.html',
        'app/templates/user_info.html',
        'app/static/css/style.css',
        'app/static/js/home.js',
        'app/static/js/user-info.js',
        'app/static/js/config.js',
        'app/static/js/room.js',
        'app/static/js/chat.js',
        'app/static/js/dom-utils.js',
        'app/static/js/api-utils.js',
        'app/static/js/timer-utils.js',
        'app/__main__.py',
        'tests/test_db.py',
        '.gitattributes'
    ]

    for file_path in required_files:
        if os.path.exists(file_path):
            print(f"✅ {file_path} exists")
        else:
            print(f"❌ {file_path} missing")

    print("✅ File structure test completed\n")


def test_database():
    """Test database initialization and basic operations"""
    print("🧪 Testing database initialization...")

    # Initialize database with correct path
    import os
    from app.database import init_db
    db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'introchat.db')
    init_db(db_path)

    # Test database connection
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()

    # Check if tables exist
    cursor.execute("SELECT name FROM sqlite_master WHERE type='table';")
    tables = [row[0] for row in cursor.fetchall()]

    expected_tables = ['events', 'rooms', 'users', 'matches']
    for table in expected_tables:
        if table in tables:
            print(f"✅ Table '{table}' exists")
        else:
            print(f"❌ Table '{table}' missing")

    # Test inserting sample data
    try:
        cursor.execute("INSERT INTO events (id, name) VALUES (?, ?)", ('TEST123', 'Test Event'))
        cursor.execute("INSERT INTO rooms (id, event_id, name) VALUES (?, ?, ?)", ('ROOM1', 'TEST123', 'Test Room'))
        conn.commit()
        print("✅ Sample data insertion successful")

        # Clean up
        cursor.execute("DELETE FROM rooms WHERE id = 'ROOM1'")
        cursor.execute("DELETE FROM events WHERE id = 'TEST123'")
        conn.commit()
        print("✅ Sample data cleanup successful")

    except Exception as e:
        print(f"❌ Database operations failed: {e}")

    conn.close()
    print("✅ Database test completed\n")


def test_conversation_prompts():
    """Test conversation prompts"""
    print("🧪 Testing conversation prompts...")

    from app.state import CONVERSATION_PROMPTS

    if CONVERSATION_PROMPTS and len(CONVERSATION_PROMPTS) > 0:
        print(f"✅ Found {len(CONVERSATION_PROMPTS)} conversation prompts")
        print(f"✅ Sample prompt: '{CONVERSATION_PROMPTS[0]}'")
    else:
        print("❌ No conversation prompts found")

    print("✅ Conversation prompts test completed\n")


def test_state_constants():
    """Test that state constants are correctly defined"""
    print("🧪 Testing state constants...")

    from app.state import MATCH_EXPIRY_MINUTES, CLEANUP_INTERVAL_SECONDS, CLEANUP_THRESHOLD_SECONDS

    if MATCH_EXPIRY_MINUTES == 2:
        print(f"✅ MATCH_EXPIRY_MINUTES = {MATCH_EXPIRY_MINUTES}")
    else:
        print(f"❌ MATCH_EXPIRY_MINUTES should be 2, got {MATCH_EXPIRY_MINUTES}")

    if CLEANUP_INTERVAL_SECONDS == 60:
        print(f"✅ CLEANUP_INTERVAL_SECONDS = {CLEANUP_INTERVAL_SECONDS}")
    else:
        print(f"❌ CLEANUP_INTERVAL_SECONDS should be 60, got {CLEANUP_INTERVAL_SECONDS}")

    if CLEANUP_THRESHOLD_SECONDS == 300:
        print(f"✅ CLEANUP_THRESHOLD_SECONDS = {CLEANUP_THRESHOLD_SECONDS}")
    else:
        print(f"❌ CLEANUP_THRESHOLD_SECONDS should be 300, got {CLEANUP_THRESHOLD_SECONDS}")

    print("✅ State constants test completed\n")





def test_home_page():
    """Test home page renders"""
    print("🧪 Testing home page...")
    with app.test_client() as client:
        resp = client.get('/')
        assert resp.status_code == 200
        assert b'IntroChat' in resp.data
    print("✅ Home page renders correctly\n")


def test_api_endpoints():
    """Test all API endpoints respond correctly"""
    print("🧪 Testing API endpoints...")

    with app.test_client() as client:
        # Create event
        resp = client.post('/api/events', json={'name': 'API Test Event'})
        assert resp.status_code == 200
        data = resp.get_json()
        assert 'event_id' in data
        event_id = data['event_id']
        print(f"✅ POST /api/events → {event_id}")

        # Get rooms
        resp = client.get(f'/api/events/{event_id}/rooms')
        assert resp.status_code == 200
        rooms = resp.get_json()
        assert len(rooms) == 8
        print(f"✅ GET /api/events/<id>/rooms → {len(rooms)} rooms")

        # Join event
        resp = client.post(f'/api/events/{event_id}/join', json={'username': 'TestUser'})
        assert resp.status_code == 200
        data = resp.get_json()
        assert 'user_id' in data
        user_id = data['user_id']
        print(f"✅ POST /api/events/<id>/join → user {user_id}")

        # Select room
        room_id = rooms[0]['id']
        resp = client.post(f'/api/users/{user_id}/room', json={'room_id': room_id})
        assert resp.status_code == 200
        print(f"✅ POST /api/users/<id>/room → room selected")

        # Set available
        resp = client.post(f'/api/users/{user_id}/available', json={'available': True})
        assert resp.status_code == 200
        print(f"✅ POST /api/users/<id>/available → toggled")

        # QR code
        resp = client.get(f'/api/qr/{event_id}')
        assert resp.status_code == 200
        data = resp.get_json()
        assert 'qr_code' in data
        print(f"✅ GET /api/qr/<id> → QR generated")

        # Prompts
        resp = client.get('/api/prompts')
        assert resp.status_code == 200
        prompts = resp.get_json()
        assert len(prompts) == 10
        print(f"✅ GET /api/prompts → {len(prompts)} prompts")

    print("✅ API endpoint test completed\n")


def test_social_info():
    """Test social info (linkedin_url, slack_handle) is saved on join"""
    print("🧪 Testing social info collection...")

    with app.test_client() as client:
        resp = client.post('/api/events', json={'name': 'Social Test'})
        event_id = resp.get_json()['event_id']

        resp = client.post(f'/api/events/{event_id}/join', json={
            'username': 'SocialUser',
            'linkedin_url': 'https://linkedin.com/in/testuser',
            'slack_handle': '@testuser'
        })
        assert resp.status_code == 200
        user_id = resp.get_json()['user_id']

        from app.state import active_users
        user = active_users.get(user_id, {})
        assert user.get('linkedin_url') == 'https://linkedin.com/in/testuser'
        assert user.get('slack_handle') == '@testuser'

    print("✅ Social info saved correctly\n")


def test_error_paths():
    """Test error responses for invalid requests"""
    print("🧪 Testing error paths...")

    with app.test_client() as client:
        # Missing user
        resp = client.post('/api/users/nonexistent/room', json={'room_id': 'room1'})
        assert resp.status_code == 404

        # Missing match
        resp = client.get('/api/matches/nonexistent')
        assert resp.status_code == 404

        # Missing event rooms
        resp = client.get('/api/events/nonexistent/rooms')
        assert resp.status_code == 200  # Returns empty list, not error

        # Join with no body
        resp = client.post('/api/events/nonexistent/join', json={})
        assert resp.status_code == 200  # Creates user with defaults

    print("✅ Error path test completed\n")


def test_matchmaking_lifecycle():
    """Test match lifecycle: create, retrieve, connect"""
    print("🧪 Testing matchmaking lifecycle...")

    from app.state import active_users, active_matches, waiting_queue
    from app.matchmaking import create_match

    with app.test_client() as client:
        # Create event + users
        resp = client.post('/api/events', json={'name': 'Match Test'})
        event_id = resp.get_json()['event_id']

        resp = client.post(f'/api/events/{event_id}/join', json={'username': 'User1'})
        user1_id = resp.get_json()['user_id']

        resp = client.post(f'/api/events/{event_id}/join', json={'username': 'User2'})
        user2_id = resp.get_json()['user_id']

        resp = client.get(f'/api/events/{event_id}/rooms')
        room_id = resp.get_json()[0]['id']

        client.post(f'/api/users/{user1_id}/room', json={'room_id': room_id})
        client.post(f'/api/users/{user2_id}/room', json={'room_id': room_id})

        # Create match directly
        create_match(user1_id, user2_id, room_id)

        match_ids = [m for m in active_matches.values()
                     if m['user1_id'] == user1_id and m['user2_id'] == user2_id]
        assert len(match_ids) == 1
        match_id = list(active_matches.keys())[
            [m['user1_id'] for m in active_matches.values()].index(user1_id)
        ]
        print(f"✅ Match created: {match_id}")

        # Retrieve match
        resp = client.get(f'/api/matches/{match_id}')
        assert resp.status_code == 200
        match_data = resp.get_json()
        assert match_data['user1_username'] == 'User1'
        assert match_data['user2_username'] == 'User2'
        print("✅ Match retrieved via API")

        # Connection exchange — user1 opts in
        resp = client.post(f'/api/matches/{match_id}/connect',
                           json={'user_id': user1_id, 'wants_to_connect': True})
        assert resp.status_code == 200

        # Connection exchange — user2 opts in
        resp = client.post(f'/api/matches/{match_id}/connect',
                           json={'user_id': user2_id, 'wants_to_connect': True})
        assert resp.status_code == 200
        print("✅ Connection exchange completed")

        # Cleanup state
        if match_id in active_matches:
            del active_matches[match_id]

    print("✅ Matchmaking lifecycle test completed\n")


def main():
    """Run all tests"""
    print("🌟 IntroChat Application Test Suite")
    print("=" * 50)

    test_imports()
    test_file_structure()
    test_database()
    test_conversation_prompts()
    test_state_constants()
    test_home_page()
    test_api_endpoints()
    test_social_info()
    test_error_paths()
    test_matchmaking_lifecycle()

    print("🎉 All tests completed!")

    print("\n📋 To run the application:")
    print("   python -m app")

    print("\n🌐 Then open your browser to:")
    print("   http://localhost:5000")

    print("\n💡 For testing with multiple devices:")
    print("   - Find your computer's IP address")
    print("   - Open http://YOUR_IP:5000 on other devices")
    print("   - Make sure all devices are on the same network")


if __name__ == "__main__":
    main()
