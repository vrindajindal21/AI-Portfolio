@echo off
echo Starting AI Portfolio...

:: Start Backend
echo Launching Backend (FastAPI) on port 8000...
start cmd /k "cd backend && venv\Scripts\python main.py"

:: Start Frontend
echo Launching Frontend (Vite) on port 5173...
start cmd /k "cd frontend && npm run dev"

echo.
echo All systems launching!
echo Frontend: http://localhost:5173
echo Backend:  http://localhost:8000
echo.
pause
