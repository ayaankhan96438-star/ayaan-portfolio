AYAAN PORTFOLIO — CINEMATIC INTERACTIONS UPDATE

WHAT THIS UPDATE ADDS
1. A separate /playground page with editable HTML, CSS and JavaScript tabs and an isolated live iframe preview. It does not replace or redesign the homepage hero.
2. A more cinematic project showcase: subtle pointer-position lighting, responsive 3D preview tilt, and stagger-free scroll reveals for selected project cards.
3. A subtle desktop cursor spotlight. It is disabled on touch devices and when reduced motion is enabled.
4. GSAP ScrollTrigger reveals for elements marked with data-cinematic-reveal. Existing Hero, Intro and skill-card animations remain in place.
5. A Live Playground link in the fullscreen navigation menu.

PRESERVED / INCLUDED FROM THE PREVIOUS REQUEST
- Existing homepage hero and its two scrolling image strips are untouched.
- Project cards retain their case-study links and separate verified Live Demo / GitHub links.
- Skill matrix remains in place.
- The Live Build preloader's 5-second animation timing and mobile preview spacing refinements are included.
- Contact heading line spacing is widened on desktop to prevent the i dots colliding with the previous line; mobile line-height remains unchanged.

FILES IN THIS OVERLAY
- app/globals.css
- app/layout.tsx
- app/preloader.css
- app/playground/page.tsx
- components/ContactSection.tsx
- components/CursorEffects.tsx
- components/LiveCodePlayground.tsx
- components/Navbar.tsx
- components/PlaygroundSection.tsx
- components/Preloader.tsx
- components/ProjectsSection.tsx
- components/ScrollAnimations.tsx
- data/projects.ts

NO NEW PACKAGES ARE REQUIRED. The update uses the project's existing Next.js, React, GSAP, Framer Motion and Lucide dependencies.

APPLY ON THE PROJECT MACHINE
1. Extract this ZIP into the root of the existing project folder, preserving the included folders. Do not extract it into a new nested project folder.
2. Run:
   npm run typecheck
   npm run build
3. Review the changes, then commit and push from the existing project repository.

This is a source overlay, not a replacement full-project archive. It intentionally does not include node_modules, .next, .git, package files or environment secrets.
