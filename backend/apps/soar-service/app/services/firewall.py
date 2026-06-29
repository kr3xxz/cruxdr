from app.core.redis import block_ip as redis_block_ip, get_blocked_ips


class FirewallService:

    @staticmethod
    async def block_ip(ip: str):
        await redis_block_ip(ip)
        print(f"[ACTION] Blocking IP {ip} (persisted in Redis)")

    @staticmethod
    async def list_blocked():
        return await get_blocked_ips()
