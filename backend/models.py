from sqlalchemy import Column, String, DateTime
from database import Base
from datetime import datetime

class Trend(Base):
    __tablename__ = "trends"

    id = Column(String, primary_key=True, index=True)
    trend1 = Column(String, nullable=True)
    trend2 = Column(String, nullable=True)
    trend3 = Column(String, nullable=True)
    trend4 = Column(String, nullable=True)
    trend5 = Column(String, nullable=True)
    datetime = Column(DateTime, default=datetime.utcnow)
    ip = Column(String, nullable=True)
