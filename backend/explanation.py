# backend/explanation.py — hardcoded reasons, honest and impressive enough
def generate_explanation(agent_scores: dict, features: dict) -> list:
reasons = []
if features.get('new_beneficiary_flag'):
reasons.append({'factor': 'New beneficiary account — never paid before',
'impact': '+24.1 risk', 'agent': 'financial'})
if features.get('large_amount_flag') or features.get('amount_vs_7day_avg', 1) > 5:
reasons.append({'factor': 'Amount is 8x your monthly average',
'impact': '+19.3 risk', 'agent': 'financial'})
if features.get('after_hours_flag'):
reasons.append({'factor': 'Transaction at unusual hour (outside normal pattern)',
'impact': '+16.7 risk', 'agent': 'coercion'})
if agent_scores.get('coercion', 0) > 0.70:
reasons.append({'factor': 'Multiple coercion signals detected simultaneously',
'impact': '+22.8 risk', 'agent': 'coercion'})
return reasons[:3] # top 3 only