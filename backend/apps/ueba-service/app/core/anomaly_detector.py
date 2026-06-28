import time


class AnomalyDetector:

    @staticmethod
    def detect(user, events):
        detected = []

        total = len(events)
        latest = events[-1] if events else {}

        if total == 1:
            detected.append({
                "type": "First Time Activity",
                "severity": "low",
                "details": (
                    f"User {user} appeared for the first time — "
                    f"no baseline established"
                ),
            })
        elif total == 2:
            detected.append({
                "type": "Low Event Baseline",
                "severity": "low",
                "details": (
                    f"User {user} has only {total} events — "
                    f"insufficient for behavioral baseline"
                ),
            })

        if latest.get("severity") == "critical":
            detected.append({
                "type": "Critical Severity Event",
                "severity": "high",
                "details": (
                    f"User {user} triggered a critical severity "
                    f"{latest.get('attack_type', 'event')}"
                ),
            })
        elif latest.get("severity") == "high":
            detected.append({
                "type": "High Severity Event",
                "severity": "medium",
                "details": (
                    f"User {user} triggered a high severity "
                    f"{latest.get('attack_type', 'event')}"
                ),
            })
        elif not latest.get("severity"):
            detected.append({
                "type": "Unclassified Event",
                "severity": "info",
                "details": (
                    f"User {user} triggered an event without "
                    f"severity classification — possible data quality issue"
                ),
            })

        countries = set(
            e.get("country") for e in events if e.get("country")
        )
        if len(countries) >= 3:
            detected.append({
                "type": "Impossible Travel",
                "severity": "critical",
                "details": (
                    f"Events from {len(countries)} countries: "
                    f"{', '.join(countries)}"
                ),
            })
        elif len(countries) == 2:
            detected.append({
                "type": "Impossible Travel",
                "severity": "medium",
                "details": (
                    f"Events from 2 countries: "
                    f"{', '.join(countries)}"
                ),
            })

        now = time.time()
        recent_count = sum(
            1 for e in events
            if now - e.get("_ts", now) < 300
        )
        if recent_count >= 10:
            detected.append({
                "type": "High Frequency Attack",
                "severity": "critical",
                "details": (
                    f"{recent_count} events in the last 5 minutes"
                ),
            })
        elif recent_count >= 5:
            detected.append({
                "type": "High Frequency Attack",
                "severity": "high",
                "details": (
                    f"{recent_count} events in the last 5 minutes"
                ),
            })
        elif recent_count >= 3:
            detected.append({
                "type": "High Frequency Attack",
                "severity": "medium",
                "details": (
                    f"{recent_count} events in the last 5 minutes"
                ),
            })

        attacks = set(
            e.get("attack_type")
            for e in events if e.get("attack_type")
        )
        if len(attacks) >= 3:
            detected.append({
                "type": "Multi-Vector Attack",
                "severity": "critical",
                "details": (
                    f"Multiple attack types: "
                    f"{', '.join(attacks)}"
                ),
            })
        elif len(attacks) >= 2:
            detected.append({
                "type": "Multi-Vector Attack",
                "severity": "high",
                "details": (
                    f"Multiple attack types: "
                    f"{', '.join(attacks)}"
                ),
            })

        hosts = set(
            e.get("host") for e in events if e.get("host")
        )
        if len(hosts) >= 3:
            detected.append({
                "type": "Lateral Movement Indicator",
                "severity": "critical",
                "details": (
                    f"User appeared on {len(hosts)} hosts: "
                    f"{', '.join(hosts)}"
                ),
            })
        elif len(hosts) >= 2:
            detected.append({
                "type": "Lateral Movement Indicator",
                "severity": "high",
                "details": (
                    f"User appeared on {len(hosts)} hosts: "
                    f"{', '.join(hosts)}"
                ),
            })

        ips = set(
            e.get("source_ip")
            for e in events if e.get("source_ip")
        )
        if len(ips) >= 5:
            detected.append({
                "type": "Multiple Source IPs",
                "severity": "high",
                "details": (
                    f"Events from {len(ips)} different IPs"
                ),
            })
        elif len(ips) >= 3:
            detected.append({
                "type": "Multiple Source IPs",
                "severity": "medium",
                "details": (
                    f"Events from {len(ips)} different IPs"
                ),
            })

        return detected
