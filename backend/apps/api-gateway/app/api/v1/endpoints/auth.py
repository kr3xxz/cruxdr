from fastapi import APIRouter
from fastapi import Depends
from fastapi import HTTPException

from sqlalchemy.ext.asyncio import AsyncSession

from app.db.session import get_db
from app.schemas.auth import (
    UserRegister,
    UserLogin,
    TokenResponse,
)
from app.services.auth_service import AuthService
from app.core.security import create_access_token

router = APIRouter()


@router.post(
    "/register",
    response_model=TokenResponse,
)
async def register(
    user_data: UserRegister,
    db: AsyncSession = Depends(get_db),
):

    user = await AuthService.create_user(
        db,
        user_data,
    )

    token = create_access_token(
        subject=user.username
    )

    return TokenResponse(
        access_token=token
    )


@router.post(
    "/login",
    response_model=TokenResponse,
)
async def login(
    credentials: UserLogin,
    db: AsyncSession = Depends(get_db),
):

    user = await AuthService.authenticate_user(
        db,
        credentials.username,
        credentials.password,
    )

    if not user:
        raise HTTPException(
            status_code=401,
            detail="Invalid credentials",
        )

    token = create_access_token(
        subject=user.username
    )

    return TokenResponse(
        access_token=token
    )
