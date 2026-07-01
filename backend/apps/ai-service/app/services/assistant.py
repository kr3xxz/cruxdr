import asyncio
import json
import os
import importlib
import urllib.request
import urllib.error

from app.core.llm import get_zen_api_key, get_zen_model


ZEN_API_URL = "https://opencode.ai/zen/v1/chat/completions"


def retrieve_context(query: str) -> list:
    try:
        mod = importlib.import_module("app.rag.retrieve")
        return mod.retrieve_context(query)
    except Exception:
        return []


async def _call_zen_api(messages):
    api_key = get_zen_api_key()
    if not api_key:
        return None, "No Zen API key configured"
    model = get_zen_model()
    try:
        body = json.dumps({"model": model, "messages": messages}).encode()
        req = urllib.request.Request(
            ZEN_API_URL,
            data=body,
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
                "User-Agent": "CruXDR-SOC/1.0",
            },
            method="POST",
        )
        resp = await asyncio.wait_for(
            asyncio.to_thread(
                urllib.request.urlopen, req, timeout=120
            ),
            timeout=125,
        )
        data = json.loads(resp.read().decode())
        return data["choices"][0]["message"]["content"], None
    except asyncio.TimeoutError:
        return None, "Zen API timed out (no response within 2 minutes)"
    except urllib.error.HTTPError as e:
        code = e.code
        detail = e.read().decode()[:200]
        if code == 403 and "1010" in detail:
            return None, "Zen API blocked this request (Cloudflare 1010). The API key or IP may need whitelisting."
        return None, f"Zen API returned {code}: {detail}"
    except urllib.error.URLError as e:
        reason = str(e.reason) if hasattr(e, 'reason') else str(e)
        return None, f"Zen API connection failed: {reason}"
    except Exception as e:
        return None, f"Zen API error: {e}"


class AISOCService:

    @staticmethod
    async def ask(
        question: str,
        extra_context: str = "",
    ):

        rag_context = retrieve_context(question)
        rag_str = str(rag_context) if rag_context else ""

        context_parts = [p for p in [rag_str, extra_context] if p]
        context_str = "\n\n".join(context_parts) if context_parts else "No additional context available."

        prompt = f"""
You are an elite SOC analyst AI with read-only access to security data.

Current security context:
{context_str}

Question:
{question}

Provide:
- concise investigation summary
- threat explanation
- MITRE ATT&CK insights
- remediation suggestions
"""

        text, err = await _call_zen_api([
            {"role": "system", "content": "You are a cybersecurity SOC assistant."},
            {"role": "user", "content": prompt},
        ])
        if err:
            return f"Zen API error: {err}", "zen"
        return text, "zen"
