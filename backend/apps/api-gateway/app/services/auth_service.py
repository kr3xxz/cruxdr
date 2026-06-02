from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.user import User
from app.schemas.auth import UserRegister
from app.core.security import (
    hash_password,
    verify_password,
)


class AuthService:

    @staticmethod
    async def create_user(
        db: AsyncSession,
        user_data: UserRegister,
    ) -> User:

        user = User(
            username=user_data.username,
            email=user_data.email,
            hashed_password=hash_password(
                user_data.password
            ),
        )

        db.add(user)

        await db.commit()

        await db.refresh(user)

        return user

    @staticmethod
    async def authenticate_user(
        db: AsyncSession,
        username: str,
        password: str,
    ):

        query = select(User).where(
            User.username == username
        )

        result = await db.execute(query)

        user = result.scalar_one_or_none()

        if not user:
            return None

        if not verify_password(
            password,
            user.hashed_password,
        ):
            return None

        return user
