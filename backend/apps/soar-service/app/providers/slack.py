import os
import httpx


WEBHOOK_URL = os.getenv(
    "SLACK_WEBHOOK_URL"
)


class SlackProvider:

    @staticmethod
    async def send_message(
        message: str,
    ):

        if not WEBHOOK_URL:
            return

        async with httpx.AsyncClient() as client:

            await client.post(
                WEBHOOK_URL,
                json={
                    "text": message
                },
            )
