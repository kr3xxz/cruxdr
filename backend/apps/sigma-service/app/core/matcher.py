from app.store.rules import (
    sigma_rules,
)

from app.store.rules import (
    sigma_alerts,
)


class SigmaMatcher:

    @staticmethod
    def match(event):

        matched = []

        for rule in sigma_rules:

            keywords = (
                rule["detection"]
                .get("keywords", [])
            )

            for keyword in keywords:

                if (
                    keyword.lower()
                    in str(event).lower()
                ):

                    alert = {
                        "rule_title":
                        rule["title"],

                        "severity":
                        rule["severity"],

                        "mitre":
                        rule["mitre"][
                            "technique"
                        ],

                        "event":
                        event,
                    }

                    sigma_alerts.insert(
                        0,
                        alert,
                    )

                    del sigma_alerts[200:]

                    matched.append(
                        alert
                    )

                    break

        return matched
