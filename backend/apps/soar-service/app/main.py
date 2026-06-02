from fastapi.middleware.cors import CORSMiddleware
import asyncio

from app.core.kafka import (
    consumer,
)

from app.playbooks.engine import (
    PlaybookEngine,
)

print(
    "[*] SOAR service started...",
    flush=True
)


async def process_message(
    incident,
):

    try:

        if not incident:
            return

        identifier = (
            incident.get(
                "data",
                {}
            ).get(
                "incident_id"
            )
            or incident.get(
                "incident_id"
            )
            or incident.get(
                "username"
            )
            or "unknown"
        )

        print(
            f"[*] Executing Playbook: "
            f"{identifier}",
            flush=True
        )

        await asyncio.wait_for(

            PlaybookEngine.execute(
                incident
            ),

            timeout=30
        )

        print(
            "[*] Playbook Completed",
            flush=True
        )

    except Exception as e:

        print(
            f"[ERROR] {e}",
            flush=True
        )


async def process():

    while True:

        for message in consumer:

            incident = message.value

            await process_message(
                incident
            )

        await asyncio.sleep(1)


asyncio.run(
    process()
)
