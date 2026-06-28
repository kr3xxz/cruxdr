from fastapi import APIRouter

from app.data.store import incidents_store

router = APIRouter()


@router.get("/incidents")
async def get_incidents():

    return incidents_store[::-1]


@router.delete("/incidents")
async def clear_incidents():

    incidents_store.clear()

    return {"message": "Incidents cleared"}
