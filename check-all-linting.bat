@echo off
echo "=========================================="
echo "COMPREHENSIVE LINTING CHECK"
echo "=========================================="
echo.

echo "1. Running ESLint on entire project..."
echo "----------------------------------------"
npx eslint . --ext .js,.jsx,.ts,.tsx --config .eslintrc.json --format=compact
echo.

echo "2. Running TypeScript check..."
echo "----------------------------------------"
npx tsc --noEmit --strict
echo.

echo "3. Running Next.js build check..."
echo "----------------------------------------"
npm run build
echo.

echo "=========================================="
echo "LINTING CHECK COMPLETE"
echo "=========================================="
echo.
echo "If you see any errors above, those need to be fixed."
echo "If all checks pass, your project is ready for deployment!"
echo.
pause
