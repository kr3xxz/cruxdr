RISK_WEIGHTS = {
    "unusual_login_time": 40,
    "new_country_login": 60,
}


def calculate_behavior_risk(
    anomalies,
):

    total = 0

    for anomaly in anomalies:

        total += RISK_WEIGHTS.get(
            anomaly,
            10,
        )

    if total > 100:
        total = 100

    return total
