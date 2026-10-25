from fastapi import APIRouter
from CORE.repo_analyzer import build_graph

router = APIRouter()


@router.get("/structure/graph")
def get_graph(repo: str):
    return build_graph(repo)
