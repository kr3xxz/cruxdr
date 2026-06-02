from fastapi import APIRouter

from app.core.hunt_engine import (
    HuntEngine,
)

from app.store.events import (
    search_history,
)

router = APIRouter()


@router.get("/hunt")
async def hunt(
    q: str = "",
):

    results = (
        HuntEngine.execute(q)
    )

    return {
        "results":
        results
    }


@router.get("/history")
async def history():

    return {
        "history":
        search_history
    }
