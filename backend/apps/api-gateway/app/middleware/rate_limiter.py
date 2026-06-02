import time

from fastapi import HTTPException
from starlette.middleware.base import (
    BaseHTTPMiddleware,
)

RATE_LIMIT = 100

request_store = {}


class RateLimitMiddleware(
    BaseHTTPMiddleware
):

    async def dispatch(
        self,
        request,
        call_next,
    ):

        client_ip = request.client.host

        current_time = int(time.time())

        if client_ip not in request_store:
            request_store[client_ip] = []

        request_store[client_ip] = [
            ts
            for ts in request_store[client_ip]
            if ts > current_time - 60
        ]

        if (
            len(request_store[client_ip])
            >= RATE_LIMIT
        ):
            return JSONResponse(
                status_code=429,
                detail="Rate limit exceeded",
            )

        request_store[client_ip].append(
            current_time
        )

        return await call_next(request)
