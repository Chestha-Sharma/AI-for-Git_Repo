from collections import Counter
from datetime import datetime, timezone

from utils.db import repos_col, files_col
from CORE.code_parser import parse_github_url, make_repo_id, download_repo, resolve_imports, repo_to_dict
from CORE.vector_store import build_vector_store, delete_vector_store


def index_repository(url: str, progress=lambda text: None) -> dict:
    """Download GitHub repo -> parse -> files into MongoDB -> chunks into ChromaDB."""
    owner, name = parse_github_url(url)
    repo_id = make_repo_id(owner, name)

    progress("Downloading repository")
    files = download_repo(owner, name)
    if not files:
        raise ValueError("No readable source files found in this repo.")
    resolve_imports(files)

    progress(f"Saving {len(files)} files")
    files_col.delete_many({"repo": repo_id})
    docs = [{**f, "repo": repo_id} for f in files]
    for i in range(0, len(docs), 100):
        files_col.insert_many(docs[i:i + 100])

    progress("Embedding code chunks (first time downloads the model)")
    chunks = build_vector_store(repo_id, files)

    doc = {
        "_id": repo_id, "name": f"{owner}/{name}", "url": url, "files": len(files),
        "lines": sum(f["lines"] for f in files), "chunks": chunks,
        "languages": dict(Counter(f["language"] for f in files)),
        "indexedAt": int(datetime.now(timezone.utc).timestamp() * 1000),
    }
    repos_col.replace_one({"_id": repo_id}, doc, upsert=True)
    return repo_to_dict(doc)


def delete_repository(repo_id: str) -> None:
    files_col.delete_many({"repo": repo_id})
    repos_col.delete_one({"_id": repo_id})
    delete_vector_store(repo_id)
