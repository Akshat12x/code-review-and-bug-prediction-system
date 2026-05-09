from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.models.db import create_tables
from app.routers import reviews

app = FastAPI(
    title="AI Code Review & Bug Prediction System",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(reviews.router)


@app.on_event("startup")
def startup():
    create_tables()


@app.get("/")
def root():
    return {"message": "AI Code Review API is running", "docs": "/docs"}
