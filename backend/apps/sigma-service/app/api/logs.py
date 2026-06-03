from fastapi import APIRouter

from app.data.store import (
    logs_store,
    alerts_store,
)

router = APIRouter()

@router.get("/logs")
async def get_logs():
    return logs_store[::-1]

@router.get("/alerts")
async def get_alerts():
    return alerts_store[::-1]
