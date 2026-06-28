IP_COUNTRY_MAP = [
    ("10.", "Internal Network"),
    ("192.168.", "Corporate LAN"),
    ("172.16.", "Corporate LAN"),
    ("172.17.", "Corporate LAN"),
    ("172.18.", "Corporate LAN"),
    ("172.19.", "Corporate LAN"),
    ("172.20.", "Corporate LAN"),
    ("185.", "Russia"),
    ("78.", "Germany"),
    ("91.", "Russia"),
    ("46.", "Germany"),
    ("45.", "United States"),
    ("104.", "United States"),
    ("198.", "United States"),
    ("203.", "China"),
    ("219.", "China"),
    ("103.", "India"),
    ("106.", "India"),
    ("177.", "Brazil"),
    ("179.", "Brazil"),
    ("80.", "United Kingdom"),
    ("81.", "United Kingdom"),
    ("151.", "Italy"),
    ("93.", "Italy"),
    ("157.", "Japan"),
    ("133.", "Japan"),
    ("1.", "South Korea"),
    ("58.", "South Korea"),
    ("200.", "Brazil"),
    ("31.", "Netherlands"),
    ("195.", "Netherlands"),
    ("41.", "South Africa"),
    ("102.", "South Africa"),
]


class ImpossibleTravelEngine:

    @staticmethod
    def enrich(event):
        source_ip = (
            event.get("source_ip")
            or event.get("ip")
            or ""
        )

        for prefix, country in IP_COUNTRY_MAP:
            if source_ip.startswith(prefix):
                event["country"] = country
                return event

        event["country"] = "United States"
        return event
