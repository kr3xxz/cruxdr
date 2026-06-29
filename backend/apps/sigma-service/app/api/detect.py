from fastapi import APIRouter
from app.core.matcher import SigmaMatcher
from app.store.rules import sigma_rules

router = APIRouter()


@router.post("/detect")
async def detect(body: dict):
    events = body.get("events", [])
    rule_alerts = {}

    for event in events:
        try:
            matches = SigmaMatcher.match(event)
        except Exception as e:
            return {
                "alerts": [],
                "error": f"match error: {e}",
                "rules_loaded": len(sigma_rules),
                "events_received": len(events),
            }
        for alert in matches:
            title = alert.get("title", "Sigma Match")
            if title not in rule_alerts:
                rule_alerts[title] = {
                    "title": title,
                    "severity": alert.get("severity", "medium"),
                    "mitre_attack": alert.get("mitre_attack", ""),
                    "alert_type": alert.get("alert_type", title),
                    "event_count": 0,
                    "hosts": set(),
                    "users": set(),
                    "event": None,
                }
            entry = rule_alerts[title]
            entry["event_count"] += 1
            ev = alert.get("event", {})
            if entry["event"] is None:
                entry["event"] = ev
            host = ev.get("host", "")
            user = ev.get("username", "")
            if host:
                entry["hosts"].add(host)
            if user:
                entry["users"].add(user)

    result = []
    for entry in rule_alerts.values():
        entry["hosts"] = list(entry["hosts"])
        entry["users"] = list(entry["users"])
        result.append(entry)

    return {
        "alerts": result,
        "rules_loaded": len(sigma_rules),
        "events_received": len(events),
    }
