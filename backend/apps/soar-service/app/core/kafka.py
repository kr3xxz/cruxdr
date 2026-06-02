import json

from kafka import KafkaConsumer


def safe_deserializer(m):

    try:

        return json.loads(
            m.decode("utf-8")
        )

    except Exception:

        return None


consumer = KafkaConsumer(

    "siem-enriched-incidents",
    "ueba-alerts",

    bootstrap_servers="kafka:9092",

    value_deserializer=
    safe_deserializer,

    auto_offset_reset="latest",

    enable_auto_commit=True,

    group_id="soar-group",
)
