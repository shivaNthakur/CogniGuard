# backend/main.py
from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware
import asyncio, httpx, uuid, json
import redis.asyncio as aioredis
from explanation import generate_explanation
from database import init_db, save_session_db

app = FastAPI(title='CogniGuard API')
app.add_middleware(CORSMiddleware, allow_origins=['*'], allow_methods=['*'], allow_headers=['*'])
redis_client = None

@app.on_event('startup')
async def startup():
    global redis_client
    redis_client = aioredis.from_url('redis://redis:6379')
    # Initialize Postgres DB on startup (Hour 6 task)
    try:
        await init_db()
    except Exception as e:
        print(f"DB Init Warning: {e} - (Will retry on connection)")

# ■■ Session start ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
@app.post('/api/v1/session/start')
async def start_session(body: dict):
    session_id = str(uuid.uuid4())
    user_id = body.get('user_id', 'demo_user_1')
    
    await redis_client.hset(f'session:{session_id}', mapping={
        'user_id': user_id, 'trust_score': 85, 'action': 'ALLOW',
        'identity': 0.15, 'financial': 0.12, 'coercion': 0.10,
        'explanation': '[]'
    })
    
    # Save to PostgreSQL
    try:
        await save_session_db(session_id, user_id)
    except Exception:
        pass # Silently fail for demo if Postgres isn't fully ready
        
    return {'session_id': session_id, 'user_id': user_id}

# ■■ WebSocket — live trust score push ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
@app.websocket('/api/v1/ws/{session_id}')
async def ws_endpoint(websocket: WebSocket, session_id: str):
    await websocket.accept()
    while True:
        data = await redis_client.hgetall(f'session:{session_id}')
        score = float(data.get(b'trust_score', 85))
        
        # Parse the explanation string back into JSON
        try:
            explanation_data = json.loads(data.get(b'explanation', b'[]').decode('utf-8'))
        except:
            explanation_data = []

        await websocket.send_json({
            'trust_score': score,
            'action': get_action(score),
            'agent_scores': {
                'financial': float(data.get(b'financial', 0.12)),
                'coercion': float(data.get(b'coercion', 0.10)),
            },
            'explanation': explanation_data
        })
        await asyncio.sleep(2)

# ■■ Keystroke Telemetry (Hour 5 Task) ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
@app.post('/api/v1/telemetry/keystroke')
async def receive_keystroke(body: dict):
    # For the mid-eval demo, we just need to accept the POST request successfully
    return {'received': True}

# ■■ Transaction telemetry — calls Prince's ML service ■■■■■■■■■■■■■■■■■
@app.post('/api/v1/telemetry/transaction')
async def receive_transaction(body: dict):
    sid = body['session_id']
    features = {
        'amount_zscore': (body.get('amount', 0) - 5000) / 2000,
        'beneficiary_seen_before': 0 if body.get('is_new_beneficiary') else 1,
        'time_of_day_bin': 0, 
        'amount_vs_7day_avg': body.get('amount', 0) / 5000,
        'new_device_flag': 0,
        'location_change_flag': 0,
        'large_amount_flag': body.get('amount',0) > 50000,
        'new_beneficiary_flag': body.get('is_new_beneficiary', False),
        'after_hours_flag': False,
    }
    
    try:
        async with httpx.AsyncClient(timeout=5) as client:
            r3 = await client.post('http://ml-engine:8001/ml/agent3/score',
                                   json={'session_id': sid, 'features': features})
            r5 = await client.post('http://ml-engine:8001/ml/agent5/score',
                                   json={'session_id': sid, 'features': features})
            
            fin = r3.json().get('score', 0.88)
            coer = r5.json().get('score', 0.91)
    except httpx.RequestError:
        # Fallback scores for demo if Prince's container isn't up yet
        fin, coer = 0.88, 0.91

    # Recompute trust
    trust = 100 * (1 - (fin * 0.40 + coer * 0.40 + 0.20 * 0.15))
    trust = max(0, min(100, round(trust, 2)))
    
    # Generate SHAP explanations
    explanations = generate_explanation({'financial': fin, 'coercion': coer}, features)

    await redis_client.hset(f'session:{sid}', mapping={
        'trust_score': trust, 
        'financial': fin, 
        'coercion': coer,
        'action': get_action(trust),
        'explanation': json.dumps(explanations)
    })
    return {'received': True}

# ■■ Alerts Endpoint (Day 2, Hour 7) ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
@app.get('/api/v1/alerts')
async def get_alerts():
    return [{
        "id": str(uuid.uuid4()),
        "session_id": "demo_session",
        "agent_name": "Agent 5 - Coercion",
        "reason": "Multiple coercion signals detected simultaneously",
        "severity": "CRITICAL",
        "triggered_at": "Just now"
    }]

# ■■ Session History (Day 2, Hour 8) ■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■■
@app.get('/api/v1/session/{session_id}/history')
async def get_session_history(session_id: str):
    # Returns a simulated recent timeline drop for the frontend chart
    return {
        "session_id": session_id,
        "history": [
            {"time": "10s ago", "score": 85},
            {"time": "8s ago", "score": 85},
            {"time": "6s ago", "score": 83},
            {"time": "4s ago", "score": 61},
            {"time": "2s ago", "score": 34}
        ]
    }

def get_action(score: float) -> str:
    if score >= 80: return 'ALLOW'
    elif score >= 60: return 'SOFT_OTP'
    elif score >= 40: return 'BIOMETRIC'
    else: return 'FREEZE'



# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import redis.asyncio as aioredis
from config import settings
from database import engine, Base
from routers import auth, session, telemetry, alerts, trust
app = FastAPI(title='CogniGuard API', version='1.0.0')
app.add_middleware(CORSMiddleware,
allow_origins=settings.cors_origins,
allow_credentials=True, allow_methods=['*'], allow_headers=['*'])
redis_client = None
@app.on_event('startup')
async def startup():
global redis_client
redis_client = aioredis.from_url(settings.redis_url, decode_responses=True)
async with engine.begin() as conn:
await conn.run_sync(Base.metadata.create_all)
print('CogniGuard backend started — docs at /docs')
app.include_router(auth.router, prefix='/api/v1/auth', tags=['Auth'])
app.include_router(session.router, prefix='/api/v1/session', tags=['Session'])
app.include_router(telemetry.router, prefix='/api/v1/telemetry', tags=['Telemetry'])
app.include_router(alerts.router, prefix='/api/v1/alerts', tags=['Alerts'])
app.include_router(trust.router, prefix='/api/v1', tags=['Trust'])
@app.get('/health')
async def health():
return {'status': 'ok', 'service': 'cogniguard-backend', 'version': '1.0.0'}