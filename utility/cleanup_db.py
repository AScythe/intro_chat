# Description: Database maintenance script — cascade-deduplicates duplicate-named events, deduplicates rows, removes User_* test users, purges orphaned events, and optionally keeps only one event per database.
# Run: uv run python utility/cleanup_db.py
# Run with keep-event: uv run python utility/cleanup_db.py --keep-event 53aba7a9

import sqlite3

DBS = ["data/introchat.db", "data/e2e_test.db"]


def _cascade_delete_event_ids(cur, eids):
    """Delete all records cascade-style for the given event IDs."""
    if not eids:
        return
    ph = ','.join('?' for _ in eids)
    room_ids = [r[0] for r in cur.execute(f"SELECT id FROM rooms WHERE event_id IN ({ph})", eids).fetchall()]
    if room_ids:
        rp = ','.join('?' for _ in room_ids)
        cur.execute(f"DELETE FROM users WHERE is_sample = 1 AND room_id IN ({rp})", room_ids)
    cur.execute(f"DELETE FROM user_interests WHERE event_id IN ({ph})", eids)
    cur.execute(f"DELETE FROM matches WHERE user1_id IN (SELECT id FROM users WHERE event_id IN ({ph})) OR user2_id IN (SELECT id FROM users WHERE event_id IN ({ph}))", eids + eids)
    cur.execute(f"DELETE FROM users WHERE event_id IN ({ph})", eids)
    cur.execute(f"DELETE FROM rooms WHERE event_id IN ({ph})", eids)
    cur.execute(f"DELETE FROM event_topics WHERE event_id IN ({ph})", eids)
    cur.execute(f"DELETE FROM events WHERE id IN ({ph})", eids)


def dedup_events(cur):
    rows = cur.execute("""
        SELECT name, id, COALESCE(created_at, '1970-01-01') as created_at
        FROM events
        ORDER BY name, created_at ASC
    """).fetchall()
    groups: dict[str, list[tuple[str, str]]] = {}
    for name, eid, ts in rows:
        groups.setdefault(name, []).append((eid, ts))

    total_removed = 0
    for name, entries in groups.items():
        if len(entries) <= 1:
            continue
        keep = entries[0][0]
        print(f"  Events \"{name}\": keeping {keep} (earliest), removing {len(entries)-1} duplicate(s)")
        for eid, _ in entries[1:]:
            _cascade_delete_event_ids(cur, [eid])
            total_removed += 1
    if total_removed:
        print(f"  Removed {total_removed} duplicate event(s) via cascade delete")
    else:
        print("  No duplicate events found")


def dedup_rooms(cur):
    for name, ids in cur.execute("SELECT name, GROUP_CONCAT(id) FROM rooms GROUP BY name HAVING COUNT(id) > 1").fetchall():
        parts = ids.split(",")
        keep = parts[0]
        for rid in parts[1:]:
            cur.execute("UPDATE users SET room_id=? WHERE room_id=?", (keep, rid))
            cur.execute("UPDATE matches SET room_id=? WHERE room_id=?", (keep, rid))
        cur.execute(f"DELETE FROM rooms WHERE id IN ({','.join('?' for _ in parts[1:])})", parts[1:])


def dedup_users(cur):
    for username, ids in cur.execute("SELECT username, GROUP_CONCAT(id) FROM users GROUP BY username HAVING COUNT(id) > 1").fetchall():
        parts = ids.split(",")
        keep = parts[0]
        for uid in parts[1:]:
            cur.execute("UPDATE matches SET user1_id=? WHERE user1_id=?", (keep, uid))
            cur.execute("UPDATE matches SET user2_id=? WHERE user2_id=?", (keep, uid))
        cur.execute(f"DELETE FROM users WHERE id IN ({','.join('?' for _ in parts[1:])})", parts[1:])


def remove_user_prefix(cur):
    ids = [r[0] for r in cur.execute("SELECT id FROM users WHERE username LIKE 'User_%'").fetchall()]
    if not ids:
        return
    fallback = cur.execute("SELECT id FROM users WHERE username NOT LIKE 'User_%' LIMIT 1").fetchone()
    if fallback:
        fb_id = fallback[0]
        for uid in ids:
            cur.execute("UPDATE matches SET user1_id=? WHERE user1_id=?", (fb_id, uid))
            cur.execute("UPDATE matches SET user2_id=? WHERE user2_id=?", (fb_id, uid))
    cur.execute(f"DELETE FROM users WHERE id IN ({','.join('?' for _ in ids)})", ids)


def dedup_matches(cur):
    for u1, u2, ids in cur.execute("SELECT user1_id, user2_id, GROUP_CONCAT(id) FROM matches GROUP BY user1_id, user2_id HAVING COUNT(id) > 1").fetchall():
        parts = ids.split(",")
        keep = parts[0]
        cur.execute(f"DELETE FROM matches WHERE id IN ({','.join('?' for _ in parts[1:])})", parts[1:])
    cur.execute("DELETE FROM matches WHERE user1_id NOT IN (SELECT id FROM users) OR user2_id NOT IN (SELECT id FROM users)")


def keep_only_event(cur, keep_id: str):
    orphan_ids = [
        r[0] for r in cur.execute("SELECT id FROM events WHERE id != ?", (keep_id,)).fetchall()
    ]
    if not orphan_ids:
        print(f"  Only one event ({keep_id}) — nothing to remove.")
        return
    _cascade_delete_event_ids(cur, orphan_ids)
    # Second pass: purge records left orphaned from previous runs (event_id no longer in events)
    cur.execute("DELETE FROM event_topics WHERE event_id NOT IN (SELECT id FROM events)")
    cur.execute("DELETE FROM user_interests WHERE event_id NOT IN (SELECT id FROM events)")
    cur.execute("DELETE FROM users WHERE is_sample = 1 AND room_id NOT IN (SELECT id FROM rooms)")
    cur.execute("DELETE FROM users WHERE event_id NOT IN (SELECT id FROM events)")
    cur.execute("DELETE FROM rooms WHERE event_id NOT IN (SELECT id FROM events)")
    cur.execute("DELETE FROM matches WHERE user1_id NOT IN (SELECT id FROM users) OR user2_id NOT IN (SELECT id FROM users)")
    print(f"  Kept event {keep_id}, removed {len(orphan_ids)} other event(s).")


def delete_events(cur, event_ids: list[str]):
    existing = [
        r[0] for r in cur.execute(
            f"SELECT id FROM events WHERE id IN ({','.join('?' for _ in event_ids)})", event_ids
        ).fetchall()
    ]
    not_found = [eid for eid in event_ids if eid not in existing]
    for eid in not_found:
        print(f"  Event {eid} not found — skipping.")
    if not existing:
        print("  No matching events found.")
        return
    _cascade_delete_event_ids(cur, existing)
    print(f"  Deleted {len(existing)} event(s): {existing}")


def remove_orphaned_events(cur):
    orphan_ids = [
        r[0] for r in cur.execute("""
            SELECT e.id FROM events e
            WHERE NOT EXISTS (SELECT 1 FROM rooms r WHERE r.event_id = e.id AND r.selected = 1)
              AND NOT EXISTS (SELECT 1 FROM event_topics t WHERE t.event_id = e.id AND t.selected = 1)
        """).fetchall()
    ]
    if not orphan_ids:
        print("  No orphaned events found.")
        return
    _cascade_delete_event_ids(cur, orphan_ids)
    print(f"  Removed {len(orphan_ids)} orphaned event(s): {orphan_ids}")


def process(db_path, keep_event_id=None, delete_event_ids=None):
    conn = sqlite3.connect(db_path)
    conn.execute("PRAGMA foreign_keys = OFF")
    cur = conn.cursor()

    tables = [r[0] for r in cur.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()]
    print(f"\n=== {db_path} ===")

    if delete_event_ids:
        delete_events(cur, delete_event_ids)

    if keep_event_id and cur.execute("SELECT 1 FROM events WHERE id = ?", (keep_event_id,)).fetchone():
        keep_only_event(cur, keep_event_id)
    else:
        if keep_event_id:
            print(f"  Event {keep_event_id} not found in this DB — running standard cleanup.")
        if "events" in tables:
            dedup_events(cur)
        if "rooms" in tables:
            dedup_rooms(cur)
        if "users" in tables:
            remove_user_prefix(cur)
            dedup_users(cur)
        if "matches" in tables:
            dedup_matches(cur)
        if "events" in tables and "rooms" in tables and "event_topics" in tables:
            remove_orphaned_events(cur)

    # Final pass: purge any records orphaned by prior steps
    for t in tables:
        if t == "event_topics":
            cur.execute("DELETE FROM event_topics WHERE event_id NOT IN (SELECT id FROM events)")
        elif t == "user_interests":
            cur.execute("DELETE FROM user_interests WHERE event_id NOT IN (SELECT id FROM events)")
        elif t == "users":
            cur.execute("DELETE FROM users WHERE event_id NOT IN (SELECT id FROM events)")
        elif t == "rooms":
            cur.execute("DELETE FROM rooms WHERE event_id NOT IN (SELECT id FROM events)")
        elif t == "matches":
            cur.execute("DELETE FROM matches WHERE user1_id NOT IN (SELECT id FROM users) OR user2_id NOT IN (SELECT id FROM users)")

    conn.commit()

    print("  Final counts:")
    for t in tables:
        cnt = cur.execute(f"SELECT COUNT(*) FROM {t}").fetchone()[0]
        print(f"    {t}: {cnt}")
        if t == "users":
            users = [r[0] for r in cur.execute("SELECT username FROM users ORDER BY username").fetchall()]
            print(f"    usernames: {users}")

    conn.close()


if __name__ == "__main__":
    import sys
    keep_event = None
    delete_event_ids = None
    args = sys.argv[1:]
    for i, a in enumerate(args):
        if a == "--keep-event" and i + 1 < len(args):
            keep_event = args[i + 1]
    if "--delete-events" in args:
        idx = args.index("--delete-events")
        ids = []
        for a in args[idx + 1:]:
            if a.startswith("--"):
                break
            ids.append(a)
        if ids:
            delete_event_ids = ids
    for db_path in DBS:
        process(db_path, keep_event_id=keep_event, delete_event_ids=delete_event_ids)
    print("\nDone.")
