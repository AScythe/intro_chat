#!/usr/bin/env python3
"""
Simple test script for IntroChat application
Tests core functionality without running the full server
"""

import sqlite3
import json
import requests
import time
from app import init_db, CONVERSATION_PROMPTS

def test_database():
    """Test database initialization and basic operations"""
    print("🧪 Testing database initialization...")
    
    # Initialize database
    init_db()
    
    # Test database connection
    conn = sqlite3.connect('introchat.db')
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
    
    if CONVERSATION_PROMPTS and len(CONVERSATION_PROMPTS) > 0:
        print(f"✅ Found {len(CONVERSATION_PROMPTS)} conversation prompts")
        print(f"✅ Sample prompt: '{CONVERSATION_PROMPTS[0]}'")
    else:
        print("❌ No conversation prompts found")
    
    print("✅ Conversation prompts test completed\n")

def test_imports():
    """Test that all required modules can be imported"""
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
    
    print("✅ Import test completed\n")

def test_file_structure():
    """Test that all required files exist"""
    print("🧪 Testing file structure...")
    
    import os
    
    required_files = [
        'app.py',
        'requirements.txt',
        'README.md',
        'templates/index.html',
        'templates/room.html',
        'templates/chat.html',
        'static/style.css',
        'static/home.js'
    ]
    
    for file_path in required_files:
        if os.path.exists(file_path):
            print(f"✅ {file_path} exists")
        else:
            print(f"❌ {file_path} missing")
    
    print("✅ File structure test completed\n")

def main():
    """Run all tests"""
    print("🌟 IntroChat Application Test Suite")
    print("=" * 50)
    
    test_imports()
    test_file_structure()
    test_database()
    test_conversation_prompts()
    
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
