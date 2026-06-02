import asyncio

from app.core.kafka import (
    consumer,
)

from app.engine.correlation import (
    CorrelationEngine,
)


class EventProcessor:

    @staticmethod
    async def start():

        while True:

            for message in consumer:

                event = message.value

                incident = (
                    CorrelationEngine
                    .process(event)
                )

                if incident:

                    print(
                        f"[CORRELATED] {incident}"
                    )

            await asyncio.sleep(1)
