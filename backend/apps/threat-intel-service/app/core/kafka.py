import json

from kafka import KafkaConsumer
from kafka import KafkaProducer


consumer = KafkaConsumer(
    "siem-incidents",

    bootstrap_servers="crux-kafka:9092",

    value_deserializer=lambda m:
    json.loads(
        m.decode("utf-8")
    ),

    auto_offset_reset="latest",

    enable_auto_commit=True,

    group_id="threat-intel-group",
)


producer = KafkaProducer(

    bootstrap_servers="crux-kafka:9092",

    value_serializer=lambda v:
    json.dumps(v).encode("utf-8"),
)
