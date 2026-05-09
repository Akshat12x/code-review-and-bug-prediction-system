<div align="center">

# CodeSentinel AI

### Gen-AI Powered Full Stack Code Review & Bug Prediction System

![Python](https://img.shields.io/badge/Python-3.11+-3776AB?style=flat&logo=python&logoColor=white)
![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=flat&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=flat&logo=typescript&logoColor=white)
![Gemini](https://img.shields.io/badge/Gemini-1.5_Flash-4285F4?style=flat&logo=google&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

A final-year capstone project that leverages **Google Gemini 1.5 Flash** to perform deep AI-driven code review, bug prediction, security vulnerability detection, and performance analysis — built on a modern full-stack React + FastAPI architecture.

</div>

---

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Docker](#docker)
- [Screenshots](#screenshots)

---

## Features

| # | Feature | Description |
|---|---------|-------------|
| 1 | **AI Code Review** | Deep static analysis powered by Google Gemini 1.5 Flash |
| 2 | **Bug Prediction** | Detects bugs with severity scoring — Critical / High / Medium / Low |
| 3 | **Security Scanning** | Identifies OWASP-style vulnerabilities with fix recommendations |
| 4 | **Performance Analysis** | Spots bottlenecks and suggests concrete optimizations |
| 5 | **Auto Fix** | AI generates a fully corrected version of your code |
| 6 | **Analytics Dashboard** | Pie charts and stats tracking review history and trends |
| 7 | **PDF Export** | Download a professional, color-coded review report |
| 8 | **Multi-language** | Python, JavaScript, TypeScript, Java, C++, Go, Rust, and more |
| 9 | **Monaco Editor** | VS Code-grade in-browser code editor with syntax highlighting |
| 10 | **Mobile Responsive** | Fully responsive UI with collapsible sidebar on mobile |

---

## Architecture

```
┌──────────────────────┐          HTTP / REST          ┌──────────────────────────┐
│     React + TS       │ ◄───────────────────────────► │    FastAPI  (Python)      │
│     Tailwind CSS v4  │                               │    SQLAlchemy + SQLite    │
│     Monaco Editor    │                               │    Pydantic v2            │
│     Recharts         │                               └────────────┬─────────────┘
│     Axios            │                                            │
└──────────────────────┘                                            ▼
                                                       ┌──────────────────────────┐
                                                       │    Google Gemini AI      │
                                                       │    gemini-1.5-flash      │
                                                       └──────────────────────────┘
```

**Data Flow:**
1. User pastes code into the Monaco editor and submits
2. FastAPI receives the request and forwards code + language to Gemini
3. Gemini returns a structured JSON analysis (bugs, security, performance, fix)
4. Results are persisted to SQLite and returned to the frontend
5. Frontend renders the analysis with severity badges, score ring, and collapsible sections

---

## Tech Stack

### Backend
| Package | Version | Purpose |
|---------|---------|---------|
| FastAPI | 0.115 | REST API framework |
| SQLAlchemy | 2.0 | ORM & database layer |
| Google Generative AI | 0.8 | Gemini AI integration |
| Pydantic | 2.11 | Request/response validation |
| ReportLab | 4.2 | PDF report generation |
| Uvicorn | 0.32 | ASGI server |
| python-dotenv | 1.0 | Environment variable management |

### Frontend
| Package | Version | Purpose |
|---------|---------|---------|
| React | 19 | UI framework |
| TypeScript | 5 | Type safety |
| Vite | 8 | Build tool & dev server |
| Tailwind CSS | v4 | Utility-first styling |
| Monaco Editor | 4.7 | In-browser code editor |
| Recharts | 3.8 | Analytics charts |
| Axios | 1.15 | HTTP client |
| React Router | 7 | Client-side routing |
| Lucide React | latest | Icon library |
| Inter (Fontsource) | — | Typography |

### Infrastructure
| Tool | Purpose |
|------|---------|
| SQLite | Embedded database (zero config) |
| Docker + Compose | Optional containerized deployment |

---

## Project Structure

```
├── backend/
│   ├── app/
│   │   ├── main.py                 # FastAPI app, CORS, startup
│   │   ├── models/
│   │   │   ├── database.py         # SQLAlchemy ORM models (User, Review)
│   │   │   └── db.py               # Engine, session, table creation
│   │   ├── routers/
│   │   │   └── reviews.py          # All review endpoints (CRUD + AI + PDF)
│   │   ├── schemas/
│   │   │   └── schemas.py          # Pydantic request/response schemas
│   │   └── services/
│   │       ├── gemini.py           # Gemini AI prompt + JSON parsing
│   │       └── pdf.py              # ReportLab PDF generation
│   ├── requirements.txt
│   ├── Dockerfile
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Dashboard.tsx       # Analytics overview with charts
│   │   │   ├── NewReview.tsx       # Code editor + language selector
│   │   │   ├── ReviewDetail.tsx    # Full AI results with collapsible sections
│   │   │   └── History.tsx         # Review history with search & filter
│   │   ├── components/
│   │   │   ├── Layout.tsx          # App shell with sidebar
│   │   │   ├── Sidebar.tsx         # Navigation (desktop + mobile drawer)
│   │   │   ├── ScoreRing.tsx       # Animated SVG score ring
│   │   │   └── SeverityBadge.tsx   # Color-coded severity pill
│   │   ├── lib/
│   │   │   └── api.ts              # Axios instance
│   │   ├── types/
│   │   │   └── index.ts            # Shared TypeScript interfaces
│   │   └── index.css               # Tailwind v4 + global component classes
│   ├── vite.config.ts
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
├── start.bat                       # One-command project launcher (Windows)
└── README.md
```

---

## Getting Started

### Prerequisites

- [Python 3.11+](https://www.python.org/downloads/)
- [Node.js 20+](https://nodejs.org/)
- [Google Gemini API Key](https://aistudio.google.com/app/apikey) — free tier available

### 1. Clone the repository

```bash
git clone https://github.com/your-username/codesentinel-ai.git
cd codesentinel-ai
```

### 2. Configure environment

```bash
copy backend\.env.example backend\.env
```

Open `backend\.env` and set your Gemini API key:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Run the project

**Option A — Single command (Windows):**

```bat
start.bat
```

This script automatically creates the Python venv, installs all dependencies, and starts both servers.

**Option B — Manual (two terminals):**

```bash
# Terminal 1 — Backend
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

```bash
# Terminal 2 — Frontend
cd frontend
npm install
npm run dev
```

### 4. Open the app

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |

---

## Environment Variables

All variables are defined in `backend/.env`. Copy from `.env.example` to get started.

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `GEMINI_API_KEY` | ✅ Yes | — | Google Gemini API key |
| `DATABASE_URL` | No | `sqlite:///./codereviewer.db` | SQLAlchemy database URL |
| `SECRET_KEY` | No | fallback string | JWT signing secret |
| `ALGORITHM` | No | `HS256` | JWT algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | No | `60` | Token expiry duration |

---

## API Reference

Base URL: `http://localhost:8000/api`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/reviews/analyze` | Submit code for AI analysis |
| `GET` | `/reviews/history` | Get all past reviews |
| `GET` | `/reviews/analytics` | Get aggregated stats |
| `GET` | `/reviews/{id}` | Get a single review by ID |
| `GET` | `/reviews/{id}/export/pdf` | Download PDF report |
| `DELETE` | `/reviews/{id}` | Delete a review |

Full interactive docs available at [`/docs`](http://localhost:8000/docs) (Swagger UI).

---

## Docker

```bash
# 1. Set your API key
copy backend\.env.example backend\.env
# Edit backend\.env and add GEMINI_API_KEY

# 2. Build and run
docker-compose up --build
```

---

## Screenshots

> _Add screenshots of the Dashboard, New Review, and Review Detail pages here._

---

## License

This project is licensed under the [MIT License](LICENSE).

---

<div align="center">
  <sub>Built with ❤️ using Google Gemini AI · FastAPI · React · TypeScript</sub>
</div>
