import asyncio
import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import requests

from app.core.llm import get_zen_client
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

OLLAMA_URL = "http://127.0.0.1:11434/api/generate"

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

    zen_client = get_zen_client()
    if zen_client:
        try:
            resp = await asyncio.wait_for(
                asyncio.to_thread(
                    zen_client.chat.completions.create,
                    model=ZEN_MODEL,
                    messages=[
                        {"role": "system", "content": "You are a cybersecurity SOC assistant."},
                        {"role": "user", "content": prompt},
                    ],
                ),
                timeout=120,
            )
            return {
                "analysis": resp.choices[0].message.content,
                "provider": "zen",
                "model": ZEN_MODEL,
            }
        except asyncio.TimeoutError:
            return {"error": "Zen API timed out. Try again later.", "provider": "zen"}
        except Exception as e:
            return {"error": str(e), "provider": "zen"}

    try:

        response = requests.post(
            OLLAMA_URL,
            json={
                "model": "tinyllama",
                "prompt": prompt,
                "stream": False
            },
            timeout=120
        )

        data = response.json()

        return {
            "analysis":
            data.get(
                "response",
                "No response from model"
            ),
            "provider": "ollama",
        }

    except Exception as e:

        return {
            "error": str(e),
            "provider": "ollama",
        }


@app.get("/")
async def root():

    return {
        "service":
        "CruXDR AI Engine"
    }
