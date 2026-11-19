AYAAN PORTFOLIO — FULL-COLOR PALETTE THEMES

This patch applies the existing four choices as full site color themes:
- 0: original stylesheet palette (Classic for Light, existing Dark for Dark)
- B: full palette generated from B1-B5
- G: full palette generated from G1-G5
- M: full palette generated from M1-M5

WHAT THIS FIXES
The previous palette engine only changed its 14 core variables. The portfolio's Tailwind v4 and legacy design tokens also use --bg, --card, --text, --border, --accent-text, --dark-panel, --dark-code, syntax tokens, playground tokens, and other related aliases. Those aliases were still being supplied by the old Classic/Dark/Forest CSS presets, so palettes could look partially unchanged.

This patch maps each selected palette onto the full set of site tokens at runtime. It covers:
- page background, surfaces, cards, text, muted text, borders, and accents
- CTA text color and accent-light colors
- dark panels, code panels, inverse text, and shadows
- editor syntax colors, playground/browser preview colors, and status dots
- the 3D floating hero lighting/orbit colors through the existing --accent, --warm, --ok, --dark, --on-dark, and --accent-light tokens
- stack headings in both Light and Dark modes

The 0 palette clears generated inline variables and restores the original CSS theme exactly: Classic for Light or existing Dark for Dark.

PERSISTENCE / FIRST PAINT
- Palette identity and Light/Dark mode remain in localStorage under palette-state.
- Generated core variables remain in palette-vars.
- The inline head boot script now derives and applies the full token map before first paint.
- The PaletteBar UI, its four dots, and the Light/Dark chooser are unchanged.
- Theme switching only changes root CSS variables and data attributes. It does not remount the preloader, GSAP, Lenis, or the hero.

FILES IN THIS OVERLAY
- lib/palette.ts
- app/layout.tsx

The patch intentionally does not replace app/globals.css, HeroSection, the 3D floating animation, preloader, navbar, photos, PaletteBar, palette data, or other page content.

APPLY
1. Extract this ZIP into the existing Next.js project root.
2. Run: npm run typecheck
3. Run: npm run build
4. Test all four dots (0, B, G, M) in both Light and Dark modes.
5. Refresh after selecting each theme to verify first-paint restoration.

No new dependency is required.
