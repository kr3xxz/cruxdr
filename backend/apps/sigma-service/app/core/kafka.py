from kafka import KafkaConsumer
import json


def get_consumer():

    return KafkaConsumer(
        "logs",
        bootstrap_servers="crux-kafka:9092",
        auto_offset_reset="latest",
        value_deserializer=lambda x: json.loads(
            x.decode("utf-8")
        ),
    )
