import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from app.services.assistant import _call_zen_api
from app.routes.chat import router as chat_router

app = FastAPI(
    title="CruXDR AI Engine"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat_router)

ZEN_MODEL = os.getenv("ZEN_MODEL", "deepseek-v4-flash-free")

class AnalysisRequest(BaseModel):
    events: list

@app.post("/analyze")
async def analyze(req: AnalysisRequest):

    prompt = f"""
You are an elite SOC AI assistant.

Analyze these security events:

{req.events}

Provide:
1. Threat summary
2. Severity assessment
3. MITRE ATT&CK insights
4. Recommended response actions
5. Business impact
"""

    text, err = await _call_zen_api([
        {"role": "system", "content": "You are a cybersecurity SOC assistant."},
        {"role": "user", "content": prompt},
    ])
    if err:
        return {"error": err, "provider": "zen"}
    return {
        "analysis": text,
        "provider": "zen",
        "model": ZEN_MODEL,
    }


@app.get("/")
async def root():
    return {
        "service":
        "CruXDR AI Engine"
    }
