import time

from app.store.users import (
    user_profiles,
)

from app.store.users import (
    user_risks,
)

from app.store.users import (
    anomalies,
)

from app.core.risk_engine import (
    UserRiskEngine,
)

from app.core.impossible_travel import (
    ImpossibleTravelEngine,
)


class UEBAEngine:

    @staticmethod
    def process(event):

        event = (
            ImpossibleTravelEngine
            .enrich(event)
        )

        user = (
            event.get(
                "target_user"
            )
            or "unknown"
        )

        if user not in user_profiles:

            user_profiles[user] = []

        user_profiles[user].append(
            {
                "timestamp":
                time.time(),

                "event":
                event,
            }
        )

        recent = [
            item["event"]
            for item in (
                user_profiles[user]
            )[-10:]
        ]

        risk_score = (
            UserRiskEngine
            .calculate(recent)
        )

        countries = list(set([
            e["country"]
            for e in recent
        ]))

        anomaly = None

        if len(countries) >= 3:

            anomaly = {
                "type":
                "Impossible Travel",

                "user":
                user,

                "countries":
                countries,

                "severity":
                "critical",
            }

            anomalies.insert(
                0,
                anomaly,
            )

        risk = {
            "user":
            user,

            "risk_score":
            risk_score,

            "event_count":
            len(recent),

            "countries":
            countries,
        }

        user_risks.insert(
            0,
            risk,
        )

        del user_risks[100:]

        return risk
