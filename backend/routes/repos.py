import asyncio
from fastapi import APIRouter, HTTPException, Response
from schemas import AddRepoRequest
from services.indexer import index_repository, delete_repository
from CORE.code_parser import repo_to_dict
from utils.db import repos_col

router = APIRouter()


@router.get("/repos")
def get_repos():
    return [repo_to_dict(r) for r in repos_col.find().sort("indexedAt", -1)]


@router.post("/repos")
async def add_repo(body: AddRepoRequest):
    try:
        repo = await asyncio.to_thread(index_repository, body.url)
    except ValueError as e:
        raise HTTPException(400, str(e))
    except Exception as e:
        raise HTTPException(500, f"Indexing failed: {e}")

    return repo

@router.post("/repos/{repo_id}/reindex")
async def reindex_repo(repo_id: str):
    try:
        return await asyncio.to_thread(reindex_repository, repo_id)
    except ValueError as e:
        raise HTTPException(404, str(e))
    except Exception as e:
        raise HTTPException(500, f"Re-indexing failed: {e}")


@router.delete("/repos/{repo_id}", status_code=204)
def remove_repo(repo_id: str):
    delete_repository(repo_id)
    return Response(status_code=204)
