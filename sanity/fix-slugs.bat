@echo off
cd /d "C:\Users\ปิ๊ก\.gemini\antigravity\scratch\nyxcable-website\sanity"

REM === Load SANITY_TOKEN from .env file — NEVER hardcode tokens ===
set SANITY_TOKEN=
for /f "usebackq tokens=1,2 delims==" %%a in ("..\..\.env") do (
  if "%%a"=="SANITY_TOKEN" set SANITY_TOKEN=%%b
)
if "%SANITY_TOKEN%"=="" (
  echo ERROR: SANITY_TOKEN not found in .env file
  echo Please create a .env file with: SANITY_TOKEN=your_token_here
  pause
  exit /b 1
)

node scripts/fix-cvv-vct-slugs.mjs
pause
