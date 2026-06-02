import uuid

from datetime import datetime

from app.models.incidents import (
    active_incidents,
)

from app.services.risk_scoring import (
    calculate_risk,
)


MAX_ALERTS_PER_INCIDENT = 20


class CorrelationEngine:

    @staticmethod
    def process_alert(alert):

        source_ip = alert.get(
            "source_ip"
        )

        technique = alert.get(
            "technique"
        )

        existing = None

        for incident in active_incidents:

            if (
                incident["source_ip"]
                == source_ip
                and
                incident["technique"]
                == technique
            ):

                existing = incident
                break

        if existing:

            existing["alert_count"] += 1

            existing["last_seen"] = (
                datetime.utcnow().isoformat()
            )

            existing["updated_at"] = (
                datetime.utcnow().isoformat()
            )

            existing["latest_alert"] = (
                alert
            )

            existing["alerts"].append(
                alert
            )

            existing["alerts"] = (
                existing["alerts"]
                [-MAX_ALERTS_PER_INCIDENT:]
            )

            risk_score = calculate_risk(
                existing["alerts"]
            )

            existing["risk_score"] = (
                risk_score
            )

            if risk_score >= 90:

                existing["severity"] = (
                    "critical"
                )

            elif risk_score >= 70:

                existing["severity"] = (
                    "high"
                )

            else:

                existing["severity"] = (
                    "medium"
                )

            return existing

        now = datetime.utcnow().isoformat()

        incident = {

            "incident_id":
            f"INC-{uuid.uuid4().hex[:8]}",

            "title":
            "Potential Host Compromise",

            "severity":
            "medium",

            "source_ip":
            source_ip,

            "technique":
            technique,

            "alert_count":
            1,

            "latest_alert":
            alert,

            "alerts":
            [alert],

            "risk_score":
            calculate_risk([alert]),

            "first_seen":
            now,

            "last_seen":
            now,

            "created_at":
            now,

            "updated_at":
            now,
        }

        active_incidents.append(
            incident
        )

        return incident
