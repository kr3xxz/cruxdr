from fastapi import APIRouter

from pydantic import BaseModel

from app.services.assistant import (
    AISOCService,
)

router = APIRouter()


class ChatRequest(BaseModel):
    question: str
    events: list = []


@router.post("/chat")
async def ai_chat(
    request: ChatRequest,
):

    context_parts = []
    if request.events:
        context_parts.append(f"Recent security events:\n{request.events}")

    context_str = "\n\n".join(context_parts) if context_parts else ""

    text, provider = await AISOCService.ask(
        request.question,
        context_str,
    )

    return {
        "response": text,
        "provider": provider,
    }