from app.logging.logger import logger


def audit_log(
    action: str,
    username: str,
    resource: str,
):

    logger.info(
        "audit_event",
        action=action,
        username=username,
        resource=resource,
    )
