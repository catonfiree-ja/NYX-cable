@echo off
echo === Building NYX Cable Frontend ===
cd /d "C:\Users\ปิ๊ก\.gemini\antigravity\scratch\nyxcable-website\frontend"
call npm run build
if %errorlevel% neq 0 (
    echo.
    echo ❌ BUILD FAILED! Check errors above.
    pause
    exit /b 1
)
echo.
echo ✅ Build succeeded!
echo.
echo === Pushing to Git ===
git add -A
git commit -m "refactor: remove hardcoded product data, use CMS 100%% with orderRank sorting"
git push
echo.
echo ✅ Pushed! Vercel will auto-deploy.
pause
