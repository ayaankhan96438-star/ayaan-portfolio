Ayaan portfolio - TypeScript fix

This patch updates only components/Preloader.tsx.
It avoids TypeScript incorrectly narrowing masterTimeline to never because
GSAP assigns it inside the gsap.context callback.

Apply from your project root:
  unzip -o /home/ayaan/Downloads/ayaan-preloader-ts-fix.zip -d /home/ayaan/ayaan
  npm run typecheck
  npm run build
