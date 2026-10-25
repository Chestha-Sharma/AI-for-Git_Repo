import time

from utils.db import repos_col
from CORE.repo_analyzer import analyze_repo
from CORE.rag_engine import ask_question


async def run_pipeline(question: str, repo_id, history=None):
    """find repo -> analyse -> answer with RAG."""
    start = time.time()
    repo = repos_col.find_one({"_id": repo_id}) if repo_id else repos_col.find_one(sort=[("indexedAt", -1)])

    if not repo:
        return {
            "content": "No repository found. Add a repo first, then ask again.",
            "citations": [],
            "meta": {"latencyMs": int((time.time() - start) * 1000), "confidence": 0, "source": "extractive"},
        }

    analysis = analyze_repo(repo["_id"])

    result = await ask_question(repo["_id"], question, analysis, history, repo["name"])

    return {
        "content": result["content"],
        "citations": result["citations"],
        "meta": {
            "latencyMs": int((time.time() - start) * 1000),
            "confidence": result["confidence"],
            "source": result["source"],
            "note": result.get("note"),
            "repoId": repo["_id"],
            "repoName": repo["name"],
        },
    }
