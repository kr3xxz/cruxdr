from sqlalchemy import String, Boolean
from sqlalchemy.orm import Mapped
from sqlalchemy.orm import mapped_column

from app.db.session import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)

    username: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        index=True,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        index=True,
    )

    hashed_password: Mapped[str]

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
    )

    role: Mapped[str] = mapped_column(
        String(50),
        default="analyst",
    )
