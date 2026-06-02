import asyncio

from app.core.kafka import (
    consumer,
)

from app.store.events import (
    events,
)


class HuntIngestionEngine:

    @staticmethod
    async def start():

        while True:

            for message in consumer:

                event = message.value

                events.insert(
                    0,
                    event,
                )

                del events[1000:]

                print(
                    f"[HUNT-INGEST] {event}"
                )

            await asyncio.sleep(1)
