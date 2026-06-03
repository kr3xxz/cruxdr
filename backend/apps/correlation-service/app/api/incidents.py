from fastapi import APIRouter

from app.data.store import incidents_store

router = APIRouter()


@router.get("/incidents")
async def get_incidents():

    return incidents_store[::-1]
