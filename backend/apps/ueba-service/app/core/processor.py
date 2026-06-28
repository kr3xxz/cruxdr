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
        loop = asyncio.get_event_loop()

        while True:
            messages = (
                await loop.run_in_executor(
                    None,
                    consumer.poll,
                    1000,
                )
            )

            for tp, batch in (
                messages.items()
            ):

                for message in batch:

                    event = message.value

                    if event is None:
                        continue

                    risk = (
                        UEBAEngine
                        .process(event)
                    )

                    print(
                        f"[UEBA] {risk}"
                    )

            await asyncio.sleep(0.1)
