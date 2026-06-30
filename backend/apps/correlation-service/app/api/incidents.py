from fastapi import APIRouter, Body

from app.data.store import incidents_store

router = APIRouter()


@router.get("/incidents")
async def get_incidents():

    return incidents_store[::-1]


def _merge_incident(existing: dict, incoming: dict) -> dict:
    existing["last_seen"] = incoming.get("last_seen") or incoming.get("timestamp") or ""
    existing["alert_count"] = existing.get("alert_count", 1) + 1

    incoming_sev = incoming.get("severity", "medium")
    severity_order = {"critical": 4, "high": 3, "medium": 2, "low": 1}
    if severity_order.get(incoming_sev, 0) > severity_order.get(existing.get("severity", "low"), 0):
        existing["severity"] = incoming_sev

    existing_iocs = set(existing.get("iocs", []))
    for ioc in incoming.get("iocs", []):
        if ioc and ioc != "N/A":
            existing_iocs.add(ioc)
    existing["iocs"] = list(existing_iocs)

    existing_timeline = existing.get("timeline", [])
    for entry in incoming.get("timeline", []):
        if entry not in existing_timeline:
            existing_timeline.append(entry)
    existing["timeline"] = existing_timeline

    for key in ["mitre", "source_ip", "host", "user"]:
        val = incoming.get(key)
        if val and val != "N/A":
            existing[key] = val

    return existing


@router.post("/incidents")
async def create_incident(incident: dict = Body(...)):

    found = None
    for x in incidents_store:
        if x.get("title") == incident.get("title") and x.get("host") == incident.get("host") and x.get("user") == incident.get("user"):
            found = x
            break

    if found:
        _merge_incident(found, incident)
        incidents_store.remove(found)
        incidents_store.append(found)
        return {"status": "updated", "alert_count": found.get("alert_count", 1)}

    incident["alert_count"] = 1
    incident["last_seen"] = incident.get("last_seen") or incident.get("timestamp") or ""
    incidents_store.append(incident)
    incidents_store[:] = incidents_store[-100:]

    return {"status": "created", "alert_count": 1}


@router.delete("/incidents")
async def clear_incidents():

    incidents_store.clear()

    return {"message": "Incidents cleared"}



