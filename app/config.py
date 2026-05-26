# config.py
# Description: Central configuration constants for database path, server host, port, and timer intervals
# ====
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.environ.get('DB_PATH') or os.path.join(BASE_DIR, 'data', 'introchat.db')
HOST = '127.0.0.1'
PORT = 5000

# Backend timer configuration constants
MATCH_EXPIRY_SECONDS = 30          # How long a match is valid in DB (informational)
CLEANUP_INTERVAL_SECONDS = 60      # How often to check for expired matches
CLEANUP_THRESHOLD_SECONDS = 300    # Remove matches older than this (5 minutes)
