AYAAN PORTFOLIO — PROMPT 4 QUALITY PATCH
=======================================

Apply this ZIP over the existing project root (the folder containing package.json).
It is an overlay patch, not a replacement project. It does not add npm dependencies.

WHAT CHANGED
------------
1. Responsive layout safeguards for tablet portrait, narrow phones, compact laptops,
   and wide displays. This includes the hero/laptop stage, navigation, project cards,
   terminal, command palette, contact form, and case-study layouts.
2. Refined the existing CSS 3D laptop without replacing it: metallic bezel, screen
   reflection, camera indicator, keyboard key grid, trackpad, and softer chassis shadow.
   Touch/coarse-pointer devices skip the continuous laptop/orbit motion to save work.
3. SEO: canonical URLs, fuller page metadata, Open Graph/Twitter previews, explicit
   SVG favicon metadata, Person + WebSite JSON-LD, and the playground route in sitemap.
4. Accessibility: skip-to-content link, visible keyboard focus, stronger semantics for
   palette groups, reduced-motion handling for Framer Motion overlays, and keyboard
   arrow/Home/End navigation for the HTML/CSS/JS playground tabs.
5. Performance: homepage project screenshots now use Next Image's normal lazy loading
   instead of being preloaded; the standalone code playground is a route-level dynamic
   import; pointer effects stop while the browser tab is hidden.
6. Updated project screenshot alt text and the miniature preloader preview so it matches
   the current BUILD / SHAPE / LAUNCH identity and “Building & learning” header text.

IMPORTANT 3D NOTE
-----------------
The supplied portfolio source contains a CSS-based floating 3D laptop hero, not a
separate Three.js/WebGL keyboard scene. This patch preserves and improves that existing
laptop visual, including adding a visible keyboard deck and trackpad. No existing 3D
scene or working interaction has been intentionally removed.

FILES
-----
Only the files in this patch are overwritten/added. package.json and package-lock.json
are not changed; no new dependencies are required.

VALIDATION
----------
In the patch-generation environment: 33 TypeScript/TSX files passed syntax parsing,
6 CSS files passed PostCSS parsing, local project image assets were found, and static
SEO/accessibility markers were checked. A full Next.js build, browser console audit,
and real-device viewport test were not run here because this workspace does not have
the project's node_modules installed. Run the commands below on your Kali project.
