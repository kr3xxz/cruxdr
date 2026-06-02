from datetime import datetime

from app.core.kafka import producer

from app.services.risk import (
    calculate_behavior_risk,
)


class UEBAAlertService:

    @staticmethod
    def publish_alert(
        username,
        anomalies,
        country,
    ):

        risk = calculate_behavior_risk(
            anomalies
        )

        alert = {
            "title":
            "User Behavior Anomaly",

            "severity":
            "high" if risk >= 70
            else "medium",

            "username":
            username,

            "anomalies":
            anomalies,

            "country":
            country,

            "risk_score":
            risk,

            "timestamp":
            datetime.utcnow().isoformat(),
        }

        producer.send(
            "ueba-alerts",
            alert,
        )

        print(
            f"[UEBA ALERT] {alert}"
        )
