from pydantic_settings import BaseSettings
from pydantic import ConfigDict


class Settings(BaseSettings):
    PROJECT_NAME: str = "cruxdr"

    API_V1_PREFIX: str = "/api/v1"

    POSTGRES_DB: str
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str

    JWT_SECRET: str

    REDIS_PORT: int

    OPENSEARCH_PORT: int

    class Config:
        env_file = ".env"


settings = Settings()
