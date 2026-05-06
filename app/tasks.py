# tasks.py
# Background tasks for IntroChat
# ===============================================================
# Contains the cleanup thread that removes expired matches.

from .state import active_matches, CLEANUP_INTERVAL_SECONDS, CLEANUP_THRESHOLD_SECONDS
import time
import threading

def cleanup_expired_matches():
    """Background thread to clean up expired matches."""
    while True:
        time.sleep(CLEANUP_INTERVAL_SECONDS)
        current_time = time.time()
        expired_matches = []

        for match_id, match in active_matches.items():
            if current_time - match['created_at'] > CLEANUP_THRESHOLD_SECONDS:
                expired_matches.append(match_id)

        for match_id in expired_matches:
            del active_matches[match_id]

def start_cleanup_thread():
    """Start the cleanup thread as a daemon."""
    cleanup_thread = threading.Thread(target=cleanup_expired_matches, daemon=True)
    cleanup_thread.start()
    return cleanup_thread
