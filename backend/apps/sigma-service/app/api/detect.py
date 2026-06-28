from fastapi import APIRouter

from app.store.rules import sigma_rules

router = APIRouter()


@router.post("/detect")
async def detect(body: dict):

    events = body.get("events", [])
    alerts = []

    for event in events:
        raw = str(event.get("raw", "")).lower()
        message = str(event.get("message", "")).lower()
        content = raw + " " + message

        for rule in sigma_rules:
            detection = rule.get("detection", {})
            keywords = detection.get("keywords", [])

            if not keywords:
                continue

            for keyword in keywords:
                if keyword.lower() in content:
                    severity = rule.get("severity") or rule.get("level") or "medium"
                    mitre = rule.get("mitre", {})
                    if isinstance(mitre, dict):
                        mitre_id = mitre.get("technique", "")
                    else:
                        mitre_id = str(mitre)
                    if not mitre_id:
                        for tag in rule.get("tags", []):
                            t = tag.lower()
                            if t.startswith("attack.t"):
                                mid = tag.split(".", 1)[1]
                                mitre_id = mid[0].upper() + mid[1:]
                                break
                            if t.startswith("t") and "." in t:
                                mitre_id = tag[0].upper() + tag[1:]
                                break
                    alerts.append({
                        "title": rule.get("title", "Sigma Match"),
                        "severity": severity,
                        "mitre_attack": mitre_id,
                        "alert_type": rule.get("title", "Sigma Match"),
                        "event": event,
                    })
                    break

    return {"alerts": alerts}
