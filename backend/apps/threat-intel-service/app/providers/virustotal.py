import os
import httpx


API_KEY = os.getenv(
    "VIRUSTOTAL_API_KEY"
)


class VirusTotalProvider:

    @staticmethod
    async def check_ip(ip: str):

        url = (
            f"https://www.virustotal.com/api/v3/"
            f"ip_addresses/{ip}"
        )

        headers = {
            "x-apikey": API_KEY
        }

        async with httpx.AsyncClient() as client:

            response = await client.get(
                url,
                headers=headers,
            )

            if response.status_code != 200:
                return None

            data = response.json()

            stats = data["data"][
                "attributes"
            ]["last_analysis_stats"]

            return {
                "malicious":
                stats.get("malicious", 0),

                "suspicious":
                stats.get("suspicious", 0),
            }
