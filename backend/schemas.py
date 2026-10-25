from typing import Optional
from pydantic import BaseModel, Field


class AddRepoRequest(BaseModel):
    url: str = Field(min_length=10, max_length=300)


class AskRequest(BaseModel):
    question: str = Field(min_length=1, max_length=1000)
    repoId: Optional[str] = None
    history: list = []  # a few previous messages, for follow-up questions


class FeedbackRequest(BaseModel):
    messageId: str
    rating: int
