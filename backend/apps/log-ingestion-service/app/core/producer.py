import asyncio
from kafka import KafkaProducer
import json

_producer = None

def get_producer():
    global _producer
    if _producer is None:
        _producer = KafkaProducer(
            bootstrap_servers="crux-kafka:9092",
            value_serializer=lambda v:
                json.dumps(v).encode("utf-8")
        )
    return _producer

async def send_event(event):
    for attempt in range(5):
        try:
            p = get_producer()
            p.send("cruxdr-logs", event)
            p.flush()
            return
        except Exception as e:
            if attempt < 4:
                await asyncio.sleep(2 ** attempt)
            else:
                print(f"[KAFKA ERROR] send_event failed after 5 retries: {e}", flush=True)

async def send_alert(alert):
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

    for attempt in range(5):
        try:
            p = get_producer()
            p.send("alerts", payload)
            p.flush()
            return
        except Exception as e:
            if attempt < 4:
                await asyncio.sleep(2 ** attempt)
            else:
                print(f"[KAFKA ERROR] send_alert failed after 5 retries: {e}", flush=True)
