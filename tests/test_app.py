#!/usr/bin/env python3
"""
Test script for IntroChat application
Tests new modular architecture (state.py, database.py, routes.py, etc.)
"""

import sys
import os

# Add project root to path so app package can be found
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import sqlite3
import json
import requests
import time


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
        'templates/index.html',
        'templates/room.html',
        'templates/chat.html',
        'static/css/style.css',
        'static/js/home.js'
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





def main():
    """Run all tests"""
    print("🌟 IntroChat Application Test Suite")
    print("=" * 50)

    test_imports()
    test_file_structure()
    test_database()
    test_conversation_prompts()
    test_state_constants()

    print("🎉 All tests completed!")

    print("\n📋 To run the application:")
    print("   python app.py")

    print("\n🌐 Then open your browser to:")
    print("   http://localhost:5000")

    print("\n💡 For testing with multiple devices:")
    print("   - Find your computer's IP address")
    print("   - Open http://YOUR_IP:5000 on other devices")
    print("   - Make sure all devices are on the same network")


if __name__ == "__main__":
    main()
