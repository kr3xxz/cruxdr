from random import choice

COUNTRIES = [
    "India",
    "Germany",
    "USA",
    "Russia",
    "China",
]


class ImpossibleTravelEngine:

    @staticmethod
    def enrich(event):

        event["country"] = (
            choice(COUNTRIES)
        )

        return event
