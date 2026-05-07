---
name: update-document-guidelines
description: Analyze the current document ecosystem and update `DOCUMENT_GUIDELINES.md` to be accurate, complete, and consistent with all existing documents. Trigger when the user says "update document guidelines", "a new document was added", "sync document guidelines", or similar.
---

## What I do
- Read the existing `docs/DOCUMENT_GUIDELINES.md` (if it exists) and all documents in `docs/`
- Identify missing document entries, outdated scope definitions, or broken decision tree paths
- Don't rewrite the entire document — only update sections that are outdated or missing content
- Update the document to accurately governs all documents in the project
- Write or update `docs/README.md` in standardized format
- Ensure every document in the project has a corresponding entry
- Redirect any out-of-scope content to the correct document

---

## Scope
Meta-governance document. Answers "Where does this content go?", "What belongs in each doc?", "How do I add a new document?".

---

## Audience
- Developers adding or reorganizing documentation
- AI agents deciding where to write new content

---

## Content Scope

### ✅ What to Include
- Quick Reference Table — all docs with audience, primary purpose, update trigger, content type
- Per-document sections: Scope, Audience, What TO Include, What NOT to Include, Content Boundaries
- Decision Tree covering all documents
- Anti-Duplication Rules
- Checklist before adding content

### ❌ What NOT to Include — Redirect Instead
```
Is it about...
├── Actual content from any document? → The document itself
├── User-facing setup instructions/usage/feature/benefits? Installation or setup instructions? → README.md
├── Technical structure/modules/file tree? Project-specific implementation ? Data flow with endpoint names? Module descriptions? → ARCHITECTURE.md
├── Product vision/pitch/user journey? Problem statement? → SPECIFICATIONS.md
├── Demo presentation? Detailed demo walkthrough? Demo step-by-step instructions? → DEMO_GUIDE.md
├── AI agent permissions? Agent operational rules? AI agent file ownership? → AGENTS.md
├── Universal coding patterns? Best practices? Lessons learned? → PROJECT_BEST_PRACTICES.md
└── Doc scope or content boundaries? → DOCUMENT_GUIDELINES.md ✅
```

If content belongs elsewhere, note it with: `→ Redirect to <filename>` — do not include it in `DOCUMENT_GUIDELINES.md`.

---

## Content Boundaries
- **Per-document sections:** Define categories of content — not project-specific section names or hardcoded counts
- **Decision Tree:** Must cover every document in the Quick Reference Table — no gaps
- **What TO Include lists:** Describe *what kind of content* belongs, not *which specific sections* exist in the current file
- **Update Trigger column:** Must be a condition, not a line count or date

---

## Steps

### 1. Read All Documents in `docs/`
Scan every document that exists in the project:
- What documents exist?
- Does each one have a corresponding entry in DOCUMENT_GUIDELINES.md?
- Has any document's scope or audience shifted since the last update?

### 2. Read the Current Document
- Check if `DOCUMENT_GUIDELINES.md` exists — create it if not
- Read the Quick Reference Table — is every current document listed?
- Read each per-document section — does it accurately describe that document's current scope?
- Read the Decision Tree — does it cover all documents?

### 3. Identify Gaps and Issues
- Any document in `docs/` missing from the Quick Reference Table → needs a new entry
- Any per-document section with hardcoded section names or counts → needs generalization
- Any Decision Tree branch missing a document → needs updating
- Any ❌ redirect pointing to a document that doesn't exist → needs fixing

### 4. Update the Document
- Add missing Quick Reference Table rows
- Add missing per-document sections (follow the same structure: Scope, Audience, What TO Include, What NOT to Include, Content Boundaries)
- Fix outdated scope definitions to reflect current document reality
- Update Decision Tree to include all documents
- Replace any hardcoded section names/counts with category descriptions
- Don't rewrite the entire document — only update sections that are outdated or missing content
- Keep it concise — no unnecessary detail, but ensure all critical governance information is included

### 5. Verify
Read back the updated document and confirm:
- [ ] Every document in `docs/` has a row in the Quick Reference Table
- [ ] Every document in `docs/` has a full per-document section
- [ ] Decision Tree has a branch for every document
- [ ] No per-document section contains hardcoded section names or line counts
- [ ] All ❌ redirects point to documents that actually exist
- [ ] No ❌ content remains — redirected if needed
- [ ] Checklist and Anti-Duplication Rules are still accurate and complete

---


## Anti-Duplication Rules
1. **One purpose per document** — if content fits two documents, choose the PRIMARY purpose
2. **Cross-reference, don't copy** — describe what belongs in each doc; never reproduce actual content from those docs
3. **Summary here, details there** — DOCUMENT_GUIDELINES.md describes scope; the documents themselves contain the actual content
4. **Audience-first** — if audience overlaps, choose the document with the MOST RELEVANT audience

---

## Checklist Before Adding Content
- [ ] I've identified the PRIMARY purpose of the content
- [ ] I've verified the content doesn't already exist in another document
- [ ] I've used the Decision Tree to confirm it belongs in DOCUMENT_GUIDELINES.md
- [ ] If content spans multiple purposes, I've split it appropriately
- [ ] I've added cross-references instead of duplicating
- [ ] No ❌ content remains — redirected if needed
- [ ] Each section is concise — no unnecessary detail, but all critical information is included

---

## Quick Reference Table
| Document | Audience | Primary Purpose | Update Trigger | Content Type |
|----------|----------|-----------------|----------------|--------------|
| **README.md** | End users, new developers | Entry point: what, how, setup | Features or setup change | User-facing, practical |
| **ARCHITECTURE.md** | Developers, AI agents | Technical structure reference | Code structure changes | Technical, implementation |
| **SPECIFICATIONS.md** | Product owners, developers, AI agents, stakeholders, judges | Product vision, user flow & product context | Product scope changes | Product, pitch, vision, specification |
| **DEMO_GUIDE.md** | Presenters, judges | Demo execution steps | Demo flow changes | Practical, step-by-step |
| **AGENTS.md** | AI agents (opencode) | Agent permissions & rules | File/command changes | Operational, constraints |
| **PROJECT_BEST_PRACTICES.md** | All developers, AI | Universal best practices | After each session | Educational, guidelines |
| **DOCUMENT_GUIDELINES.md** | Developers, AI agents | Doc scope & boundaries | New doc added | Meta, governance |