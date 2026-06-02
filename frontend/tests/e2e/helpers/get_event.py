# get_event.py
# Description: Queries the E2E test database for the most recent event ID

import os
import sqlite3

db_path = os.environ.get(
    'DB_PATH',
    os.path.join(os.path.dirname(__file__), '..', '..', '..', '..', 'data', 'e2e_test.db'),
)

conn = sqlite3.connect(db_path)
row = conn.execute('SELECT id FROM events ORDER BY rowid DESC LIMIT 1').fetchone()
conn.close()

if row is None:
    raise SystemExit('No events found in database — run organizer flow first')

print(row[0])
