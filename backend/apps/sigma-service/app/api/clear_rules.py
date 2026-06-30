from fastapi import APIRouter
from app.store.rules import sigma_rules

router = APIRouter()

@router.delete("/rules")

async def clear_rules():

    sigma_rules.clear()

    return {
        "message": "All Sigma rules cleared from memory (disk files preserved)"
    }
