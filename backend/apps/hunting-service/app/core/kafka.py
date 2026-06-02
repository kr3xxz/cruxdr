import json

from kafka import KafkaConsumer


consumer = KafkaConsumer(
    "siem-events",

    bootstrap_servers="kafka:9092",

    value_deserializer=lambda m:
    json.loads(m.decode("utf-8")),

    auto_offset_reset="latest",
)
