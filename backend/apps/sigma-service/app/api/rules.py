from fastapi import APIRouter

from app.data.store import (
    logs_store,
    alerts_store,
)

router = APIRouter()


@router.get("/rules")
async def get_rules():

    return [
        {
            "name": "Ransomware Detection",
            "severity": "critical",
        },
        {
            "name": "Phishing Detection",
            "severity": "high",
        },
    ]


@router.get("/logs")
async def get_logs():

    return logs_store[-200:]


@router.get("/alerts")
async def get_alerts():

    return alerts_store[-100:]
