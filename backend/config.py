# backend/config.py
from pydantic_settings import BaseSettings
from typing import list
class Settings(BaseSettings):
# PostgreSQL
postgres_url: str = 'postgresql+asyncpg://postgres:secret@localhost:5432/cogniguard'
# Redis
redis_url: str = 'redis://localhost:6379'
# ML Engine (Prince's service)
ml_service_url: str = 'http://localhost:8001'
# JWT
jwt_secret: str = 'local-dev-secret-change-in-production'
jwt_algorithm: str = 'HS256'
jwt_expire_minutes: int = 60
# CORS (Anshul's React at 5173, or 3000 if built)
cors_origins: list[str] = ['http://localhost:3000', 'http://localhost:5173']
class Config:
env_file = '.env'
settings = Settings()