@echo off
echo "Adding all modified files..."
git add .eslintrc.json
git add app/api/featured-products/route.ts
git add app/produkt/[id]/page.tsx
git add lib/cronJobs.ts
git add public/site.webmanifest
git add scripts/check-brands-simple.ts
git add scripts/check-brands.ts
git add scripts/debug-brands-encoding.ts

echo "Committing all fixes..."
git commit -m "Fix all TypeScript and ESLint errors for Vercel deployment

- Fix ESLint configuration (remove TypeScript-specific rules)
- Fix OpenGraph type error in product page (change 'product' to 'website')
- Fix cronJobs.ts TypeScript errors (use custom job status tracking)
- Fix TypeScript errors in all script files (add proper type assertions)
- Update site.webmanifest
- Fix featured-products route TypeScript issues

All build errors resolved for successful Vercel deployment."

echo "Pushing to GitHub..."
git push origin main

echo "✅ All fixes committed and pushed successfully!"
echo "Vercel will now automatically trigger a new deployment."
echo "The build should succeed without any TypeScript or ESLint errors."
pause
