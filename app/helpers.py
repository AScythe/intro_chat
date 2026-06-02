# helpers.py [CLEANUP]
# Description: Shared utility functions — short ID generation, default room/topic insertion, and other small helpers used across modules
# ====
import uuid
import aiosqlite

from .config import DEFAULT_ROOMS, DEFAULT_TOPICS


def short_id() -> str:
    """Generate an 8-character hex ID from a random UUID."""
    return str(uuid.uuid4())[:8]


async def insert_default_rooms(db: aiosqlite.Connection, event_id: str) -> None:
    """Insert default rooms for a given event if none exist."""
    for room_name in DEFAULT_ROOMS:
        room_id = short_id()
        await db.execute('INSERT INTO rooms (id, event_id, name, selected) VALUES (?, ?, ?, 1)',
                         (room_id, event_id, room_name))


async def insert_default_topics(db: aiosqlite.Connection, event_id: str) -> None:
    """Insert default topics for a given event."""
    for topic_name in DEFAULT_TOPICS:
        topic_id = short_id()
        await db.execute('INSERT INTO event_topics (id, event_id, name, selected) VALUES (?, ?, ?, 1)',
                         (topic_id, event_id, topic_name))


async def get_rooms_for_event(db: aiosqlite.Connection, event_id: str) -> list[dict[str, str]]:
    """Fetch all rooms for an event as {id, name} dicts."""
    cursor = await db.execute('SELECT id, name FROM rooms WHERE LOWER(event_id) = LOWER(?) AND selected = 1', (event_id,))
    rows = await cursor.fetchall()
    return [{'id': row[0], 'name': row[1]} for row in rows]
