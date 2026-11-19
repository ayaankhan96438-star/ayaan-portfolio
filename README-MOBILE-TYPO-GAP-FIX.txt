AYAAN PORTFOLIO — PRELOADER TYPOGRAPHY / MOBILE PREVIEW SPACING FIX

Overlay contains only:
- app/preloader.css
- app/globals.css

Changes:
1. Loosens the tight letter spacing in Think / Code / Ship in the homepage hero on desktop and mobile.
2. Loosens the same typography in the preloader's website preview on desktop and mobile.
3. On mobile only (max-width: 639px), moves the three preview project cards closer to the Think / Code / Ship heading by overriding the auto top margin. Desktop/tablet preview layout remains unchanged.
4. On short mobile screens, applies the same compact spacing so the preview remains balanced.

No component markup, image strips, preloader timing, animations, project data, or desktop section layout have been changed.

Apply from the portfolio root:
  unzip -o ~/Downloads/ayaan-portfolio-mobile-preloader-spacing-fix-20261118.zip -d .

Then verify:
  npm run typecheck
  npm run build

Commit and push after checks pass:
  git add app/preloader.css app/globals.css
  git commit -m "Tweak hero tracking and mobile preloader spacing"
  git push origin main
