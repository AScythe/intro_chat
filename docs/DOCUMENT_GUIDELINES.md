# Document Guidelines - IntroChat

> **Purpose:** Authoritative reference for document boundaries. Defines which content goes where, how each document is differentiated, and what to do when boundaries touch. Use this guide as the single source of truth for routing new content.

---

## Quick Reference Table

| Document | Routes content about | Audience | Update Trigger | Content Type |
|----------|---------------------|----------|----------------|--------------|
| **README.md** | User-facing setup, usage, features, benefits, installation | End users, new developers | Feature or setup change | User-facing, practical |
| **ARCHITECTURE.md** | Technical structure, modules, file tree, implementation, data flow | Developers, AI agents | Code structure change | Technical, implementation |
| **SPECIFICATIONS.md** | Product vision, user journey, problem statement, pitch | Product owners, devs, AI, stakeholders | Product scope change | Product, pitch, vision, spec |
| **DEMO_GUIDE.md** | Demo presentation, walkthrough, step-by-step instructions | Presenters, judges | Demo flow change | Practical, step-by-step |
| **AGENTS.md** | AI agent permissions, rules, file ownership, operational constraints | AI agents (opencode) | File or command change | Operational, constraints |
| **PROJECT_BEST_PRACTICES.md** | Universal coding patterns, best practices, lessons learned | All developers, AI | After each session | Educational, guidelines |
| **DOCUMENT_GUIDELINES.md** | Doc scope, content boundaries, governance | Developers, AI agents | New doc added | Meta, governance |

---

## 1. README.md

### Scope
User-facing entry point for anyone discovering the project. Answers "What is it?", "How do I use it?", "How do I run it?".

### Audience
- End users (event organizers, attendees)
- New developers joining the project
- Anyone visiting the repository for the first time

### Key Differentiator
**User-facing benefits over implementation.** Describe outcomes, not internals. If a non-technical first-time visitor wouldn't care about it, it doesn't belong here. This is the only document written for someone who may never write a line of code.

### What to Include
- **Project description and tagline** — what the project is and why it exists, in one paragraph
- **Feature list** — user-facing benefits, not technical implementation. Describe what users can do, not how it works.
- **Quick start instructions** — install dependencies, run the app, minimum steps to get going
- **How to use** — step-by-step for each user type (organizer, attendee). Show the workflow from their perspective.
- **Technical details** — tech stack and simplified architecture. High-level only, max 2-3 paragraphs. Enough for a curious user to understand the stack, not enough to build from.
- **API endpoints** — summary table only (method, path, purpose). No request/response examples, no detailed schemas.
- **Testing instructions** — how to run tests, what the test suite covers
- **Deployment options** — how to deploy for production use
- **Privacy and security information** — user-facing framing of privacy model and security practices
- **Troubleshooting common issues** — problems users have encountered and how to resolve them
- **Contributing guidelines reference** — link to contributing guide, not the full content
- **License information** — what license the project uses

### What NOT to Include
- ❌ Detailed module descriptions or file trees — these go in ARCHITECTURE.md
- ❌ Implementation design decisions or trade-offs — these go in ARCHITECTURE.md
- ❌ Product vision, pitch, or user journey narrative — these go in SPECIFICATIONS.md
- ❌ Demo walkthrough or presentation steps — these go in DEMO_GUIDE.md
- ❌ AI agent permissions or operational rules — these go in AGENTS.md
- ❌ Best practices lessons or coding philosophy — these go in PROJECT_BEST_PRACTICES.md
- ❌ Data flow with endpoint names — this goes in ARCHITECTURE.md

### Content Boundaries
- **Features section:** Write in terms of user benefits, not technical implementation. "Users can join a room and chat anonymously" not "WebSocket connections are established on room join."
- **Technical details:** Maximum 2-3 paragraphs. Summarize the stack, don't document it.
- **API endpoints:** Summary table only. No request/response examples, no headers, no status codes. Just method, path, and a one-line purpose.

---

## 2. ARCHITECTURE.md

### Scope
Technical structure reference for the project. Answers "How is it built?", "What are the modules?", "How do I modify it?".

### Audience
- Developers working on the codebase
- AI agents making code changes
- Technical reviewers evaluating the implementation

### Key Differentiator
**Implementation over vision.** Describes internal structure, data flow, and design rationale. The "HOW" document — in contrast to SPECIFICATIONS.md which is the "WHY" document. If a reader needs to know how to add a route, extend a feature, or understand module boundaries, they come here.

### What to Include
- **Complete project file tree** — every directory and key file with a description of its role
- **Module descriptions** — internal logic of each module, what it owns, what it delegates. Not user benefits, not marketing language.
- **Key functionalities** — technical focus on what the code does, not why users want it
- **Data flow** — MUST include all API endpoints (method, path, purpose) and WebSocket events (event name, direction, payload). This is the authoritative data flow reference.
- **Key design decisions** — why certain patterns were chosen. Must include the *why*, not just the *what*.
- **Import structure and dependency graph** — how modules depend on each other, circular dependency prevention
- **Running instructions** — technical startup sequence, env vars, configuration
- **Modifying instructions** — how to add routes, events, extend functionality. The "if you need to add X, here's how" section.
- **Critical implementation details** — match expiry logic, cleanup thread behavior, in-memory state management, default rooms, any non-obvious runtime behavior

### What NOT to Include
- ❌ User-facing benefits or marketing language — these go in README.md
- ❌ Product pitch, problem statement, or user journey — these go in SPECIFICATIONS.md
- ❌ Demo step-by-step instructions — these go in DEMO_GUIDE.md
- ❌ AI agent file ownership tables or operational rules — these go in AGENTS.md
- ❌ Best practices philosophy or universal coding patterns — these go in PROJECT_BEST_PRACTICES.md

### Content Boundaries
- **Module descriptions:** Internal logic only. Describe what the module does in the system, not what users get from it.
- **Data flow:** Every endpoint and WebSocket event must include its actual name (e.g., `POST /api/events`, `join_room`). No placeholders.
- **Design decisions:** Always include the reasoning. "Why SQLite?" not just "Uses SQLite."
- **Language:** Technical throughout. Assume the reader knows what Flask, SocketIO, and SQLite are.

---

## 3. SPECIFICATIONS.md

### Scope
Product specification and vision. Answers "Why does this exist?", "What problem does it solve?", "How does the user journey work?", "What features should I build that align with the vision?".

### Audience
- Product owners and managers
- Developers and AI agents needing product context to develop features aligned with the vision
- Product stakeholders — hackathon judges, investors, or anyone evaluating the product concept

### Key Differentiator
**Vision over implementation.** Describes purpose, user journey, and product rationale. The "WHY" document — in contrast to ARCHITECTURE.md which is the "HOW" document. No endpoint names, no module internals, no implementation details. If a decision involves trade-offs about what to build and why, it belongs here.

### What to Include
- **Problem statement and context** — what pain point exists, who experiences it, why it matters
- **Solution description and pitch** — what the product does at a high level, why it solves the problem
- **User journey / core logic flow** — product-focused steps in plain language. "User scans QR code, selects a room, gets matched." No endpoint names, no technical sequence.
- **Feature descriptions with purpose and rationale** — what each feature does and WHY it exists. Every feature needs a reason.
- **Product decisions and rationale** — why certain approaches were chosen (e.g., "Why 30 seconds?", "Why anonymous?", "Why no accounts?")
- **Target user personas** — who the product serves, why they benefit. Not user stories or acceptance criteria — archetypes.
- **Feature priority and status** — what's implemented vs. planned, to guide what to build next
- **Product constraints** — what the product explicitly does NOT do and why. Honest boundaries prevent scope creep.
- **Privacy and trust model** — user-facing framing of how privacy works. Not implementation details.
- **Problem-solution pairs** — why target users benefit from each feature
- **Tech stack with rationale** — include a "Why?" column alongside each technology choice. Not detailed module descriptions.
- **Sample user flow** — narrative story of a user experiencing the product. Readable by a non-technical evaluator.
- **Value proposition for evaluators** — what judges, investors, or stakeholders should understand about the product's value
- **Future enhancements / bonus features** — clearly marked as not yet implemented
- **Final pitch line** — the one-sentence summary of what this product is
- **Brief demo setup** — 2-3 lines so a judge can run it independently. Full walkthrough goes in DEMO_GUIDE.md.

### What NOT to Include
- ❌ Endpoint names, route definitions, or any implementation-level detail — these go in ARCHITECTURE.md
- ❌ Module descriptions, file trees, or import structure — these go in ARCHITECTURE.md
- ❌ Installation or setup instructions — these go in README.md
- ❌ Detailed demo walkthrough with step-by-step actions — this goes in DEMO_GUIDE.md
- ❌ AI agent rules, file permissions, or operational constraints — these go in AGENTS.md
- ❌ Best practices or universal coding patterns — these go in PROJECT_BEST_PRACTICES.md
- ❌ Data flow with endpoint names — this goes in ARCHITECTURE.md

### Content Boundaries
- **User journey / core logic flow:** Product-focused only. Describe steps in plain language. No `POST /api/events`, no `join_room` — those belong in ARCHITECTURE.md.
- **Feature descriptions:** Product purpose and user benefit. Not implementation mechanism.
- **Product decisions:** Vision rationale ("anonymous chats prevent social anxiety"), not technical trade-offs ("we chose not to store messages to save disk space").
- **Target personas:** Who the user is and why they benefit. Not user stories, not acceptance criteria.
- **Feature priority / status:** What state each feature is in. Not implementation timeline.
- **Tech stack:** Include a "Why?" rationale column. Not detailed module descriptions.
- **Brief demo setup:** Enough for a judge to run it independently. Full walkthrough goes in DEMO_GUIDE.md.

**Context for developers:**
- Need **product context** (what to build and why) → SPECIFICATIONS.md
- Need **implementation context** (how to build it, endpoints, modules) → ARCHITECTURE.md

**Context for agents:**
- Need **product context** (what should I build and why, what is the product vision) → SPECIFICATIONS.md
- Need **operational context** (what files can I touch, what commands can I run) → AGENTS.md

---

## 4. DEMO_GUIDE.md

### Scope
Practical demo execution guide. Answers "How do I demonstrate this?", "What should I highlight?", "What are the test scenarios?".

### Audience
- Presenters demonstrating the app
- Hackathon judges evaluating the demo
- Users trying the app for the first time

### Key Differentiator
**Action over description.** Not what the product does — exactly what to click, what to say, what to expect at each step. Written for a presenter under pressure who needs to deliver a smooth demo. Every step must have a clear expected result. If it can't be demonstrated, it doesn't belong here.

### What to Include
- **Prerequisites** — what must be running before the demo starts (services running, env vars set, data pre-loaded)
- **Quick start walkthrough** — ordered steps to reach a working demo state from scratch
- **Key features to demonstrate** — what to highlight and in what order for maximum impact
- **Testing scenarios** — discrete flows with exact actions and expected results. "Click X, expect Y to appear."
- **UI highlights** — what the runner should point to on screen at each stage
- **Technical features to highlight** — for technical evaluators who care about implementation
- **Demo tips** — separate guidance for different audience types (what judges care about vs. what users care about)
- **Fallback options** — what to do if something breaks live. Must be actionable ("if X breaks, do Y"), not vague reassurance.
- **Reset instructions** — how to restore demo state after a run so it can be shown again
- **Success signals** — what the audience should feel or see at the end. Not technical metrics.

### What NOT to Include
- ❌ Product vision, problem statement, or pitch — these go in SPECIFICATIONS.md
- ❌ Technical architecture or module descriptions — these go in ARCHITECTURE.md
- ❌ Full API endpoint tables — summaries go in README.md, detailed data flow goes in ARCHITECTURE.md
- ❌ AI agent permissions or operational rules — these go in AGENTS.md
- ❌ Best practices or coding philosophy — these go in PROJECT_BEST_PRACTICES.md
- ❌ Installation or setup instructions — these go in README.md

### Content Boundaries
- **Testing scenarios:** Step-by-step actions with expected results. Not technical implementation.
- **Demo tips:** Must have separate sections for judges vs. users. They care about different things.
- **Fallback options:** Must be actionable. "If the QR code doesn't load, refresh the page and try again." Not "try again later."
- **Success signals:** How the audience feels or what they see. Not technical metrics.
- **Language:** Presenter-focused throughout. Assume the reader is on stage with people watching.

---

## 5. AGENTS.md

### Scope
AI agent operational guidelines. Answers "What can agents touch?", "What commands do they use?", "What are they forbidden from doing?".

### Audience
- AI agents (e.g., opencode)
- Developers setting up agent permissions

### Key Differentiator
**Operational constraints over technical structure.** Not how the code is organized — what agents are allowed to edit, what commands to run, what files to never touch. The boundary between AGENTS.md and ARCHITECTURE.md is: AGENTS.md = permissions and commands; ARCHITECTURE.md = implementation and data flow. If an agent needs to know "can I edit this file?" or "what command do I run to test?", it's here.

### What to Include
- **Scope definition** — what this document covers and how it relates to other guidance (e.g., skill files)
- **Project overview** — 1 paragraph describing the project and its key functionalities (enough for context, not full detail)
- **Architecture summary** — key components only, 3-5 lines. Enough to navigate the codebase. Full detail goes in ARCHITECTURE.md.
- **Environment setup** — Python version, venv setup, production env vars
- **File ownership table** — every location an agent might touch, with explicit policy: ✅ safe to edit, ⚠️ caution required, ❌ forbidden
- **Core commands** — setup commands, run commands, test commands with exact syntax
- **Command ordering** — when sequence matters (e.g., run lint before test)
- **Agent rules** — explicit always/never directives, no "consider" or "try to"
- **Verification requirements** — what must pass before a task is done
- **API endpoints** — reference table (method, path, purpose). Data flow context goes in ARCHITECTURE.md.
- **WebSocket events** — reference table (event name, direction, payload). Same boundary as API endpoints.
- **Out of scope list** — explicit forbidden implementations, not suggestions
- **Privacy requirements** — hard constraints, not guidelines

### What NOT to Include
- ❌ Detailed module descriptions or file trees — these go in ARCHITECTURE.md
- ❌ User-facing setup instructions or benefit descriptions — these go in README.md
- ❌ Product pitch, vision, or user journey — these go in SPECIFICATIONS.md
- ❌ Demo walkthrough or presentation steps — these go in DEMO_GUIDE.md
- ❌ Best practices philosophy or universal coding patterns — these go in PROJECT_BEST_PRACTICES.md
- ❌ Detailed data flow with request/response details — this goes in ARCHITECTURE.md

### Content Boundaries
- **File ownership:** Every entry must include a policy column (✅ safe, ⚠️ caution, ❌ forbidden). File names alone are not enough.
- **Agent rules:** Must be imperative. "Always run tests after changes." Not "Consider running tests after changes."
- **Out of scope:** Must be explicit forbidden items. "Do not implement user authentication." Not "Authentication is not recommended."
- **Privacy requirements:** Hard constraints. "No message storage." Not "Avoid storing messages when possible."
- **Architecture summary:** 3-5 lines maximum. Navigation-level only. Cross-reference ARCHITECTURE.md for details.

---

## 6. PROJECT_BEST_PRACTICES.md

### Scope
Universal development best practices derived from real sessions on this project. Answers "What lessons were learned?", "What patterns should I reuse in future projects?", "How should I approach common problems?".

### Audience
- Developers starting new projects
- AI agents learning transferable patterns

### Key Differentiator
**Universal over project-specific.** Not about this project — patterns proven here that apply elsewhere. This is the only document whose value extends beyond this repo. Every other document describes this project specifically. This one captures what any project can learn from. If a lesson mentions a specific module name or route from this project, it hasn't been properly generalized.

### What to Include
Practices are organized into 6 category clusters:

**Code Structure**
- **Modularization** — responsibility patterns, circular import prevention, leaf vs internal module design
- **Architecture Decisions** — universal patterns only (e.g., "separate I/O from business logic"). Project-specific decisions go in ARCHITECTURE.md.

**Quality**
- **Error Handling** — error types encountered, fix strategies, prevention patterns
- **Testing** — syntax checks, unit tests, integration tests, verification steps that caught real bugs

**Operations**
- **Configuration** — tool config patterns, environment setup practices
- **Version Control** — commit discipline, branching strategies, what to never commit

**Process**
- **Debugging Process** — how issues were isolated, tools and commands that worked
- **Documentation** — doc structure principles, scope distinctions, cross-referencing patterns
- **AI-Assisted Development** — prompting patterns that worked, skill usage, agent behavior insights

**UI**
- **Frontend Practices** — UI patterns, JS module organization, template conventions

**Meta**
- **Session Lessons Learned** — process meta-lessons only. If a practice fits any named category above, put it there instead. This is the overflow for lessons that don't have a home elsewhere.

### What NOT to Include
- ❌ Project-specific architecture decisions or module designs — these go in ARCHITECTURE.md
- ❌ User-facing instructions or setup steps — these go in README.md
- ❌ Product vision, user journey, or pitch — these go in SPECIFICATIONS.md
- ❌ Demo scripts or presentation steps — these go in DEMO_GUIDE.md
- ❌ AI agent file permissions or operational rules — these go in AGENTS.md

### Content Boundaries
- **Every entry** must follow the format: Context (1 line) + Principle (2-3 lines) + Example (short snippet) + Why it matters (1 line). No exceptions.
- **Project-specific names** are stripped from the Principle and kept only in the Example field for context.
- **One practice per entry.** If a lesson spans multiple categories, pick the PRIMARY category.
- **No duplicates.** If an entry already covers a principle, improve the existing entry instead of creating a new one.
- **Conciseness required.** Turn "We encountered a problem where indentation was incorrect in `__init__.py` which caused a syntax error" into "Indentation errors in `__init__.py` — verify after every edit."

---

## 7. DOCUMENT_GUIDELINES.md (this document)

### Scope
Meta-governance for all project documentation. Answers "Where does this content go?", "What belongs in each document?", "How do I add a new document?".

### Audience
- Developers and AI agents deciding where to write new content
- Anyone maintaining or extending the project's documentation

### Key Differentiator
**Meta over content.** Does not contain project content — it describes where project content lives. This is the only document about documents. If you are unsure where something belongs, start here. If you are adding a new document, update this file first.

### What to Include
- **Quick Reference Table** — one-row-per-document summary of audience, purpose, routing, update trigger, and content type
- **Per-document differentiation sections** — for each doc: scope, audience, key differentiator, what to include, what not to include, content boundaries
- **Boundary Tensions** — known overlap points between documents with explicit resolution guidance
- **Anti-Duplication Rules** — principles for avoiding content overlap across documents
- **Checklist** — verification steps before adding content to any document

### What NOT to Include
- ❌ Actual content from any document. Describe boundaries, don't duplicate content.
- ❌ Project-specific implementation details. Reference the document that owns them.
- ❌ Agent operational rules — these go in AGENTS.md.

### Content Boundaries
- **Never copy** content from other documents. Reference them.
- **Update this file** whenever a new document is added — add a table row and a new differentiation section.
- **Keep the checklist current** — it should reflect the actual decision process for routing content.

---

## Boundary Tensions

These are the common confusion points where content could reasonably fit in multiple documents. When in doubt, use this table:

| Tension | Resolution |
|---------|-----------|
| **Architecture summary vs AGENTS.md architecture section** | AGENTS.md gets a 3-5 line overview (enough to navigate). Full module descriptions, file tree, and data flow go in ARCHITECTURE.md. |
| **Product decisions in SPECIFICATIONS.md vs Design decisions in ARCHITECTURE.md** | SPECIFICATIONS.md = vision rationale ("why anonymous?", "why 30 seconds?"). ARCHITECTURE.md = technical rationale ("why Flask?", "why SQLite?"). |
| **Brief demo setup in SPECIFICATIONS.md vs Full DEMO_GUIDE.md** | SPECIFICATIONS.md gets 2-3 lines so a judge can run it independently. DEMO_GUIDE.md gets the full ordered walkthrough with UI highlights and fallback options. |
| **Feature description in README.md vs Feature purpose in SPECIFICATIONS.md** | README.md = what the feature does (benefit to the user). SPECIFICATIONS.md = why the feature exists (rationale, user need being addressed). |
| **API endpoints in AGENTS.md vs ARCHITECTURE.md** | AGENTS.md gets a reference table (method, path, purpose) as a quick lookup for agents. ARCHITECTURE.md gets the data flow context — how endpoints interact, request/response details, event sequences. |
| **Best practice vs project-specific lesson** | If the lesson references a specific module name, route, or implementation detail from this project, it goes in ARCHITECTURE.md. If it can be generalized to "always verify X after Y" without naming this project, it goes in PROJECT_BEST_PRACTICES.md. |
| **Tech stack in README.md vs Tech stack in SPECIFICATIONS.md** | README.md gets a one-liner (e.g., "Built with Flask + SQLite"). SPECIFICATIONS.md gets the full tech stack with a "Why?" column for each technology. |

---

## Anti-Duplication Rules

1. **One purpose per document** — If content fits two documents, choose the PRIMARY purpose. Don't split the same content across multiple docs.

2. **Cross-reference, don't copy** — Use `[See ARCHITECTURE.md](ARCHITECTURE.md)` instead of pasting sections from one document into another. A reference is better than a duplicate.

3. **Summary here, details there** — Documents at the top of the funnel (README.md, AGENTS.md) get summary tables and navigation-level overviews. Documents deeper in (ARCHITECTURE.md) get the full detail.

4. **Audience-first** — If audience overlaps, choose the document with the MOST RELEVANT audience. A developer reading about architecture doesn't need the same content as a user reading the README.

5. **Update this guide** — If you add a new document, add a row to the Quick Reference Table and a new numbered section following the same structure: Scope, Audience, Key Differentiator, What to Include, What NOT to Include, Content Boundaries.

---

## Checklist Before Adding Content

Before adding content to any document, verify:

- [ ] I've identified the PRIMARY purpose of the content (what question does it answer?)
- [ ] I've checked the Quick Reference Table to find which document routes this type of content
- [ ] I've reviewed the target document's "What NOT to Include" section for disqualifiers
- [ ] I've checked the Boundary Tensions table if the content could fit multiple documents
- [ ] I've verified the content doesn't already exist in another document
- [ ] If content spans multiple purposes, I've split it appropriately across documents
- [ ] I've added cross-references instead of duplicating content
- [ ] I've written for the target document's specific audience, not a general audience

---

> **Good documentation is invisible.** When in doubt, ask: "Who needs this information?" and "What action will they take after reading it?"
