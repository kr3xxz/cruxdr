from fastapi.middleware.cors import CORSMiddleware
import asyncio

from app.core.kafka import (
    consumer,
)

from app.services.enrichment import (
    ThreatEnrichmentService,
)

from app.services.publisher import (
    ThreatPublisher,
)

print(
    "[*] Threat intel service started...",
    flush=True
)


async def process_message(
    incident,
):

    try:

        print(
            f"[*] Enriching Incident: "
            f"{incident['data']['incident_id']}",
            flush=True
        )

        enriched = (
            await ThreatEnrichmentService
            .enrich_incident(
                incident
            )
        )

        ThreatPublisher.publish_enriched_incident(
            enriched
        )

        print(
            f"{incident['data']['incident_id']}",
            flush=True
        )

    except Exception as e:

        print(
            f"[ERROR] {e}",
            flush=True
        )


async def process():

    for message in consumer:

        incident = message.value

        await process_message(
            incident
        )


asyncio.run(
    process()
)
