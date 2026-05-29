# Description: Database maintenance script — deduplicates rows and removes User_* test users.
# Run: uv run python utility/cleanup_db.py

import sqlite3

DBS = ["data/introchat.db", "data/e2e_test.db"]


def dedup_events(cur):
    for name, ids in cur.execute("SELECT name, GROUP_CONCAT(id) FROM events GROUP BY name HAVING COUNT(id) > 1").fetchall():
        parts = ids.split(",")
        keep = parts[0]
        for eid in parts[1:]:
            cur.execute("UPDATE rooms SET event_id=? WHERE event_id=?", (keep, eid))
        cur.execute(f"DELETE FROM events WHERE id IN ({','.join('?' for _ in parts[1:])})", parts[1:])


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


def process(db_path):
    conn = sqlite3.connect(db_path)
    conn.execute("PRAGMA foreign_keys = OFF")
    cur = conn.cursor()

    tables = [r[0] for r in cur.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()]
    print(f"\n=== {db_path} ===")

    if "events" in tables:
        dedup_events(cur)
    if "rooms" in tables:
        dedup_rooms(cur)
    if "users" in tables:
        remove_user_prefix(cur)
        dedup_users(cur)
    if "matches" in tables:
        dedup_matches(cur)

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
    for db_path in DBS:
        process(db_path)
    print("\nDone.")
