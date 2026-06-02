# state.py
# Description: Server-global in-memory state — active users, active matches, waiting queue, and conversation prompts shared across all modules
# ====

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

class StateStore:
    def __init__(self) -> None:
        self.active_users: dict[str, UserData] = {}
        self.active_matches: dict[str, MatchData] = {}
        self.waiting_queue: dict[str, QueueEntry] = {}
        self.connection_statuses: dict[str, dict[str, bool]] = {}
        self._lock = threading.Lock()

    @property
    def lock(self) -> threading.Lock:
        return self._lock

    # [ARCH] Mutator / accessor methods — encapsulate dict mutations under lock

    def add_user(self, user_id: str, data: UserData) -> None:
        with self._lock:
            self.active_users[user_id] = data

    def get_user(self, user_id: str) -> UserData | None:
        with self._lock:
            return self.active_users.get(user_id)

    def update_user(self, user_id: str, **fields) -> None:
        with self._lock:
            user = self.active_users.get(user_id)
            if user is not None:
                user.update(fields)

    def remove_user(self, user_id: str) -> None:
        with self._lock:
            self.active_users.pop(user_id, None)

    def add_match(self, match_id: str, data: MatchData) -> None:
        with self._lock:
            self.active_matches[match_id] = data

    def get_match(self, match_id: str) -> MatchData | None:
        with self._lock:
            return self.active_matches.get(match_id)

    def remove_match(self, match_id: str) -> None:
        with self._lock:
            self.active_matches.pop(match_id, None)

    def add_to_waiting_queue(self, user_id: str, entry: QueueEntry) -> None:
        with self._lock:
            self.waiting_queue[user_id] = entry

    def remove_from_waiting_queue(self, user_id: str) -> None:
        with self._lock:
            self.waiting_queue.pop(user_id, None)

    def init_connection_status(self, match_id: str) -> None:
        with self._lock:
            self.connection_statuses.setdefault(match_id, {})

    def set_connection_vote(self, match_id: str, user_id: str, wants: bool) -> None:
        with self._lock:
            self.connection_statuses.setdefault(match_id, {})[user_id] = wants

    def connection_vote_count(self, match_id: str) -> int:
        with self._lock:
            return len(self.connection_statuses.get(match_id, {}))

    def connection_all_voted_yes(self, match_id: str) -> bool:
        with self._lock:
            votes = self.connection_statuses.get(match_id, {})
            return len(votes) == 2 and all(votes.values())


store = StateStore()
