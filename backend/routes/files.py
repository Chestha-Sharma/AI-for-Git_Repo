from typing import Optional
from fastapi import APIRouter, HTTPException
from CORE.code_parser import file_to_dict
from utils.db import files_col

router = APIRouter()


@router.get("/files")
def get_files(repo: Optional[str] = None, language: Optional[str] = None, limit: int = 5000):
    query = {}
    if repo and repo != "ALL":
        query["repo"] = repo
    if language and language != "ALL":
        query["language"] = language
    docs = files_col.find(query, {"content": 0, "imports": 0}).sort("path", 1).limit(min(limit, 10000))
    return [file_to_dict(d) for d in docs]


@router.get("/files/content")
def get_file_content(repo: str, path: str):
    doc = files_col.find_one({"repo": repo, "path": path})
    if not doc:
        raise HTTPException(404, "File not found")
    return {"path": doc["path"], "language": doc["language"], "content": doc["content"]}
