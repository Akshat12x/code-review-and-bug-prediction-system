@echo off
echo.
echo  ==========================================
echo   CodeSentinel AI - Starting Project...
echo  ==========================================
echo.

REM Check if .env exists
if not exist "backend\.env" (
    echo  [!] backend\.env not found. Copying from .env.example...
    copy "backend\.env.example" "backend\.env" >nul
    echo  [!] Please edit backend\.env and add your GEMINI_API_KEY, then re-run this script.
    pause
    exit /b 1
)

REM Check if venv exists, create if not
if not exist "backend\venv" (
    echo  [*] Creating Python virtual environment...
    cd backend
    python -m venv venv
    cd ..
)

REM Install backend deps if needed
echo  [*] Checking backend dependencies...
backend\venv\Scripts\pip install -r backend\requirements.txt -q

REM Install frontend deps if needed
if not exist "frontend\node_modules" (
    echo  [*] Installing frontend dependencies...
    cd frontend
    npm install --silent
    cd ..
)

echo.
echo  [*] Starting Backend  ^(http://localhost:8000^)
echo  [*] Starting Frontend ^(http://localhost:5173^)
echo.
echo  Press Ctrl+C to stop both servers.
echo.

cd frontend
npm run start
