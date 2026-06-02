from jose import jwt
from fastapi import Depends
from fastapi import HTTPException
from fastapi.security import HTTPBearer
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.config import settings
from app.db.session import get_db
from app.models.user import User

security = HTTPBearer()


async def get_current_user(
    token=Depends(security),
    db: AsyncSession = Depends(get_db),
):

    try:
        payload = jwt.decode(
            token.credentials,
            settings.JWT_SECRET,
            algorithms=["HS256"],
        )

        username = payload.get("sub")

        if username is None:
            raise HTTPException(
                status_code=401,
                detail="Invalid token",
            )

        query = select(User).where(
            User.username == username
        )

        result = await db.execute(query)

        user = result.scalar_one_or_none()

        if user is None:
            raise HTTPException(
                status_code=401,
                detail="User not found",
            )

        return user

    except Exception:
        raise HTTPException(
            status_code=401,
            detail="Invalid authentication",
        )
