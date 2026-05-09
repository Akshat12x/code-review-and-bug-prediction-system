from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    reviews = relationship("Review", back_populates="owner", cascade="all, delete")


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    title = Column(String(200), nullable=False)
    language = Column(String(50), nullable=False)
    original_code = Column(Text, nullable=False)
    overall_score = Column(Float, default=0.0)
    summary = Column(Text)
    bugs = Column(JSON, default=list)
    suggestions = Column(JSON, default=list)
    security_issues = Column(JSON, default=list)
    performance_issues = Column(JSON, default=list)
    fixed_code = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    owner = relationship("User", back_populates="reviews")
