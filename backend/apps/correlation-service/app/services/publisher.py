from datetime import datetime

from app.core.kafka import producer


class IncidentPublisher:

    @staticmethod
    def publish_incident(
        incident,
    ):

        try:

            payload = {

                "event_type":
                "incident",

                "pipeline":
                "crux-xdr",

                "published_at":
                datetime.utcnow().isoformat(),

                "data":
                incident,
            }

            producer.send(
                "siem-incidents",
                payload,
            )

            producer.flush()

            print(
                f"[INCIDENT] "
                f"{incident['incident_id']}",
                flush=True
            )

        except Exception as e:

            print(
                f"[ERROR] "
                f"Failed to publish incident: "
                f"{e}",
                flush=True
            )
