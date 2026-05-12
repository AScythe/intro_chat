# database.py
# Description: Async SQLite database initialization creating events, users, rooms, and matches tables with migration handling for social profile columns
# ====
import aiosqlite
import sqlite3
import os

async def init_db(db_path):
    async with aiosqlite.connect(db_path) as db:
        await db.execute('''
            CREATE TABLE IF NOT EXISTS events (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                is_active BOOLEAN DEFAULT 1
            )
        ''')
        await db.execute('''
            CREATE TABLE IF NOT EXISTS rooms (
                id TEXT PRIMARY KEY,
                event_id TEXT,
                name TEXT NOT NULL,
                FOREIGN KEY (event_id) REFERENCES events (id)
            )
        ''')
        await db.execute('''
            CREATE TABLE IF NOT EXISTS users (
                id TEXT PRIMARY KEY,
                event_id TEXT,
                room_id TEXT,
                username TEXT,
                linkedin_url TEXT DEFAULT '',
                slack_handle TEXT DEFAULT '',
                is_available BOOLEAN DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                last_seen TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (event_id) REFERENCES events (id),
                FOREIGN KEY (room_id) REFERENCES rooms (id)
            )
        ''')
        try:
            await db.execute('ALTER TABLE users ADD COLUMN linkedin_url TEXT DEFAULT ""')
        except sqlite3.OperationalError:
            pass
        try:
            await db.execute('ALTER TABLE users ADD COLUMN slack_handle TEXT DEFAULT ""')
        except sqlite3.OperationalError:
            pass
        await db.execute('''
            CREATE TABLE IF NOT EXISTS matches (
                id TEXT PRIMARY KEY,
                user1_id TEXT,
                user2_id TEXT,
                room_id TEXT,
                status TEXT DEFAULT 'active',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                expires_at TIMESTAMP,
                FOREIGN KEY (user1_id) REFERENCES users (id),
                FOREIGN KEY (user2_id) REFERENCES users (id),
                FOREIGN KEY (room_id) REFERENCES rooms (id)
            )
        ''')
        await db.commit()
