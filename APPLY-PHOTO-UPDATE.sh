#!/usr/bin/env bash
set -euo pipefail

ROOT="${1:-$(pwd)}"
if [[ ! -f "$ROOT/package.json" || ! -d "$ROOT/public" ]]; then
  echo "ERROR: Run this script with your portfolio project folder as the argument."
  echo "Example: bash APPLY-PHOTO-UPDATE.sh /home/ayaan/ayaan"
  exit 1
fi

find_photo() {
  local filename="$1"
  local candidate
  for candidate in \
    "$ROOT/$filename" \
    "$ROOT/public/images/$filename" \
    "$ROOT/public/$filename" \
    "$HOME/Downloads/$filename" \
    "/home/ayaan/Downloads/$filename" \
    "$HOME/$filename" \
    "/home/ayaan/$filename"; do
    if [[ -f "$candidate" ]]; then
      printf '%s\n' "$candidate"
      return 0
    fi
  done
  for directory in "$HOME/Downloads" "/home/ayaan/Downloads"; do
    if [[ -d "$directory" ]]; then
      candidate="$(find "$directory" -maxdepth 3 -type f -name "$filename" -print -quit 2>/dev/null || true)"
      if [[ -n "$candidate" ]]; then
        printf '%s\n' "$candidate"
        return 0
      fi
    fi
  done
  return 1
}

PHOTO1="$(find_photo photo1.png || true)"
PHOTO2="$(find_photo photo2.png || true)"
if [[ -z "$PHOTO1" || -z "$PHOTO2" ]]; then
  echo "ERROR: Both photo1.png and photo2.png are required."
  echo "Put both files in /home/ayaan/Downloads (or this project root), then run this script again."
  echo "Found photo1: ${PHOTO1:-NO}; photo2: ${PHOTO2:-NO}"
  exit 1
fi

ASSET_DIR="$ROOT/public/images"
mkdir -p "$ASSET_DIR"
if [[ "$(realpath -m "$PHOTO1")" != "$(realpath -m "$ASSET_DIR/photo1.png")" ]]; then
  cp -f "$PHOTO1" "$ASSET_DIR/photo1.png"
fi
if [[ "$(realpath -m "$PHOTO2")" != "$(realpath -m "$ASSET_DIR/photo2.png")" ]]; then
  cp -f "$PHOTO2" "$ASSET_DIR/photo2.png"
fi

# Delete the old mock project artwork so it cannot accidentally be reused.
rm -f \
  "$ASSET_DIR/project-amaantrader.svg" \
  "$ASSET_DIR/project-books.svg" \
  "$ASSET_DIR/project-chess.svg"

echo "Updated portfolio images:"
echo "  AmaanTrader -> public/images/photo1.png"
echo "  Book Exchange -> public/images/photo2.png"
echo "Removed the old AmaanTrader, Book Exchange, and Chess mock artwork."
