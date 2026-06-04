class SigmaMatcher:

    @staticmethod
    def match(event):

        alerts = []

        event_type = event.get(
            "event_type",
            ""
        )

        raw = event.get(
            "raw",
            ""
        ).lower()

        if event_type == "failed_login":

            alerts.append(
                {
                    "title": "Failed Login Attempt",
                    "severity": "medium",
                    "event": event,
                }
            )

        if event_type == "credential_access":

            alerts.append(
                {
                    "title": "Credential Access Detected",
                    "severity": "high",
                    "event": event,
                }
            )

        if event_type == "lateral_movement":

            alerts.append(
                {
                    "title": "Lateral Movement Detected",
                    "severity": "high",
                    "event": event,
                }
            )

        if event_type == "data_exfiltration":

            alerts.append(
                {
                    "title": "Data Exfiltration Detected",
                    "severity": "critical",
                    "event": event,
                }
            )

        if event_type == "privilege_escalation":

            alerts.append(
                {
                    "title": "Privilege Escalation Detected",
                    "severity": "high",
                    "event": event,
                }
            )

        if (
            event_type == "ransomware"
            or "encryptor" in raw
            or "encrypted" in raw
            or ".locked" in raw
        ):

            alerts.append(
                {
                    "title": "Possible Ransomware Detected",
                    "severity": "critical",
                    "event": event,
                }
            )

        return alerts
