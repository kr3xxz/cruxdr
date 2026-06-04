from app.store.rules import sigma_rules


class SigmaMatcher:

    @staticmethod
    def match(event):

        alerts = []

        raw = str(
            event.get("raw", "")
        ).lower()

        message = str(
            event.get("message", "")
        ).lower()

        content = (
            raw + " " + message
        )

        for rule in sigma_rules:

            detection = rule.get(
                "detection",
                {}
            )

            keywords = detection.get(
                "keywords",
                []
            )

            for keyword in keywords:

                if (
                    keyword.lower()
                    in content
                ):

                    alerts.append(
                        {
                            "title":
                                rule.get(
                                    "title",
                                    "Sigma Match"
                                ),

                            "severity":
                                rule.get(
                                    "severity",
                                    "medium"
                                ),

                            "event":
                                event,
                        }
                    )

                    break

        return alerts
