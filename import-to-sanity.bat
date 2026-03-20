@echo off
echo ═══════════════════════════════════════════
echo   NYX Cable — Sanity Data Import
echo ═══════════════════════════════════════════
echo.
echo Make sure you are logged in: npx sanity login
echo.
echo Step 1: Import Post Categories
npx sanity dataset import migration\post-categories.ndjson production --replace
echo.
echo Step 2: Import Product Categories
npx sanity dataset import migration\categories.ndjson production --replace
echo.
echo Step 3: Import Products
npx sanity dataset import migration\products.ndjson production --replace
echo.
echo Step 4: Import Product Variants
npx sanity dataset import migration\variants.ndjson production --replace
echo.
echo Step 5: Import Blog Posts
npx sanity dataset import migration\blog-posts.ndjson production --replace
echo.
echo Step 6: Import Static Pages
npx sanity dataset import migration\pages.ndjson production --replace
echo.
echo Step 7: Import Site Settings
npx sanity dataset import migration\site-settings.ndjson production --replace
echo.
echo ═══════════════════════════════════════════
echo   ✅ IMPORT COMPLETE!
echo ═══════════════════════════════════════════
pause
