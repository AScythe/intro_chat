# app/__init__.py
# Main application entry point for IntroChat
# ================================================================
# This file initializes Flask and SocketIO, then wires up all modular components.
# All business logic has been moved to separate modules in the app package:
# - state.py:      Shared in-memory state and constants
# - database.py:   Database schema initialization
# - routes.py:     All HTTP route handlers
# - matchmaking.py: Match finding and creation logic
# - socket_events.py: SocketIO event handlers
# - tasks.py:     Background cleanup thread

from flask import Flask, render_template, request, jsonify, send_file
from flask_socketio import SocketIO, emit, join_room, leave_room
import sqlite3
import uuid
import time
import threading
import qrcode
import io
import base64
from datetime import datetime, timedelta
import json

app = Flask(__name__)
app.config['SECRET_KEY'] = 'introchat_secret_key_2024'
socketio = SocketIO(app, cors_allowed_origins="*")

# Initialize database with absolute path
import os
db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'introchat.db')
# Override the path in database.py by passing it as argument
from .database import init_db
init_db(db_path)

# Register HTTP routes
from .routes import register_routes
register_routes(app)
print(f"Registered routes: {[rule.rule for rule in app.url_map.iter_rules()]}" )

# Register SocketIO event handlers
from .socket_events import register_handlers
register_handlers(socketio)

# Start background cleanup thread
from .tasks import start_cleanup_thread
start_cleanup_thread()

if __name__ == '__main__':
    socketio.run(app, debug=True, host='0.0.0.0', port=5000)
