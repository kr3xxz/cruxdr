from collections import Counter

def detect_threats(events):

    alerts = []

    failed_ips = [
        e["source_ip"]
        for e in events
        if e["event_type"] == "failed_login"
    ]

    ip_counts = Counter(failed_ips)

    for ip, count in ip_counts.items():

        if count >= 5:

            alerts.append({
                "alert_type": "SSH Brute Force",
                "severity": "high",
                "source_ip": ip,
                "failed_attempts": count,
                "mitre_attack": "T1110"
            })

    return alerts
