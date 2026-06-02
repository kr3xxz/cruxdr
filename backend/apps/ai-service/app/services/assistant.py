from app.rag.retrieve import (
    retrieve_context,
)

from app.core.llm import client


class AISOCService:

    @staticmethod
    def ask(
        question: str,
    ):

        context = retrieve_context(
            question
        )

        prompt = f"""
You are an elite SOC analyst AI.

Context:
{context}

Question:
{question}

Provide:
- concise investigation summary
- threat explanation
- MITRE ATT&CK insights
- remediation suggestions
"""

        response = client.chat.completions.create(
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
        ].message.content
