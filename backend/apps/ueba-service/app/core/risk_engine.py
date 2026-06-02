class UserRiskEngine:

    @staticmethod
    def calculate(events):

        score = 0

        for event in events:

            attack = event.get(
                "attack_type"
            )

            if attack == "ransomware":
                score += 50

            elif attack == "phishing":
                score += 25

            elif attack == "brute_force":
                score += 20

        return min(score, 100)
