#!/usr/bin/env python
"""
update_best_practices.py
Analyzes the current coding session AND existing product code structure, then updates PROJECT_BEST_PRACTICES.md

Applies universal principles (not project-specific). Self-contained - no external doc references.
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


def analyze_code_structure():
    """Analyze existing code structure to extract universal best practices. Self-contained."""
    practices = {
        'document_scope': [],
        'module_patterns': [],
        'import_patterns': [],
        'universal_principles': []
    }
    
    # Self-contained checks (no external doc reads)
    # Check: One purpose per document rule
    practices['document_scope'].append('One purpose per document (universal rule)')
    practices['document_scope'].append('Use Decision Tree: README→user, ARCHITECTURE→tech, etc.')
    practices['document_scope'].append('Apply anti-duplication: cross-reference, dont copy')
    
    # Check: Universal principles rule
    practices['universal_principles'].append('Universal principles, not project-specific')
    practices['universal_principles'].append('Examples MUST include Context and Why it matters')
    practices['universal_principles'].append('Examples reference project files as context ONLY')
    
    # Analyze app/*.py for module patterns
    app_dir = Path('app')
    if app_dir.exists():
        for py_file in app_dir.glob('*.py'):
            with open(py_file, 'r') as f:
                content = f.read()
                # Check for leaf module pattern
                if 'state.py' in str(py_file) or 'database.py' in str(py_file):
                    if 'from .' not in content:
                        practices['module_patterns'].append(f"Leaf module pattern in {py_file.name}")
                # Check for import patterns
                if 'from .state import' in content:
                    practices['import_patterns'].append(f"Leaf import pattern in {py_file.name}")
    
    # Check docs/*.md for one purpose rule
    docs_dir = Path('docs')
    if docs_dir.exists():
        for md_file in docs_dir.glob('*.md'):
            with open(md_file, 'r') as f:
                content = f.read()
                if 'One purpose per document' in content:
                    practices['document_scope'].append(f"One purpose rule found in {md_file.name}")
    
    return practices


def update_best_practices_doc(practices, code_practices):
    """Update the PROJECT_BEST_PRACTICES.md with new practices."""
    doc_path = Path('docs/PROJECT_BEST_PRACTICES.md')
    
    # Read existing content
    if doc_path.exists():
        with open(doc_path, 'r') as f:
            existing = f.read()
    else:
        existing = "# Project Best Practices\n\n> Derived from real-world debugging - applies to ALL projects\n\n"
    
    # Add session-specific updates
    updates = "\n\n## Session Updates\n\n"
    for category, items in practices.items():
        if items:
            updates += f"### {category.replace('_', ' ').title()}\n"
            for item in items:
                updates += f"- {item}\n"
    
    # Add code structure updates (self-contained rules)
    updates += "\n\n## Code Structure Updates\n\n"
    for category, items in code_practices.items():
        if items:
            updates += f"### {category.replace('_', ' ').title()}\n"
            for item in items:
                updates += f"- {item}\n"
    
    # Add Document Scope section if not exists (self-contained rule)
    if 'Document Scope & Distinctions' not in existing:
        updates += """
        
## Document Scope & Distinctions

**Context**: From duplicate content across documents.

**Principle**: One purpose per document. Move content to `/docs/` if README >250 lines.

**Example**:
| Document | Purpose |
|----------|---------|
| **README.md** | User-facing: what, how, quick start |
| **AGENTS.md** | Agent context: *what* agents work on |
| **ARCHITECTURE.md** | Technical: *how* it's structured |
| **CONTRIBUTING.md** | Workflow: dev setup, PR process |

**Why it matters**: No confusion, clear ownership.

**Rule**: Universal principles, not project-specific details. Examples reference project files as context ONLY.
"""
    
    # Write updated doc
    with open(doc_path, 'w') as f:
        f.write(existing + updates)
    
    print(f"✅ Updated {doc_path} with session + code structure practices (self-contained)")
    return str(doc_path)


if __name__ == '__main__':
    print("Analyzing session...")
    practices = analyze_session()
    print("Analyzing existing code structure...")
    code_practices = analyze_code_structure()
    print("Updating best practices document...")
    update_best_practices_doc(practices, code_practices)
