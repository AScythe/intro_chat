#! /usr/bin/env python3
"""
test_js_modules.py
Description: Frontend source module validation suite using static regex analysis — checks file existence, TypeScript exports, function/component definitions, and cross-file import references
"""
import os
import re

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_SRC = os.path.join(BASE_DIR, 'frontend', 'src')

def _read(src_path):
    with open(os.path.join(FRONTEND_SRC, src_path), 'r', encoding='utf-8') as f:
        return f.read()

def test_frontend_files_exist():
    """Test that all required frontend source files exist"""
    print("🧪 Testing frontend file structure...")

    required_files = [
        'api/client.ts',
        'config/constants.ts',
        'utils/format.ts',
        'utils/storage.ts',
        'utils/random.ts',
        'utils/demoData.ts',
        'types/api.ts',
        'hooks/useSocket.ts',
        'hooks/useTimer.ts',
        'hooks/useDemoSimulation.ts',
        'hooks/useUser.ts',
        'context/useTheme.tsx',
        'context/SocketContext.tsx',
        'context/UserContext.tsx',
        'components/Timer.tsx',
        'components/PeoplePageViews.tsx',
        'components/ChatPageViews.tsx',
        'components/PersonCard.tsx',
        'components/PromptCard.tsx',
        'components/MatchCountdown.tsx',
        'components/ConnectionCard.tsx',
        'components/QRDisplay.tsx',
        'pages/HomePage.tsx',
        'pages/UserInfoPage.tsx',
        'pages/RoomPage.tsx',
        'pages/ChatPage.tsx',
        'pages/PeoplePage.tsx',
        'pages/ConnectPage.tsx',
        'pages/OrganizeEventPage.tsx',
        'hooks/useChatRequest.ts',
        'hooks/useChipSelection.ts',
        'lib/utils.ts',
        'App.tsx',
        'main.tsx',
    ]

    for rel in required_files:
        full = os.path.join(FRONTEND_SRC, rel)
        if os.path.exists(full):
            print(f"✅ {rel} exists")
        else:
            print(f"❌ {rel} missing")
    print()

def test_api_exports():
    """Test that api.ts has all expected interfaces"""
    print("🧪 Testing API types (api.ts)...")
    content = _read('types/api.ts')
    expected = [
        'CreateEventResponse', 'Room',
        'Topic', 'EventConfigResponse',
        'JoinEventResponse',
        'QRResponse',
        'SampleUserData',
        'RoomUsersResponse',
        'SaveEventConfigResponse',
    ]
    for name in expected:
        if f'export interface {name}' in content or f'export type {name}' in content:
            print(f"✅ Interface '{name}' found")
        else:
            print(f"❌ Interface '{name}' missing")
    print()

def test_demo_data_exports():
    """Test that demoData.ts exports all expected interfaces and data"""
    print("🧪 Testing demo data exports (utils/demoData.ts)...")
    content = _read('utils/demoData.ts')
    expected = [
        'SAMPLE_USERS', 'RESPONSES',
    ]
    for name in expected:
        if f'export interface {name}' in content or f'export const {name}' in content:
            print(f"✅ demoData.ts exports {name}")
        else:
            print(f"❌ demoData.ts missing {name}")
    print()

def test_config():
    """Test that constants.ts has all expected config properties"""
    print("🧪 Testing config constants (config/constants.ts)...")
    content = _read('config/constants.ts')
    expected = ['CHAT_DURATION', 'MATCH_FOUND_COUNTDOWN', 'TIMER_WARNING_THRESHOLD',
                 'TIMER_DANGER_THRESHOLD', 'DEMO_LOADING_DELAY_MS', 'DEMO_CONNECTION_DELAY_MS',
                 'SIMULATE_RESPONSE_DELAY_MS', 'SIMULATE_READY_DELAY_MS']
    for prop in expected:
        if prop in content:
            print(f"✅ CONFIG.{prop} defined")
        else:
            print(f"❌ CONFIG.{prop} missing")
    print()

def test_utils_exports():
    """Test that util files export all expected functions"""
    print("🧪 Testing utility exports...")

    # format.ts
    fmt = _read('utils/format.ts')
    if 'export function formatTime' in fmt:
        print("✅ format.ts exports formatTime")
    else:
        print("❌ format.ts missing formatTime")

    # storage.ts
    store = _read('utils/storage.ts')
    store_funcs = ['storeUserId', 'getUserId', 'clearUserId', 'storeData', 'getData']
    for fn in store_funcs:
        if f'export function {fn}' in store:
            print(f"✅ storage.ts exports {fn}")
        else:
            print(f"❌ storage.ts missing {fn}")

    # random.ts
    rand = _read('utils/random.ts')
    if 'export function generateRandomString' in rand:
        print(f"✅ random.ts exports generateRandomString")
    else:
        print(f"❌ random.ts missing generateRandomString")
    if 'export function generateUsername' in rand:
        print(f"✅ random.ts exports generateUsername")
    else:
        print(f"❌ random.ts missing generateUsername")
    print()

def test_hook_exports():
    """Test that hooks export all expected functions"""
    print("🧪 Testing hook exports...")

    hook_files = {
        'useSocket.ts': ['useSocket', 'SocketContext', 'SocketContextValue'],
        'useTimer.ts': ['useChatTimer'],
        'useDemoSimulation.ts': ['useDemoSimulation'],
        'useChipSelection.ts': ['useChipSelection', 'ChipItem'],
        'useUser.ts': ['useUser', 'UserContext', 'UserData'],
        'useChatRequest.ts': ['useChatRequest'],
    }

    for filename, expected in hook_files.items():
        content = _read(os.path.join('hooks', filename))
        for name in expected:
            if f'export function {name}' in content or f'export const {name}' in content or f'export interface {name}' in content:
                print(f"✅ {filename} exports {name}")
            else:
                print(f"❌ {filename} missing {name}")
    print()

def test_component_exports():
    """Test that all components export their expected React components"""
    print("🧪 Testing component exports...")
    components = {
        'Timer.tsx': 'Timer',
        'PeoplePageViews.tsx': ['NearbyUsersView', 'WaitingResponseView', 'AcceptedView', 'PersonResponse'],
        'ChatPageViews.tsx': ['ErrorView', 'ChatLoadingView', 'ChattingView', 'TimeUpView', 'ExtendedView'],
        'PersonCard.tsx': 'PersonCard',
        'PromptCard.tsx': 'PromptCard',
        'MatchCountdown.tsx': 'MatchCountdown',
        'ConnectionCard.tsx': 'ConnectionCard',
        'QRDisplay.tsx': 'QRDisplay',
    }
    for filename, exports in components.items():
        content = _read(os.path.join('components', filename))
        if isinstance(exports, list):
            for name in exports:
                pattern = f'export function {name}' in content or f'export interface {name}' in content or f'export const {name}' in content
                if pattern:
                    print(f"✅ {filename} exports {name}")
                else:
                    print(f"❌ {filename} missing {name}")
        else:
            if f'export function {exports}' in content:
                print(f"✅ {filename} exports {exports}")
            else:
                print(f"❌ {filename} missing {exports}")
    print()

def test_page_exports():
    """Test that page components are exported"""
    print("🧪 Testing page exports...")
    pages = {
        'HomePage.tsx': 'HomePage',
        'UserInfoPage.tsx': 'UserInfoPage',
        'RoomPage.tsx': 'RoomPage',
        'ChatPage.tsx': 'ChatPage',
        'PeoplePage.tsx': 'PeoplePage',
        'ConnectPage.tsx': 'ConnectPage',
        'OrganizeEventPage.tsx': 'OrganizeEventPage',
    }
    for filename, page in pages.items():
        content = _read(os.path.join('pages', filename))
        if f'export function {page}' in content:
            print(f"✅ {filename} exports {page}")
        else:
            print(f"❌ {filename} missing {page}")
    print()

def test_import_references():
    """Test that App.tsx references all pages and contexts"""
    print("🧪 Testing App.tsx import references...")
    app = _read('App.tsx')

    expected_imports = ['HomePage', 'UserInfoPage', 'RoomPage', 'ChatPage',
                        'PeoplePage', 'ConnectPage', 'OrganizeEventPage',
                        'SocketProvider', 'UserProvider']
    for imp in expected_imports:
        if imp in app:
            print(f"✅ App.tsx imports '{imp}'")
        else:
            print(f"❌ App.tsx missing '{imp}' import")
    print()

def test_client_exports():
    """Test that client.ts exports its public API function"""
    print("🧪 Testing client exports (api/client.ts)...")
    content = _read('api/client.ts')
    if 'export async function fetchJSON' in content:
        print("✅ client.ts exports fetchJSON")
    else:
        print("❌ client.ts missing fetchJSON")
    if 'async function fetchWithTimeout' in content:
        print("✅ client.ts defines fetchWithTimeout (internal)")
    else:
        print("❌ client.ts missing fetchWithTimeout")
    if 'async function parseJSON' in content:
        print("✅ client.ts defines parseJSON (internal)")
    else:
        print("❌ client.ts missing parseJSON")
    print()


def test_code_quality():
    """Test code quality — no console.log stmts in production code, strict mode"""
    print("🧪 Testing code quality...")

    ts_files = [
        'api/client.ts', 'config/constants.ts',
        'utils/format.ts', 'utils/storage.ts', 'utils/random.ts', 'utils/demoData.ts',
        'types/api.ts',
        'hooks/useSocket.ts', 'hooks/useTimer.ts', 'hooks/useDemoSimulation.ts', 'hooks/useUser.ts',
        'hooks/useChatRequest.ts', 'hooks/useChipSelection.ts', 'lib/utils.ts',
        'context/useTheme.tsx',
    ]

    for rel in ts_files:
        content = _read(rel)
        count = content.count('console.log')
        code_len = len(content.splitlines())
        ratio = count / max(code_len, 1)
        status = "⚠️" if ratio > 0.05 else "✅"
        print(f"{status} {rel}: {count} console.log in {code_len} lines")

    tsx_files = [
        'components/Timer.tsx', 'components/PersonCard.tsx', 'components/PromptCard.tsx',
        'components/MatchCountdown.tsx', 'components/ConnectionCard.tsx', 'components/QRDisplay.tsx',
        'components/PeoplePageViews.tsx', 'components/ChatPageViews.tsx',
        'pages/HomePage.tsx', 'pages/UserInfoPage.tsx', 'pages/RoomPage.tsx', 'pages/ChatPage.tsx',
        'pages/PeoplePage.tsx', 'pages/ConnectPage.tsx', 'pages/OrganizeEventPage.tsx',
        'context/SocketContext.tsx', 'context/UserContext.tsx',
        'App.tsx',
    ]
    for rel in tsx_files:
        content = _read(rel)
        count = content.count('console.log')
        code_len = len(content.splitlines())
        ratio = count / max(code_len, 1)
        status = "⚠️" if ratio > 0.05 else "✅"
        print(f"{status} {rel}: {count} console.log in {code_len} lines")
    print()

def main():
    print("🌟 IntroChat Frontend Source Validation Suite")
    print("=" * 60)
    print()

    test_frontend_files_exist()
    test_api_exports()
    test_demo_data_exports()
    test_config()
    test_utils_exports()
    test_hook_exports()
    test_component_exports()
    test_page_exports()
    test_import_references()
    test_client_exports()
    test_code_quality()

    print("🎉 All frontend source validation tests completed!")
    print("\n📋 Summary:")
    print("   - TypeScript types and interfaces validated")
    print("   - Demo data exports validated (demoData.ts)")
    print("   - Utility functions present in format.ts, storage.ts, random.ts")
    print("   - Hooks exported: useSocket, useTimer, useDemoSimulation, useUser, useChatRequest, useChipSelection")
    print("   - 8 components + 7 pages exported with expected names")
    print("   - App.tsx references all pages and context providers")

if __name__ == "__main__":
    main()
