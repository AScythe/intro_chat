# Contributing to IntroChat

Thank you for your interest in contributing to IntroChat! This document provides guidelines for contributing to the project.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [How to Contribute](#how-to-contribute)
- [Development Setup](#development-setup)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [Coding Standards](#coding-standards)
- [Community](#community)

---

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md) (if available). Please be respectful and inclusive to all contributors.

---

## Getting Started

### Prerequisites
- Python 3.10+
- pip (Python package installer)
- Git

### Development Setup
```bash
# Clone the repository
git clone <your-fork-url>
cd introchat

# Create virtual environment
python -m venv venv
# Windows: venv\Scripts\activate
# macOS/Linux: source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the application
python -m app
```

---

## How to Contribute

### Reporting Bugs
1. Check [existing issues](https://github.com/your-repo/issues) first
2. Create a new issue with:
   - Clear description of the problem
   - Steps to reproduce
   - Expected vs actual behavior
   - Screenshots if applicable

### Suggesting Enhancements
1. Open an issue with the "enhancement" label
2. Describe the feature and why it's valuable
3. Discuss implementation approach

### Your First Code Contribution
1. Look for issues labeled "good first issue"
2. Comment on the issue to express interest
3. Ask questions if anything is unclear

---

## Development Setup

### Branch Strategy
- `main` — production-ready code only
- Feature branches — `feature/description` or `fix/description`
- Never commit directly to `main`

### Local Development Workflow
```bash
# Create feature branch
git checkout -b feature/my-feature

# Make changes
# ... edit files ...

# Run tests (REQUIRED before committing)
python tests/test_app.py
python tests/test_js_modules.py

# Commit changes
git add .
git commit -m "Feat: Add amazing feature"

# Push to your fork
git push origin feature/my-feature

# Open Pull Request on GitHub
```

---

## Testing

### Running Tests
```bash
# Backend tests
python tests/test_app.py

# JavaScript module validation
python tests/test_js_modules.py

# Run the app and test manually
python -m app
# Then open http://localhost:5000 in two browser tabs
```

### Test Requirements
- **All tests must pass** before submitting a PR
- Add tests for new features
- Update tests when fixing bugs
- Test both happy path and error cases

---

## Pull Request Process

### Before Submitting
- [ ] All tests pass (`python tests/test_app.py`)
- [ ] Code follows project style (see Coding Standards)
- [ ] Commit messages are clear and descriptive
- [ ] Documentation updated (if needed)
- [ ] No hardcoded values (use config files)

### PR Description Template
```markdown
## Description
Brief description of changes

## Type
- [ ] Bug fix
- [ ] New feature
- [ ] Refactoring
- [ ] Documentation

## Testing
- [ ] Existing tests pass
- [ ] Added new tests
- [ ] Manual testing completed

## Screenshots (if UI changes)
Add screenshots here
```

### Review Process
1. Maintainers will review your PR
2. Address feedback promptly
3. PR will be merged once approved
4. You'll be credited in release notes

---

## Coding Standards

### Python (Backend)
- Follow [PEP 8](https://pep8.org/) style guide
- Use meaningful variable and function names
- Add docstrings for public functions
- Handle errors with try/except
- No hardcoded values — use `config.py` or constants

### JavaScript (Frontend)
- Use clear, descriptive variable names
- Modularize by page/feature
- No inline `<script>` tags in templates
- Pass data via `window` globals from Jinja2

### Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org/):
```
fix: Resolve 404 on user room endpoint
feat: Add QR code generation for events
refactor: Extract matchmaking logic to service
docs: Update API documentation
test: Add tests for connection exchange
```

### What NOT to Do
- Don't commit secrets (.env, credentials)
- Don't commit large binaries
- Don't use `print()` for production logging (use `logging`)
- Don't skip tests

---

## Community

### Getting Help
- Check [README.md](README.md) for project overview
- Review [AGENTS.md](AGENTS.md) for agent context
- Open an issue for questions
- Check closed issues for similar problems

### Recognition
Contributors will be:
- Added to [CONTRIBUTORS.md](CONTRIBUTORS.md) (if it exists)
- Mentioned in release notes
- Credited in project documentation

---

## License

By contributing, you agree that your contributions will be licensed under the project's MIT License.

---

**Thank you for making IntroChat better for introverts everywhere! 🌟**
