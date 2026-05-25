# backend/models/user.py
from sqlalchemy import String, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from database import Base
import uuid
class User(Base):
__tablename__ = 'users'
id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
username: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
email: Mapped[str] = mapped_column(String(200), unique=True, nullable=False)
password_hash:Mapped[str] = mapped_column(String(255), nullable=False)
role: Mapped[str] = mapped_column(String(20), default='user') # user|analyst|admin
enrolled_at: Mapped[DateTime] = mapped_column(DateTime, default=func.now())
# backend/models/session.py
from sqlalchemy import String, Float, DateTime, ForeignKey, JSON, func
from sqlalchemy.orm import Mapped, mapped_column
from database import Base
import uuid
class Session(Base):
__tablename__ = 'sessions'
id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
user_id: Mapped[str] = mapped_column(String, ForeignKey('users.id'))
start_time: Mapped[DateTime] = mapped_column(DateTime, default=func.now())
end_time: Mapped[DateTime] = mapped_column(DateTime, nullable=True)
final_score: Mapped[float] = mapped_column(Float, nullable=True)
action_taken: Mapped[str] = mapped_column(String(20), nullable=True)
channel: Mapped[str] = mapped_column(String(50), default='web')
device_info: Mapped[dict] = mapped_column(JSON, nullable=True)
class Alert(Base):
__tablename__ = 'alerts'
id: Mapped[str] = mapped_column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
session_id: Mapped[str] = mapped_column(String, ForeignKey('sessions.id'))
agent_name: Mapped[str] = mapped_column(String(50))
reason: Mapped[str] = mapped_column(String(500))
severity: Mapped[str] = mapped_column(String(20)) # LOW|MEDIUM|HIGH|CRITICAL
top_factors: Mapped[list]= mapped_column(JSON, default=list)
resolved: Mapped[bool]= mapped_column(default=False)
triggered_at: Mapped[DateTime] = mapped_column(DateTime, default=func.now())