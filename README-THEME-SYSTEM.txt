AYAAN PORTFOLIO — THEME SYSTEM (TASKS 1 + 2)

Included
- Three root themes: classic, dark, forest, set with html[data-theme].
- Classic keeps the existing beige / near-black / lime palette.
- Dark and Forest use the supplied core values.
- CSS semantic tokens cover the page, project cards, code playground, preloader,
  cursor/project effects, browser artwork, shadows, SVG fills and animation UI.
- Repeated inline SVG artwork scopes each gradient/filter ID per instance, so the
  looping homepage image strips keep their own correct gradients in every theme.
- ThemeSwitcher is available next to Menu on desktop and inside the opened mobile menu.
- Theme choice is saved in localStorage under "theme".
- An inline head script restores the selected theme before first paint; the default is dark.
- Theme changes only update documentElement.dataset.theme and CSS variables. They do not
  remount the preloader, GSAP, Framer Motion, or Lenis providers.

Tailwind note
This project uses Tailwind CSS 4 (@tailwindcss/postcss and @import "tailwindcss"),
not Tailwind 3. Tailwind 4's supported token mapping is the @theme inline block in
app/globals.css. It exposes bg-bg, bg-surface, text-text, text-muted, text-accent,
border-border and related utilities. A legacy tailwind.config.js is intentionally not
added because Tailwind 4 does not auto-load the old JS config format.

Apply
1. Extract this ZIP at the root of /home/ayaan/ayaan (preserve folder paths).
2. Run npm run typecheck and npm run build.
3. Check Classic, Dark and Forest on desktop and mobile, then push your commit.

Changed / added source files
- app/globals.css
- app/preloader.css
- app/layout.tsx
- app/icon.svg
- components/ThemeSwitcher.tsx (new)
- components/ThemeArtwork.tsx (new)
- components/Navbar.tsx
- components/BrowserWindow.tsx
- components/Preloader.tsx
- components/LiveCodePlayground.tsx
- public/images/*.svg
