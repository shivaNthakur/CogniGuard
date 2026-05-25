# backend/routers/session.py
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from database import get_db
from models.session import Session, Alert
import uuid, asyncio, json
from main import redis_client
router = APIRouter()
def get_action(score: float) -> str:
if score >= 80: return 'ALLOW'
elif score >= 60: return 'SOFT_OTP'
elif score >= 40: return 'BIOMETRIC'
else: return 'FREEZE'
# ■■ Start session ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
@router.post('/start')
async def start_session(body: dict, db: AsyncSession = Depends(get_db)):
session_id = str(uuid.uuid4())
await redis_client.hset(f'session:{session_id}', mapping={
'user_id': body.get('user_id', 'unknown'),
'trust_score': '85.0', 'action': 'ALLOW',
'identity': '0.15', 'cognitive': '0.12', 'financial': '0.10',
'threat': '0.08', 'coercion': '0.09',
'channel': body.get('channel', 'web'),
'explanation': '[]'
})
await redis_client.expire(f'session:{session_id}', 7200)
await redis_client.sadd('active_sessions', session_id)
# Save to PostgreSQL
session = Session(id=session_id, user_id=body.get('user_id', 'unknown'),
channel=body.get('channel', 'web'))
db.add(session)
await db.commit()
return {'session_id': session_id, 'user_id': body.get('user_id')}
# ■■ End session ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
@router.post('/end')
async def end_session(body: dict, db: AsyncSession = Depends(get_db)):
sid = body.get('session_id')
data = await redis_client.hgetall(f'session:{sid}')
final_score = float(data.get('trust_score', 0))
# Update PostgreSQL
result = await db.execute(select(Session).where(Session.id == sid))
session = result.scalar_one_or_none()
if session:
from datetime import datetime
session.end_time = datetime.utcnow()
session.final_score = final_score
session.action_taken= data.get('action', 'ALLOW')
await db.commit()
await redis_client.delete(f'session:{sid}')
await redis_client.srem('active_sessions', sid)
return {'session_id': sid, 'final_score': final_score}
# ■■ Get session ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
@router.get('/{session_id}')
async def get_session(session_id: str):
data = await redis_client.hgetall(f'session:{session_id}')
if not data: raise HTTPException(status_code=404, detail='Session not found')
return {
'session_id': session_id,
'trust_score': float(data.get('trust_score', 85)),
'action': data.get('action', 'ALLOW'),
'agent_scores': {
k: float(data.get(k, 0))
for k in ['identity','cognitive','financial','threat','coercion']
}
}
# ■■ WebSocket — user session ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
@router.websocket('/ws/{session_id}')
async def ws_user(websocket: WebSocket, session_id: str):
await websocket.accept()
try:
while True:
data = await redis_client.hgetall(f'session:{session_id}')
if not data:
await websocket.send_json({'error': 'session_not_found'}); break
score = float(data.get('trust_score', 85))
await websocket.send_json({
'trust_score': score,
'action': get_action(score),
'agent_scores': {k: float(data.get(k,0))
for k in ['identity','cognitive','financial','threat','coercion']},
'explanation': json.loads(data.get('explanation', '[]'))
})
await asyncio.sleep(2)
except WebSocketDisconnect:
pass
# ■■ WebSocket — analyst all sessions ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
@router.websocket('/ws/analyst')
async def ws_analyst(websocket: WebSocket):
await websocket.accept()
try:
while True:
session_ids = await redis_client.smembers('active_sessions')
sessions = []
for sid in session_ids:
d = await redis_client.hgetall(f'session:{sid}')
if d:
sessions.append({'session_id': sid,
'user_id': d.get('user_id', 'unknown'),
'trust_score': float(d.get('trust_score', 85)),
'action': d.get('action', 'ALLOW'),
'channel': d.get('channel', 'web')})
await websocket.send_json({'type': 'sessions_update', 'sessions': sessions})
await asyncio.sleep(3)
except WebSocketDisconnect:
pass