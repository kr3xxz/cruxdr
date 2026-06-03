import asyncio
import json
import traceback

from kafka import KafkaConsumer

from app.data.store import (
    logs_store,
    alerts_store,
)

from app.core.matcher import SigmaMatcher
from app.core.producer import get_producer


class SigmaProcessor:

    @staticmethod
    async def start():

        try:

            print("[*] SIGMA PROCESSOR STARTED")

            consumer = KafkaConsumer(
                "logs",
                bootstrap_servers="kafka:9092",
                value_deserializer=lambda m: json.loads(m.decode("utf-8")),
                auto_offset_reset="latest",
                group_id=None
            )

            print("[*] KAFKA CONNECTED")

            producer = get_producer()

            while True:

                messages = consumer.poll(timeout_ms=100)

                for tp, records in messages.items():

                    for message in records:

                        event = message.value

                        print(f"[LOG] {event}")

                        logs_store.append(event)

                        logs_store[:] = logs_store[-200:]

                        alerts = SigmaMatcher.match(event)

                        for alert in alerts:

                            print(f"[ALERT] {alert}")

                            alerts_store.append(alert)

                            alerts_store[:] = alerts_store[-100:]

                            producer.send(
                                "alerts",
                                alert
                            )

                await asyncio.sleep(0.5)

        except Exception as e:

            print("[!!!] SIGMA PROCESSOR CRASHED")

            print(str(e))

            traceback.print_exc()
