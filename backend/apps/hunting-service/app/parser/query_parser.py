class QueryParser:

    @staticmethod
    def parse(query: str):

        parsed = {
            "attack_type": None,
            "severity": None,
            "mitre": None,
            "keyword": None,
        }

        tokens = query.split()

        for token in tokens:

            if token.startswith(
                "attack_type="
            ):

                parsed[
                    "attack_type"
                ] = token.split("=")[1]

            elif token.startswith(
                "severity="
            ):

                parsed[
                    "severity"
                ] = token.split("=")[1]

            elif token.startswith(
                "mitre="
            ):

                parsed[
                    "mitre"
                ] = token.split("=")[1]

            else:

                parsed[
                    "keyword"
                ] = token

        return parsed
