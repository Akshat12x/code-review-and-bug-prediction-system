from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session
from typing import List
from app.models.db import get_db
from app.models.database import Review
from app.schemas.schemas import CodeReviewRequest, CodeReviewResponse, AnalyticsSummary
from app.services.gemini import analyze_code
from app.services.pdf import generate_pdf_report

router = APIRouter(prefix="/api/reviews", tags=["reviews"])


@router.post("/analyze", response_model=CodeReviewResponse, status_code=201)
async def create_review(payload: CodeReviewRequest, db: Session = Depends(get_db)):
    try:
        result = await analyze_code(payload.code, payload.language)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"AI analysis failed: {str(e)}")

    review = Review(
        user_id=1,
        title=payload.title,
        language=payload.language,
        original_code=payload.code,
        overall_score=result.get("overall_score", 0),
        summary=result.get("summary", ""),
        bugs=result.get("bugs", []),
        suggestions=result.get("suggestions", []),
        security_issues=result.get("security_issues", []),
        performance_issues=result.get("performance_issues", []),
        fixed_code=result.get("fixed_code"),
    )
    db.add(review)
    db.commit()
    db.refresh(review)
    return review


@router.get("/history", response_model=List[CodeReviewResponse])
def get_history(db: Session = Depends(get_db)):
    return db.query(Review).order_by(Review.created_at.desc()).all()


@router.get("/analytics", response_model=AnalyticsSummary)
def get_analytics(db: Session = Depends(get_db)):
    reviews = db.query(Review).all()
    if not reviews:
        return AnalyticsSummary(total_reviews=0, avg_score=0, languages_used={}, bugs_found=0, security_issues_found=0)

    lang_count: dict = {}
    total_bugs = 0
    total_sec = 0
    for r in reviews:
        lang_count[r.language] = lang_count.get(r.language, 0) + 1
        total_bugs += len(r.bugs or [])
        total_sec += len(r.security_issues or [])

    return AnalyticsSummary(
        total_reviews=len(reviews),
        avg_score=round(sum(r.overall_score for r in reviews) / len(reviews), 2),
        languages_used=lang_count,
        bugs_found=total_bugs,
        security_issues_found=total_sec,
    )


@router.get("/{review_id}", response_model=CodeReviewResponse)
def get_review(review_id: int, db: Session = Depends(get_db)):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    return review


@router.get("/{review_id}/export/pdf")
def export_pdf(review_id: int, db: Session = Depends(get_db)):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")

    review_dict = {
        "title": review.title,
        "language": review.language,
        "overall_score": review.overall_score,
        "summary": review.summary,
        "bugs": review.bugs,
        "security_issues": review.security_issues,
        "performance_issues": review.performance_issues,
        "suggestions": review.suggestions,
    }
    pdf_bytes = generate_pdf_report(review_dict, "user")
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=review_{review_id}.pdf"},
    )


@router.delete("/{review_id}", status_code=204)
def delete_review(review_id: int, db: Session = Depends(get_db)):
    review = db.query(Review).filter(Review.id == review_id).first()
    if not review:
        raise HTTPException(status_code=404, detail="Review not found")
    db.delete(review)
    db.commit()
