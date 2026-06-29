from fastapi import APIRouter
from app.core.log_generator import LogGenerator
from app.websocket.manager import manager
from app.graph.engine import AttackGraphEngine
from app.websocket.graph_manager import graph_manager
from app.models.graph_state import graph_nodes, graph_edges
from kafka import KafkaProducer
import json
import traceback

router = APIRouter()


@router.get("/graph")
async def get_graph():
    return {
        "nodes": graph_nodes[-30:],
        "edges": graph_edges[-30:],
    }


def get_producer():

    return KafkaProducer(
        bootstrap_servers="kafka:9092",
        value_serializer=lambda v:
            json.dumps(v).encode("utf-8")
    )


async def send_logs(logs, attack_type=None):

    producer = get_producer()

    for log in logs:

        producer.send(
            "cruxdr-logs",
            log
        )

    producer.flush()

    for log in logs:
        await manager.broadcast(log)

    if logs and attack_type:
        graph = AttackGraphEngine.process_attack(logs[0])
        await graph_manager.broadcast(graph)

    return {
        "status": "success",
        "logs_generated": len(logs)
    }


@router.post("/ransomware")
async def ransomware():

    try:

        return await send_logs(
            LogGenerator.ransomware(),
            attack_type="ransomware",
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
            LogGenerator.brute_force(),
            attack_type="brute_force",
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
            LogGenerator.phishing(),
            attack_type="phishing",
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
            LogGenerator.lateral_movement(),
            attack_type="lateral_movement",
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
            LogGenerator.exfiltration(),
            attack_type="exfiltration",
        )

    except Exception as e:

        traceback.print_exc()

        return {
            "error": str(e)
        }
