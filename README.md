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

- `siteUrl`: `https://ayaan-portfolio-mu.vercel.app`. Update this when the production domain changes.
- `email`: `ayaankhan96438@gmail.com`.
- `github`: `https://github.com/ayaankhan96438-star`.
- `linkedin`: `https://www.linkedin.com/in/ayaan-khan-b23a7a440`.

`app/layout.tsx`, `app/robots.ts`, and `app/sitemap.ts` all read the domain from `siteConfig.siteUrl`.

## Projects and images

Project details, technology stacks, live demos, and GitHub repository links are maintained in `data/projects.ts`. The current portfolio showcases AmaanTrader and Book Exchange. Their project screenshots are stored in `public/images/photo1.png` and `public/images/photo2.png`.

## Interactive features

- **Developer terminal:** `components/DeveloperTerminal.tsx` supports `help`, `about`, `projects`, `skills`, `contact`, and `clear`. It is a portfolio-only simulation; it never executes system commands. Command history is available with the Up/Down arrow keys.
- **Project showcase:** cards use the real project data in `data/projects.ts`, with Live Demo, GitHub, and View Details actions. Detailed case studies live under `app/work/[slug]/page.tsx`.
- **Journey timeline:** edit `data/journey.ts` to add verified learning, experience, achievement, and project milestones. Experience and achievement rows are intentionally editable placeholders until confirmed information is available.
- **Command palette:** Ctrl+K (Windows/Linux) or Cmd+K (macOS) opens the searchable navigation overlay. Resume is shown as disabled because no resume file is present in `public/`.
- **Contact form:** validates fields and prepares a `mailto:` message for the visitor's email application. It does not claim to send anything from the site. A real form endpoint can be configured later.
- **Scroll progress:** a lightweight top progress line follows document scroll position.

## Contact and configuration notes

- Email and social links are defined in `lib/site.ts`.
- No email submission provider is configured; the form intentionally uses the visitor's email client.
- No resume file was present in `public/`; add a real `public/resume.pdf` and set `resumeUrl: "/resume.pdf"` in `lib/site.ts` before enabling Resume downloads.
- The uploaded source contains the 3D floating-laptop hero and its pointer interaction. It does not contain a separate 3D keyboard scene/component or keyboard asset, so this update leaves the uploaded hero intact rather than inventing a keyboard implementation.

## Production checks

```bash
npm run typecheck
npm run lint
npm run build
```
