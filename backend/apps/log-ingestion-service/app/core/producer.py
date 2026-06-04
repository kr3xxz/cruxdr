from kafka import KafkaProducer
import json

producer = KafkaProducer(
    bootstrap_servers="kafka:9092",
    value_serializer=lambda v:
        json.dumps(v).encode("utf-8")
)

def send_event(event):

    producer.send(
        "cruxdr-logs",
        event
    )

    producer.flush()


def send_alert(alert):

    payload = {
        "title":
            alert.get(
                "alert_type",
                "Unknown Alert"
            ),

        "severity":
            alert.get(
                "severity",
                "medium"
            ).upper(),

        "mitre_attack":
            alert.get(
                "mitre_attack"
            ),

        "username":
            alert.get(
                "username",
                "unknown"
            ),

        "source_ip":
            alert.get(
                "source_ip",
                "N/A"
            ),

        "event": {
            "host":
                alert.get(
                    "source_ip",
                    "N/A"
                ),

            "user":
                alert.get(
                    "username",
                    "unknown"
                ),

            "message":
                alert.get(
                    "alert_type",
                    "Threat Detected"
                ),
        }
    }

    producer.send(
        "alerts",
        payload
    )

    producer.flush()
