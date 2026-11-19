AYAAN PORTFOLIO — TWO REAL PROJECT PHOTOS + REMOVE CHESS

What changed:
- AmaanTrader now uses /images/photo1.png.
- Book Exchange now uses /images/photo2.png.
- The supplied photos are also used in the homepage's moving image strips.
- Royal Realms Chess was removed from the project data, project cards, generated case-study routes, hero strip, and artwork registry.
- The selected-work grid now uses two balanced columns.
- BrowserWindow now renders PNG/JPG/WebP assets with next/image and keeps the generic hero SVG artwork renderer.

Important:
The two PNG files were not present in the files available to this update, so they are NOT embedded in this ZIP. The apply script copies your local photo1.png and photo2.png into public/images/ when it finds them.

Apply from your portfolio project folder:
  unzip -o ayaan-portfolio-two-projects-no-chess-20261119.zip -d .
  bash APPLY-PHOTO-UPDATE.sh /home/ayaan/ayaan

The script looks in the project root, public/images, /home/ayaan/Downloads, and the current user's Downloads folder. If it cannot find both files, move photo1.png and photo2.png into /home/ayaan/Downloads and run it again.

Then run:
  npm run typecheck
  npm run build

The overlay preserves the existing Next.js theme system, ThemeSwitcher, Live Playground, preloader, GSAP/Lenis setup, and other sections.
