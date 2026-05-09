from pydantic import BaseModel, EmailStr
from typing import List, Optional, Any
from datetime import datetime


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserLogin(BaseModel):
    username: str
    password: str


class UserOut(BaseModel):
    id: int
    username: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str
    token_type: str
    user: UserOut


class BugItem(BaseModel):
    line: Optional[int] = None
    severity: str  # critical, high, medium, low
    type: str
    description: str
    suggestion: str


class SecurityIssue(BaseModel):
    line: Optional[int] = None
    severity: str
    issue: str
    recommendation: str


class PerformanceIssue(BaseModel):
    description: str
    recommendation: str


class CodeReviewRequest(BaseModel):
    title: str
    code: str
    language: str


class CodeReviewResponse(BaseModel):
    id: int
    title: str
    language: str
    original_code: str
    overall_score: float
    summary: str
    bugs: List[Any]
    suggestions: List[Any]
    security_issues: List[Any]
    performance_issues: List[Any]
    fixed_code: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


class AnalyticsSummary(BaseModel):
    total_reviews: int
    avg_score: float
    languages_used: dict
    bugs_found: int
    security_issues_found: int
