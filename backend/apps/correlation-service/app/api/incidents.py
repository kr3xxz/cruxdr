from fastapi import APIRouter

from app.models.entity_tracker import (
    correlated_incidents,
)

router = APIRouter()


@router.get("/incidents")
async def get_incidents():

    return {
        "incidents":
        correlated_incidents[:50]
    }
