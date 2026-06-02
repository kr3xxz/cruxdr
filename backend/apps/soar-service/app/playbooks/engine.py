from app.providers.slack import (
    SlackProvider,
)

from app.providers.discord import (
    DiscordProvider,
)

from app.services.firewall import (
    FirewallService,
)


class PlaybookEngine:

    @staticmethod
    async def execute(
        incident,
    ):

        data = incident.get(
            "data",
            incident
        )

        risk = data.get(
            "risk_score",
            0,
        )

        ip = data.get(
            "source_ip",
            "unknown",
        )

        title = data.get(
            "title",
            "Unknown Incident",
        )

        username = data.get(
            "username",
            "unknown",
        )

        message = f"""
🚨 CruXDR Incident

Title: {title}
Username: {username}
IP: {ip}
Risk Score: {risk}
"""

        await SlackProvider.send_message(
            message
        )

        await DiscordProvider.send_message(
            message
        )

        if risk >= 80:

            print(
                f"[*] Blocking IP: {ip}",
                flush=True
            )

            await FirewallService.block_ip(
                ip
            )
