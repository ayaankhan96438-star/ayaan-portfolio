AYAAN PORTFOLIO — PALETTE DOTS + DARK STACK HEADING FIX

Overlay these files into the existing Next.js project root.

WHAT CHANGED
- Replaced the old four-swatch palette box with compact round palette dots.
- Desktop: palette dots sit beside the existing theme dots near Menu.
- Mobile: palette dots appear in the opened menu beside the theme dots.
- Dot colors:
    B = #BB3468 (pink)
    G = #168EFE (blue)
    M = #ACDA60 (M2 green; deliberately distinct from G)
    0 = #A7C96B (original)
- Clicking any dot opens a small Light / Dark mode chooser.
- Selecting a mode applies the palette immediately and persists it in localStorage.
- The header and mobile-menu instances synchronize with each other.
- Dark-mode stack headings for B/G/M use the generated accent-on-dark color rather than the pale ink color.
  This keeps Frontend, Backend, Databases, and the “the stack” word more distinct.
- Palette identity and mode are restored in the head boot script before first paint.
- No preloader, GSAP, Lenis, layout structure, project content, or photos changed.

DARK-MODE HEADING CONTRAST AGAINST THE CURRENT #171916 STACK CARD
- B: #E57D27 — 6.14:1
- G: #168EFE — 5.34:1
- M: #01A9D7 — 6.45:1
All exceed 4.5:1.

FILES INCLUDED
- app/globals.css
- app/layout.tsx
- app/palette.css
- components/Navbar.tsx
- components/PaletteBar.tsx
- data/palettes.ts
- lib/palette.ts

APPLY
1. Extract this ZIP into the project root, preserving paths.
2. Run: npm run typecheck
3. Run: npm run build
4. Check desktop header palette dots and mobile menu palette dots.
5. Click B, G, M, or 0; choose Light or Dark.

The existing `data/palettes.ts` already contains only B, G, M. The original 0 option is represented by the PaletteBar and restores the original CSS tokens.
