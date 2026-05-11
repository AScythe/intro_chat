# state.py
# Description: Server-global in-memory state — active users, active matches, waiting queue, conversation prompts, and timer configuration constants shared across all modules
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

# Conversation prompts
CONVERSATION_PROMPTS = [
    "What's one thing you're excited about this weekend?",
    "What's your favorite snack at hackathons?",
    "If you could steal one skill from another hacker, what would it be?",
    "What's your favorite debugging story?",
    "What's the most interesting project you've worked on recently?",
    "If you could learn any programming language instantly, what would it be?",
    "What's your go-to coffee order during long coding sessions?",
    "What's the weirdest bug you've ever encountered?",
    "If you could build any app, what would it be?",
    "What's your favorite way to unwind after a long day of coding?"
]

# Backend timer configuration constants
# These replace hardcoded values in the original app.py.
MATCH_EXPIRY_MINUTES = 2           # How long a match is valid in DB (informational)
CLEANUP_INTERVAL_SECONDS = 60      # How often to check for expired matches
CLEANUP_THRESHOLD_SECONDS = 300    # Remove matches older than this (5 minutes)
