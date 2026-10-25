from fastapi import APIRouter
from CORE.rag_engine import llm_enabled, llm_provider

router = APIRouter()


@router.get("/health")
def health():
    return {"ok": True}


@router.get("/status")
def status():
    # frontend isse dikhata hai ki AI model connected hai ya nahi
    return {"ok": True, "llm": llm_enabled(), "provider": llm_provider()}
