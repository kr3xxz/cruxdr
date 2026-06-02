from datetime import datetime

from app.core.kafka import producer


class ThreatPublisher:

    @staticmethod
    def publish_enriched_incident(
        incident,
    ):

        try:

            payload = {

                "event_type":
                "enriched_incident",

                "pipeline":
                "crux-xdr",

                "published_at":
                datetime.utcnow().isoformat(),

                "data":
                incident,
            }

            producer.send(
                "siem-enriched-incidents",
                payload,
            )

            producer.flush()

            print(
                f"[*] Published Enriched Incident: "
                f"{incident.get('data', {}).get('incident_id', 'unknown')}",
                flush=True
            )

        except Exception as e:

            print(
                f"[ERROR] {e}",
                flush=True
            )
