from fastapi import APIRouter

from app.store.users import (
    user_risks,
)

from app.store.users import (
    anomalies,
)

router = APIRouter()


@router.get("/risks")
async def get_risks():

    return {
        "risks":
        user_risks[:50]
    }


@router.get("/anomalies")
async def get_anomalies():

    return {
        "anomalies":
        anomalies[:50]
    }
