from collections import Counter


def detect_threats(events):

    alerts = []

    # SSH Brute Force

    failed_ips = [
        e.get("source_ip")
        for e in events
        if e.get("event_type") == "failed_login"
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

    # Account Compromise

    for event in events:

        if event.get("event_type") == "successful_login":

            alerts.append({
                "alert_type": "Account Compromise",
                "severity": "critical",
                "source_ip": event.get("source_ip", "unknown"),
                "username": event.get("username", "unknown"),
                "mitre_attack": "T1078"
            })

    # Credential Dumping

    for event in events:

        if event.get("event_type") == "credential_access":

            alerts.append({
                "alert_type": "Credential Dumping",
                "severity": "critical",
                "mitre_attack": "T1003",
                "raw": event.get("raw")
            })

    # Privilege Escalation

    for event in events:

        if event.get("event_type") == "privilege_escalation":

            alerts.append({
                "alert_type": "Privilege Escalation",
                "severity": "high",
                "mitre_attack": "T1068",
                "raw": event.get("raw")
            })

    # Lateral Movement

    for event in events:

        if event.get("event_type") == "lateral_movement":

            alerts.append({
                "alert_type": "Lateral Movement",
                "severity": "high",
                "mitre_attack": "T1021",
                "raw": event.get("raw")
            })

    # Data Exfiltration

    for event in events:

        if event.get("event_type") == "data_exfiltration":

            alerts.append({
                "alert_type": "Data Exfiltration",
                "severity": "critical",
                "mitre_attack": "T1041",
                "raw": event.get("raw")
            })

    # Ransomware

    for event in events:

        if event.get("event_type") == "ransomware":

            alerts.append({
                "alert_type": "Ransomware Activity",
                "severity": "critical",
                "mitre_attack": "T1486",
                "raw": event.get("raw")
            })

    return alerts
