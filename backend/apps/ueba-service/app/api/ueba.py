import time
from datetime import datetime

from fastapi import APIRouter

from app.store.users import (
    user_risks,
    anomalies,
    user_profiles,
    user_identity,
)

from app.core.ueba_engine import (
    UEBAEngine,
)

from app.core.risk_engine import (
    UserRiskEngine,
    ATTACK_WEIGHTS,
    SEVERITY_WEIGHTS,
)

from shared.seed_data import (
    USERS,
    lookup_user,
    DEPARTMENTS,
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


@router.get("/user/{username}")
async def get_user_details(username: str):
    profile = user_profiles.get(username, [])
    identity = user_identity.get(username) or lookup_user.get(username, {})
    risk_entry = next((r for r in user_risks if r["user"] == username), None)
    user_anomalies = [a for a in anomalies if a["user"] == username]

    events = list(profile)

    risk_breakdown = None
    if len(events) > 0 and risk_entry:
        now = time.time()
        attack_contrib = 0
        severity_contrib = 0
        freq = len(events)
        for ev in events:
            ts = ev.get("_ts", now)
            age_hours = (now - ts) / 3600
            decay = max(0.1, 1.0 - (age_hours / 24))
            attack = ev.get("attack_type", "")
            aw = ATTACK_WEIGHTS.get(attack, 10)
            sev_val = ev.get("severity", "medium")
            sw = SEVERITY_WEIGHTS.get(sev_val, 5)
            attack_contrib += aw * decay
            severity_contrib += sw * decay
        freq_mult = 1.0 + (0.1 * min(10, freq))

        group_risks = [
            r for r in user_risks
            if r.get("department") == identity.get("department")
            and r["user"] != username
        ]
        peer_avg = round(sum(r["risk_score"] for r in group_risks) / max(len(group_risks), 1))

        risk_breakdown = {
            "attack_contribution": round(attack_contrib, 1),
            "severity_contribution": round(severity_contrib, 1),
            "frequency_multiplier": round(freq_mult, 2),
            "total_before_cap": round((attack_contrib + severity_contrib) * freq_mult, 1),
            "anomaly_boost": sum(1 for a in user_anomalies if a["severity"] in ("critical", "high")) * 5,
            "peer_average": peer_avg,
        }

    return {
        "user": username,
        "identity": dict(identity) if identity else {},
        "risk_score": risk_entry["risk_score"] if risk_entry else 0,
        "risk_breakdown": risk_breakdown,
        "event_count": len(events),
        "events": events[-20:],
        "anomalies": user_anomalies[-20:],
        "peers": [
            {
                "user": r["user"],
                "risk_score": r["risk_score"],
                "department": r.get("department", ""),
                "event_count": r.get("event_count", 0),
                "anomaly_count": r.get("anomaly_count", 0),
                "attack_types": r.get("attack_types", []),
            }
            for r in user_risks[:20]
            if r.get("department") == identity.get("department") and r["user"] != username
        ],
    }


@router.get("/user/{username}/events")
async def get_user_events(username: str):
    profile = user_profiles.get(username, [])
    return {"user": username, "events": list(reversed(profile[-50:])), "total": len(profile)}


@router.get("/user/{username}/risk-breakdown")
async def get_risk_breakdown(username: str):
    profile = user_profiles.get(username, [])
    risk_entry = next((r for r in user_risks if r["user"] == username), None)
    if not profile or not risk_entry:
        return {"user": username, "risk_score": 0, "breakdown": None}

    now = time.time()
    per_event = []
    attack_total = {}
    severity_total = {}
    for ev in profile:
        ts = ev.get("_ts", now)
        age_hours = (now - ts) / 3600
        decay = max(0.1, 1.0 - (age_hours / 24))
        attack = ev.get("attack_type", "unknown")
        aw = ATTACK_WEIGHTS.get(attack, 10)
        sev_val = ev.get("severity", "medium")
        sw = SEVERITY_WEIGHTS.get(sev_val, 5)
        contrib = (aw + sw) * decay
        attack_total[attack] = attack_total.get(attack, 0) + aw * decay
        severity_total[sev_val] = severity_total.get(sev_val, 0) + sw * decay
        per_event.append({
            "event_type": ev.get("event_type", ""),
            "attack_type": attack,
            "severity": sev_val,
            "message": ev.get("message", "")[:100],
            "timestamp": ev.get("timestamp", ev.get("ts", "")),
            "contribution": round(contrib, 1),
        })

    freq = len(profile)
    freq_mult = 1.0 + (0.1 * min(10, freq))

    return {
        "user": username,
        "risk_score": risk_entry["risk_score"],
        "total_events": freq,
        "frequency_multiplier": round(freq_mult, 2),
        "by_attack_type": {k: round(v, 1) for k, v in sorted(attack_total.items(), key=lambda x: -x[1])},
        "by_severity": {k: round(v, 1) for k, v in sorted(severity_total.items(), key=lambda x: -x[1])},
        "events": per_event[-20:],
    }


@router.get("/peer-comparison/{username}")
async def get_peer_comparison(username: str):
    identity = user_identity.get(username) or lookup_user.get(username, {})
    department = identity.get("department", "")
    dept_users = [u for u in USERS if u["department"] == department]

    peers = []
    for u in dept_users:
        uname = u["username"]
        risk_entry = next((r for r in user_risks if r["user"] == uname), None)
        peers.append({
            "user": uname,
            "role": u.get("role", ""),
            "risk_score": risk_entry["risk_score"] if risk_entry else 0,
            "event_count": risk_entry.get("event_count", 0) if risk_entry else 0,
            "anomaly_count": risk_entry.get("anomaly_count", 0) if risk_entry else 0,
            "attack_types": risk_entry.get("attack_types", []) if risk_entry else [],
        })

    scores = [p["risk_score"] for p in peers]
    dept_avg = round(sum(scores) / max(len(scores), 1))

    high_risk_count = sum(1 for p in peers if p["risk_score"] >= 70)

    return {
        "user": username,
        "department": department,
        "department_average": dept_avg,
        "department_high_risk_count": high_risk_count,
        "total_in_department": len(dept_users),
        "peers": peers,
    }
