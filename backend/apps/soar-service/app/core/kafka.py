import asyncio
import json

from kafka import KafkaConsumer


def safe_deserializer(m):
    try:
        return json.loads(
            m.decode("utf-8")
        )
    except Exception:
        return None


_consumer = None

async def get_consumer():
    global _consumer
    if _consumer is not None:
        return _consumer
    for attempt in range(10):
        try:
            _consumer = KafkaConsumer(
                "siem-enriched-incidents",
                "ueba-alerts",
                bootstrap_servers="crux-kafka:9092",
                value_deserializer=safe_deserializer,
                auto_offset_reset="latest",
                enable_auto_commit=True,
                group_id="soar-group",
            )
            return _consumer
        except Exception as e:
            print(f"[KAFKA] SOAR consumer attempt {attempt + 1}/10 failed: {e}", flush=True)
            if attempt < 9:
                await asyncio.sleep(3)
    print("[KAFKA] SOAR consumer could not connect — will operate without Kafka", flush=True)
    return None
