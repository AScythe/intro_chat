# Document Guidelines - IntroChat

> **Purpose:** Define exact scope, audience, and content boundaries for every document in `docs/`. Use this guide to determine WHERE to add new content and WHAT to exclude.

---

## Quick Reference Table

| Document | Audience | Primary Purpose | Update Trigger | Content Type |
|----------|----------|------------------|----------------|--------------|
| **README.md** | End users, new developers | Entry point: what, how, setup | Features or setup change | User-facing, practical |
| **ARCHITECTURE.md** | Developers, AI agents | Technical structure reference | Code structure changes | Technical, implementation |
| **SPECIFICATIONS.md** | Product owners, developers, AI agents, stakeholders, judges | Product vision, user flow & product context | Product scope changes | Product, pitch, vision, specification |
| **DEMO_GUIDE.md** | Presenters, judges | Demo execution steps | Demo flow changes | Practical, step-by-step |
| **AGENTS.md** | AI agents (opencode) | Agent permissions & rules | File/command changes | Operational, constraints |
| **PROJECT_BEST_PRACTICES.md** | All developers, AI | Universal best practices | After each session | Educational, guidelines |
| **DOCUMENT_GUIDELINES.md** | Developers, AI agents | Doc scope & boundaries | New doc added | Meta, governance |

---

## 1. README.md

### **Scope**
User-facing entry point for anyone discovering the project. Answers "What is it?", "How do I use it?", "How do I run it?".

### **Audience**
- End users (event organizers, attendees)
- New developers joining the project
- Anyone visiting the repository for the first time

### **What TO Include**
- Project description and tagline
- Feature list (user-facing, benefit-focused)
- Quick start instructions (install, run)
- How to use (step-by-step for each user type)
- Technical details (tech stack, simplified architecture)
- API endpoints table (summary only)
- Testing instructions
- Deployment options
- Privacy & security information
- Troubleshooting common issues
- Contributing guidelines reference
- License information

### **What NOT to Include**
- ❌ Detailed module descriptions (goes in ARCHITECTURE.md)
- ❌ Product vision/pitch (goes in SPECIFICATIONS.md)
- ❌ Demo scripts (goes in DEMO_GUIDE.md)
- ❌ AI agent permissions (goes in AGENTS.md)
- ❌ Best practices lessons (goes in PROJECT_BEST_PRACTICES.md)
- ❌ Detailed data flow with endpoint names (goes in ARCHITECTURE.md)

### **Content Boundaries**
- **Features section:** User-facing benefits, not technical implementation
- **Technical Details:** High-level only (max 2-3 paragraphs)
- **API Endpoints:** Summary table only, no detailed request/response examples

---

## 2. ARCHITECTURE.md

### **Scope**
Technical structure reference. Answers "How is it built?", "What are the modules?", "How do I modify it?".

### **Audience**
- Developers working on the codebase
- AI agents making code changes
- Technical reviewers

### **What TO Include**
- Complete project file tree with descriptions
- Module descriptions (1-2 paragraphs per module)
- Key Functionalities list (9 items, technical focus)
- Data Flow (technical with API endpoints + WebSocket events)
- Key Design Decisions (why certain patterns were chosen)
- Import structure and dependency graph
- Running instructions (technical)
- Modifying instructions (how to add routes, events, etc.)
- Critical implementation details (match expiry, default rooms, etc.)

### **What NOT to Include**
- ❌ User-facing feature benefits (goes in README.md)
- ❌ Product pitch or problem statement (goes in SPECIFICATIONS.md)
- ❌ Demo step-by-step instructions (goes in DEMO_GUIDE.md)
- ❌ AI agent file ownership tables (goes in AGENTS.md)
- ❌ Best practices philosophy (goes in PROJECT_BEST_PRACTICES.md)

### **Content Boundaries**
- **Module Descriptions:** Internal logic, not user benefits
- **Data Flow:** MUST include API endpoints (e.g., `POST /api/events`)
- **Key Functionalities:** Technical list, not marketing language

---

## 3. SPECIFICATIONS.md

### **Scope**
Product specification and vision. Answers "Why does this exist?", "What problem does it solve?", "How does the user journey work?".

### **Audience**
- Product owners and managers
- Developers and AI agents needing product context to develop features aligned with the vision
- Product stakeholders like hackathon judges, investors, or potential users, or anyone evaluating the product concept

### **What TO Include**
- Problem statement and context
- Solution description and pitch
- User journey / core logic flow (product-focused, no endpoint names)
- Feature descriptions with purpose and rationale (what each feature does and why it exists)
- Product decisions and rationale (why certain approaches were chosen)
- Target user personas (who the product serves, why they benefit)
- Feature priority and status (what's implemented vs. planned)
- Product constraints (what the product explicitly does not do and why)
- Privacy and trust model (user-facing framing)
- Problem-solution pairs (why target users benefit)
- Tech stack with rationale ("Why?" column, not implementation detail)
- Sample user flow (narrative story)
- Value proposition for evaluators (judges, stakeholders)
- Future enhancements / bonus features
- Final pitch line
- Brief demo setup (enough for judges to run it, not a full guide)

### **What NOT to Include**
- ❌ Technical file tree (goes in ARCHITECTURE.md)
- ❌ Installation/setup instructions (goes in README.md)
- ❌ Detailed demo walkthrough (goes in DEMO_GUIDE.md)
- ❌ AI agent rules (goes in AGENTS.md)
- ❌ Best practices (goes in PROJECT_BEST_PRACTICES.md)
- ❌ Data flow with endpoint names (goes in ARCHITECTURE.md)
- ❌ Implementation details, module internals, or code structure (goes in ARCHITECTURE.md)

**Developer context clarification:** Developers needing *product context* (what to build and why) → SPECIFICATIONS.md. Developers needing *implementation context* (how to build it, endpoints, modules) → ARCHITECTURE.md.

### **Content Boundaries**
- **Core Logic Flow:** Product-focused, not technical (no endpoint names)
- **Feature Descriptions:** Product purpose and user benefit, not implementation mechanism
- **Product Decisions:** Vision rationale, not technical trade-offs
- **Target Personas:** Who the user is and why they benefit, not user stories or acceptance criteria
- **Feature Priority/Status:** What state each feature is in, not implementation timeline
- **Why Introverts Love It:** Problem-solution pairs, not implementation details
- **Tech Stack:** Include "Why?" column, not detailed module descriptions

---

## 4. DEMO_GUIDE.md

### **Scope**
Practical demo execution guide. Answers "How do I demonstrate this?", "What should I highlight?", "What are the test scenarios?".

### **Audience**
- Presenters demonstrating the app
- Hackathon judges evaluating the demo
- Users trying the app for the first time

### **What TO Include**
- Prerequisites — what must be running before demo starts
- Quick start walkthrough — ordered steps to reach a working demo state
- Key features to demonstrate — what to highlight and in what order
- Testing scenarios — discrete flows with exact actions and expected results
- UI highlights — what the runner should point to on screen
- Technical features to highlight — for technical evaluators
- Demo tips — separate guidance for different audience types (judges vs. users)
- Fallback options — what to do if something breaks live
- Reset instructions — how to restore demo state after a run
- Success signals — what the audience should feel or see

### **What NOT to Include**
- ❌ Product vision/problem statement (goes in SPECIFICATIONS.md)
- ❌ Technical architecture details (goes in ARCHITECTURE.md)
- ❌ Full API endpoint tables (goes in README.md or ARCHITECTURE.md)
- ❌ AI agent permissions (goes in AGENTS.md)
- ❌ Best practices lessons (goes in PROJECT_BEST_PRACTICES.md)

### **Content Boundaries**
- **Testing Scenarios:** Step-by-step actions, not technical implementation
- **Demo Tips:** Separate sections for judges vs. users
- **Success Metrics:** User feelings, not technical metrics

---

## 5. AGENTS.md

### **Scope**
AI agent operational guidelines. Answers "What can agents touch?", "What commands do they use?", "What are they forbidden from doing?".

### **Audience**
- AI agents (e.g., opencode)
- Developers setting up agent permissions

### **What TO Include**
- Scope definition (what vs. how distinction)
- Project Overview (1 paragraph + key functionalities summary)
- Architecture summary (key components only — enough to navigate, not full detail)
- Environment setup
- File Ownership table (location, role, agent policy)
- Core Commands (setup + test commands)
- API Endpoints + WebSocket Events tables
- Out of Scope list (forbidden implementations)
- Privacy Requirements (hard requirements)

### **What NOT to Include**
- ❌ Detailed module descriptions (goes in ARCHITECTURE.md)
- ❌ User-facing setup instructions (goes in README.md)
- ❌ Product pitch (goes in SPECIFICATIONS.md)
- ❌ Demo instructions (goes in DEMO_GUIDE.md)
- ❌ Best practices philosophy (goes in PROJECT_BEST_PRACTICES.md)
- ❌ Detailed data flow (goes in ARCHITECTURE.md)

### **Content Boundaries**
- **File Ownership:** MUST include agent policy (✅ safe, ⚠️ caution, ❌ forbidden)
- **Out of Scope:** Explicit forbidden items, not suggestions
- **Privacy Requirements:** Hard requirements only, not guidelines

---

## 6. PROJECT_BEST_PRACTICES.md

### **Scope**
Universal development best practices derived from real debugging sessions. Answers "How should I code?", "What patterns should I follow?", "What lessons were learned?".

### **Audience**
- All developers working on the project
- AI agents making changes
- Future maintainers

### **What TO Include**
- Modularization Techniques (6 subsections: responsibility pattern, circular import prevention, etc.)
- Configuration principles
- Error Handling patterns
- State Management strategies
- Testing practices
- Documentation principles
- Session Lessons Learned (4 subsections)
- AI-Assisted Dev guidelines
- Version Control practices
- Code Review Checklist
- Frontend Best Practices
- Debugging Process
- Document Scope & Distinctions
- Key Takeaways

### **What NOT to Include**
- ❌ Project-specific architecture (goes in ARCHITECTURE.md)
- ❌ User-facing instructions (goes in README.md)
- ❌ Product vision (goes in SPECIFICATIONS.md)
- ❌ Demo scripts (goes in DEMO_GUIDE.md)
- ❌ AI agent file permissions (goes in AGENTS.md)

### **Content Boundaries**
- **All sections:** Universal principles, not project-specific details
- **Examples:** SHOULD reference project files (e.g., `app/__init__.py`) as context
- **Lessons Learned:** MUST include "Context" and "Why it matters"

---

## 7. DOCUMENT_GUIDELINES.md

### **Scope**
Meta-governance document. Answers "Where does this content go?", "What belongs in each doc?", "How do I add a new document?".

### **Audience**
- Developers adding or reorganizing documentation
- AI agents deciding where to write new content

### **What TO Include**
- Quick Reference Table of all docs with audience, purpose, update trigger, content type
- Per-document sections: Scope, Audience, What TO Include, What NOT to Include, Content Boundaries
- Decision Tree for routing new content
- Anti-Duplication Rules
- Checklist before adding content

### **What NOT to Include**
- ❌ Actual content from any document (no copying, only describing)
- ❌ Project-specific implementation details
- ❌ Agent operational rules (goes in AGENTS.md)

### **Content Boundaries**
- **Per-document sections:** Define categories, not project-specific section names or counts
- **Decision Tree:** Must cover all documents in the Quick Reference Table
- **Update Trigger:** Update this file whenever a new document is added to the project

---

## Decision Tree: Where Does This Content Go?

```
Is it about...
├── User-facing setup/usage? → README.md
├── Technical structure/modules? → ARCHITECTURE.md
├── Product vision/user journey? → SPECIFICATIONS.md
├── Demo steps/presentation? → DEMO_GUIDE.md
├── AI agent permissions? → AGENTS.md
├── Universal coding patterns? → PROJECT_BEST_PRACTICES.md
└── Doc scope or content boundaries? → DOCUMENT_GUIDELINES.md
```

---

## Anti-Duplication Rules

1. **One purpose per document** - If content fits two documents, choose the PRIMARY purpose
2. **Cross-reference, don't copy** - Use `[See ARCHITECTURE.md](ARCHITECTURE.md)` instead of duplicating
3. **Summary here, details there** - README.md gets summary tables, ARCHITECTURE.md gets detailed descriptions
4. **Audience-first** - If audience overlaps, choose the document with the MOST RELEVANT audience
5. **Update this guide** - If you add a new document, add a row to the Quick Reference Table and a new numbered section following the same structure: Scope, Audience, What TO Include, What NOT to Include, Content Boundaries

---

## Checklist Before Adding Content

- [ ] I've identified the PRIMARY purpose of the content
- [ ] I've checked the "What NOT to Include" section for my target document
- [ ] I've verified the content doesn't already exist in another document
- [ ] I've used the Decision Tree to confirm the right document
- [ ] If content spans multiple purposes, I've split it appropriately
- [ ] I've added cross-references instead of duplicating

---

> **Remember:** Good documentation is invisible. When in doubt, ask: "Who needs this information?" and "What action will they take after reading it?"