from app.data.store import incidents_store


class IncidentBuilder:

    @staticmethod
    def create(alert):

        incident = {

            "title":
                alert.get(
                    "title"
                ),

            "severity":
                alert.get(
                    "severity"
                ),

            "timeline": [

                {
                    "step":
                        "Initial Detection",

                    "description":
                        alert["event"].get(
                            "message"
                        )
                }

            ],

            "iocs": [

                alert["event"].get(
                    "source_ip",
                    "N/A"
                ),

                alert["event"].get(
                    "destination_ip",
                    "N/A"
                ),
            ],

            "host":
                alert["event"].get(
                    "host"
                ),

            "user":
                alert["event"].get(
                    "user"
                ),

            "mitre":
                IncidentBuilder.map_mitre(
                    alert
                ),
        }

        incidents_store.append(
            incident
        )

        incidents_store[:] = \
            incidents_store[-50:]

        return incident


    @staticmethod
    def map_mitre(alert):

        title = \
            alert.get(
                "title",
                ""
            ).lower()

        if "ransomware" in title:
            return "T1486"

        if "brute" in title:
            return "T1110"

        if "exfiltration" in title:
            return "T1041"

        return "T1021"
