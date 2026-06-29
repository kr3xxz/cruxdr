import redis.asyncio as redis

redis_client: redis.Redis | None = None

BLOCKED_IPS_KEY = "soar:blocked_ips"


async def get_redis():
    global redis_client
    if redis_client is None:
        redis_client = redis.Redis(
            host="crux-redis",
            port=6379,
            decode_responses=True,
        )
    return redis_client


async def block_ip(ip: str, ttl: int = 86400):
    r = await get_redis()
    await r.sadd(BLOCKED_IPS_KEY, ip)
    await r.expire(BLOCKED_IPS_KEY, ttl)


async def unblock_ip(ip: str):
    r = await get_redis()
    await r.srem(BLOCKED_IPS_KEY, ip)


async def get_blocked_ips():
    r = await get_redis()
    members = await r.smembers(BLOCKED_IPS_KEY)
    return sorted(members)


async def is_blocked(ip: str) -> bool:
    r = await get_redis()
    return await r.sismember(BLOCKED_IPS_KEY, ip)
