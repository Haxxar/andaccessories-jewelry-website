@echo off
echo "Running TypeScript check..."
npx tsc --noEmit --strict
if %errorlevel% equ 0 (
    echo "TypeScript check passed! Committing fixes..."
    git add lib/cronJobs.ts
    git commit -m "Fix cronJobs.ts TypeScript errors - use custom job status tracking"
    git push origin main
    echo "All fixes committed and pushed successfully!"
) else (
    echo "TypeScript check failed. Please check the errors above."
)
pause
