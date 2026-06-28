from fastapi import APIRouter
from app.core.log_generator import LogGenerator
<<<<<<< HEAD
=======
from app.websocket.manager import manager
from app.graph.engine import AttackGraphEngine
from app.websocket.graph_manager import graph_manager
from app.models.graph_state import graph_nodes, graph_edges
>>>>>>> 1f84238 (redesign SOC interface, fix sigma→correlation pipeline, enhance UEBA analytics & MITRE heatmap)
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
<<<<<<< HEAD
        bootstrap_servers="crux-kafka:9092",
=======
        bootstrap_servers="kafka:9092",
>>>>>>> 1f84238 (redesign SOC interface, fix sigma→correlation pipeline, enhance UEBA analytics & MITRE heatmap)
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
<<<<<<< HEAD
            LogGenerator.ransomware()
=======
            LogGenerator.ransomware(),
            attack_type="ransomware",
>>>>>>> 1f84238 (redesign SOC interface, fix sigma→correlation pipeline, enhance UEBA analytics & MITRE heatmap)
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
<<<<<<< HEAD
            LogGenerator.brute_force()
=======
            LogGenerator.brute_force(),
            attack_type="brute_force",
>>>>>>> 1f84238 (redesign SOC interface, fix sigma→correlation pipeline, enhance UEBA analytics & MITRE heatmap)
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
<<<<<<< HEAD
            LogGenerator.phishing()
=======
            LogGenerator.phishing(),
            attack_type="phishing",
>>>>>>> 1f84238 (redesign SOC interface, fix sigma→correlation pipeline, enhance UEBA analytics & MITRE heatmap)
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
<<<<<<< HEAD
            LogGenerator.lateral_movement()
=======
            LogGenerator.lateral_movement(),
            attack_type="lateral_movement",
>>>>>>> 1f84238 (redesign SOC interface, fix sigma→correlation pipeline, enhance UEBA analytics & MITRE heatmap)
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
<<<<<<< HEAD
            LogGenerator.exfiltration()
=======
            LogGenerator.exfiltration(),
            attack_type="exfiltration",
>>>>>>> 1f84238 (redesign SOC interface, fix sigma→correlation pipeline, enhance UEBA analytics & MITRE heatmap)
        )

    except Exception as e:

        traceback.print_exc()

        return {
            "error": str(e)
        }
