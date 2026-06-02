from fastapi import FastAPI
from pydantic import BaseModel
import requests

app = FastAPI(
    title="CruXDR AI Engine"
)

OLLAMA_URL = "http://127.0.0.1:11434/api/generate"

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
            )
        }

    except Exception as e:

        return {
            "error": str(e)
        }

@app.get("/")
async def root():

    return {
        "service":
        "CruXDR AI Engine"
    }
