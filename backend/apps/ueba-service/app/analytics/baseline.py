from app.models.profiles import (
    user_profiles,
)


class BaselineEngine:

    @staticmethod
    def update_profile(
        username,
        login_hour,
        country,
    ):

        if username not in user_profiles:

            user_profiles[username] = {
                "hours": [],
                "countries": set(),
                "login_count": 0,
            }

        profile = user_profiles[username]

        profile["hours"].append(
            login_hour
        )

        profile["countries"].add(
            country
        )

        profile["login_count"] += 1

        return profile
