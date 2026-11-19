AYAAN PORTFOLIO — 3D FLOATING ELEMENTS HERO

This update replaces only components/HeroSection.tsx and appends the marked hero-only CSS block to app/globals.css.

Hero copy uses “BUILD. / ideas into / real experiences.” and the small process line “PLAN / EXPERIMENT / IMPROVE” — it does not use “Think / Code / Ship”.
The visual uses the existing projects data and BrowserWindow component. It expects:
  public/images/photo1.png (AmaanTrader)
  public/images/photo2.png (Book Exchange)

Apply on Kali from the project directory:
  unzip -o ~/Downloads/ayaan-3d-floating-elements-hero-20261119.zip -d /tmp/ayaan-hero-overlay
  bash /tmp/ayaan-hero-overlay/APPLY-HERO-3D.sh /home/ayaan/ayaan

Then run:
  npm run typecheck
  npm run build

The script keeps the current globals.css contents, appending hero styles once using a marker. It does not alter preloader code, navbar, palette controls, projects data, GSAP/Lenis providers, or other sections.
