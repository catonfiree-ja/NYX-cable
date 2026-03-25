@echo off
chcp 65001 >nul 2>&1
cd /d "C:\Users\ปิ๊ก\.gemini\antigravity\scratch\nyxcable-website\frontend"
echo === Current directory ===
cd
echo === Git status ===
git status --short
echo === Adding files ===
git add -A
echo === Committing ===
git commit -m "fix: delivery grid layout to match original site mosaic pattern"
echo === Pushing ===
git push
echo === Done ===
