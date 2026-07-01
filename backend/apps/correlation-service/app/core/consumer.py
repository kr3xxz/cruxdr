import json
import time

from kafka import KafkaConsumer

_consumer = None

def get_consumer():
    global _consumer
    if _consumer is not None:
        return _consumer
    for attempt in range(10):
        try:
            _consumer = KafkaConsumer(
                "alerts",
                bootstrap_servers="crux-kafka:9092",
                value_deserializer=lambda m: json.loads(m.decode("utf-8")),
                auto_offset_reset="earliest",
                group_id="cruxdr-correlation",
                consumer_timeout_ms=5000,
            )
            return _consumer
        except Exception as e:
            print(f"[KAFKA] consumer init attempt {attempt + 1}/10 failed: {e}", flush=True)
            if attempt < 9:
                time.sleep(3)
    raise RuntimeError("Could not connect to Kafka after 10 attempts")
