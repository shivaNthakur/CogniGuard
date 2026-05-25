# backend/routers/telemetry.py
from fastapi import APIRouter
from main import redis_client
from services.ml_client import call_agent
from services.trust_engine import recompute_trust
from services.explanation import generate_explanation
import asyncio, json
router = APIRouter()
# ■■ Transaction — CRITICAL path ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
@router.post('/transaction')
async def receive_transaction(body: dict):
sid = body['session_id']
# Extract features for Agent 3 (Financial)
fin_features = {
'amount_zscore': (body.get('amount', 0) - 5000) / 2000,
'beneficiary_seen_before': 0 if body.get('is_new_beneficiary') else 1,
'time_of_day_bin': 0 if body.get('after_hours') else 2,
'amount_vs_7day_avg': body.get('amount', 0) / 5000,
'new_device_flag': 1 if body.get('device_changed') else 0,
'location_change_flag': 0,
}
# Extract features for Agent 5 (Coercion)
coer_features = {
'large_amount_flag': body.get('amount', 0) > 50000,
'new_beneficiary_flag': body.get('is_new_beneficiary', False),
'after_hours_flag': body.get('after_hours', False),
'typing_speed_spike': False, # set by keystroke stream
'nav_sequence_deviation': False,
'error_rate_delta': 0.0,
}
# Call Agent 3 and Agent 5 in parallel
fin_resp, coer_resp = await asyncio.gather(
call_agent(3, sid, fin_features),
call_agent(5, sid, coer_features),
return_exceptions=True
)
# Handle ML service errors gracefully
fin_score = fin_resp.get('score', 0.1) if isinstance(fin_resp, dict) else 0.1
coer_score = coer_resp.get('score', 0.1) if isinstance(coer_resp, dict) else 0.1
# Recompute trust and update Redis
new_trust = await recompute_trust(sid, {'financial': fin_score, 'coercion': coer_score})
from session import get_action
action = get_action(new_trust)
# Generate explanation for Anshul's SHAP cards
explanation = generate_explanation({'financial': fin_score, 'coercion': coer_score}, body)
await redis_client.hset(f'session:{sid}', 'explanation', json.dumps(explanation))
# If FREEZE — save alert to DB
if action == 'FREEZE':
from services.alert_service import create_alert
await create_alert(sid, 'coercion', explanation, 'CRITICAL')
return {'received': True, 'trust_score': new_trust,
'action': action, 'explanation': explanation}
# ■■ Keystroke ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
@router.post('/keystroke')
async def receive_keystroke(body: dict):
sid = body.get('session_id')
events = body.get('events', [])
if not events: return {'received': True, 'event_count': 0}
# Push to Redis Stream for background processing
await redis_client.xadd('stream:keystroke',
{'session_id': sid, 'events': json.dumps(events)},
maxlen=10000)
return {'received': True, 'event_count': len(events)}
# ■■ Touch ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
@router.post('/touch')
async def receive_touch(body: dict):
await redis_client.xadd('stream:touch',
{'session_id': body.get('session_id'), 'events': json.dumps(body.get('events', []))},
maxlen=10000)
return {'received': True, 'event_count': len(body.get('events', []))}