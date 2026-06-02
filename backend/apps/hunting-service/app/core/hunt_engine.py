from app.store.events import (
    events,
)

from app.store.events import (
    search_history,
)

from app.parser.query_parser import (
    QueryParser,
)


class HuntEngine:

    @staticmethod
    def execute(query: str):

        parsed = (
            QueryParser.parse(
                query
            )
        )

        results = []

        for event in events:

            if (
                parsed["attack_type"]
            ):

                if (
                    event.get(
                        "attack_type"
                    )
                    != parsed[
                        "attack_type"
                    ]
                ):
                    continue

            if parsed["severity"]:

                if (
                    event.get(
                        "severity"
                    )
                    != parsed[
                        "severity"
                    ]
                ):
                    continue

            if parsed["mitre"]:

                if (
                    event.get(
                        "mitre_technique"
                    )
                    != parsed[
                        "mitre"
                    ]
                ):
                    continue

            if parsed["keyword"]:

                if (
                    parsed[
                        "keyword"
                    ].lower()
                    not in str(
                        event
                    ).lower()
                ):
                    continue

            results.append(
                event
            )

        search_history.insert(
            0,
            query,
        )

        del search_history[20:]

        return results[:100]
