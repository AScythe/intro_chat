# config.py
# Description: Central configuration constants for database path, server host, port, and timer intervals
# ====
import logging

logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[logging.StreamHandler()]
)
logger = logging.getLogger(__name__)

import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIST_DIR = os.path.join(BASE_DIR, 'frontend', 'dist')
DB_PATH = os.environ.get('DB_PATH') or os.path.join(BASE_DIR, 'data', 'introchat.db')
HOST = '127.0.0.1'
PORT = 5000

# Backend timer configuration constants
MATCH_EXPIRY_SECONDS = 30          # How long a match is valid in DB (informational)
CLEANUP_INTERVAL_SECONDS = 60      # How often to check for expired matches
CLEANUP_THRESHOLD_SECONDS = 300    # Remove matches older than this (5 minutes)

# Default room names for new events
DEFAULT_ROOMS = ['Main Hall', 'Table 1', 'Table 2', 'Table 3', 'Table 4', 'Table 5', 'Quiet Corner', 'Coffee Area']
