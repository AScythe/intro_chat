"""
Database utility script for IntroChat
Use this to quickly test database connectivity and table structure.
Run: python tests/test_db.py
"""

import sqlite3
import os

def test_db_connection():
    """Test database connection and table structure"""
    # Find database path
    db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'introchat.db')
    
    if not os.path.exists(db_path):
        print(f"❌ Database not found at: {db_path}")
        print("   Run: python -m app  (to create database)")
        return False
    
    print(f"✅ Database found: {db_path}")
    
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()
        
        # Check tables
        cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
        tables = [row[0] for row in cursor.fetchall()]
        
        expected_tables = ['events', 'rooms', 'users', 'matches']
        print(f"\n📊 Found {len(tables)} tables:")
        for table in expected_tables:
            if table in tables:
                print(f"   ✅ {table}")
            else:
                print(f"   ❌ {table} (missing)")
        
        # Check row counts
        print(f"\n📈 Row counts:")
        for table in expected_tables:
            if table in tables:
                cursor.execute(f"SELECT COUNT(*) FROM {table}")
                count = cursor.fetchone()[0]
                print(f"   {table}: {count} rows")
        
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Database error: {e}")
        return False

def reset_database():
    """Reset the database (deletes and recreates)"""
    import sys
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    
    db_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), 'data', 'introchat.db')
    
    if os.path.exists(db_path):
        os.remove(db_path)
        print(f"🗑️  Deleted: {db_path}")
    
    # Recreate database
    from app.database import init_db
    init_db(db_path)
    print(f"✅ Database recreated at: {db_path}")

if __name__ == '__main__':
    import sys
    print("🧪 IntroChat Database Utility\n")
    
    if len(sys.argv) > 1:
        if sys.argv[1] == 'reset':
            reset_database()
        else:
            print(f"Unknown command: {sys.argv[1]}")
            print("Usage: python tests/test_db.py [reset]")
    else:
        test_db_connection()
