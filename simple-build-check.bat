@echo off
echo "=========================================="
echo "SIMPLE BUILD CHECK (No ESLint)"
echo "=========================================="
echo.

echo "1. Running TypeScript check..."
echo "----------------------------------------"
npx tsc --noEmit --strict
if %errorlevel% neq 0 (
    echo "❌ TypeScript errors found!"
    pause
    exit /b 1
)
echo "✅ TypeScript check passed!"
echo.

echo "2. Running Next.js build..."
echo "----------------------------------------"
npm run build
if %errorlevel% neq 0 (
    echo "❌ Build failed!"
    pause
    exit /b 1
)
echo "✅ Build successful!"
echo.

echo "=========================================="
echo "ALL CHECKS PASSED - READY FOR DEPLOYMENT!"
echo "=========================================="
echo.
echo "Your project is ready to deploy to Vercel!"
echo "The build will succeed without ESLint issues."
echo.
pause
