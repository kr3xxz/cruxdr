from fastapi import APIRouter
from fastapi import Depends

from app.core.dependencies import (
    get_current_user,
)

router = APIRouter()


@router.get("/me")
async def get_me(
    current_user=Depends(get_current_user),
):

    return {
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role,
    }
