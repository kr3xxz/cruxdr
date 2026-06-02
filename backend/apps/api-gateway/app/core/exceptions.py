from fastapi.responses import JSONResponse

from app.logging.logger import logger


async def global_exception_handler(
    request,
    exc,
):

    logger.error(
        "unhandled_exception",
        error=str(exc),
        path=request.url.path,
    )

    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal server error"
        },
    )
