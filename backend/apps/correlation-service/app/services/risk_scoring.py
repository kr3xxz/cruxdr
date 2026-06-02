SEVERITY_SCORES = {
    "low": 10,
    "medium": 30,
    "high": 70,
    "critical": 100,
}


TACTIC_MULTIPLIERS = {
    "Reconnaissance": 1.0,
    "Initial Access": 1.2,
    "Execution": 1.3,
    "Persistence": 1.5,
    "Privilege Escalation": 1.6,
    "Defense Evasion": 1.7,
    "Credential Access": 1.8,
    "Discovery": 1.2,
    "Lateral Movement": 2.0,
    "Collection": 1.5,
    "Exfiltration": 2.5,
    "Impact": 3.0,
}


def calculate_risk(alerts):

    total_score = 0

    unique_ips = set()

    for alert in alerts:

        severity = alert.get(
            "severity",
            "low",
        )

        tactic = alert.get(
            "tactic",
            "Reconnaissance",
        )

        source_ip = alert.get(
            "source_ip",
            "unknown",
        )

        unique_ips.add(source_ip)

        base_score = SEVERITY_SCORES.get(
            severity,
            10,
        )

        multiplier = TACTIC_MULTIPLIERS.get(
            tactic,
            1.0,
        )

        total_score += (
            base_score * multiplier
        )

    diversity_bonus = (
        len(unique_ips) * 5
    )

    final_score = (
        total_score + diversity_bonus
    )

    return min(
        int(final_score),
        100,
    )
