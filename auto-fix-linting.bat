@echo off
echo "=========================================="
echo "AUTO-FIX LINTING ERRORS"
echo "=========================================="
echo.

echo "1. Running ESLint auto-fix..."
echo "----------------------------------------"
npx eslint . --ext .js,.jsx,.ts,.tsx --config .eslintrc.json --fix
echo.

echo "2. Checking what was fixed..."
echo "----------------------------------------"
npx eslint . --ext .js,.jsx,.ts,.tsx --config .eslintrc.json --format=compact
echo.

echo "3. Running TypeScript check..."
echo "----------------------------------------"
npx tsc --noEmit --strict
echo.

echo "=========================================="
echo "AUTO-FIX COMPLETE"
echo "=========================================="
echo.
echo "ESLint has automatically fixed what it can."
echo "Any remaining errors need manual fixes."
echo "Run 'detailed-lint-check.bat' to see remaining issues."
echo.
pause
