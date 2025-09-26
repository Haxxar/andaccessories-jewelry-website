@echo off
echo "Committing ESLint fixes..."
git add app/components/AffiliateTrackingDemo.tsx
git add app/privatlivspolitik/CookieConsent.tsx
git add app/privatlivspolitik/page.tsx
git commit -m "Fix ESLint errors

- Fix React Hook useEffect missing dependencies in AffiliateTrackingDemo
- Fix unescaped quotes in AffiliateTrackingDemo, CookieConsent, and privacy policy page
- Replace anchor tags with Next.js Link components in privacy policy page
- All ESLint errors resolved for successful build"
git push origin main
echo "ESLint fixes committed and pushed successfully!"
pause
