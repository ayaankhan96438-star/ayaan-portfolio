#!/usr/bin/env bash
set -euo pipefail
PROJECT_DIR="${1:-$(pwd)}"
rm -f "$PROJECT_DIR/components/ThemeSwitcher.tsx"
echo "Removed the old Classic / Dark / Forest three-dot ThemeSwitcher."
echo "The four palette dots (0, B, G, M) remain in PaletteBar."
