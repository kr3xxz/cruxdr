import os
import importlib

from app.core.llm import get_openai_client, get_zen_client


def retrieve_context(query: str) -> list:
    try:
        mod = importlib.import_module("app.rag.retrieve")
        return mod.retrieve_context(query)
    except Exception:
        return []


class AISOCService:

    @staticmethod
    def ask(
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

        zen_client = get_zen_client()
        if zen_client:
            model = os.getenv("ZEN_MODEL", "deepseek-v4-flash-free")
            resp = zen_client.chat.completions.create(
                model=model,
                messages=[
                    {
                        "role": "system",
                        "content":
                        "You are a cybersecurity SOC assistant."
                    },
                    {
                        "role": "user",
                        "content": prompt,
                    }
                ],
                timeout=120,
            )
            return resp.choices[0].message.content, "zen"

        response = get_openai_client().chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {
                    "role": "system",
                    "content":
                    "You are a cybersecurity SOC assistant."
                },
                {
                    "role": "user",
                    "content": prompt,
                }
            ]
        )

        return response.choices[
            0
        ].message.content, "openai"
