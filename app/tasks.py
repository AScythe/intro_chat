# tasks.py
# Description: Daemon background thread that periodically checks for and removes expired matches from in-memory state to prevent stale data accumulation
# ====

from .state import store
from .config import CLEANUP_INTERVAL_SECONDS, CLEANUP_THRESHOLD_SECONDS
import time
import threading

def find_expired_matches(
    active_matches: dict,
    current_time: float,
    threshold: float,
) -> list[str]:
    """[ARCH] Pure function — identify expired match IDs without side effects."""
    return [
        mid for mid, match in active_matches.items()
        if current_time - match['created_at'] > threshold
    ]


def cleanup_expired_matches() -> None:
    """Background thread to clean up expired matches."""
    while True:
        time.sleep(CLEANUP_INTERVAL_SECONDS)
        current_time = time.time()

        with store.lock:
            expired_matches = find_expired_matches(
                store.active_matches, current_time, CLEANUP_THRESHOLD_SECONDS
            )
            for match_id in expired_matches:
                store.remove_match(match_id)

def start_cleanup_thread() -> threading.Thread:
    """Start the cleanup thread as a daemon."""
    cleanup_thread = threading.Thread(target=cleanup_expired_matches, daemon=True)
    cleanup_thread.start()
    return cleanup_thread
