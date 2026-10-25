import io
import posixpath
import re
import zipfile

import requests

LANGS = {
    ".py": "Python", ".js": "JavaScript", ".jsx": "JavaScript", ".ts": "TypeScript", ".tsx": "TypeScript",
    ".java": "Java", ".go": "Go", ".rs": "Rust", ".c": "C", ".h": "C", ".cpp": "C++", ".cs": "C#",
    ".rb": "Ruby", ".php": "PHP", ".md": "Markdown", ".json": "JSON", ".yml": "YAML", ".yaml": "YAML",
    ".toml": "TOML", ".html": "HTML", ".css": "CSS", ".sql": "SQL", ".sh": "Shell",
}
SKIP_DIRS = {"node_modules", ".git", "dist", "build", "venv", "__pycache__", ".next", "vendor", "coverage"}
ROOTS = {"src", "lib", "app", "packages"}  # "src/pkg/x.py" ko "pkg.x" bhi maano
JS_EXT = [".js", ".jsx", ".ts", ".tsx"]
MAX_FILE_BYTES = 100_000
MAX_FILES = 400

PY_IMPORT = re.compile(r"^[ \t]*(?:from[ \t]+(\.*)([\w.]*)[ \t]+import[ \t]+([\w, *(]+)|import[ \t]+([\w., ]+))", re.M)
JS_IMPORT = re.compile(r"""(?:from\s+|require\(\s*|import\s*\(\s*|import\s+)['"](\.{1,2}/[^'"]+)['"]""")


def parse_github_url(url: str):
    m = re.match(r"https?://github\.com/([^/\s]+)/([^/\s#?]+)", url.strip())
    if not m:
        raise ValueError("Enter a GitHub repo URL like https://github.com/owner/repo")
    return m.group(1), m.group(2).removesuffix(".git")


def make_repo_id(owner: str, name: str) -> str:
    # chroma collection name rules: letters, digits, - _ . only
    return re.sub(r"[^a-zA-Z0-9_-]", "-", f"{owner}--{name}")[:60].strip("-_")


def download_repo(owner: str, name: str) -> list:
    r = requests.get(f"https://api.github.com/repos/{owner}/{name}/zipball", timeout=90)
    if r.status_code == 404:
        raise ValueError("Repo not found. It must be public.")
    r.raise_for_status()
    if len(r.content) > 60_000_000:
        raise ValueError("Repo is too large (over 60 MB).")

    files = []
    with zipfile.ZipFile(io.BytesIO(r.content)) as zf:
        for info in zf.infolist():
            if info.is_dir() or info.file_size > MAX_FILE_BYTES:
                continue
            parts = info.filename.split("/")[1:]  # pehla folder owner-repo-sha hota hai
            if not parts or any(p in SKIP_DIRS for p in parts):
                continue
            path = "/".join(parts)
            ext = posixpath.splitext(path)[1].lower()
            if ext not in LANGS or path.endswith("lock.json"):
                continue
            text = zf.read(info).decode("utf-8", errors="ignore")
            if text.strip():
                files.append({"path": path, "language": LANGS[ext], "lines": text.count("\n") + 1,
                              "size": len(text), "content": text})
    return files[:MAX_FILES]


def resolve_imports(files: list) -> None:
    """Fills imports for every file: which other files of the repo it imports."""
    paths = {f["path"] for f in files}
    py = {}
    for p in paths:
        if p.endswith(".py"):
            parts = p[:-3].split("/")
            if parts[-1] == "__init__":
                parts = parts[:-1]
            if parts:
                py[".".join(parts)] = p
                if parts[0] in ROOTS and len(parts) > 1:
                    py[".".join(parts[1:])] = p

    for f in files:
        found, path = set(), f["path"]
        if f["language"] == "Python":
            here = path.split("/")[:-1]
            for dots, mod, names, plain in PY_IMPORT.findall(f["content"]):
                if plain:
                    cands = [x.split()[0] for x in plain.split(",") if x.strip()]
                else:
                    base = ".".join(here[:len(here) - (len(dots) - 1)] + ([mod] if mod else [])) if dots else mod
                    subs = [n for n in (x.strip(" (*") for x in names.split(",")) if n]
                    cands = [base] + [f"{base}.{n}" if base else n for n in subs]
                found.update(py[c] for c in cands if c in py)
        elif f["language"] in ("JavaScript", "TypeScript"):
            for spec in JS_IMPORT.findall(f["content"]):
                base = posixpath.normpath(posixpath.join(posixpath.dirname(path), spec))
                for cand in [base] + [base + e for e in JS_EXT] + [f"{base}/index{e}" for e in JS_EXT]:
                    if cand in paths:
                        found.add(cand)
                        break
        found.discard(path)
        f["imports"] = sorted(found)


def file_to_dict(doc: dict) -> dict:
    # mongo document ko frontend wale format me badalna (content nahi bhejte, wo alag endpoint se aata hai)
    return {"id": str(doc["_id"]), "repo": doc["repo"], "path": doc["path"],
            "language": doc["language"], "lines": doc["lines"], "size": doc["size"]}


def repo_to_dict(doc: dict) -> dict:
    return {"id": doc["_id"], **{k: v for k, v in doc.items() if k != "_id"}}
