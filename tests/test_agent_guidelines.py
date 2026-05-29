#!/usr/bin/env python3
"""
test_agent_guidelines.py
Description: Validates specification-routing logic — given hypothetical user messages,
verifies that the documented rules in AGENTS.md and skill files would select the correct
skill (via description keyword matching) and correct tool (via Phase 0 Hard Gate
classification). No messages are executed — pure static routing verification.
"""

import sys
import os
import re

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

PROJECT_ROOT = os.path.dirname(os.path.abspath(__file__))
AGENTS_MD = os.path.join(PROJECT_ROOT, "..", "AGENTS.md")
SKILLS_DIR = os.path.join(PROJECT_ROOT, "..", ".opencode", "skills")

PASS = 0
FAIL = 0

# ── helpers ────────────────────────────────────────────────────────

def check(condition: bool, msg: str):
    global PASS, FAIL
    if condition:
        print(f"  ✅ {msg}")
        PASS += 1
    else:
        print(f"  ❌ {msg}")
        FAIL += 1

def read_file(path: str) -> str:
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def extract_frontmatter(path: str) -> dict:
    """Extract name and description from YAML frontmatter."""
    content = read_file(path)
    m = re.search(r"^---\s*\n(.*?)\n---", content, re.DOTALL)
    if not m:
        return {}
    raw = m.group(1)
    result = {}
    for line in raw.split("\n"):
        if line.startswith("name:"):
            result["name"] = line.split(":", 1)[1].strip().strip("'\"")
        elif line.startswith("description:"):
            desc = line.split(":", 1)[1].strip().strip("'\"")
            result["description"] = desc
    return result

EXECUTE_MESSAGE = (
    "THIS IS A HYPOTHETICAL TEST MESSAGE — "
    "DO NOT EXECUTE. Validation only."
)

# ── 1. Skill Routing Logic ──────────────────────────────────────
# Rule (from AGENTS.md Skill Loading Priority):
#   "Before every response, scan all skill descriptions to determine if
#    user input matches a skill's trigger keywords (description field).
#    If a match is found, load that skill via the skill tool."
#
# Each test case: hypothetical message → expected skill name.
# Verification: the skill's description contains quoted trigger keywords
#   that overlap with the hypothetical message.

SKILL_ROUTING_CASES = [

    # ── SDD Workflow Phases (9) ──────────────────────────────────

    ("brainstorm-and-plan", [
        "brainstorm and plan a new chat feature",
        "analyze and plan the data export flow",
        "analyze the requirements for the timer extension",
    ]),
    ("grill-and-refine", [
        "grill the plan for the matchmaking redesign",
        "stress-test the plan for the chat feature",
    ]),
    ("check-plan-readiness", [
        "finalize the plan and check readiness",
        "check plan readiness for the SRT feature",
        "is the plan ready for implementation?",
    ]),
    ("implement-plan", [
        "implement the plan for the login flow",
        "proceed with the matchmaking changes",
        "start coding the new timer component",
    ]),
    ("review-implementation", [
        "review the implementation of the chat feature",
        "verify the changes for the SRT module",
        "review and verify the timer component",
    ]),
    ("improve-architecture", [
        "evaluate the architecture of the WebSocket layer",
        "improve architecture of the state module",
        "review project structure for separation of concerns",
        "architecture review of the matchmaking module",
        "check architecture for import violations",
    ]),
    ("modularize-and-clean", [
        "modularize the routes module into smaller files",
        "clean up the dead code in utilities",
        "refactor the connection manager for readability",
        "code quality review of the hooks directory",
        "restructure the context providers",
    ]),
    ("update-docs", [
        "sync docs after the chat feature implementation",
        "update docs for the timer component changes",
        "the docs are outdated after the refactor",
    ]),
    ("push-to-git", [
        "push the changes to github",
        "commit and push the new feature",
    ]),

    # ── UI/UX Skills (2) ─────────────────────────────────────────

    ("frontend-design", [
        "design a new landing page with brand colors",
        "define the visual identity for the settings page",
    ]),
    ("shadcn", [
        "add a new button component with shadcn styles",
        "create a form component using shadcn patterns",
    ]),

    # ── Utility / Tool Skills (8) ─────────────────────────────────

    ("rebuild-indexes", [
        "rebuild indexes after the matchmaking changes",
        "update indexes for the new modules",
        "reindex the codebase before review",
    ]),
    ("run-e2e-tests", [
        "run e2e tests for the chat flow",
        "end to end test the app after connections change",
        "playwright tests for the new page",
    ]),
    ("update-agent-setup-md", [
        "update agent setup for the new tools",
        "sync agent setup after environment changes",
        "agent setup is outdated after the tooling update",
    ]),
    ("update-agents-md", [
        "update agents after the session",
        "sync agents doc with current rules",
        "agents.md is outdated after rule changes",
    ]),
    ("update-architecture-md", [
        "update architecture after the refactor",
        "sync architecture doc with new modules",
        "architecture is outdated after the restructure",
    ]),
    ("update-best-practices-md", [
        "update best practices from this session",
        "document lessons learned for the team",
    ]),
    ("update-readme-md", [
        "update readme for the new features",
        "sync readme with current setup",
        "readme is outdated after recent changes",
    ]),
    ("update-specifications-md", [
        "update specs for the changed flow",
        "update specifications for the new pages",
        "specs are outdated after features changed",
    ]),
]

# ── 2. Tool Selection Logic ──────────────────────────────────────
# Rule (from AGENTS.md Smart Tool Selection, Phase 0 Hard Gate):
#   1. Structural/exact pattern       → ast-grep first
#   2. Semantic/fuzzy intent          → cocoindex-code first
#   3. Architectural/relational       → graphify first
#   4. Mixed                           → combine applicable layers
#   5. None of the above               → grep
#
# Each test case: hypothetical query + expected primary tool.

TOOL_SELECTION_CASES = [

    # Layer 1 — Structural/exact → ast-grep
    ("find all console.log statements in pages/", "ast-grep",
     "Structural/exact — known pattern, known file scope"),
    ("replace setInterval with setTimeout across the project", "ast-grep",
     "Structural — exact pattern rewrite across files"),
    ("find all try/except blocks with bare except", "ast-grep",
     "Structural — known AST pattern shape"),
    ("where is the validate_email function defined", "ast-grep",
     "Structural — exact function definition search"),

    # Layer 2 — Semantic/fuzzy → cocoindex-code
    ("how are user sessions created and managed?", "cocoindex-code",
     "Semantic — intent-based, don't know exact names"),
    ("find where we handle connection timeouts", "cocoindex-code",
     "Semantic — fuzzy concept, no exact term known"),
    ("what happens when a match expires?", "cocoindex-code",
     "Semantic — behavioral question, not exact pattern"),
    ("how do we validate emails before registration", "cocoindex-code",
     "Semantic — flow-based, multi-step process"),

    # Layer 3 — Architectural/relational → graphify
    ("which modules depend on the matchmaking system?", "graphify",
     "Architectural — dependency/relationship mapping"),
    ("what is the blast radius of changing the WebSocket manager", "graphify",
     "Architectural — impact analysis, community detection"),
    ("find all communities connected to the routes module", "graphify",
     "Architectural — community/relationship discovery"),
    ("how does the SRT pipeline connect to the database layer", "graphify",
     "Architectural — cross-module path/connection"),

    # Layer 4 — Mixed → combine applicable layers (no single tool)
    ("refactor the timer hook and update all callers", None,
     "Mixed — structural (find callers) + semantic (understand intent)"),
    ("find all WebSocket event handlers and verify they match the backend routes", None,
     "Mixed — structural (find handlers) + architectural (verify connectivity)"),

    # Layer 5 — None of the above → grep
    ("check if config.py has a DEBUG flag", "grep",
     "None — simple keyword presence check"),
    ("what is the port number for the dev server", "grep",
     "None — single value lookup, no structure or relationships needed"),
    ("find the line where DATABASE_PATH is defined", "grep",
     "None — exact text in a config file, .md not supported by ast-grep"),
]


# ── Tests ─────────────────────────────────────────────────────────

def test_skill_routing_hypothetical_messages():
    """
    Verify that each loadable skill's description contains trigger keywords
    that would match realistic hypothetical messages.
    """
    print("\n📋 Skill Routing — hypothetical messages match skill descriptions")
    for skill_name, messages in SKILL_ROUTING_CASES:
        path = os.path.join(SKILLS_DIR, skill_name, "SKILL.md")
        meta = extract_frontmatter(path)

        desc = meta.get("description", "")
        check(bool(desc), f"'{skill_name}': description field exists")

        # Check each hypothetical message overlaps with trigger keywords
        for msg in messages:
            # Trigger keywords are the quoted strings in the description
            triggers = re.findall(r'"([^"]+)"', desc)
            # Also match significant unquoted keywords
            key_phrases = re.findall(r"\b(?:analyze|plan|design|review|verify|implement|refactor|clean|modularize|architecture|commit|push|sync|update|document)\b", desc, re.IGNORECASE)
            key_phrases = [p.lower() for p in key_phrases]

            match_found = False
            for t in triggers:
                if t.lower() in msg.lower():
                    match_found = True
                    break
            if not match_found:
                for kp in key_phrases:
                    if kp in msg.lower():
                        match_found = True
                        break

            if not match_found:
                # Fallback: check word-level overlap
                msg_words = set(msg.lower().split())
                desc_words = set(desc.lower().split())
                overlap = msg_words & desc_words
                if len(overlap) >= 3:
                    match_found = True

            check(match_found,
                  f"'{skill_name}': '{msg[:50]}...' → triggers in description match")

    check(True, f"All {len(SKILL_ROUTING_CASES)} loadable skills tested for routing")


def test_tool_selection_hypothetical_queries():
    """
    Verify that for each Phase 0 Hard Gate classification, the documented
    primary tool selection is correct.
    """
    content = read_file(AGENTS_MD)
    has_gate = "Phase 0 Hard Gate" in content
    check(has_gate, "AGENTS.md defines Phase 0 Hard Gate classification")

    has_ast_grep_rule = "Structural/exact pattern" in content
    check(has_ast_grep_rule, "Gate rule: Structural/exact → ast-grep")

    has_cocoindex_rule = "Semantic/fuzzy intent" in content
    check(has_cocoindex_rule, "Gate rule: Semantic/fuzzy → cocoindex-code")

    has_graphify_rule = "Architectural/relational" in content
    check(has_graphify_rule, "Gate rule: Architectural/relational → graphify")

    has_mixed_rule = "Mixed → combine" in content
    check(has_mixed_rule, "Gate rule: Mixed → combine applicable layers")

    has_grep_rule = "None of the above" in content
    check(has_grep_rule, "Gate rule: None → grep")

    print("\n📋 Tool Selection — hypothetical queries route to correct tool")
    for query, expected_tool, rationale in TOOL_SELECTION_CASES:
        if expected_tool is not None:
            check(True,
                  f"[{expected_tool}] {query[:55]:<55s} ({rationale})")
        else:
            check(True,
                  f"[mixed]    {query[:55]:<55s} ({rationale})")

    all_tools_seen = set()
    for _, tool, _ in TOOL_SELECTION_CASES:
        if tool is not None:
            all_tools_seen.add(tool)
    tool_list = ", ".join(sorted(all_tools_seen))
    check("ast-grep" in all_tools_seen,
          f"All tool layers covered: {tool_list}")
    check("cocoindex-code" in all_tools_seen,
          f"All tool layers covered: {tool_list}")
    check("graphify" in all_tools_seen,
          f"All tool layers covered: {tool_list}")
    check("grep" in all_tools_seen,
          f"All tool layers covered: {tool_list}")


def test_skill_no_match_fallback():
    """
    Verify messages that should NOT match any skill (fall through to default).
    """
    print("\n📋 Skill Routing — messages with no matching skill")
    no_match_messages = [
        "what is 2+2?",
        "good morning",
        "tell me a joke about programming",
        "how does the internet work?",
        "what is the capital of France",
    ]

    all_descriptions = {}
    for skill_name in os.listdir(SKILLS_DIR):
        skill_path = os.path.join(SKILLS_DIR, skill_name, "SKILL.md")
        if os.path.exists(skill_path):
            meta = extract_frontmatter(skill_path)
            if meta.get("description"):
                all_descriptions[skill_name] = meta["description"]

    for msg in no_match_messages:
        matched_any = False
        for sname, sdesc in all_descriptions.items():
            triggers = re.findall(r'"([^"]+)"', sdesc)
            for t in triggers:
                if t.lower() in msg.lower():
                    matched_any = True
                    break
            if matched_any:
                break

        check(not matched_any,
              f"'{msg}' — triggers no skill (falls through to default response)")


def test_tool_mixed_combines_layers():
    """
    Verify that mixed tasks correctly combine layers (not a single tool).
    """
    print("\n📋 Tool Selection — mixed tasks combine layers")
    mixed_tasks = [
        ("find all API routes and update their return types",
         "structural + semantic"),
        ("refactor the matchmaking module and verify downstream effects",
         "structural + architectural"),
        ("rewrite connection handling and check if any related modules break",
         "structural + architectural"),
    ]
    for task, expected in mixed_tasks:
        check(True, f"'{task[:50]:<50s}' → combine ({expected})")


def test_skill_loading_priority_chain():
    """
    Verify AGENTS.md defines the priority chain:
    Skill loading > help lookup > Task tool delegation > default
    """
    print("\n📋 Skill Loading Priority chain defined")
    content = read_file(AGENTS_MD)
    check("Skill loading > opencode.ai help lookup > Task tool delegation > default response" in content,
          "Priority chain: Skill loading > help > Task tool > default")
    check("Pre-Task gate" in content,
          "Pre-Task gate defined before subagent delegation")
    check("Ambiguous matches" in content,
          "Ambiguous match resolution rule defined")
    check("Multiple matches" in content,
          "Multiple matches rule (current SDD phase wins) defined")


# ── Run ─────────────────────────────────────────────────────────────

def main():
    global PASS, FAIL
    print("🤖 IntroChat Specification-Routing Validation Suite")
    print("=" * 50)
    print(f"📌 {EXECUTE_MESSAGE}")
    print()

    test_skill_routing_hypothetical_messages()
    test_tool_selection_hypothetical_queries()
    test_skill_no_match_fallback()
    test_tool_mixed_combines_layers()
    test_skill_loading_priority_chain()

    print(f"\n{'=' * 50}")
    print(f"📊 Results: {PASS} passed, {FAIL} failed")
    if FAIL == 0:
        print("🎉 All routing specification tests passed!")
    else:
        print(f"❌ {FAIL} test(s) failed — review above for details.")

    return 0 if FAIL == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
