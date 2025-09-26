@echo off
echo "Testing build process..."
npm run build
if %errorlevel% equ 0 (
    echo "Build successful! Committing ESLint fix..."
    git add .eslintrc.json
    git commit -m "Fix ESLint configuration - remove TypeScript-specific rules"
    git push origin main
    echo "ESLint fix committed and pushed successfully!"
) else (
    echo "Build failed. Please check the errors above."
)
pause
