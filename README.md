# Ayaan Khan — Developer Portfolio

A Next.js App Router portfolio built with TypeScript, Tailwind CSS, Framer Motion, GSAP, Lenis, and lucide-react.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

If you extract this archive over an older copy of the project, remove the no-longer-used legacy transition component because ZIP extraction does not delete files that are absent from the archive:

```bash
rm -f components/RouteTransition.tsx
```

The App Router enter animation now lives in `app/template.tsx`.

## Production checks

```bash
npm run typecheck
npm run lint
npm run build
```

## Personal details to finish

All site-wide identity and SEO values live in `lib/site.ts`:

- `siteUrl`: currently blank because the production portfolio domain or Vercel URL has not been supplied yet. Set it before deployment.
- `email`: `ayaankhan96438@gmail.com`.
- `github`: `https://github.com/ayaankhan96438-star`.
- `linkedin`: `https://www.linkedin.com/in/ayaan-khan-b23a7a440`.

`app/layout.tsx`, `app/robots.ts`, and `app/sitemap.ts` all read the domain from `siteConfig.siteUrl`.

## Project links and screenshots

Project details and live/repository links are in `data/projects.ts`.

The current files in `public/images/` are temporary SVG artwork, not captured product screenshots. Replace them with your authentic screenshots using these names (PNG, JPG, or WebP are fine), then update the image paths in `data/projects.ts` if the extension changes:

- `project-chess.png` — Royal Realms Chess screen (currently `project-chess.svg`)
- `project-amaantrader.png` — AmaanTrader live storefront screenshot (currently `project-amaantrader.svg`)
- `project-books.png` — Book Exchange live website screenshot (currently `project-books.svg`)
- `hero-interface.png` — a strong wide screenshot for the hero strips (currently `hero-interface.svg`)

Project cards, case-study covers, and hero strips use the shared `BrowserWindow` component so screenshots sit inside a responsive browser mockup. Keep source screenshots around 1400px wide or larger where possible. When you replace an SVG with a PNG/WebP, update the matching image path in `data/projects.ts` or `components/HeroSection.tsx`.

The final portfolio domain and authentic project screenshots still need to be supplied before deployment.
