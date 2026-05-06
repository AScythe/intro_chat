from app import app
from app.state import active_users, active_matches, waiting_queue
import json

with app.test_client() as client:
    # Test 1: Check if routes are registered
    print("Testing route registration...")
    with app.app_context():
        from flask import url_for
        try:
            url_for('create_event')
            url_for('get_rooms', event_id='test')
            url_for('join_event', event_id='test')
            url_for('set_user_room', user_id='test')
            url_for('set_availability', user_id='test')
            url_for('get_match', match_id='test')
            url_for('exchange_connection', match_id='test')
            url_for('generate_qr', event_id='test')
            url_for('get_prompts')
            print("All routes registered successfully!")
        except Exception as e:
            print(f"Route error: {e}")
    
    # Test 2: Test /api/prompts
    print("\nTesting /api/prompts...")
    resp = client.get('/api/prompts')
    print(f"Status: {resp.status_code}")
    if resp.status_code == 200:
        prompts = resp.get_json()
        print(f"Got {len(prompts)} prompts")
    
    # Test 3: Test /api/events POST
    print("\nTesting /api/events POST...")
    resp = client.post('/api/events', json={'name': 'Test Event'})
    print(f"Status: {resp.status_code}")
    if resp.status_code == 200:
        data = resp.get_json()
        event_id = data.get('event_id')
        print(f"Created event: {event_id}")
        
        # Test 4: Test /api/events/<id>/rooms
        print(f"\nTesting /api/events/{event_id}/rooms...")
        resp = client.get(f'/api/events/{event_id}/rooms')
        print(f"Status: {resp.status_code}")
        if resp.status_code == 200:
            rooms = resp.get_json()
            print(f"Got {len(rooms)} rooms")
        
        # Test 5: Test /api/events/<id>/join
        print(f"\nTesting /api/events/{event_id}/join...")
        resp = client.post(f'/api/events/{event_id}/join', json={'username': 'TestUser'})
        print(f"Status: {resp.status_code}")
        if resp.status_code == 200:
            data = resp.get_json()
            user_id = data.get('user_id')
            print(f"Created user: {user_id}")
            
            # Test 6: Test /api/users/<id>/room
            print(f"\nTesting /api/users/{user_id}/room...")
            resp = client.post(f'/api/users/{user_id}/room', json={'room_id': 'room1'})
            print(f"Status: {resp.status_code}")
            
            # Test 7: Test /api/users/<id>/available
            print(f"\nTesting /api/users/{user_id}/available...")
            resp = client.post(f'/api/users/{user_id}/available', json={'available': True})
            print(f"Status: {resp.status_code}")
    
    print("\n=== All tests completed! ===")
