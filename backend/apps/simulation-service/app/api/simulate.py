from fastapi import APIRouter
from app.core.log_generator import LogGenerator
from kafka import KafkaProducer
import json
import traceback

router = APIRouter()


def get_producer():

    return KafkaProducer(
        bootstrap_servers="crux-kafka:9092",
        value_serializer=lambda v:
            json.dumps(v).encode("utf-8")
    )


async def send_logs(logs):

    producer = get_producer()

    for log in logs:

        producer.send(
            "cruxdr-logs",
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

        return await send_logs(
            LogGenerator.ransomware()
        )

    except Exception as e:

        traceback.print_exc()

        return {
            "error": str(e)
        }


@router.post("/brute_force")
async def brute_force():

    try:

        return await send_logs(
            LogGenerator.brute_force()
        )

    except Exception as e:

        traceback.print_exc()

        return {
            "error": str(e)
        }


@router.post("/phishing")
async def phishing():

    try:

        return await send_logs(
            LogGenerator.phishing()
        )

    except Exception as e:

        traceback.print_exc()

        return {
            "error": str(e)
        }


@router.post("/lateral_movement")
async def lateral_movement():

    try:

        return await send_logs(
            LogGenerator.lateral_movement()
        )

    except Exception as e:

        traceback.print_exc()

        return {
            "error": str(e)
        }


@router.post("/exfiltration")
async def exfiltration():

    try:

        return await send_logs(
            LogGenerator.exfiltration()
        )

    except Exception as e:

        traceback.print_exc()

        return {
            "error": str(e)
        }
