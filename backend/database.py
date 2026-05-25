# backend/database.py
import asyncpg
import os

# Fetch from environment variable provided by docker-compose, fallback to default
POSTGRES_URL = os.getenv("POSTGRES_URL", "postgresql://postgres:secret@postgres:5432/cogniguard")

async def init_db():
    conn = await asyncpg.connect(POSTGRES_URL)
    # Create a basic table to satisfy the Hour 6 requirement
    await conn.execute('''
        CREATE TABLE IF NOT EXISTS sessions (
            id SERIAL PRIMARY KEY,
            session_id VARCHAR(255) UNIQUE,
            user_id VARCHAR(255),
            start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            trust_score FLOAT,
            action VARCHAR(50)
        );
    ''')
    await conn.close()

async def save_session_db(session_id: str, user_id: str):
    conn = await asyncpg.connect(POSTGRES_URL)
    await conn.execute(
        'INSERT INTO sessions (session_id, user_id) VALUES ($1, $2) ON CONFLICT DO NOTHING',
        session_id, user_id
    )
    await conn.close()




# backend/database.py
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from config import settings
engine = create_async_engine(settings.postgres_url, echo=False)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)
class Base(DeclarativeBase):
pass
# Dependency — use in every router that needs DB
async def get_db():
async with AsyncSessionLocal() as session:
try:
yield session
await session.commit()
except Exception:
await session.rollback()
raise