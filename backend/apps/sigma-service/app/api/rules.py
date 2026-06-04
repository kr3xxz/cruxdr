from fastapi import APIRouter

from app.data.store import (
    logs_store,
    alerts_store,
)

from app.store.rules import (
    sigma_rules,
)

router = APIRouter()


@router.get("/rules")
async def get_rules():

    return sigma_rules


@router.get("/logs")
async def get_logs():

    return logs_store[::-1]


@router.get("/alerts")
async def get_alerts():

    return alerts_store[::-1]
