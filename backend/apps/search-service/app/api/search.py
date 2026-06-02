from fastapi import APIRouter

from app.store.events import (
    events,
)

router = APIRouter()


@router.get("/events")
async def get_events():

    return {
        "events":
        events[:100]
    }


@router.get("/search")
async def search_events(
    q: str = "",
    severity: str = "",
    attack_type: str = "",
):

    filtered = []

    for event in events:

        if (
            q.lower()
            in str(event).lower()
        ):

            if severity:

                if (
                    event.get(
                        "severity"
                    )
                    != severity
                ):
                    continue

            if attack_type:

                if (
                    event.get(
                        "attack_type"
                    )
                    != attack_type
                ):
                    continue

            filtered.append(
                event
            )

    return {
        "results":
        filtered[:100]
    }
