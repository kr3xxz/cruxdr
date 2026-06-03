import json
import time

from kafka import KafkaProducer
from kafka.errors import NoBrokersAvailable

producer = None

while producer is None:
    try:
        producer = KafkaProducer(
            bootstrap_servers="crux-kafka:9092",
            value_serializer=lambda v: json.dumps(v).encode("utf-8"),
        )

        print("[*] Connected to Kafka", flush=True)

    except NoBrokersAvailable:
        print("[!] Kafka not ready, retrying in 5 seconds...", flush=True)
        time.sleep(5)
