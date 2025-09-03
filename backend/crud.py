from sqlalchemy.orm import Session
from models import Trend
import uuid
from datetime import datetime

# ✅ Create a new trend record
def create_trend(db: Session, data: dict):
    trend = Trend(
        id=str(uuid.uuid4()),
        trend1=data.get("trend1"),
        trend2=data.get("trend2"),
        trend3=data.get("trend3"),
        trend4=data.get("trend4"),
        trend5=data.get("trend5"),
        datetime=datetime.utcnow(),
        ip=data.get("ip", "127.0.0.1")
    )
    db.add(trend)
    db.commit()
    db.refresh(trend)
    return trend

# ✅ Get latest trend
def get_latest_trend(db: Session):
    return db.query(Trend).order_by(Trend.datetime.desc()).first()

# ✅ Get all trends (with pagination)
def get_all_trends(db: Session, limit: int = 10, offset: int = 0):
    return db.query(Trend).order_by(Trend.datetime.desc()).offset(offset).limit(limit).all()

# ✅ Get trend by ID
def get_trend_by_id(db: Session, trend_id: str):
    return db.query(Trend).filter(Trend.id == trend_id).first()

# ✅ Delete trend by ID
def delete_trend(db: Session, trend_id: str):
    trend = db.query(Trend).filter(Trend.id == trend_id).first()
    if trend:
        db.delete(trend)
        db.commit()
        return True
    return False
