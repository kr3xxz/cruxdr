import os
import httpx


API_KEY = os.getenv(
    "ABUSEIPDB_API_KEY"
)


class AbuseIPDBProvider:

    @staticmethod
    async def check_ip(ip: str):

        url = (
            "https://api.abuseipdb.com/api/v2/check"
        )

        headers = {
            "Key": API_KEY,
            "Accept": "application/json",
        }

        params = {
            "ipAddress": ip,
            "maxAgeInDays": 90,
        }

        async with httpx.AsyncClient() as client:

            response = await client.get(
                url,
                headers=headers,
                params=params,
            )

            if response.status_code != 200:
                return None

            data = response.json()["data"]

            return {
                "abuse_score":
                data["abuseConfidenceScore"],

                "country":
                data["countryCode"],

                "isp":
                data["isp"],
            }
