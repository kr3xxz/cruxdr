import json

from kafka import KafkaConsumer
from kafka import KafkaProducer


def safe_deserializer(m):

    try:

        return json.loads(
            m.decode("utf-8")
        )

    except Exception:

        return None


consumer = KafkaConsumer(

    "user-events",

    bootstrap_servers="kafka:9092",

    value_deserializer=
    safe_deserializer,

    auto_offset_reset="latest",

    enable_auto_commit=True,

    group_id="ueba-group",
)


producer = KafkaProducer(

    bootstrap_servers="kafka:9092",

    value_serializer=lambda v:
    json.dumps(v).encode("utf-8"),
)
