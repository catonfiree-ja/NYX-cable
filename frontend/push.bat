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
git commit -m "fix: disable Sanity CDN cache and prioritize CMS data over hardcoded fallbacks"
echo === Pushing ===
git push
echo === Done ===
