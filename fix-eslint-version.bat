@echo off
echo "=========================================="
echo "FIXING ESLINT VERSION"
echo "=========================================="
echo.

echo "1. Removing current ESLint..."
echo "----------------------------------------"
npm uninstall eslint
echo.

echo "2. Installing ESLint 8.57.0 (compatible with .eslintrc.json)..."
echo "----------------------------------------"
npm install --save-dev eslint@8.57.0
echo.

echo "3. Testing ESLint configuration..."
echo "----------------------------------------"
npx eslint --version
echo.

echo "4. Running ESLint check..."
echo "----------------------------------------"
npx eslint . --ext .js,.jsx,.ts,.tsx --config .eslintrc.json --format=compact
echo.

echo "=========================================="
echo "ESLINT VERSION FIXED!"
echo "=========================================="
echo.
echo "ESLint 8.57.0 is now installed and should work with .eslintrc.json"
echo "Run 'auto-fix-linting.bat' to fix any remaining errors."
echo.
pause
