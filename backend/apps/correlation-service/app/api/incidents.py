from fastapi import APIRouter, Body

from app.data.store import incidents_store

router = APIRouter()


@router.get("/incidents")
async def get_incidents():

    return incidents_store[::-1]


@router.post("/incidents")
async def create_incident(incident: dict = Body(...)):

    exists = any(
        x.get("title") == incident.get("title")
        and x.get("host") == incident.get("host")
        and x.get("user") == incident.get("user")
        for x in incidents_store
    )

    if not exists:
        incidents_store.append(incident)
        incidents_store[:] = incidents_store[-100:]

    return {"status": "created", "exists": exists}


@router.delete("/incidents")
async def clear_incidents():

    incidents_store.clear()

    return {"message": "Incidents cleared"}



