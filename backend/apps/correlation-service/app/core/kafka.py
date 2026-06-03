import json
import time

from kafka import KafkaConsumer
from kafka import KafkaProducer
from kafka.errors import NoBrokersAvailable


consumer = None
producer = None


while consumer is None:

    try:

        consumer = KafkaConsumer(
            "siem-alerts",

            bootstrap_servers="crux-kafka:9092",

            value_deserializer=lambda m:
            json.loads(
                m.decode("utf-8")
            ),

            auto_offset_reset="latest",

            group_id="siem-consumers",
        )

        print(
            "[*] Connected Kafka Consumer",
            flush=True
        )

    except NoBrokersAvailable:

        print(
            "[!] Kafka Consumer not ready...",
            flush=True
        )

        time.sleep(5)


while producer is None:

    try:

        producer = KafkaProducer(
            bootstrap_servers="crux-kafka:9092",

            value_serializer=lambda v:
            json.dumps(v).encode("utf-8"),

            acks="all",

            retries=5,
        )

        print(
            "[*] Connected Kafka Producer",
            flush=True
        )

    except NoBrokersAvailable:

        print(
            "[!] Kafka Producer not ready...",
            flush=True
        )

        time.sleep(5)
