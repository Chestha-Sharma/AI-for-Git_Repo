from collections import Counter
from utils.db import files_col
from CORE.code_parser import ROOTS

MAX_NODES = 10  # graph chhota rahe isliye sirf sabse bade modules


def module_of(path: str) -> str:
    parts = path.split("/")
    if len(parts) == 1:
        return "(root)"
    return "/".join(parts[:2]) if parts[0] in ROOTS and len(parts) > 2 else parts[0]


def graph_from_files(files: list) -> dict:
    mods = {}
    for f in files:
        m = mods.setdefault(module_of(f["path"]), {"files": 0, "lines": 0})
        m["files"] += 1
        m["lines"] += f["lines"]

    keep = set(sorted(mods, key=lambda k: -mods[k]["files"])[:MAX_NODES])
    edges = {(module_of(f["path"]), module_of(i)) for f in files for i in f.get("imports", [])}
    return {
        "nodes": [{"id": k, **mods[k]} for k in keep],
        "edges": [{"from": a, "to": b} for a, b in sorted(edges) if a != b and a in keep and b in keep],
    }


def build_graph(repo: str) -> dict:
    files = list(files_col.find({"repo": repo}, {"path": 1, "lines": 1, "imports": 1}))
    return graph_from_files(files)


def analyze_repo(repo: str) -> dict:
    """
    A short repo overview that the LLM receives as context.
    hubs = the files that are imported by the most other files (core code),
    modules = the largest folders.
    """
    files = list(files_col.find({"repo": repo}, {"path": 1, "lines": 1, "imports": 1}))
    imported_by = Counter(i for f in files for i in f.get("imports", []))
    graph = graph_from_files(files)
    modules = sorted(graph["nodes"], key=lambda n: -n["files"])[:5]
    return {
        "hubs": [{"path": p, "importedBy": n} for p, n in imported_by.most_common(5)],
        "modules": [{"module": m["id"], "files": m["files"], "lines": m["lines"]} for m in modules],
    }
