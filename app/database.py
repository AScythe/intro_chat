# database.py
# Description: Async SQLite database initialization creating events, users, rooms, and matches tables with migration handling for social profile columns
# ====

import aiosqlite
import sqlite3
import os

from .config import DEFAULT_ROOMS, DEFAULT_TOPICS

async def init_db(db_path: str) -> None:
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
        cursor = await db.execute("PRAGMA table_info(users)")
        user_cols = {row[1] for row in await cursor.fetchall()}
        if 'linkedin_url' not in user_cols:
            await db.execute('ALTER TABLE users ADD COLUMN linkedin_url TEXT DEFAULT ""')
        if 'slack_handle' not in user_cols:
            await db.execute('ALTER TABLE users ADD COLUMN slack_handle TEXT DEFAULT ""')
        if 'is_sample' not in user_cols:
            await db.execute('ALTER TABLE users ADD COLUMN is_sample INTEGER DEFAULT 0')
        if 'status' not in user_cols:
            await db.execute('ALTER TABLE users ADD COLUMN status TEXT DEFAULT ""')
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
        await db.execute('''
            CREATE TABLE IF NOT EXISTS event_topics (
                id TEXT PRIMARY KEY,
                event_id TEXT,
                name TEXT NOT NULL,
                FOREIGN KEY (event_id) REFERENCES events (id)
            )
        ''')
        await db.execute('''
            CREATE TABLE IF NOT EXISTS user_interests (
                user_id TEXT,
                event_id TEXT,
                interest TEXT NOT NULL,
                PRIMARY KEY (user_id, interest),
                FOREIGN KEY (user_id) REFERENCES users (id),
                FOREIGN KEY (event_id) REFERENCES events (id)
            )
        ''')
        cursor = await db.execute("PRAGMA table_info(rooms)")
        room_cols = {row[1] for row in await cursor.fetchall()}
        if 'selected' not in room_cols:
            await db.execute('ALTER TABLE rooms ADD COLUMN selected INTEGER DEFAULT 1')
            await db.execute('UPDATE rooms SET selected = 0')
            placeholders = ','.join('?' for _ in DEFAULT_ROOMS)
            await db.execute(f'UPDATE rooms SET selected = 1 WHERE name IN ({placeholders})', DEFAULT_ROOMS)
        cursor = await db.execute("PRAGMA table_info(event_topics)")
        topic_cols = {row[1] for row in await cursor.fetchall()}
        if 'selected' not in topic_cols:
            await db.execute('ALTER TABLE event_topics ADD COLUMN selected INTEGER DEFAULT 1')
            await db.execute('UPDATE event_topics SET selected = 0')
            placeholders = ','.join('?' for _ in DEFAULT_TOPICS)
            await db.execute(f'UPDATE event_topics SET selected = 1 WHERE name IN ({placeholders})', DEFAULT_TOPICS)
        await db.execute('CREATE UNIQUE INDEX IF NOT EXISTS idx_events_name ON events(name)')
        await db.execute('DROP TABLE IF EXISTS room_sample_users')
        await db.commit()
