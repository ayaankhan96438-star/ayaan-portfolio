AYAAN PORTFOLIO — REMOVE THE OLD THREE-THEME DOTS

This update removes the old Classic / Dark / Forest dots. Keep only the four
palette dots provided by PaletteBar: 0 (original), B (pink), G (blue), M (green).

Files in this overlay:
- components/Navbar.tsx: removes the ThemeSwitcher from desktop header and mobile menu.
- app/globals.css: removes old three-dot styles, breakpoint rules, and old swatch tokens.
- REMOVE-OLD-THEME-SWITCHER.sh: removes the now-unused components/ThemeSwitcher.tsx file.

Apply from the Next.js project root:
  unzip -o ayaan-portfolio-remove-old-three-theme-dots-20261119.zip -d .
  bash REMOVE-OLD-THEME-SWITCHER.sh "$PWD"
  npm run typecheck
  npm run build

The PaletteBar remains unchanged and continues to show only 0, B, G, M. Each dot
opens its Light / Dark choice. This update does not alter palette colors, preloader,
photos, homepage content, GSAP, or Lenis.
