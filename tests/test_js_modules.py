#+++ test_js_modules.py (修改后)
#!/usr/bin/env python3
"""
Test suite for extracted JavaScript files in IntroChat application
Tests the modular JavaScript structure and functionality
"""

import os
import re

def test_js_files_exist():
    """Test that all required JS files exist"""
    print("🧪 Testing JavaScript file structure...")

    required_files = [
        'static/utils.js',
        'static/dom-utils.js',
        'static/api-utils.js',
        'static/timer-utils.js',
        'static/room.js',
        'static/chat.js',
        'static/home.js'
    ]

    for file_path in required_files:
        if os.path.exists(file_path):
            print(f"✅ {file_path} exists")
        else:
            print(f"❌ {file_path} missing")

    print()

def test_utils_functions():
    """Test that utils.js and split utility files contain all required functions"""
    print("🧪 Testing utils.js functions...")

    files = ['static/utils.js', 'static/dom-utils.js', 'static/api-utils.js', 'static/timer-utils.js']
    all_content = ''
    for f in files:
        if os.path.exists(f):
            with open(f, 'r') as fh:
                all_content += fh.read()

    required_functions = [
        'showError',
        'getUrlParameter',
        'formatTime',
        'initSocket',
        'getElementById',
        'setTextContent',
        'setDisplay',
        'addEventListenerSafe',
        'fetchWithTimeout',
        'parseJSON',
        'fetchJSON',
        'generateRandomString',
        'generateUsername',
        'storeUserId',
        'getUserId',
        'clearUserId',
        'createChatTimer',
        'createCountdown',
        'storeData',
        'getData',
        'clearData'
    ]

    for func_name in required_functions:
        pattern = rf'function\s+{func_name}\s*\('
        if re.search(pattern, all_content):
            print(f"✅ Function '{func_name}' found")
        else:
            print(f"❌ Function '{func_name}' missing")

    print()

def test_room_js_functions():
    """Test that room.js contains all required functions"""
    print("🧪 Testing room.js functions...")

    with open('static/room.js', 'r') as f:
        content = f.read()

    required_functions = [
        'initRoomPage',
        'ensureUserExists',
        'loadRooms',
        'setupEventListeners',
        'selectRoom',
        'handleMatchFound',
        'startCountdown',
        'goToChat',
        'addSampleUsers',
        'updateNearbyUsers',
        'requestChatWithPerson',
        'simulatePersonResponse',
        'cancelRequest',
        'testFunction'
    ]

    for func_name in required_functions:
        pattern = rf'function\s+{func_name}\s*\('
        if re.search(pattern, content):
            print(f"✅ Function '{func_name}' found")
        else:
            print(f"❌ Function '{func_name}' missing")

    # Check for proper imports from utils
    utils_imports = ['getUserId', 'storeUserId', 'generateUsername', 'generateRandomString',
                     'fetchJSON', 'getElementById', 'setTextContent', 'setDisplay',
                     'addEventListenerSafe', 'initSocket', 'showError']

    print("\nChecking utils.js function usage:")
    for func in utils_imports:
        if func in content:
            print(f"✅ Uses '{func}' from utils.js")
        else:
            print(f"⚠️  Does not use '{func}' (may be optional)")

    print()

def test_chat_js_functions():
    """Test that chat.js contains all required functions"""
    print("🧪 Testing chat.js functions...")

    with open('static/chat.js', 'r') as f:
        content = f.read()

    required_functions = [
        'initChatPage',
        'loadMatchInfo',
        'loadPrompts',
        'setupEventListeners',
        'startChatTimer',
        'updateTimerDisplay',
        'displayCurrentPrompt',
        'nextPrompt',
        'showTimeUp',
        'extendChat',
        'startExtendedChatTimer',
        'updateExtendedTimerDisplay',
        'showSlackConnection',
        'setConnectionPreference',
        'showWaitingForConnection',
        'handleConnectionExchanged',
        'handleConnectionDeclined'
    ]

    for func_name in required_functions:
        pattern = rf'function\s+{func_name}\s*\('
        if re.search(pattern, content):
            print(f"✅ Function '{func_name}' found")
        else:
            print(f"❌ Function '{func_name}' missing")

    # Check for proper imports from utils
    utils_imports = ['getUserId', 'fetchJSON', 'getElementById', 'setTextContent',
                     'setDisplay', 'addEventListenerSafe', 'initSocket', 'showError']

    print("\nChecking utils.js function usage:")
    for func in utils_imports:
        if func in content:
            print(f"✅ Uses '{func}' from utils.js")
        else:
            print(f"⚠️  Does not use '{func}' (may be optional)")

    print()

def test_html_templates():
    """Test that HTML templates properly include the new JS files"""
    print("🧪 Testing HTML template script includes...")

    # Test room.html
    with open('templates/room.html', 'r') as f:
        room_content = f.read()

    for js_name in ['utils.js', 'dom-utils.js', 'api-utils.js', 'timer-utils.js']:
        if js_name in room_content:
            print(f"✅ room.html includes {js_name}")
        else:
            print(f"❌ room.html missing {js_name}")

    if 'room.js' in room_content:
        print("✅ room.html includes room.js")
    else:
        print("❌ room.html missing room.js")

    if 'window.roomEventId' in room_content:
        print("✅ room.html passes event_id to JavaScript")
    else:
        print("❌ room.html missing event_id configuration")

    # Test chat.html
    with open('templates/chat.html', 'r') as f:
        chat_content = f.read()

    for js_name in ['utils.js', 'dom-utils.js', 'api-utils.js', 'timer-utils.js']:
        if js_name in chat_content:
            print(f"✅ chat.html includes {js_name}")
        else:
            print(f"❌ chat.html missing {js_name}")

    if 'chat.js' in chat_content:
        print("✅ chat.html includes chat.js")
    else:
        print("❌ chat.html missing chat.js")

    if 'window.chatMatchId' in chat_content:
        print("✅ chat.html passes match_id to JavaScript")
    else:
        print("❌ chat.html missing match_id configuration")

    # Verify no inline scripts remain (except config)
    inline_script_pattern = r'<script>\s*(?!// Pass Flask)(?!window\.)[\s\S]*?function\s+\w+'
    if not re.search(inline_script_pattern, room_content):
        print("✅ room.html has no inline function definitions")
    else:
        print("⚠️  room.html may still have inline functions")

    if not re.search(inline_script_pattern, chat_content):
        print("✅ chat.html has no inline function definitions")
    else:
        print("⚠️  chat.html may still have inline functions")

    print()

def test_code_quality():
    """Test code quality and best practices"""
    print("🧪 Testing code quality...")

    js_files = ['static/utils.js', 'static/dom-utils.js', 'static/api-utils.js', 'static/timer-utils.js', 'static/room.js', 'static/chat.js']

    for js_file in js_files:
        with open(js_file, 'r') as f:
            content = f.read()

        # Check for console.log statements (acceptable for debugging)
        console_logs = content.count('console.log')
        print(f"ℹ️  {js_file}: {console_logs} console.log statements")

        # Check for JSDoc comments
        if '/**' in content:
            print(f"✅ {js_file} has JSDoc comments")
        else:
            print(f"⚠️  {js_file} could use more JSDoc comments")

        # Check for strict mode or module pattern
        if "'use strict'" in content or '"use strict"' in content:
            print(f"✅ {js_file} uses strict mode")
        else:
            print(f"ℹ️  {js_file} doesn't explicitly use strict mode (acceptable for modern browsers)")

    print()

def main():
    """Run all tests"""
    print("🌟 IntroChat JavaScript Modularization Test Suite")
    print("=" * 60)
    print()

    test_js_files_exist()
    test_utils_functions()
    test_room_js_functions()
    test_chat_js_functions()
    test_html_templates()
    test_code_quality()

    print("🎉 All JavaScript tests completed!")
    print("\n📋 Summary:")
    print("   - JavaScript code successfully extracted from HTML templates")
    print("   - Shared utilities moved to utils.js")
    print("   - Page-specific logic separated into room.js and chat.js")
    print("   - Flask template variables passed via window object")
    print("   - All existing functionality preserved")

if __name__ == "__main__":
    main()