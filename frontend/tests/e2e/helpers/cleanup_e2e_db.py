# Description: Clears all data from the E2E test database so Playwright starts fresh on each run.
# Called by Playwright globalSetup before tests begin. Uses SQL so it works even if the
# webServer has the DB open.

import os
import sqlite3
import sys

db_path = os.environ.get('DB_PATH', os.path.join(os.path.dirname(__file__), '..', '..', '..', '..', 'data', 'e2e_test.db'))

if not os.path.exists(db_path):
    print(f'No DB to clean: {db_path} not found')
    sys.exit(0)

conn = sqlite3.connect(db_path)
conn.execute("PRAGMA foreign_keys = OFF")
cur = conn.cursor()

tables = [r[0] for r in cur.execute("SELECT name FROM sqlite_master WHERE type='table'").fetchall()]
for t in tables:
    cur.execute(f"DELETE FROM {t}")

conn.commit()
conn.close()
print(f'Cleared {len(tables)} tables in {db_path}')
