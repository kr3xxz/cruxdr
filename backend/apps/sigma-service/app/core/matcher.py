class SigmaMatcher:

    @staticmethod
    def match(event):

        alerts = []

        process_name = event.get(
            "process_name",
            ""
        )

        event_id = event.get(
            "event_id"
        )

        message = event.get(
            "message",
            ""
        )

        if (
            process_name == "powershell.exe"
        ):

            alerts.append(
                {
                    "title": "Suspicious PowerShell Activity",
                    "severity": "high",
                    "event": event,
                }
            )

        if (
            event_id == 4625
        ):

            alerts.append(
                {
                    "title": "Failed Login Attempt",
                    "severity": "medium",
                    "event": event,
                }
            )

        if (
            "encryption" in message.lower()
        ):

            alerts.append(
                {
                    "title": "Possible Ransomware Detected",
                    "severity": "critical",
                    "event": event,
                }
            )

        return alerts
