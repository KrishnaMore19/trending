from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from sqlalchemy import text  # ✅ Add this import
from database import engine, Base, get_db
import models, crud
from scraper import scrape_trending_topics
from datetime import datetime

# ✅ Create tables
Base.metadata.create_all(bind=engine)

# ✅ FastAPI App
app = FastAPI(
    title="X Trending Topics API",
    description="API for scraping and retrieving trending topics from X (Twitter)",
    version="1.0.0"
)

# ✅ CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # ⚠️ Change to frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# -------------------- ROUTES --------------------

@app.get("/", tags=["Health Check"])
def root():
    return {
        "message": "X Trending Topics API is running!",
        "version": "1.0.0",
        "status": "healthy",
        "timestamp": datetime.utcnow()
    }

# 🔹 Scrape and Save
@app.post("/scrape", tags=["Scraping"])
def scrape_and_save(db: Session = Depends(get_db)):
    try:
        # Call real Selenium scraper
        scraped_data = scrape_trending_topics()

        if not scraped_data:
            raise HTTPException(status_code=500, detail="Scraping failed, no data returned")

        # Save to DB
        trend = crud.create_trend(db, scraped_data)

        return {
            "status": "success",
            "message": "Trends scraped and saved successfully",
            "data": trend.__dict__
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 🔹 Get latest trend
@app.get("/trends", tags=["Trends"])
def get_latest_trends(db: Session = Depends(get_db)):
    trend = crud.get_latest_trend(db)
    if not trend:
        raise HTTPException(status_code=404, detail="No trends found")
    return {"status": "success", "data": trend.__dict__}

# 🔹 Get all trends with pagination
@app.get("/trends/all", tags=["Trends"])
def get_all_trends(limit: int = 10, offset: int = 0, db: Session = Depends(get_db)):
    records = crud.get_all_trends(db, limit, offset)
    return {
        "status": "success",
        "total": len(records),
        "data": [record.__dict__ for record in records]
    }

# 🔹 Get trend by ID
@app.get("/trends/{trend_id}", tags=["Trends"])
def get_trend_by_id(trend_id: str, db: Session = Depends(get_db)):
    record = crud.get_trend_by_id(db, trend_id)
    if not record:
        raise HTTPException(status_code=404, detail=f"Trend with ID '{trend_id}' not found")
    return {"status": "success", "data": record.__dict__}

# 🔹 Delete trend by ID
@app.delete("/trends/{trend_id}", tags=["Trends"])
def delete_trend(trend_id: str, db: Session = Depends(get_db)):
    deleted = crud.delete_trend(db, trend_id)
    if not deleted:
        raise HTTPException(status_code=404, detail=f"Trend with ID '{trend_id}' not found")
    return {"status": "success", "message": f"Trend with ID '{trend_id}' deleted successfully"}

# 🔹 Health Check with DB - FIXED VERSION
@app.get("/health", tags=["Health Check"])
def health_check(db: Session = Depends(get_db)):
    try:
        # ✅ Use text() wrapper for raw SQL
        db.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception as e:
        db_status = f"error: {str(e)}"

    return {
        "status": "healthy",
        "timestamp": datetime.utcnow(),
        "database": db_status,
        "version": "1.0.0"
    }