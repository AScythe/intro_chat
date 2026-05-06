#!/usr/bin/env python
"""
update_best_practices.py
Analyzes the current coding session and updates PROJECT_BEST_PRACTICES.md
"""

import re
from pathlib import Path

def analyze_session():
    """Analyze the current session to extract best practices."""
    practices = {
        'session_fixes': [],
        'code_patterns': [],
        'tool_usage': [],
        'lessons': []
    }
    
    # Read modified files to understand what was done
    modified_files = [
        'app/__init__.py',
        'app/routes.py',
        'app/matchmaking.py',
        'app/static/js/room.js',
        'app/static/js/chat.js'
    ]
    
    for file_path in modified_files:
        if Path(file_path).exists():
            with open(file_path, 'r') as f:
                content = f.read()
                # Analyze patterns
                if 'import' in content:
                    practices['code_patterns'].append(f"Module imports in {file_path}")
                if 'try:' in content and 'except' in content:
                    practices['code_patterns'].append(f"Error handling in {file_path}")
    
    return practices

def update_best_practices_doc(practices):
    """Update the PROJECT_BEST_PRACTICES.md with new practices."""
    doc_path = Path('PROJECT_BEST_PRACTICES.md')
    
    # Read existing content
    if doc_path.exists():
        with open(doc_path, 'r') as f:
            existing = f.read()
    else:
        existing = "# Project Best Practices\n\n"
    
    # Add session-specific updates
    updates = "\n\n## Session Updates\n\n"
    for category, items in practices.items():
        if items:
            updates += f"### {category.replace('_', ' ').title()}\n"
            for item in items:
                updates += f"- {item}\n"
    
    # Write updated doc
    with open(doc_path, 'w') as f:
        f.write(existing + updates)
    
    print(f"✅ Updated {doc_path}")
    return str(doc_path)

if __name__ == '__main__':
    print("Analyzing session...")
    practices = analyze_session()
    print("Updating best practices document...")
    update_best_practices_doc(practices)
