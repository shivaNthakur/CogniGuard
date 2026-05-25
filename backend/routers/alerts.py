# backend/routers/alerts.py
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from database import get_db
from models.session import Alert
router = APIRouter()
@router.get('/')
async def get_all_alerts(
limit: int = 20, offset: int = 0,
severity: str = None,
db: AsyncSession = Depends(get_db)):
query = select(Alert).order_by(desc(Alert.triggered_at))
if severity:
query = query.where(Alert.severity == severity)
query = query.limit(limit).offset(offset)
result = await db.execute(query)
alerts = result.scalars().all()
return {'alerts': [
{'id': a.id, 'session_id': a.session_id, 'agent_name': a.agent_name,
'reason': a.reason, 'severity': a.severity,
'top_factors': a.top_factors, 'resolved': a.resolved,
'triggered_at': a.triggered_at.isoformat()}
for a in alerts], 'total': len(alerts)}
@router.get('/{session_id}')
async def get_session_alerts(session_id: str, db: AsyncSession = Depends(get_db)):
result = await db.execute(
select(Alert).where(Alert.session_id == session_id)
.order_by(desc(Alert.triggered_at)))
alerts = result.scalars().all()
return {'session_id': session_id,
'alerts': [{'id': a.id, 'agent_name': a.agent_name,
'reason': a.reason, 'severity': a.severity,
'top_factors': a.top_factors, 'resolved': a.resolved,
'triggered_at': a.triggered_at.isoformat()}
for a in alerts]}
@router.put('/{alert_id}/resolve')
async def resolve_alert(alert_id: str, body: dict,
db: AsyncSession = Depends(get_db)):
result = await db.execute(select(Alert).where(Alert.id == alert_id))
alert = result.scalar_one_or_none()
if not alert: raise HTTPException(status_code=404, detail='Alert not found')
alert.resolved = True
await db.commit()
return {'id': alert_id, 'resolved': True}