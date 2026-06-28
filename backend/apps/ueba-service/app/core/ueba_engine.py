import time
from datetime import datetime

from app.store.users import (
    user_profiles,
    user_risks,
    anomalies,
)

from app.core.risk_engine import (
    UserRiskEngine,
)

from app.core.impossible_travel import (
    ImpossibleTravelEngine,
)

from app.core.anomaly_detector import (
    AnomalyDetector,
)


class UEBAEngine:

    @staticmethod
    def process(event):
        event = (
            ImpossibleTravelEngine
            .enrich(event)
        )

        user = (
            event.get("user")
            or event.get("username")
            or event.get("target_user")
            or event.get("source_ip")
            or "unknown"
        )

        now = time.time()
        event["_ts"] = now

        if user not in user_profiles:
            user_profiles[user] = []

        user_profiles[user].append(event)
        user_profiles[user] = user_profiles[user][-50:]

        recent = user_profiles[user]

        risk_score = UserRiskEngine.calculate(recent)

        anomaly_list = AnomalyDetector.detect(
            user,
            recent,
        )

        countries = list(set(
            e.get("country", "Unknown")
            for e in recent if e.get("country")
        ))
        hosts = list(set(
            e.get("host", "")
            for e in recent if e.get("host")
        ))
        attack_types = list(set(
            e.get("attack_type", "")
            for e in recent if e.get("attack_type")
        ))

        timestamp = event.get(
            "timestamp",
            str(datetime.utcnow()),
        )

        risk_entry = {
            "user": user,
            "risk_score": risk_score,
            "event_count": len(recent),
            "countries": countries,
            "hosts": hosts,
            "attack_types": attack_types,
            "anomaly_count": len(anomaly_list),
            "anomalies": [
                a["type"] for a in anomaly_list
            ],
            "timestamp": timestamp,
        }

        user_risks.insert(0, risk_entry)
        del user_risks[100:]

        for anomaly in anomaly_list:
            anomaly_entry = {
                "user": user,
                "type": anomaly["type"],
                "severity": anomaly["severity"],
                "details": anomaly.get(
                    "details", ""
                ),
                "timestamp": timestamp,
            }
            anomalies.insert(0, anomaly_entry)

        del anomalies[100:]

        return risk_entry
