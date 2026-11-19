AYAAN PORTFOLIO — 3D FLOATING ELEMENTS HERO

This update replaces the homepage hero animation with the TOP-LEFT #1 concept from the 8-idea moodboard:
- one dimensional laptop with a code-editor screen
- rotating orbital rings around the laptop
- floating orange, palette-accent, and dark spheres
- subtle pointer-based laptop tilt on desktop
- GSAP intro reveal starts after the existing preloader:done event
- copy reads BUILD / SHAPE / LAUNCH (not Think / Code / Ship)

Only these existing files are changed:
- components/HeroSection.tsx
- app/globals.css

Preserved:
- current navigation and palette dots (0 / B / G / M)
- existing photo1.png and photo2.png usage in projects/preloader
- all other homepage sections and project pages
- preloader logic/timing, GSAP provider, and Lenis provider
- responsive layout and prefers-reduced-motion support

Apply by extracting this ZIP into the root of the existing project, then run:
  npm run typecheck
  npm run build

No new dependencies or assets are required.
