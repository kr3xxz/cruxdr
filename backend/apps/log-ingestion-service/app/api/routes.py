from fastapi import APIRouter, UploadFile, File

from app.core.indexer import client, INDEX_NAME
from app.core.indexer import index_event

from app.core.parser import parse_logs
from app.core.detector import detect_threats

from app.core.producer import (
    send_event,
    send_alert,
)

from app.core.store import (
    EVENTS,
    ALERTS,
)

router = APIRouter()


@router.get("/health")
async def health():

    return {
        "status": "ok"
    }


@router.post("/upload")
async def upload(
    file: UploadFile = File(...)
):

    content = await file.read()

    logs = content.decode(
        errors="ignore"
    )

    parsed_events = parse_logs(
        logs
    )

    alerts = detect_threats(
        parsed_events
    )

    EVENTS.extend(
        parsed_events
    )

    ALERTS.extend(
        alerts
    )

    EVENTS[:] = EVENTS[-1000:]
    ALERTS[:] = ALERTS[-1000:]

    for event in parsed_events:

        try:

            send_event(
                event
            )

            index_event(
                event
            )

        except Exception as e:

            print(
                f"[EVENT ERROR] {e}",
                flush=True
            )

    for alert in alerts:

        try:

            send_alert(
                alert
            )

        except Exception as e:

            print(
                f"[ALERT ERROR] {e}",
                flush=True
            )

    return {
        "events": parsed_events,
        "alerts": alerts,
        "event_count": len(parsed_events),
        "alert_count": len(alerts),
    }


@router.get("/logs")
async def get_logs():

    return EVENTS


@router.get("/alerts")
async def get_alerts():

    return ALERTS


@router.get("/search")
async def search_logs(
    q: str
):

    result = client.search(

        index=INDEX_NAME,

        body={
            "query": {
                "multi_match": {
                    "query": q,

                    "fields": [
                        "event_type",
                        "source_ip",
                        "username",
                        "raw",
                    ]
                }
            }
        }
    )

    return [
        hit["_source"]
        for hit in result["hits"]["hits"]
    ]
