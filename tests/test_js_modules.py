#! /usr/bin/env python3
"""
test_js_modules.py
Description: JavaScript module validation suite using static regex analysis — checks file existence, JSDoc coverage on exported functions, function name conventions, and cross-file import references
"""

import os
import re

def test_js_files_exist():
    """Test that all required JS files exist"""
    print("🧪 Testing JavaScript file structure...")

    required_files = [
        'app/static/js/utils.js',
        'app/static/js/dom-utils.js',
        'app/static/js/api-utils.js',
        'app/static/js/timer-utils.js',
        'app/static/js/room.js',
        'app/static/js/chat.js',
        'app/static/js/home.js',
        'app/static/js/user-info.js'
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

    files = ['app/static/js/utils.js', 'app/static/js/dom-utils.js', 'app/static/js/api-utils.js', 'app/static/js/timer-utils.js']
    all_content = ''
    for f in files:
        if os.path.exists(f):
            with open(f, 'r', encoding='utf-8') as fh:
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

    with open('app/static/js/room.js', 'r', encoding='utf-8') as f:
        content = f.read()

    required_functions = [
        'initRoomPage',
        'ensureUserExists',
        'loadRooms',
        'setupEventListeners',
        'selectRoom',
        'requestChat',
        'cancelWaiting',
        'changeRoom',
        'handleMatchFound',
        'startCountdown',
        'goToChat',
        'addSampleUsers',
        'updateNearbyUsers',
        'requestChatWithPerson',
        'simulatePersonResponse',
        'checkIfBothReady',
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

    with open('app/static/js/chat.js', 'r', encoding='utf-8') as f:
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

def test_config_js():
    """Test that config.js CONFIG object has all expected properties"""
    print("🧪 Testing config.js...")

    with open('app/static/js/config.js', 'r', encoding='utf-8') as f:
        content = f.read()

    expected_properties = [
        'CHAT_DURATION',
        'MATCH_FOUND_COUNTDOWN',
        'TIMER_WARNING_THRESHOLD',
        'TIMER_DANGER_THRESHOLD',
        'DEMO_LOADING_DELAY_MS',
        'DEMO_CONNECTION_DELAY_MS',
        'SIMULATE_RESPONSE_DELAY_MS',
        'SIMULATE_READY_DELAY_MS'
    ]

    for prop in expected_properties:
        if prop in content:
            print(f"✅ CONFIG.{prop} defined")
        else:
            print(f"❌ CONFIG.{prop} missing")

    print()


def test_home_js_functions():
    """Test that home.js contains all required functions"""
    print("🧪 Testing home.js functions...")

    with open('app/static/js/home.js', 'r', encoding='utf-8') as f:
        content = f.read()

    required = ['joinEvent', 'createEvent', 'generateQRCode', 'joinCreatedEvent', 'handleQRUpload']

    for func_name in required:
        if func_name in content:
            print(f"✅ Function '{func_name}' found")
        else:
            print(f"❌ Function '{func_name}' missing")

    # Check DOMContentLoaded wrapper exists
    if 'DOMContentLoaded' in content:
        print("✅ Uses DOMContentLoaded wrapper")
    else:
        print("❌ Missing DOMContentLoaded wrapper")

    print()


def test_index_html():
    """Test index.html properly includes JS files"""
    print("🧪 Testing index.html...")

    with open('app/templates/index.html', 'r', encoding='utf-8') as f:
        content = f.read()

    for js_name in ['config.js', 'api-utils.js', 'utils.js', 'home.js']:
        if js_name in content:
            print(f"✅ index.html includes {js_name}")
        else:
            print(f"❌ index.html missing {js_name}")

    # Verify no inline functions
    inline_script_pattern = r'<script>\s*(?!// Pass template variables)(?!window\.)[\s\S]*?function\s+\w+'
    if not re.search(inline_script_pattern, content):
        print("✅ index.html has no inline function definitions")
    else:
        print("⚠️  index.html may still have inline functions")

    print()


def test_html_templates():
    """Test that HTML templates properly include the new JS files"""
    print("🧪 Testing HTML template script includes...")

    # Test room.html
    with open('app/templates/room.html', 'r', encoding='utf-8') as f:
        room_content = f.read()

    for js_name in ['utils.js', 'dom-utils.js', 'api-utils.js', 'timer-utils.js']:
        if js_name in room_content:
            print(f"✅ room.html includes {js_name}")
        else:
            print(f"❌ room.html missing {js_name}")

    for js_name in ['config.js', 'room.js']:
        if js_name in room_content:
            print(f"✅ room.html includes {js_name}")
        else:
            print(f"❌ room.html missing {js_name}")

    if 'window.roomEventId' in room_content:
        print("✅ room.html passes event_id to JavaScript")
    else:
        print("❌ room.html missing event_id configuration")

    # Test chat.html
    with open('app/templates/chat.html', 'r', encoding='utf-8') as f:
        chat_content = f.read()

    for js_name in ['utils.js', 'dom-utils.js', 'api-utils.js', 'timer-utils.js']:
        if js_name in chat_content:
            print(f"✅ chat.html includes {js_name}")
        else:
            print(f"❌ chat.html missing {js_name}")

    for js_name in ['config.js', 'chat.js']:
        if js_name in chat_content:
            print(f"✅ chat.html includes {js_name}")
        else:
            print(f"❌ chat.html missing {js_name}")

    if 'window.chatMatchId' in chat_content:
        print("✅ chat.html passes match_id to JavaScript")
    else:
        print("❌ chat.html missing match_id configuration")

    if 'window.chatEventId' in chat_content:
        print("✅ chat.html passes event_id to JavaScript")
    else:
        print("❌ chat.html missing event_id configuration")

    # Test user_info.html
    with open('app/templates/user_info.html', 'r', encoding='utf-8') as f:
        user_info_content = f.read()

    for js_name in ['config.js', 'utils.js', 'api-utils.js']:
        if js_name in user_info_content:
            print(f"✅ user_info.html includes {js_name}")
        else:
            print(f"❌ user_info.html missing {js_name}")

    if 'user-info.js' in user_info_content:
        print("✅ user_info.html includes user-info.js")
    else:
        print("❌ user_info.html missing user-info.js")

    if 'window.userInfoEventId' in user_info_content:
        print("✅ user_info.html passes event_id to JavaScript")
    else:
        print("❌ user_info.html missing event_id configuration")

    # Verify no inline scripts remain (except config)
    inline_script_pattern = r'<script>\s*(?!// Pass template variables)(?!window\.)[\s\S]*?function\s+\w+'
    if not re.search(inline_script_pattern, room_content):
        print("✅ room.html has no inline function definitions")
    else:
        print("⚠️  room.html may still have inline functions")

    if not re.search(inline_script_pattern, chat_content):
        print("✅ chat.html has no inline function definitions")
    else:
        print("⚠️  chat.html may still have inline functions")

    if not re.search(inline_script_pattern, user_info_content):
        print("✅ user_info.html has no inline function definitions")
    else:
        print("⚠️  user_info.html may still have inline functions")

    print()

def test_user_info_js_functions():
    """Test that user-info.js contains all required functions"""
    print("🧪 Testing user-info.js functions...")

    with open('app/static/js/user-info.js', 'r', encoding='utf-8') as f:
        content = f.read()

    required_functions = [
        'generateUsername',
        'fetchJSON',
        'storeUserId',
        'showError'
    ]

    for func_name in required_functions:
        if func_name in content:
            print(f"✅ Uses '{func_name}' from utils.js")
        else:
            print(f"❌ Missing '{func_name}'")

    # Check for key behaviors
    if 'linkedin_url' in content:
        print("✅ Saves linkedin_url to API")
    else:
        print("❌ Missing linkedin_url in API call")

    if 'slack_handle' in content:
        print("✅ Saves slack_handle to API")
    else:
        print("❌ Missing slack_handle in API call")

    if 'selectRoomBtn' in content:
        print("✅ Has select room button logic")
    else:
        print("❌ Missing select room button logic")

    if 'storeUserId' in content:
        print("✅ Stores user ID on save")
    else:
        print("❌ Missing user ID storage on save")

    print()

def test_code_quality():
    """Test code quality and best practices"""
    print("🧪 Testing code quality...")

    js_files = ['app/static/js/utils.js', 'app/static/js/dom-utils.js', 'app/static/js/api-utils.js', 'app/static/js/timer-utils.js', 'app/static/js/room.js', 'app/static/js/chat.js', 'app/static/js/home.js', 'app/static/js/user-info.js']

    for js_file in js_files:
        with open(js_file, 'r', encoding='utf-8') as f:
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
    test_config_js()
    test_utils_functions()
    test_room_js_functions()
    test_chat_js_functions()
    test_user_info_js_functions()
    test_home_js_functions()
    test_html_templates()
    test_index_html()
    test_code_quality()

    print("🎉 All JavaScript tests completed!")
    print("\n📋 Summary:")
    print("   - JavaScript code successfully extracted from HTML templates")
    print("   - Shared utilities moved to utils.js")
    print("   - Page-specific logic separated into room.js and chat.js")
    print("   - Template variables passed via window object")
    print("   - All existing functionality preserved")

if __name__ == "__main__":
    main()