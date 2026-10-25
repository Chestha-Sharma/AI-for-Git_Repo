from datetime import datetime, timezone
from fastapi import APIRouter, Response
from schemas import AskRequest, FeedbackRequest
from services.assistant import run_pipeline
from utils.db import feedback_col

router = APIRouter()


@router.post("/assistant/ask")
async def ask(body: AskRequest):
    return await run_pipeline(body.question, body.repoId, body.history)


@router.post("/assistant/feedback", status_code=204)
def feedback(body: FeedbackRequest):
    if body.rating not in (1, -1):
        return Response(status_code=400)
    feedback_col.insert_one({"messageId": body.messageId[:40], "rating": body.rating, "createdAt": datetime.now(timezone.utc)})
    return Response(status_code=204)
