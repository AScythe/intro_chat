# Description: Merges duplicate nodes in graphify-out/graph.json whose source_file points
# to the same canonical file via different import path representations (e.g., "App.tsx",
# "src/App.tsx", "frontend/src/App.tsx" all mapping to the same physical file).
# Re-points all edges from ghost nodes to the canonical node, then removes duplicates.
# Run: uv run python utility/dedup_graph_nodes.py

import json
import os
import sys
from collections import defaultdict

GRAPH_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "graphify-out")
GRAPH_PATH = os.path.join(GRAPH_DIR, "graph.json")
PROJECT_ROOT = os.path.dirname(os.path.dirname(__file__))


def resolve_real_path(path):
    full = os.path.normpath(os.path.join(PROJECT_ROOT, path))
    if os.path.exists(full):
        return os.path.relpath(full, PROJECT_ROOT).replace("\\", "/")
    return None


def main():
    if not os.path.exists(GRAPH_PATH):
        print(f"ERROR: {GRAPH_PATH} not found. Run graphify first.")
        sys.exit(1)

    graph = json.load(open(GRAPH_PATH, "r", encoding="utf-8"))
    nodes = graph["nodes"]
    links = graph["links"]

    # Phase 1: classify nodes as canonical (source_file resolves to real file)
    # or ghost (source_file is a non-resolving import path).
    canonical_by_path = {}
    ghost_nodes = []
    node_map = {}

    for n in nodes:
        nid = n["id"]
        node_map[nid] = n
        sf = n.get("source_file", "")
        if sf:
            real = resolve_real_path(sf)
            if real:
                canonical_by_path.setdefault(real, []).append(n)
            else:
                ghost_nodes.append(n)

    print(f"Total nodes: {len(nodes)}")
    print(f"Canonical paths: {len(canonical_by_path)}")
    print(f"Ghost nodes: {len(ghost_nodes)}")

    # Phase 2: match ghost nodes to canonical paths using suffix matching.
    # A ghost source_file S is a duplicate of canonical path C if C ends with S.
    # We check against distinct canonical paths (not individual nodes) to avoid
    # false ambiguity from multi-section files.
    canonical_paths = list(canonical_by_path.keys())

    merge_map = {}
    ghost_skipped = {"ambiguous": 0, "no_match": 0}
    for gn in ghost_nodes:
        gsf = gn.get("source_file", "")
        if not gsf:
            continue

        matching_paths = [cpath for cpath in canonical_paths if cpath.endswith(gsf) or cpath == gsf]

        if len(matching_paths) == 1:
            target_path = matching_paths[0]
            # Pick the file-level node from the canonical group (prefer one with matching basename)
            candidates = canonical_by_path[target_path]
            target = None
            target_basename = os.path.basename(target_path).lower()
            for c in candidates:
                if c.get("label", "").lower() == target_basename or c.get("label", "") == c.get("source_file", ""):
                    target = c
                    break
            if not target:
                target = candidates[0]
            merge_map[gn["id"]] = target["id"]
        elif len(matching_paths) > 1:
            ghost_skipped["ambiguous"] += 1
        else:
            ghost_skipped["no_match"] += 1

    print(f"\nMerge candidates: {len(merge_map)}")
    print(f"  Ambiguous (skipped): {ghost_skipped['ambiguous']}")
    print(f"  No match (skipped): {ghost_skipped['no_match']}")

    if not merge_map:
        print("\nNo duplicates to merge. Graph is clean.")
        return

    canonical_ids = set(merge_map.values())
    ghost_ids = set(merge_map.keys())

    # Phase 3: re-point links from ghost IDs to canonical IDs.
    relink_count = 0
    for link in links:
        for key in ("source", "target"):
            old_id = link.get(key, "")
            if old_id in merge_map:
                link[key] = merge_map[old_id]
                relink_count += 1

    print(f"Links re-pointed: {relink_count}")

    # Phase 4: remove ghost nodes from node list.
    original_count = len(nodes)
    graph["nodes"] = [n for n in nodes if n["id"] not in ghost_ids]

    # Phase 5: remove any remaining exact duplicate node entries.
    seen_ids = set()
    unique_nodes = []
    dedup_removed = 0
    for n in graph["nodes"]:
        if n["id"] in seen_ids:
            dedup_removed += 1
            continue
        seen_ids.add(n["id"])
        unique_nodes.append(n)
    graph["nodes"] = unique_nodes

    print(f"Ghost nodes removed: {len(ghost_ids)}")
    print(f"Exact duplicate entries removed: {dedup_removed}")
    print(f"Final node count: {len(graph['nodes'])} (was {original_count})")

    # Phase 6: write back.
    with open(GRAPH_PATH, "w", encoding="utf-8") as f:
        json.dump(graph, f, ensure_ascii=False, indent=2)

    print(f"\nWritten: {GRAPH_PATH}")


if __name__ == "__main__":
    main()
