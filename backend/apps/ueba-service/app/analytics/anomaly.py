from statistics import mean

from app.models.profiles import (
    user_profiles,
)


class AnomalyEngine:

    @staticmethod
    def detect_login_anomaly(
        username,
        login_hour,
        country,
    ):

        if username not in user_profiles:
            return None

        profile = user_profiles[
            username
        ]

        anomalies = []

        hours = profile["hours"]

        if len(hours) > 5:

            avg_hour = mean(hours)

            if abs(avg_hour - login_hour) > 6:

                anomalies.append(
                    "unusual_login_time"
                )

        if (
            country
            not in profile["countries"]
        ):

            anomalies.append(
                "new_country_login"
            )

        return anomalies
