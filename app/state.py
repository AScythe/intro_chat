# state.py
# Description: Server-global in-memory state — active users, active matches, waiting queue, and conversation prompts shared across all modules
# ====
# Shared across routes, socket events, and background tasks. Do NOT import directly
# in modules that may cause circular imports — use: from state import active_users, etc.

# In-memory storage for active sessions
active_users = {}
active_matches = {}
waiting_queue = {}

# Default user template for new users
USER_TEMPLATE = {
    'event_id': None,
    'username': None,
    'room_id': None,
    'linkedin_url': '',
    'slack_handle': '',
    'is_available': False,
    'last_seen': None
}

# Re-export for backward compatibility
from .prompts import CONVERSATION_PROMPTS
