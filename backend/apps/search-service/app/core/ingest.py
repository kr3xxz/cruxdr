import asyncio

from app.core.kafka import (
    consumer,
)

from app.store.events import (
    events,
)


class EventIngestionEngine:

    @staticmethod
    async def start():

        while True:

            messages = consumer.poll(
                timeout_ms=1000
            )

            for tp, batch in messages.items():

                for message in batch:

                    event = message.value

                    events.insert(
                        0,
                        event,
                    )

                    del events[500:]

                    print(
                        f"[INGESTED] {event}",
                        flush=True
                    )

            await asyncio.sleep(0.1)
