import time
import uuid

from starlette.middleware.base import (
    BaseHTTPMiddleware,
)

from app.logging.logger import logger


class RequestLoggingMiddleware(
    BaseHTTPMiddleware
):

    async def dispatch(
        self,
        request,
        call_next,
    ):

        correlation_id = str(uuid.uuid4())

        request.state.correlation_id = (
            correlation_id
        )

        start_time = time.time()

        response = await call_next(request)

        duration = round(
            time.time() - start_time,
            4,
        )

        logger.info(
            "request_completed",
            method=request.method,
            path=request.url.path,
            status_code=response.status_code,
            duration=duration,
            correlation_id=correlation_id,
            client=request.client.host,
        )

        response.headers[
            "X-Correlation-ID"
        ] = correlation_id

        return response
