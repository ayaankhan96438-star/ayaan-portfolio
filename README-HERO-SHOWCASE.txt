AYAAN PORTFOLIO — INTERACTIVE PROJECT SHOWCASE HERO

Files in this patch:
- components/HeroSection.tsx
- app/globals.css

What changes:
- Replaces the animated THINK / CODE / SHIP text and scrolling image strips with an editorial split hero.
- Left side: new headline, short introduction, selected-work/contact links.
- Right side: two interactive browser preview cards sourced from data/projects.ts (AmaanTrader and Book Exchange).
- Uses the existing /images/photo1.png and /images/photo2.png project images. Keep these files in public/images/.
- Project preview cards link to their existing case-study routes.
- Keeps the existing palette CSS variables, navbar, preloader, and other homepage sections untouched.
- Hero entrance animation still waits for the existing preloader:done event and respects reduced-motion preferences.

Apply by extracting this ZIP into the project root, then run:
  npm run typecheck
  npm run build
