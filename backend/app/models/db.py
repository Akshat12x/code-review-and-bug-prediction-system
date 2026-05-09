from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.database import Base
import os
from dotenv import load_dotenv

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./codereviewer.db")

engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def create_tables():
    Base.metadata.create_all(bind=engine)
    _seed_demo_user()


def _seed_demo_user():
    from app.models.database import User
    from passlib.context import CryptContext
    db = SessionLocal()
    try:
        if not db.query(User).filter(User.username == "demo").first():
            pwd = CryptContext(schemes=["bcrypt"], deprecated="auto")
            db.add(User(
                username="demo",
                email="demo@codesentinel.ai",
                hashed_password=pwd.hash("demo1234")
            ))
            db.commit()
    finally:
        db.close()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
