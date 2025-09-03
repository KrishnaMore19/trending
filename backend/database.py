from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

# Default database settings (local)
DB_USER = os.getenv("DATABASE_USER")
DB_PASSWORD = os.getenv("DATABASE_PASSWORD")
DB_NAME = os.getenv("DATABASE_NAME", "trending_db")
DB_PORT = os.getenv("DATABASE_PORT", "5432")
DB_HOST = os.getenv("DATABASE_HOST", "localhost")  # Default for local

# Auto-detect Docker (use service name 'db' if DOCKER=true)
if os.getenv("DOCKER", "false").lower() == "true":
    DB_HOST = "db"

# Build database URL
DATABASE_URL = f"postgresql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"

# Create engine with fallback to SQLite if PostgreSQL fails
try:
    engine = create_engine(DATABASE_URL, echo=False)
    with engine.connect() as conn:
        print(f"✅ Connected to PostgreSQL at {DB_HOST}:{DB_PORT}")
except Exception as e:
    print(f"❌ PostgreSQL connection failed: {e}")
    DATABASE_URL = "sqlite:///./trending.db"
    engine = create_engine(DATABASE_URL, echo=False)
    print("⚠️ Using SQLite fallback database")

# Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base class for models
Base = declarative_base()

# Dependency to get DB session in FastAPI
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
