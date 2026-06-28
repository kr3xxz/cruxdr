import time

ATTACK_WEIGHTS = {
    "ransomware": 50,
    "exfiltration": 40,
    "lateral_movement": 35,
    "brute_force": 25,
    "phishing": 20,
}

SEVERITY_WEIGHTS = {
    "critical": 40,
    "high": 20,
    "medium": 5,
    "low": 1,
}


class UserRiskEngine:

    @staticmethod
    def calculate(events):
        score = 0
        now = time.time()

        for event in events:
            ts = event.get("_ts", now)
            age_hours = (now - ts) / 3600

            decay = max(0.1, 1.0 - (age_hours / 24))

            attack = event.get("attack_type", "")
            attack_weight = ATTACK_WEIGHTS.get(attack, 10)

            severity = event.get("severity", "medium")
            severity_weight = SEVERITY_WEIGHTS.get(severity, 5)

            score += (attack_weight + severity_weight) * decay

        freq = len(events)
        freq_mult = 1.0 + (0.1 * min(10, freq))

        score *= freq_mult

        return min(100, round(score))
