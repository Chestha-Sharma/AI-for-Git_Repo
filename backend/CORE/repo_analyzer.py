from collections import Counter
from utils.db import files_col
from CORE.code_parser import ROOTS


def module_of(path: str) -> str:
    parts = path.split("/")
    if len(parts) == 1:
        return "(root)"
    return "/".join(parts[:2]) if parts[0] in ROOTS and len(parts) > 2 else parts[0]


def analyze_repo(repo: str) -> dict:
    """
    A short repo overview that the LLM receives as context.
    hubs = the files that are imported by the most other files (core code),
    modules = the largest folders.
    """
    files = list(files_col.find({"repo": repo}, {"path": 1, "lines": 1, "imports": 1}))
    imported_by = Counter(i for f in files for i in f.get("imports", []))

    mods = {}
    for f in files:
        m = mods.setdefault(module_of(f["path"]), {"files": 0, "lines": 0})
        m["files"] += 1
        m["lines"] += f["lines"]
    top = sorted(mods.items(), key=lambda kv: -kv[1]["files"])[:5]

    return {
        "hubs": [{"path": p, "importedBy": n} for p, n in imported_by.most_common(5)],
        "modules": [{"module": k, "files": v["files"], "lines": v["lines"]} for k, v in top],
    }