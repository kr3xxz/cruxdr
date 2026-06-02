from fastapi import APIRouter

from pydantic import BaseModel

from app.services.assistant import (
    AISOCService,
)

router = APIRouter()


class ChatRequest(BaseModel):
    question: str


@router.post("/chat")
async def ai_chat(
    request: ChatRequest,
):

    response = AISOCService.ask(
        request.question
    )

    return {
        "response": response
    }
