from fastapi import APIRouter

from app.store.users import (
    user_risks,
    anomalies,
    user_profiles,
)

from app.core.ueba_engine import (
    UEBAEngine,
)

router = APIRouter()


@router.get("/risks")
async def get_risks():
    return {
        "risks": user_risks[:50],
        "total_users": len(user_profiles),
        "avg_risk": (
            round(
                sum(
                    r["risk_score"]
                    for r in user_risks[:50]
                ) / max(
                    len(user_risks[:50]),
                    1,
                )
            )
            if user_risks else 0
        ),
    }


@router.get("/anomalies")
async def get_anomalies():
    return {
        "anomalies": anomalies[:50],
        "total_anomalies": len(anomalies),
    }


@router.get("/summary")
async def get_summary():
    return {
        "total_users": len(user_profiles),
        "total_risks": len(user_risks),
        "total_anomalies": len(anomalies),
        "avg_risk": (
            round(
                sum(
                    r["risk_score"]
                    for r in user_risks[:50]
                ) / max(
                    len(user_risks[:50]),
                    1,
                )
            )
            if user_risks else 0
        ),
        "high_risk_users": len(set(
            r["user"] for r in user_risks[:50]
            if r["risk_score"] >= 70
        )),
    }


@router.post("/event")
async def ingest_event(event: dict):
    risk = UEBAEngine.process(event)
    return {"status": "ok", "risk": risk}


@router.delete("/risks")
async def delete_risks():
    user_risks.clear()
    return {"status": "ok", "cleared": True}


@router.delete("/anomalies")
async def delete_anomalies():
    anomalies.clear()
    return {"status": "ok", "cleared": True}


@router.delete("/reset")
async def reset_all():
    user_profiles.clear()
    user_risks.clear()
    anomalies.clear()
    return {"status": "ok", "cleared": True}
