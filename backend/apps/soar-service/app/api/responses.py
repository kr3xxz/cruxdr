from fastapi import APIRouter

from app.data.store import responses_store

from app.core.engine import SOAREngine


router = APIRouter()


@router.get("/responses")
async def get_responses():

    return responses_store[::-1]


@router.post("/responses")
async def execute_response(
    incident: dict
):

    return SOAREngine.execute(
        incident
    )
