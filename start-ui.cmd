@echo off
cd /d "%~dp0"
if not exist node_modules (
  echo Installing dependencies...
  call npm install
)
echo Starting AI Knowledge Assistant - UI at http://127.0.0.1:5173
echo Make sure the backend is running at http://localhost:8080
call npm run dev
