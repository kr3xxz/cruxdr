import re

from app.store.rules import sigma_rules


class SigmaMatcher:

    @staticmethod
    def _extract_mitre(rule):
        for tag in rule.get("tags", []):
            t = tag.lower()
            if t.startswith("attack.t"):
                mid = tag.split(".", 1)[1]
                return mid[0].upper() + mid[1:]
            if t.startswith("t") and "." in t:
                return tag[0].upper() + tag[1:]
        return ""

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

                    severity = rule.get("severity") or rule.get("level") or "medium"

                    alerts.append(
                        {
                            "title":
                                rule.get(
                                    "title",
                                    "Sigma Match"
                                ),

                            "severity": severity,

                            "mitre_attack":
                                SigmaMatcher._extract_mitre(
                                    rule
                                ),

                            "alert_type":
                                rule.get(
                                    "title",
                                    "Sigma Match"
                                ),

                            "event":
                                event,
                        }
                    )

                    break

        return alerts
