# backend/routers/auth.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from passlib.context import CryptContext
from jose import jwt, JWTError
from datetime import datetime, timedelta
from database import get_db
from models.user import User
from config import settings
router = APIRouter()
pwd_context = CryptContext(schemes=['bcrypt'], deprecated='auto')
def create_token(data: dict, expires_minutes: int = 60) -> str:
payload = data.copy()
payload['exp'] = datetime.utcnow() + timedelta(minutes=expires_minutes)
return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)
def verify_token(token: str) -> dict:
try:
return jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
except JWTError:
raise HTTPException(status_code=401, detail='Invalid or expired token')
# ■■ Register ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
@router.post('/register')
async def register(body: dict, db: AsyncSession = Depends(get_db)):
# Check email not already used
existing = await db.execute(select(User).where(User.email == body['email']))
if existing.scalar_one_or_none():
raise HTTPException(status_code=400, detail='Email already registered')
user = User(
username=body['username'],
email=body['email'],
password_hash=pwd_context.hash(body['password']),
role=body.get('role', 'user')
)
db.add(user)
await db.commit()
await db.refresh(user)
return {'id': user.id, 'username': user.username, 'email': user.email, 'role': user.role}
# ■■ Login ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
@router.post('/login')
async def login(body: dict, db: AsyncSession = Depends(get_db)):
result = await db.execute(select(User).where(User.email == body['email']))
user = result.scalar_one_or_none()
if not user or not pwd_context.verify(body['password'], user.password_hash):
raise HTTPException(status_code=401, detail='Invalid email or password')
access_token = create_token({'sub': user.id, 'role': user.role, 'name': user.username}, 60)
refresh_token = create_token({'sub': user.id, 'type': 'refresh'}, 60*24*7)
return {'access_token': access_token, 'refresh_token': refresh_token,
'token_type': 'bearer', 'role': user.role, 'user_id': user.id}
# ■■ Refresh ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
@router.post('/refresh')
async def refresh(body: dict):
payload = verify_token(body['refresh_token'])
if payload.get('type') != 'refresh':
raise HTTPException(status_code=401, detail='Not a refresh token')
new_token = create_token({'sub': payload['sub']}, 60)
return {'access_token': new_token, 'token_type': 'bearer'}
# ■■ Me ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
@router.get('/me')
async def me(db: AsyncSession = Depends(get_db),
token: str = Depends(oauth2_scheme)):
payload = verify_token(token)
result = await db.execute(select(User).where(User.id == payload['sub']))
user = result.scalar_one_or_none()
if not user: raise HTTPException(status_code=404, detail='User not found')
return {'id': user.id, 'username': user.username, 'email': user.email, 'role': user.role}