class FirewallService:

    @staticmethod
    async def block_ip(
        ip: str,
    ):

        print(
            f"[ACTION] Blocking IP {ip}"
        )

        # Later:
        # iptables
        # cloud firewall APIs
        # WAF integrations
