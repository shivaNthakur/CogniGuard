# backend/services/ml_client.py
import httpx
from config import settings
async def call_agent(agent_num: int, session_id: str, features: dict) -> dict:
url = f'{settings.ml_service_url}/ml/agent{agent_num}/score'
payload = {'session_id': session_id, 'features': features}
try:
async with httpx.AsyncClient(timeout=5.0) as client:
response = await client.post(url, json=payload)
return response.json()
except httpx.TimeoutException:
print(f'[ML Client] Agent {agent_num} timeout — using fallback score')
return {'agent': f'agent{agent_num}', 'score': 0.15, 'flagged': False}
except Exception as e:
print(f'[ML Client] Agent {agent_num} error: {e}')
return {'agent': f'agent{agent_num}', 'score': 0.15, 'flagged': False}
# ■■ services/trust_engine.py ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
from main import redis_client
WEIGHTS = {'identity': 0.25, 'cognitive': 0.20, 'financial': 0.25,
'threat': 0.15, 'coercion': 0.15}
async def recompute_trust(session_id: str, new_scores: dict) -> float:
# Get current scores from Redis
data = await redis_client.hgetall(f'session:{session_id}')
current = {k: float(data.get(k, 0.10)) for k in WEIGHTS}
# Update with new scores
current.update(new_scores)
# Weighted fusion
total_risk = sum(current[k] * WEIGHTS[k] for k in WEIGHTS)
trust = round(max(0, min(100, 100 * (1 - total_risk))), 2)
# Save back to Redis
update = {k: str(v) for k, v in current.items()}
update['trust_score'] = str(trust)
from routers.session import get_action
update['action'] = get_action(trust)
await redis_client.hset(f'session:{session_id}', mapping=update)
# Save to score history list
import json
from datetime import datetime
await redis_client.lpush(f'history:{session_id}',
json.dumps({'trust_score': trust, 'action': update['action'],
'timestamp': datetime.utcnow().isoformat()}))
await redis_client.ltrim(f'history:{session_id}', 0, 19)
return trust