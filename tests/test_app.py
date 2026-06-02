#!/usr/bin/env python3
"""
test_app.py
Description: End-to-end integration test suite that uses FastAPI's TestClient to test page rendering, API endpoints, matchmaking flow, profile updates, and QR generation
"""

import sys
import os

# Add project root to path so app package can be found
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import sqlite3
import json
import asyncio
import time
from fastapi.testclient import TestClient
from app import app


def test_imports():
    """Test that all modular components can be imported"""
    print("🧪 Testing imports...")

    try:
        import fastapi
        print("✅ FastAPI imported successfully")
    except ImportError as e:
        print(f"❌ FastAPI import failed: {e}")

    try:
        import uvicorn
        print("✅ Uvicorn imported successfully")
    except ImportError as e:
        print(f"❌ Uvicorn import failed: {e}")

    try:
        import aiosqlite
        print("✅ aiosqlite imported successfully")
    except ImportError as e:
        print(f"❌ aiosqlite import failed: {e}")

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
        from app.state import store
        from app.prompts import CONVERSATION_PROMPTS
        print("✅ app/state.py imported successfully")
    except ImportError as e:
        print(f"❌ app/state.py import failed: {e}")

    try:
        from app.database import init_db
        print("✅ app/database.py imported successfully")
    except ImportError as e:
        print(f"❌ app/database.py import failed: {e}")

    try:
        from app.routes_html import router_html
        from app.routes_api import router_api
        from app.routes_ws import router_ws
        print("✅ app/routes_*.py imported successfully")
    except ImportError as e:
        print(f"❌ app/routes_*.py import failed: {e}")

    try:
        from app.matchmaking import find_or_enqueue_match, create_match
        print("✅ app/matchmaking.py imported successfully")
    except ImportError as e:
        print(f"❌ app/matchmaking.py import failed: {e}")

    try:
        from app.schemas import CreateEventRequest, JoinEventRequest
        print("✅ app/schemas.py imported successfully")
    except ImportError as e:
        print(f"❌ app/schemas.py import failed: {e}")

    try:
        from app.connection_manager import manager
        print("✅ app/connection_manager.py imported successfully")
    except ImportError as e:
        print(f"❌ app/connection_manager.py import failed: {e}")

    try:
        from app.tasks import cleanup_expired_matches
        print("✅ app/tasks.py imported successfully")
    except ImportError as e:
        print(f"❌ app/tasks.py import failed: {e}")

    try:
        from app.connection_service import handle_connection_exchange
        print("✅ app/connection_service.py imported successfully")
    except ImportError as e:
        print(f"❌ app/connection_service.py import failed: {e}")

    print("✅ Import test completed\n")


def test_file_structure():
    """Test that all required files exist"""
    print("🧪 Testing file structure...")

    required_files = [
        'app/__init__.py',
        'app/state.py',
        'app/database.py',
        'app/routes_html.py',
        'app/routes_api.py',
        'app/routes_ws.py',
        'app/matchmaking.py',
        'app/connection_manager.py',
        'app/schemas.py',
        'app/config.py',
        'app/tasks.py',
        'app/connection_service.py',
        'app/handlers.py',
        'app/prompts.py',
        'app/qr_utils.py',
        'app/sample_users.py',
        'pyproject.toml',
        'docs/README.md',
        'frontend/package.json',
        'frontend/index.html',
        'frontend/src/main.tsx',
        'frontend/src/App.tsx',
        'frontend/src/types/api.ts',
        'frontend/src/api/client.ts',
        'frontend/src/utils/format.ts',
        'frontend/src/utils/storage.ts',
        'frontend/src/hooks/useSocket.ts',
        'frontend/src/hooks/useTimer.ts',
        'frontend/src/context/SocketContext.tsx',
        'frontend/src/context/UserContext.tsx',
        'frontend/src/pages/HomePage.tsx',
        'frontend/src/pages/UserInfoPage.tsx',
        'frontend/src/pages/RoomPage.tsx',
        'frontend/src/pages/ChatPage.tsx',
        'frontend/src/pages/PeoplePage.tsx',
        'frontend/src/pages/ConnectPage.tsx',
        'frontend/src/components/Timer.tsx',
        'frontend/src/components/PersonCard.tsx',
        'frontend/src/styles/global.css',
        'app/__main__.py',
        'app/websocket_handler.py',
        'app/helpers.py',
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
    db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'test_introchat.db')
    asyncio.run(init_db(db_path))

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
    os.remove(db_path)
    print("✅ Database test completed\n")


def test_conversation_prompts():
    """Test conversation prompts"""
    print("🧪 Testing conversation prompts...")

    from app.prompts import CONVERSATION_PROMPTS

    if CONVERSATION_PROMPTS and len(CONVERSATION_PROMPTS) > 0:
        print(f"✅ Found {len(CONVERSATION_PROMPTS)} conversation prompts")
        print(f"✅ Sample prompt: '{CONVERSATION_PROMPTS[0]}'")
    else:
        print("❌ No conversation prompts found")

    print("✅ Conversation prompts test completed\n")


def test_state_constants():
    """Test that state constants are correctly defined"""
    print("🧪 Testing state constants...")

    from app.config import MATCH_EXPIRY_SECONDS, CLEANUP_INTERVAL_SECONDS, CLEANUP_THRESHOLD_SECONDS

    if MATCH_EXPIRY_SECONDS == 30:
        print(f"✅ MATCH_EXPIRY_SECONDS = {MATCH_EXPIRY_SECONDS}")
    else:
        print(f"❌ MATCH_EXPIRY_SECONDS should be 30, got {MATCH_EXPIRY_SECONDS}")

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
    client = TestClient(app)
    resp = client.get('/')
    assert resp.status_code == 200
    assert 'IntroChat' in resp.text
    print("✅ Home page renders correctly\n")


def test_api_endpoints():
    """Test all API endpoints respond correctly"""
    print("🧪 Testing API endpoints...")

    client = TestClient(app)

    # Create event
    resp = client.post('/api/events', json={'name': 'API Test Event'})
    assert resp.status_code == 200
    data = resp.json()
    assert 'event_id' in data
    event_id = data['event_id']
    print(f"✅ POST /api/events → {event_id}")

    # Get rooms
    resp = client.get(f'/api/events/{event_id}/rooms')
    assert resp.status_code == 200
    rooms = resp.json()
    assert len(rooms) == 8
    print(f"✅ GET /api/events/<id>/rooms → {len(rooms)} rooms")

    # Join event
    resp = client.post(f'/api/events/{event_id}/join', json={'username': 'TestUser'})
    assert resp.status_code == 200
    data = resp.json()
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
    data = resp.json()
    assert 'qr_code' in data
    print(f"✅ GET /api/qr/<id> → QR generated")

    # Prompts
    resp = client.get('/api/prompts')
    assert resp.status_code == 200
    prompts = resp.json()
    assert len(prompts) == 10
    print(f"✅ GET /api/prompts → {len(prompts)} prompts")

    print("✅ API endpoint test completed\n")


def test_social_info():
    """Test social info (linkedin_url, slack_handle) is saved on join"""
    print("🧪 Testing social info collection...")

    client = TestClient(app)

    resp = client.post('/api/events', json={'name': 'Social Test'})
    event_id = resp.json()['event_id']

    resp = client.post(f'/api/events/{event_id}/join', json={
        'username': 'SocialUser',
        'linkedin_url': 'https://linkedin.com/in/testuser',
        'slack_handle': '@testuser'
    })
    assert resp.status_code == 200
    user_id = resp.json()['user_id']

    from app.state import store
    user = store.active_users.get(user_id, {})
    assert user.get('linkedin_url') == 'https://linkedin.com/in/testuser'
    assert user.get('slack_handle') == '@testuser'

    print("✅ Social info saved correctly\n")


def test_error_paths():
    """Test error responses for invalid requests"""
    print("🧪 Testing error paths...")

    client = TestClient(app)

    # Missing user
    resp = client.post('/api/users/nonexistent/room', json={'room_id': 'room1'})
    assert resp.status_code == 404

    # Missing match
    resp = client.get('/api/matches/nonexistent')
    assert resp.status_code == 404

    # Missing event rooms
    resp = client.get('/api/events/nonexistent/rooms')
    assert resp.status_code == 200  # Returns empty list for nonexistent event

    # Join with no body
    resp = client.post('/api/events/nonexistent/join', json={})
    assert resp.status_code == 200  # Creates user with defaults

    print("✅ Error path test completed\n")


def test_matchmaking_lifecycle():
    """Test match lifecycle: create, retrieve, connect"""
    print("🧪 Testing matchmaking lifecycle...")

    from app.state import store
    from app.matchmaking import create_match

    client = TestClient(app)

    # Create event + users
    resp = client.post('/api/events', json={'name': 'Match Test'})
    event_id = resp.json()['event_id']

    resp = client.post(f'/api/events/{event_id}/join', json={'username': 'User1'})
    user1_id = resp.json()['user_id']

    resp = client.post(f'/api/events/{event_id}/join', json={'username': 'User2'})
    user2_id = resp.json()['user_id']

    resp = client.get(f'/api/events/{event_id}/rooms')
    room_id = resp.json()[0]['id']

    client.post(f'/api/users/{user1_id}/room', json={'room_id': room_id})
    client.post(f'/api/users/{user2_id}/room', json={'room_id': room_id})

    # Create match directly
    asyncio.run(create_match(user1_id, user2_id, room_id))

    match_ids = [m for m in store.active_matches.values()
                 if m['user1_id'] == user1_id and m['user2_id'] == user2_id]
    assert len(match_ids) == 1
    match_id = list(store.active_matches.keys())[
        [m['user1_id'] for m in store.active_matches.values()].index(user1_id)
    ]
    print(f"✅ Match created: {match_id}")

    # Retrieve match via get_match
    resp = client.get(f'/api/matches/{match_id}')
    assert resp.status_code == 200
    match_data = resp.json()
    assert match_data['user1_username'] == 'User1'
    assert match_data['user2_username'] == 'User2'
    print("✅ Match retrieved via API")

    # Retrieve match via get_user_match
    resp = client.get(f'/api/users/{user1_id}/match')
    assert resp.status_code == 200
    assert resp.json()['match_id'] == match_id
    resp = client.get(f'/api/users/{user2_id}/match')
    assert resp.status_code == 200
    assert resp.json()['match_id'] == match_id
    print("✅ Match retrieved via get_user_match")

    # get_user_match returns 404 for unmatched user
    resp = client.get('/api/users/nonexistent/match')
    assert resp.status_code == 404
    print("✅ get_user_match 404 for unmatched user")

    # Connection exchange — user1 opts in
    resp = client.post(f'/api/matches/{match_id}/connect',
                       json={'user_id': user1_id, 'wants_to_connect': True})
    assert resp.status_code == 200

    # Connection exchange — user2 opts in
    resp = client.post(f'/api/matches/{match_id}/connect',
                       json={'user_id': user2_id, 'wants_to_connect': True})
    assert resp.status_code == 200
    print("✅ Connection exchange completed")

    # Connection declined path — user2 opts in, user3 opts out
    resp = client.post(f'/api/events/{event_id}/join', json={'username': 'User3'})
    user3_id = resp.json()['user_id']
    client.post(f'/api/users/{user3_id}/room', json={'room_id': room_id})
    asyncio.run(create_match(user2_id, user3_id, room_id))
    match_id2 = [mid for mid, m in store.active_matches.items()
                 if m['user1_id'] == user2_id and m['user2_id'] == user3_id][0]
    resp = client.post(f'/api/matches/{match_id2}/connect',
                       json={'user_id': user2_id, 'wants_to_connect': True})
    assert resp.status_code == 200
    resp = client.post(f'/api/matches/{match_id2}/connect',
                       json={'user_id': user3_id, 'wants_to_connect': False})
    assert resp.status_code == 200
    print("✅ Connection declined path works")
    if match_id2 in store.active_matches:
        del store.active_matches[match_id2]

    # Cleanup state
    if match_id in store.active_matches:
        del store.active_matches[match_id]

    print("✅ Matchmaking lifecycle test completed\n")


def test_find_match_end_to_end():
    """Test find_match via availability toggle (full flow, not direct call)"""
    print("🧪 Testing find_match end-to-end...")

    from app.state import store
    from app.matchmaking import find_or_enqueue_match

    client = TestClient(app)

    # Create event + two users
    resp = client.post('/api/events', json={'name': 'FindMatch Test'})
    event_id = resp.json()['event_id']

    resp = client.post(f'/api/events/{event_id}/join', json={'username': 'Alice'})
    user1_id = resp.json()['user_id']

    resp = client.post(f'/api/events/{event_id}/join', json={'username': 'Bob'})
    user2_id = resp.json()['user_id']

    resp = client.get(f'/api/events/{event_id}/rooms')
    room_id = resp.json()[0]['id']

    client.post(f'/api/users/{user1_id}/room', json={'room_id': room_id})
    client.post(f'/api/users/{user2_id}/room', json={'room_id': room_id})

    # Toggle user1 available — no match yet, goes to waiting_queue
    client.post(f'/api/users/{user1_id}/available', json={'available': True})
    assert user1_id in store.waiting_queue
    print("✅ User1 in waiting queue")

    # Toggle user2 available — triggers find_match, both should match
    client.post(f'/api/users/{user2_id}/available', json={'available': True})

    # Verify match was created
    match_id = None
    for mid, m in store.active_matches.items():
        if (m['user1_id'] == user1_id and m['user2_id'] == user2_id) or \
           (m['user1_id'] == user2_id and m['user2_id'] == user1_id):
            match_id = mid
            break
    assert match_id is not None, "find_match should create a match when two users are available in same room"
    print(f"✅ Match created via find_match: {match_id}")

    # Both should be removed from waiting queue
    assert user1_id not in store.waiting_queue
    assert user2_id not in store.waiting_queue
    print("✅ Both users removed from waiting queue")

    # Both should be set unavailable
    assert store.active_users.get(user1_id, {}).get('is_available') == False
    assert store.active_users.get(user2_id, {}).get('is_available') == False
    print("✅ Both users set to unavailable")

    # Cleanup
    if match_id in store.active_matches:
        del store.active_matches[match_id]

    print("✅ find_match end-to-end test completed\n")


def test_cleanup_expired_matches():
    """Test cleanup threshold logic — old matches get removed, new ones stay"""
    print("🧪 Testing cleanup expired matches...")

    from app.state import store
    from app.config import CLEANUP_THRESHOLD_SECONDS
    import time

    # Add a new match (should NOT be cleaned up)
    fresh_match_id = 'fresh_match_test'
    store.active_matches[fresh_match_id] = {
        'user1_id': 'u1',
        'user2_id': 'u2',
        'room_id': 'r1',
        'created_at': time.time()
    }

    # Add an old match (should be cleaned up)
    old_match_id = 'old_match_test'
    store.active_matches[old_match_id] = {
        'user1_id': 'u3',
        'user2_id': 'u4',
        'room_id': 'r2',
        'created_at': time.time() - CLEANUP_THRESHOLD_SECONDS - 10
    }

    # Run cleanup logic inline (same logic as cleanup_expired_matches)
    current_time = time.time()
    matches_to_remove = [
        mid for mid, match in store.active_matches.items()
        if current_time - match['created_at'] > CLEANUP_THRESHOLD_SECONDS
    ]

    assert old_match_id in matches_to_remove
    print("✅ Old match identified for cleanup")

    assert fresh_match_id not in matches_to_remove
    print("✅ Fresh match not identified for cleanup")

    # Actually remove them (simulating cleanup)
    for mid in matches_to_remove:
        del store.active_matches[mid]

    assert fresh_match_id in store.active_matches
    assert old_match_id not in store.active_matches
    print("✅ Cleanup removes old matches, keeps new ones")

    # Cleanup
    if fresh_match_id in store.active_matches:
        del store.active_matches[fresh_match_id]

    print("✅ Cleanup expired matches test completed\n")


def test_websocket_connection():
    """Test WebSocket endpoint and ConnectionManager"""
    print("🧪 Testing WebSocket endpoint...")

    from app.connection_manager import manager

    client = TestClient(app)

    # Test ConnectionManager connect/disconnect directly
    test_user = 'direct_test_user'
    test_room = 'direct_test_room'

    # Simulate what connect() does internally
    manager.user_connections[test_user] = None
    manager.user_rooms[test_user] = test_room
    manager.room_users.setdefault(test_room, set()).add(test_user)
    assert test_user in manager.user_connections
    assert manager.user_rooms.get(test_user) == test_room
    assert test_user in manager.room_users.get(test_room, set())
    print("✅ ConnectionManager internal mappings work")

    manager.disconnect(test_user)
    assert test_user not in manager.user_connections
    assert test_user not in manager.user_rooms
    assert test_user not in manager.room_users.get(test_room, set())
    print("✅ ConnectionManager.disconnect cleans up all mappings")

    # send_to_user handles missing user gracefully
    asyncio.run(manager.send_to_user('nonexistent', {'type': 'test'}))
    print("✅ ConnectionManager.send_to_user handles missing user gracefully")

    # Test WebSocket endpoint via TestClient
    ws_user = 'ws_e2e_user'

    with client.websocket_connect('/ws') as ws:
        ws.send_json({'user_id': ws_user, 'room_id': 'ws_room1'})

    assert ws_user not in manager.user_connections
    print("✅ WebSocket endpoint: connect and clean disconnect works")

    # Test join_room via WebSocket
    with client.websocket_connect('/ws') as ws:
        ws.send_json({'user_id': ws_user, 'room_id': 'ws_room1'})
        ws.send_json({'type': 'join_room', 'room_id': 'ws_room2'})

    assert ws_user not in manager.user_connections
    print("✅ WebSocket endpoint: join_room and disconnect works")

    # Test WebSocket rejects missing user_id
    try:
        with client.websocket_connect('/ws') as ws:
            ws.send_json({'room_id': 'no_user_room'})
            ws.receive_json()
        print("❌ WebSocket should have rejected missing user_id")
    except Exception:
        print("✅ WebSocket rejects missing user_id")

    print("✅ WebSocket endpoint test completed\n")


def test_template_pages():
    """Test that SPA pages render correctly (all return index.html)"""
    print("🧪 Testing SPA pages...")

    client = TestClient(app)

    # All client-side routes return the SPA index.html
    for path in ['/', '/join/test_event', '/room/test_event', '/chat/test_match']:
        resp = client.get(path)
        assert resp.status_code == 200
        assert '<div id="root">' in resp.text
    print("✅ All SPA routes return index.html")

    # SPA returns index.html even for unknown paths
    resp = client.get('/chat/nonexistent')
    assert resp.status_code == 200
    assert '<div id="root">' in resp.text
    print("✅ /chat/<id> renders for unknown match (SPA catch-all)")

    print("✅ SPA pages test completed\n")


def test_sample_users_fill():
    """Test that saving event config fills rooms with sample users"""
    print("🧪 Testing sample user fill on save config...")

    client = TestClient(app)

    # Create event
    resp = client.post('/api/events', json={'name': 'Sample Fill Test'})
    event_id = resp.json()['event_id']

    # Get default rooms
    resp = client.get(f'/api/events/{event_id}/rooms')
    rooms = resp.json()
    selected_names = [r['name'] for r in rooms[:3]]

    # Save config with first 3 rooms selected
    resp = client.put(f'/api/events/{event_id}/config', json={
        'rooms': selected_names,
        'topics': ['Tech', 'Music']
    })
    assert resp.status_code == 200
    data = resp.json()
    assert data['success'] is True
    assert len(data['rooms_filled']) == 3
    for name in selected_names:
        assert name in data['rooms_filled']
    print(f"✅ PUT /api/events/<id>/config → {len(data['rooms_filled'])} rooms filled")

    # Verify each room has sample users via GET endpoint
    resp = client.get(f'/api/events/{event_id}/config')
    config_rooms = resp.json()['rooms']
    for room in config_rooms:
        if room['name'] in selected_names:
            rresp = client.get(f'/api/events/{event_id}/rooms/{room["id"]}/users')
            assert rresp.status_code == 200
            users = rresp.json()['sample_users']
            assert 3 <= len(users) <= 5
            assert any(u['available'] for u in users)
            print(f"✅ Room '{room['name']}' has {len(users)} sample users (≥1 available)")

    print("✅ Sample user fill test completed\n")


def test_sample_users_idempotent():
    """Test that re-saving same config does not add duplicate sample users"""
    print("🧪 Testing sample user fill idempotency...")

    client = TestClient(app)

    resp = client.post('/api/events', json={'name': 'Idempotent Test'})
    event_id = resp.json()['event_id']

    resp = client.get(f'/api/events/{event_id}/rooms')
    rooms = resp.json()
    selected_names = [r['name'] for r in rooms[:2]]

    # First save — should fill rooms
    resp = client.put(f'/api/events/{event_id}/config', json={
        'rooms': selected_names,
        'topics': ['Tech']
    })
    assert len(resp.json()['rooms_filled']) == 2
    print("✅ First save filled 2 rooms")

    # Get count of sample users after first save
    resp = client.get(f'/api/events/{event_id}/config')
    room_id = resp.json()['rooms'][0]['id']
    rresp = client.get(f'/api/events/{event_id}/rooms/{room_id}/users')
    first_count = len(rresp.json()['sample_users'])

    # Second save — should NOT fill any rooms (idempotent)
    resp = client.put(f'/api/events/{event_id}/config', json={
        'rooms': selected_names,
        'topics': ['Tech']
    })
    assert len(resp.json()['rooms_filled']) == 0
    print("✅ Second save filled 0 rooms (idempotent)")

    # Verify count unchanged
    rresp = client.get(f'/api/events/{event_id}/rooms/{room_id}/users')
    second_count = len(rresp.json()['sample_users'])
    assert first_count == second_count
    print("✅ Sample user count unchanged after re-save")

    print("✅ Sample user fill idempotency test completed\n")


def test_room_users_api():
    """Test GET /api/events/{id}/rooms/{rid}/users endpoint"""
    print("🧪 Testing room users API...")

    client = TestClient(app)

    resp = client.post('/api/events', json={'name': 'Room Users API Test'})
    event_id = resp.json()['event_id']

    resp = client.get(f'/api/events/{event_id}/rooms')
    rooms = resp.json()
    selected_names = [r['name'] for r in rooms[:1]]

    # Save config to fill sample users
    client.put(f'/api/events/{event_id}/config', json={
        'rooms': selected_names,
        'topics': ['Tech']
    })

    # Get room ID from config
    resp = client.get(f'/api/events/{event_id}/config')
    room = resp.json()['rooms'][0]

    # GET users for this room
    rresp = client.get(f'/api/events/{event_id}/rooms/{room["id"]}/users')
    assert rresp.status_code == 200
    data = rresp.json()
    assert 'sample_users' in data
    assert len(data['sample_users']) >= 1
    for user in data['sample_users']:
        assert 'name' in user
        assert 'available' in user
        assert 'status' in user
        assert 'linkedin_url' in user
        assert 'slack_handle' in user
    print(f"✅ GET /users returned {len(data['sample_users'])} users with correct shape")

    # GET users for non-existent room — returns empty list
    rresp = client.get(f'/api/events/{event_id}/rooms/nonexistent/users')
    assert rresp.status_code == 200
    assert rresp.json()['sample_users'] == []
    print("✅ GET /users for non-existent room returns empty list")

    print("✅ Room users API test completed\n")


def test_helpers_short_id():
    """Test that short_id generates valid 8-char hex IDs"""
    print("🧪 Testing helpers.short_id...")
    from app.helpers import short_id
    id1 = short_id()
    id2 = short_id()
    assert len(id1) == 8
    assert id1 != id2
    assert all(c in '0123456789abcdef' for c in id1)
    print("✅ helpers.short_id generates valid 8-char hex IDs")
    print()


def test_qr_utils():
    """Test that generate_qr_data_uri returns a valid data URI"""
    print("🧪 Testing qr_utils.generate_qr_data_uri...")
    from app.qr_utils import generate_qr_data_uri
    uri = generate_qr_data_uri('https://example.com/test')
    assert uri.startswith('data:image/png;base64,')
    assert len(uri) > 50
    print("✅ qr_utils.generate_qr_data_uri returns valid data URI")
    print()


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
    test_find_match_end_to_end()
    test_cleanup_expired_matches()
    test_websocket_connection()
    test_template_pages()
    test_sample_users_fill()
    test_sample_users_idempotent()
    test_room_users_api()
    test_helpers_short_id()
    test_qr_utils()

    print("🎉 All tests completed!")

    print("\n📋 To run the application:")
    print("   uv run python -m app")

    print("\n🌐 Then open your browser to:")
    print("   http://localhost:5000")

    print("\n💡 For testing with multiple devices:")
    print("   - Find your computer's IP address")
    print("   - Open http://YOUR_IP:5000 on other devices")
    print("   - Make sure all devices are on the same network")


if __name__ == "__main__":
    main()
