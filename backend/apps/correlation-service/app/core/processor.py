import asyncio
import requests

from app.core.consumer import consumer
from app.data.store import incidents_store
from app.core.graph_builder import GraphBuilder


class IncidentProcessor:

    @staticmethod
    async def start():

        print("[*] INCIDENT PROCESSOR STARTED")

        while True:

            messages = consumer.poll(timeout_ms=100)

            for tp, records in messages.items():

                for message in records:

                    alert = message.value

                    incident = {
                        "title": alert.get("title"),
                        "severity": alert.get("severity"),
                        "host": alert["event"].get("host"),
                        "user": alert["event"].get("user"),
                        "mitre": IncidentProcessor.map_mitre(alert),

                        "timeline": [
                            {
                                "step": "Detection",
                                "description": alert["event"].get(
                                    "message"
                                )
                            }
                        ],

                        "iocs": [
                            alert["event"].get(
                                "source_ip",
                                "N/A"
                            ),

                            alert["event"].get(
                                "destination_ip",
                                "N/A"
                            ),
                        ],
                    }

                    incidents_store.append(
                        incident
                    )

                    incidents_store[:] = \
                        incidents_store[-50:]

                    GraphBuilder.build(
                        alert
                    )

                    requests.post(
                        "http://soar-service:8000/responses",
                        json=incident
                    )

                    print(
                        f"[INCIDENT] {incident}"
                    )

            await asyncio.sleep(0.5)

    @staticmethod
    def map_mitre(alert):

        title = alert.get(
            "title",
            ""
        ).lower()

        if "ransomware" in title:
            return "T1486"

        if "brute" in title:
            return "T1110"

        if "exfiltration" in title:
            return "T1041"

        return "T1021"
