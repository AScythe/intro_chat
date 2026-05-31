# state.py
# Description: Server-global in-memory state — active users, active matches, waiting queue, and conversation prompts shared across all modules
# ====
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

# Shared across routes, socket events, and background tasks. Do NOT import directly
# in modules that may cause circular imports — use: from state import active_users, etc.
import threading
from typing import TypedDict

class UserData(TypedDict):
    event_id: str
    username: str
    room_id: str | None
    linkedin_url: str
    slack_handle: str
    is_available: bool
    last_seen: str | None

class MatchData(TypedDict):
    user1_id: str
    user2_id: str
    room_id: str
    created_at: float

class QueueEntry(TypedDict):
    room_id: str
    timestamp: float

# In-memory storage for active sessions
active_users: dict[str, UserData] = {}
active_matches: dict[str, MatchData] = {}
active_matches_lock = threading.Lock()
waiting_queue: dict[str, QueueEntry] = {}

# Track connection exchange status per match: {match_id: {user_id: wants_to_connect}}
connection_statuses: dict[str, dict[str, bool]] = {}

# Default user template for new users
USER_TEMPLATE: UserData = {
    'event_id': '',
    'username': '',
    'room_id': None,
    'linkedin_url': '',
    'slack_handle': '',
    'is_available': False,
    'last_seen': None
}

# Re-export for backward compatibility
from .prompts import CONVERSATION_PROMPTS
