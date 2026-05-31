# helpers.py
# Description: Shared utility functions — short ID generation, default room insertion, and other small helpers used across modules
# ====
import uuid

from .config import DEFAULT_ROOMS


def short_id() -> str:
    """Generate an 8-character hex ID from a random UUID."""
    return str(uuid.uuid4())[:8]


async def insert_default_rooms(db, event_id: str) -> None:
    """Insert default rooms for a given event if none exist."""
    for room_name in DEFAULT_ROOMS:
        room_id = short_id()
        await db.execute('INSERT INTO rooms (id, event_id, name) VALUES (?, ?, ?)',
                         (room_id, event_id, room_name))
