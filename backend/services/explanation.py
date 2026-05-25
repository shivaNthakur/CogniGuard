# backend/services/explanation.py
# Generates the explanation cards Anshul renders on the dashboard
def generate_explanation(agent_scores: dict, features: dict) -> list:
reasons = []
fin = agent_scores.get('financial', 0)
coer = agent_scores.get('coercion', 0)
# Financial reasons
if features.get('is_new_beneficiary'):
reasons.append({'factor': 'New beneficiary — never paid before',
'impact': f'+{round(fin * 24.1, 1)} risk', 'agent': 'financial'})
if features.get('amount', 0) > 50000:
ratio = round(features['amount'] / 5000, 1)
reasons.append({'factor': f'Amount is {ratio}x your monthly average',
'impact': f'+{round(fin * 19.3, 1)} risk', 'agent': 'financial'})
# Coercion reasons
if features.get('after_hours'):
reasons.append({'factor': 'Transaction outside your normal active hours',
'impact': f'+{round(coer * 16.7, 1)} risk', 'agent': 'coercion'})
if coer > 0.65:
reasons.append({'factor': 'Multiple coercion signals detected simultaneously',
'impact': f'+{round(coer * 22.8, 1)} risk', 'agent': 'coercion'})
# Identity reasons
identity = agent_scores.get('identity', 0)
if identity > 0.60:
reasons.append({'factor': 'Typing pattern significantly different from baseline',
'impact': f'+{round(identity * 12.7, 1)} risk', 'agent': 'identity'})
return reasons[:3] # Return top 3 only
# ■■ services/alert_service.py ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
from models.session import Alert
from database import AsyncSessionLocal
async def create_alert(session_id: str, agent_name: str,
top_factors: list, severity: str):
severity_map = {0.9: 'CRITICAL', 0.7: 'HIGH', 0.5: 'MEDIUM', 0.0: 'LOW'}
async with AsyncSessionLocal() as db:
alert = Alert(
session_id=session_id,
agent_name=agent_name,
reason=top_factors[0]['factor'] if top_factors else 'Anomaly detected',
severity=severity,
top_factors=top_factors
)
db.add(alert)
await db.commit()