from app.data.store import responses_store


class SOAREngine:

    @staticmethod
    def execute(incident):

        actions = []

        title = incident.get(
            "title",
            ""
        ).lower()

        if "ransomware" in title:

            actions = [

                {
                    "action":
                        "isolate_host",

                    "target":
                        incident.get(
                            "host"
                        ),

                    "status":
                        "executed"
                },

                {
                    "action":
                        "disable_user",

                    "target":
                        incident.get(
                            "user"
                        ),

                    "status":
                        "executed"
                },
            ]

        elif "brute" in title:

            actions = [

                {
                    "action":
                        "block_ip",

                    "target":
                        incident.get(
                            "iocs",
                            ["N/A"]
                        )[0],

                    "status":
                        "executed"
                }
            ]

        elif "exfiltration" in title:

            actions = [

                {
                    "action":
                        "terminate_connection",

                    "target":
                        incident.get(
                            "host"
                        ),

                    "status":
                        "executed"
                }
            ]

        response = {

            "incident":
                incident.get(
                    "title"
                ),

            "actions":
                actions
        }

        responses_store.append(
            response
        )

        responses_store[:] = \
            responses_store[-50:]

        return response
