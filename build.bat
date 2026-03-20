@echo off
cd /d "%~dp0"
cd frontend
call npm run build
echo BUILD_EXIT_CODE=%ERRORLEVEL%
pause
