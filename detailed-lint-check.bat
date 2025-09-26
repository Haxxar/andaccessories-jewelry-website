@echo off
echo "=========================================="
echo "DETAILED LINTING CHECK BY FILE TYPE"
echo "=========================================="
echo.

echo "1. Checking TypeScript files (.ts, .tsx)..."
echo "----------------------------------------"
npx eslint "**/*.{ts,tsx}" --config .eslintrc.json --format=compact
echo.

echo "2. Checking JavaScript files (.js, .jsx)..."
echo "----------------------------------------"
npx eslint "**/*.{js,jsx}" --config .eslintrc.json --format=compact
echo.

echo "3. Checking specific directories..."
echo "----------------------------------------"
echo "App directory:"
npx eslint "app/**/*.{ts,tsx,js,jsx}" --config .eslintrc.json --format=compact
echo.
echo "Lib directory:"
npx eslint "lib/**/*.{ts,tsx,js,jsx}" --config .eslintrc.json --format=compact
echo.
echo "Scripts directory:"
npx eslint "scripts/**/*.{ts,tsx,js,jsx}" --config .eslintrc.json --format=compact
echo.

echo "4. TypeScript compilation check..."
echo "----------------------------------------"
npx tsc --noEmit --strict
echo.

echo "=========================================="
echo "DETAILED CHECK COMPLETE"
echo "=========================================="
echo.
echo "Review the output above for any errors."
echo "Each error will show:"
echo "  - File path and line number"
echo "  - Error type and description"
echo "  - Suggested fix (if available)"
echo.
pause
