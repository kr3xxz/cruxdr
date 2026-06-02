class RiskEngine:

    @staticmethod
    def calculate(
        attacks,
    ):

        score = 0

        for attack in attacks:

            severity = attack.get(
                "severity"
            )

            if severity == "critical":
                score += 50

            elif severity == "high":
                score += 30

            elif severity == "medium":
                score += 15

        return min(score, 100)
