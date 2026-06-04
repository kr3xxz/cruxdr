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

            try:

                messages = consumer.poll(
                    timeout_ms=100
                )

                for tp, records in messages.items():

                    for message in records:

                        alert = message.value

                        title = (
                            alert.get("title")
                            or alert.get("alert_type")
                            or "Unknown Alert"
                        )

                        incident = {

                            "title": title,

                            "severity": alert.get(
                                "severity",
                                "medium"
                            ),

                            "host": (
                                alert.get(
                                    "event",
                                    {}
                                ).get(
                                    "host",
                                    "N/A"
                                )
                            ),

                            "user": (
                                alert.get(
                                    "event",
                                    {}
                                ).get(
                                    "user"
                                )
                                or alert.get(
                                    "username"
                                )
                                or "unknown"
                            ),

                            "mitre": (
                                alert.get(
                                    "mitre_attack"
                                )
                                or IncidentProcessor.map_mitre(
                                    alert
                                )
                            ),

                            "timeline": [
                                {
                                    "step": "Detection",

                                    "description": (
                                        alert.get(
                                            "event",
                                            {}
                                        ).get(
                                            "message",
                                            title
                                        )
                                    )
                                }
                            ],

                            "iocs": [
                                alert.get(
                                    "source_ip",
                                    "N/A"
                                ),

                                alert.get(
                                    "destination_ip",
                                    "N/A"
                                ),
                            ],
                        }

                        incidents_store.append(
                            incident
                        )

                        incidents_store[:] = (
                            incidents_store[-100:]
                        )

                        try:

                            GraphBuilder.build(
                                {
                                    "title": title,

                                    "event": {
                                        "host":
                                        incident["host"],

                                        "user":
                                        incident["user"],

                                        "message":
                                        incident["title"],
                                    }
                                }
                            )

                        except Exception as e:

                            print(
                                f"[GRAPH ERROR] {e}"
                            )

                        try:

                            requests.post(
                                "http://soar-service:8000/responses",
                                json=incident,
                                timeout=3,
                            )

                        except Exception as e:

                            print(
                                f"[SOAR ERROR] {e}"
                            )

                        print(
                            f"[INCIDENT] {incident}",
                            flush=True
                        )

            except Exception as e:

                print(
                    f"[PROCESSOR ERROR] {e}",
                    flush=True
                )

            await asyncio.sleep(0.5)

    @staticmethod
    def map_mitre(alert):

        title = (
            alert.get("title")
            or alert.get("alert_type")
            or ""
        ).lower()

        mappings = {

            "ssh brute force":
                "T1110",

            "account compromise":
                "T1078",

            "credential dumping":
                "T1003",

            "privilege escalation":
                "T1068",

            "lateral movement":
                "T1021",

            "data exfiltration":
                "T1041",

            "ransomware":
                "T1486",
        }

        for key, value in mappings.items():

            if key in title:

                return value

        return "T1595"
