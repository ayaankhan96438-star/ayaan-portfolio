# Prompt 2 — Advanced Interactive Portfolio Features

Integrated into the existing Next.js App Router portfolio. No new npm dependencies were added.

## Implemented

1. **Interactive Developer Terminal** — `components/DeveloperTerminal.tsx`
   - Safe portfolio-only simulation. It does not execute shell commands, evaluate code, or access the operating system.
   - Supported commands: `help`, `about`, `projects`, `skills`, `contact`, `clear`.
   - Up/Down arrow command history, blinking native input caret, accessible live output, and section navigation.
   - Skills and projects are read from the same data files used by the portfolio.

2. **Advanced Project Showcase** — `components/ProjectsSection.tsx`
   - Existing project screenshots, actual descriptions, technology stacks and existing URLs are retained.
   - Cards show Live Demo, GitHub and View Details actions.
   - The existing `/work/[slug]` case-study route remains the detail view.
   - No new project links or achievements were invented.

3. **Animated Journey Timeline** — `components/JourneySection.tsx`
   - Uses verified project and learning context already represented in the portfolio.
   - Experience and achievement items are visibly marked as editable placeholders.
   - Edit `data/journey.ts` to add dates, roles, certifications or achievements when verified.

4. **Command Palette** — `components/CommandPalette.tsx`
   - Ctrl+K (Windows/Linux) and Cmd+K (macOS) open it.
   - Search, Arrow Up/Down, Enter, Escape, focus trap and animated open/close are supported.
   - Home, About, Projects, Skills, Resume and Contact are included; Journey and Terminal are added too.
   - Resume remains disabled until a real file exists. Add `public/resume.pdf` and set `resumeUrl: "/resume.pdf"` in `lib/site.ts` to enable its download action.

5. **Interactive Contact** — `components/ContactSection.tsx`
   - Name, email and message fields with browser validation and message-length checks.
   - Copy Email button and the existing GitHub / LinkedIn / email links.
   - Since no form submission service is configured, submission prepares a `mailto:` message. The UI explicitly says the website has not sent the message; no false success is shown.
   - A Resume download link appears only after a real resume URL is configured.

6. **Scroll Progress** — `components/ScrollProgress.tsx`
   - A fixed, thin progress line follows the visitor's document scroll position.

## Shared editable data and configuration

- `data/skills.ts` powers both the Skills cards and terminal `skills` output.
- `data/journey.ts` holds timeline items and editable placeholders.
- `data/projects.ts` remains the source of truth for project content and URLs.
- `lib/site.ts` contains the email/social links, the provided production site URL, and an empty `resumeUrl` until a real resume is added.

## Preserved

- Existing Preloader component and animation logic.
- Existing GSAP / ScrollTrigger and Lenis integration.
- Existing 3D floating-laptop hero and its pointer interaction.
- Existing palette system and the `0`, `B`, `G`, `M` options.
- Existing case-study routes and the separate Live Playground route.
- Existing project screenshots in `public/images/`.

**Source note:** The uploaded source ZIP contains the floating-laptop hero, not a separate 3D keyboard scene/component or keyboard model asset. This update preserves the hero actually present in the uploaded source and does not fabricate a replacement keyboard.

## Run and verify on Kali

```bash
npm ci
npm run typecheck
npm run lint
npm run build
npm run dev
```

No new package dependencies were added. In the build workspace used for this update, npm registry DNS requests failed (`EAI_AGAIN`), so dependency installation could not complete here; the full Next.js typecheck and production build still need to be run in the local project after `npm ci` succeeds.
