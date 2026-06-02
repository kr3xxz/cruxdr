import asyncio

from app.core.kafka import (
    consumer,
)

from app.core.matcher import (
    SigmaMatcher,
)


class SigmaProcessor:

    @staticmethod
    async def start():

        while True:

            messages = consumer.poll(
                timeout_ms=1000
            )

            for tp, batch in messages.items():

                for message in batch:

                    event = message.value

                    matches = (
                        SigmaMatcher.match(
                            event
                        )
                    )

                    for match in matches:

                        print(
                            f"[SIGMA MATCH] {match}"
                        )

            await asyncio.sleep(1)
