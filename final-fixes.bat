@echo off
git add package.json app/om-os/page.tsx
git commit -m "Fix ESLint config dependency and TypeScript Record type"
git push origin main
echo "Final fixes committed and pushed successfully!"
pause
