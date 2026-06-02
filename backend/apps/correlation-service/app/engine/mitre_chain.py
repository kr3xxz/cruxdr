MITRE_CHAINS = {
    "T1110": "Credential Access",
    "T1566": "Initial Access",
    "T1486": "Impact",
}


class MitreChainEngine:

    @staticmethod
    def enrich(event):

        technique = event.get(
            "mitre_technique"
        )

        tactic = MITRE_CHAINS.get(
            technique,
            "Unknown"
        )

        event["mitre_tactic"] = tactic

        return event
