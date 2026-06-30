import asyncio

from fastapi import APIRouter, UploadFile, File
import httpx

from app.core.indexer import client, INDEX_NAME
from app.core.indexer import index_event

from app.core.parser import parse_logs
from app.core.detector import detect_threats

from app.core.producer import (
    send_event,
)

from app.core.store import (
    EVENTS,
    ALERTS,
)


async def forward_to_ueba(event: dict):
    try:
        async with httpx.AsyncClient(timeout=3) as client:
            await client.post(
                "http://cruxdr-ueba-service:8000/event",
                json=event,
            )
    except Exception:
        pass

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

            asyncio.ensure_future(
                forward_to_ueba(
                    event
                )
            )

        except Exception as e:

            print(
                f"[EVENT ERROR] {e}",
                flush=True
            )

    sigma_alerts = []
    sigma_error = ""
    sigma_rules_loaded = 0
    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.post(
                "http://cruxdr-sigma-service:8000/detect",
                json={"events": parsed_events}
            )
            if resp.status_code == 200:
                body = resp.json()
                sigma_alerts = body.get("alerts", [])
                sigma_rules_loaded = body.get("rules_loaded", 0)
                sigma_error = body.get("error", "")
                for sa in sigma_alerts:
                    ALERTS.append(sa)
                ALERTS[:] = ALERTS[-1000:]
            else:
                sigma_error = f"sigma-service returned status {resp.status_code}"
    except Exception as e:
        sigma_error = f"sigma detect error: {e}"
        print(f"[SIGMA DETECT ERROR] {e}", flush=True)

    return {
        "events": parsed_events,
        "alerts": alerts,
        "sigma_alerts": sigma_alerts,
        "sigma_error": sigma_error,
        "sigma_rules_loaded": sigma_rules_loaded,
        "event_count": len(parsed_events),
        "alert_count": len(alerts) + len(sigma_alerts),
    }


@router.get("/logs")
async def get_logs():

    return EVENTS


@router.delete("/logs")
async def clear_logs():

    EVENTS.clear()

    return {"message": "Logs cleared"}


@router.get("/alerts")
async def get_alerts():

    return ALERTS


@router.get("/search")
async def search_logs(
    q: str
):

    ql = q.lower()
    results = [
        ev for ev in EVENTS
        if ql in str(ev.get("source_ip", "")).lower()
        or ql in str(ev.get("host", "")).lower()
        or ql in str(ev.get("username", "")).lower()
        or ql in str(ev.get("message", "")).lower()
        or ql in str(ev.get("event_type", "")).lower()
        or ql in str(ev.get("raw", "")).lower()
    ]

    if results:
        return results

    try:
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
    except Exception:
        return []
