PALETTE LAB — TASKS 1–4

Files added:
- data/palettes.ts — 13 palettes (A–M), five stable swatch IDs each.
- lib/palette.ts — strict TypeScript color math, WCAG contrast, and apply/reset helpers.
- components/PaletteBar.tsx — temporary interactive palette testing bar.
- app/palette.css — fixed dark styling for the testing bar.

File updated:
- app/layout.tsx — imports the palette component/styles, adds the pre-paint palette boot script, and renders PaletteBar immediately after CursorEffects.

Behavior:
- Select a palette A–M and Light bg / Dark bg to test it.
- Select 0 to remove generated variables and restore the original stylesheet values.
- Hide collapses the tool to a bottom-right THEMES button.
- Selection is saved in localStorage under palette-state and palette-vars.
- The early boot script validates palette-state before applying palette-vars so a deleted/unknown palette falls back without a wrong-palette flash.
- PaletteBar is rendered without keys or conditional wrappers around the preloader/animation providers; changing colors does not remount GSAP, Lenis, or the preloader.

Remove the testing tool later:
1. Delete components/PaletteBar.tsx.
2. Delete app/palette.css.
3. Delete data/palettes.ts.
4. Delete lib/palette.ts.
5. In app/layout.tsx, remove the PaletteBar import, the ./palette.css import, the paletteBootScript constant, its <script> tag, and the <PaletteBar /> element.
6. Optional cleanup in the browser console: localStorage.removeItem("palette-state"); localStorage.removeItem("palette-vars");

The requested variables are the only variables generated/applied by this task. Existing hardcoded theme tokens outside VAR_KEYS were not rewritten; see PALETTE-COLOR-AUDIT.txt for every remaining non-reactive hex declaration and its line number.

Validation performed in the authoring environment:
- 13 palettes x 2 modes tested (26 generated themes).
- Every --ink / --paper ratio is >= 9:1.
- Extra checks: --accent-strong / --paper >= 3:1; --accent-on-dark / --dark >= 4.5:1; --muted / --paper >= 4.5:1.
- Strict TypeScript check passed for lib/palette.ts and data/palettes.ts.
- Strict isolated type check of PaletteBar.tsx passed with React/JSX type stubs.
- Full Next.js typecheck/build were not run in this environment because npm dependency installation timed out; run npm run typecheck && npm run build in the project after applying this patch.
