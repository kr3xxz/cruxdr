from fastapi import APIRouter

from app.data.store import responses_store
from app.core.engine import SOAREngine
from app.services.firewall import FirewallService


router = APIRouter()


@router.get("/responses")
async def get_responses():
    return responses_store[::-1]


@router.post("/responses")
async def execute_response(incident: dict):
    return await SOAREngine.execute(incident)


@router.delete("/responses")
async def clear_responses():
    responses_store.clear()
    return {"message": "Responses cleared"}


@router.get("/blocked-ips")
async def list_blocked_ips():
    return {"blocked_ips": await FirewallService.list_blocked()}
