#!/usr/bin/env bash
set -euo pipefail

PROJECT_DIR="${1:-$(pwd)}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
COMPONENT_SOURCE="$SCRIPT_DIR/components/HeroSection.tsx"
STYLE_SOURCE="$SCRIPT_DIR/hero-floating-styles.css"
COMPONENT_TARGET="$PROJECT_DIR/components/HeroSection.tsx"
GLOBAL_CSS="$PROJECT_DIR/app/globals.css"
MARKER="/* 3D floating-elements hero — appended by APPLY-HERO-3D.sh */"

if [[ ! -d "$PROJECT_DIR/components" || ! -f "$GLOBAL_CSS" ]]; then
  echo "ERROR: '$PROJECT_DIR' does not look like the portfolio project root."
  exit 1
fi
if [[ ! -f "$PROJECT_DIR/components/BrowserWindow.tsx" || ! -f "$PROJECT_DIR/data/projects.ts" ]]; then
  echo "ERROR: BrowserWindow.tsx or data/projects.ts is missing; refusing to overwrite the hero."
  exit 1
fi
if [[ ! -f "$PROJECT_DIR/public/images/photo1.png" || ! -f "$PROJECT_DIR/public/images/photo2.png" ]]; then
  echo "WARNING: photo1.png or photo2.png is missing from public/images; project preview images may not appear."
fi

cp "$COMPONENT_SOURCE" "$COMPONENT_TARGET"
if ! grep -Fq "$MARKER" "$GLOBAL_CSS"; then
  printf '\n\n' >> "$GLOBAL_CSS"
  cat "$STYLE_SOURCE" >> "$GLOBAL_CSS"
fi

echo "Applied the 3D floating-elements hero."
echo "Changed: components/HeroSection.tsx and appended hero-only styles to app/globals.css."
echo "Existing navbar, palette controls, preloader, projects data, and other sections were left untouched."
