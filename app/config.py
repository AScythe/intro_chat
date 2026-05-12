# config.py
# Description: Central configuration constants for database path, server host, and port
# ====
import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DB_PATH = os.path.join(BASE_DIR, 'data', 'introchat.db')
HOST = '127.0.0.1'
PORT = 5000
