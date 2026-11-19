Ayaan Portfolio — Keep palettes B, G, M and Original (0) + preload project images

FILES TO OVERLAY
- data/palettes.ts
- components/PaletteBar.tsx
- app/palette.css
- components/Preloader.tsx
- app/preloader.css

WHAT CHANGED
1. Only palette ids B, G and M remain in data/palettes.ts. Palette 0 (the original design) remains as the built-in option in PaletteBar.
2. Replaced the large full-width palette testing bar with a compact COLOR selector at the top-right, immediately to the left of the Menu area. It opens a small popover with exactly 0, B, G and M, plus Light/Dark mode controls.
3. Removed palettes A, C, D, E, F, H, I, J, K and L. If one of those was saved in localStorage, the component falls back to original palette 0.
4. Preloader preview now displays only the two actual projects. Their existing /images/photo1.png and /images/photo2.png assets are requested with Next Image priority + fetchPriority=high so they load during the intro rather than after it. The preview grid now has two equal columns.
5. No preloader timing, GSAP timeline, Lenis, homepage layout, project data, or photo assets were changed.

IMAGE REQUIREMENT
Keep these existing files in the project:
- public/images/photo1.png (AmaanTrader jacket)
- public/images/photo2.png (Book Exchange)

APPLY
From the project root, unzip this archive with overwrite enabled, then run:
  npm run typecheck
  npm run build

If checks pass:
  git add components/PaletteBar.tsx components/Preloader.tsx app/palette.css app/preloader.css data/palettes.ts
  git commit -m "Keep four palette options and preload project images"
  git push origin main
