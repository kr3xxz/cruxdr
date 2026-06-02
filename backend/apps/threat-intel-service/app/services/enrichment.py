from app.providers.virustotal import (
    VirusTotalProvider,
)

from app.providers.abuseipdb import (
    AbuseIPDBProvider,
)


class ThreatEnrichmentService:

    @staticmethod
    async def enrich_incident(
        incident,
    ):

        data = incident.get(
            "data",
            {}
        )

        ip = data.get(
            "source_ip"
        )

        vt = await VirusTotalProvider.check_ip(
            ip
        )

        abuse = (
            await AbuseIPDBProvider.check_ip(
                ip
            )
        )

        data["threat_intelligence"] = {

            "virustotal": vt,

            "abuseipdb": abuse,
        }

        incident["data"] = data

        return incident
