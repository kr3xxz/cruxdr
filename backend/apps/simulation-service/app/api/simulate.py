from fastapi import APIRouter

from app.core.log_generator import LogGenerator

from kafka import KafkaProducer

import json
import traceback


router = APIRouter()


def get_producer():

    return KafkaProducer(
        bootstrap_servers="crux-kafka:9092",
        value_serializer=lambda v: json.dumps(v).encode("utf-8")
    )


async def send_logs(logs):

    producer = get_producer()

    for log in logs:

        producer.send(
            "logs",
            log
        )

    producer.flush()

    return {
        "status": "success",
        "logs_generated": len(logs)
    }


@router.post("/ransomware")
async def ransomware():

    try:

        logs = LogGenerator.ransomware()

        return await send_logs(logs)

    except Exception as e:

        traceback.print_exc()

        return {
            "error": str(e)
        }


@router.post("/brute_force")
async def brute_force():

    try:

        logs = LogGenerator.brute_force()

        return await send_logs(logs)

    except Exception as e:

        traceback.print_exc()

        return {
            "error": str(e)
        }


@router.post("/phishing")
async def phishing():

    try:

        logs = LogGenerator.ransomware()

        return await send_logs(logs)

    except Exception as e:

        traceback.print_exc()

        return {
            "error": str(e)
        }


@router.post("/lateral_movement")
async def lateral_movement():

    try:

        logs = LogGenerator.brute_force()

        return await send_logs(logs)

    except Exception as e:

        traceback.print_exc()

        return {
            "error": str(e)
        }


@router.post("/exfiltration")
async def exfiltration():

    try:

        logs = LogGenerator.exfiltration()

        return await send_logs(logs)

    except Exception as e:

        traceback.print_exc()

        return {
            "error": str(e)
        }
