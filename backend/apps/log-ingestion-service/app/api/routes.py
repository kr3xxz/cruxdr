from app.core.indexer import client, INDEX_NAME
from app.core.indexer import index_event
from app.core.producer import send_event
from app.core.store import EVENTS, ALERTS
from fastapi import APIRouter, UploadFile, File
from app.core.parser import parse_logs
from app.core.detector import detect_threats

router = APIRouter()

@router.get("/health")
async def health():
    return {"status": "ok"}

@router.post("/upload")
async def upload(file: UploadFile = File(...)):
    content = await file.read()

    logs = content.decode(errors="ignore")

    parsed_events = parse_logs(logs)

    alerts = detect_threats(parsed_events)
    EVENTS.extend(parsed_events)
    for event in parsed_events:
        send_event(event)
        index_event(event)
    ALERTS.extend(alerts)

    return {
        "events": parsed_events,
        "alerts": alerts
    }

@router.get("/logs")
async def get_logs():
    return EVENTS


@router.get("/alerts")
async def get_alerts():
    return ALERTS

@router.get("/search")
async def search_logs(q: str):

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
                        "raw"
                    ]
                }
            }
        }
    )

    return [
        hit["_source"]
        for hit in result["hits"]["hits"]
    ]
