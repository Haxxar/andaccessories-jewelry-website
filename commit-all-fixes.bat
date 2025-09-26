@echo off
git add .
git commit -m "Fix all TypeScript and ESLint errors

- Fix OpenGraph type error in product page (change 'product' to 'website')
- Fix cronJobs.ts getStatus method errors (use .running instead of .getStatus())
- Fix TypeScript errors in all script files (add proper type assertions)
- Add eslint-config-next dependency for proper ESLint configuration
- Fix Record type for isVisible state in om-os page"
git push origin main
echo "All fixes committed and pushed successfully!"
pause
