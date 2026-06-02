import asyncio

from app.core.kafka import (
    consumer,
)

from app.core.ueba_engine import (
    UEBAEngine,
)


class UEBAProcessor:

    @staticmethod
    async def start():

        while True:

            messages = consumer.poll(
                timeout_ms=1000
            )

            for tp, batch in (
                messages.items()
            ):

                for message in batch:

                    event = message.value

                    risk = (
                        UEBAEngine
                        .process(event)
                    )

                    print(
                        f"[UEBA] {risk}"
                    )

            await asyncio.sleep(1)
