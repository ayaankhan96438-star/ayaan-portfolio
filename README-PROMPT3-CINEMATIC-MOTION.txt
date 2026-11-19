AYAAN PORTFOLIO — PROMPT 3: CINEMATIC ANIMATIONS & INTERACTIONS

This is a small overlay patch for the existing /home/ayaan/ayaan Next.js project.
It does not rebuild the site and adds no dependencies.

CHANGES
- Hero reveal now brings in the navbar wordmark, role/kicker, headline lines,
  supporting copy, CTAs, 3D hero visual, orbit details, and bottom cue in sequence.
- Existing GSAP ScrollTrigger reveals now support grouped, staggered project,
  skills, and journey cards. Headings and supporting panels use a softer reveal.
- Project and skill cards use subtle cursor-led 3D tilt, palette-aware border glow,
  and restrained elevation. Touch devices do not get pointer tilt.
- The cursor spotlight follows smoothly with requestAnimationFrame and is active
  only inside selected visual sections. It is disabled for touch and reduced motion.
- Navigation, CTA, project actions, terminal, command palette, and contact form
  receive refined hover/focus transitions.
- Existing Framer Motion, GSAP, Lenis, project data, routes, and form/terminal
  behavior stay in place. No package or lockfile changes are required.
- prefers-reduced-motion is respected in both JavaScript and CSS.

APPLY
1. Stop the dev server with Ctrl+C.
2. Extract this ZIP into /home/ayaan/ayaan and allow files to be overwritten.
3. Run:
   npm run lint
   npm run typecheck
   npm run build
4. Run npm run dev and test on desktop and mobile.

FILES INCLUDED
- app/features.css
- components/ContactSection.tsx
- components/CursorEffects.tsx
- components/DeveloperTerminal.tsx
- components/HeroSection.tsx
- components/IntroSection.tsx
- components/JourneySection.tsx
- components/PlaygroundSection.tsx
- components/ProjectsSection.tsx
- components/ScrollAnimations.tsx

VALIDATION PERFORMED HERE
- TypeScript/TSX syntax transpilation: 33 files, 0 syntax diagnostics.
- CSS brace checks: globals.css, features.css, and preloader.css balanced.
- The full Next.js build was not run in this packaging environment because the
  uploaded source archive does not include node_modules. Run the commands above
  in the existing Kali project before deploying.

3D HERO NOTE
The uploaded source contains the 3D floating-laptop hero, not a separate 3D
keyboard component or Spline keyboard scene. This patch preserves the existing
hero markup and only updates its entrance animation; it does not replace it.
