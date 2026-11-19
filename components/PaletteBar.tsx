"use client";

import { useEffect, useState } from "react";
import { palettes, type Palette } from "@/data/palettes";
import { applyTheme, buildTheme, type Mode, type ThemeVariables } from "@/lib/palette";

type PaletteId = "0" | "B" | "G" | "M";
type StoredState = { id: PaletteId; mode: Mode };
type PaletteBarProps = { variant: "header" | "menu" };
type PaletteChangeDetail = StoredState;

const DEFAULT_STATE: StoredState = { id: "0", mode: "dark" };
const PALETTE_CHANGE_EVENT = "portfolio:palettechange";

const DOT_OPTIONS: ReadonlyArray<{ id: PaletteId; color: string; label: string }> = [
  { id: "B", color: "#BB3468", label: "Berry palette B" },
  { id: "G", color: "#168EFE", label: "Blue palette G" },
  { id: "M", color: "#ACDA60", label: "Green palette M" },
  { id: "0", color: "#A7C96B", label: "Original palette" },
];

function isMode(value: unknown): value is Mode {
  return value === "light" || value === "dark";
}

function isPaletteId(value: unknown): value is PaletteId {
  return value === "0" || value === "B" || value === "G" || value === "M";
}

function isStoredState(value: unknown): value is StoredState {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return isPaletteId(record.id) && isMode(record.mode);
}

function paletteById(id: PaletteId): Palette | undefined {
  return palettes.find((palette) => palette.id === id);
}

function saveState(id: PaletteId, mode: Mode, vars: ThemeVariables | null): void {
  try {
    if (vars) {
      window.localStorage.setItem("palette-vars", JSON.stringify({ vars, mode }));
    } else {
      window.localStorage.removeItem("palette-vars");
    }
    window.localStorage.setItem("palette-state", JSON.stringify({ id, mode }));
  } catch {
    // The palette remains usable for this page view when storage is unavailable.
  }
}

function setRootPalette(id: PaletteId, mode: Mode): void {
  document.documentElement.dataset.paletteId = id;
  document.documentElement.dataset.paletteMode = mode;
}

export function PaletteBar({ variant }: PaletteBarProps) {
  const [selectedId, setSelectedId] = useState<PaletteId>(DEFAULT_STATE.id);
  const [mode, setMode] = useState<Mode>(DEFAULT_STATE.mode);
  const [openId, setOpenId] = useState<PaletteId | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let restored: StoredState = DEFAULT_STATE;
    try {
      const raw = window.localStorage.getItem("palette-state");
      if (raw) {
        const parsed: unknown = JSON.parse(raw);
        if (isStoredState(parsed)) restored = parsed;
      }
    } catch {
      restored = DEFAULT_STATE;
    }

    const palette = paletteById(restored.id);
    const vars = palette ? buildTheme(Object.values(palette.colors), restored.mode) : null;
    applyTheme(vars, restored.mode);
    setRootPalette(restored.id, restored.mode);
    saveState(restored.id, restored.mode, vars);
    setSelectedId(restored.id);
    setMode(restored.mode);
    setReady(true);

    const onPaletteChange = (event: Event) => {
      const detail = (event as CustomEvent<unknown>).detail;
      if (!isStoredState(detail)) return;
      setSelectedId(detail.id);
      setMode(detail.mode);
      setOpenId(null);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenId(null);
    };
    window.addEventListener(PALETTE_CHANGE_EVENT, onPaletteChange);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener(PALETTE_CHANGE_EVENT, onPaletteChange);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, []);

  function choosePaletteMode(id: PaletteId, nextMode: Mode): void {
    if (!ready) return;

    const palette = paletteById(id);
    const vars = palette ? buildTheme(Object.values(palette.colors), nextMode) : null;
    applyTheme(vars, nextMode);
    setRootPalette(id, nextMode);
    saveState(id, nextMode, vars);
    setSelectedId(id);
    setMode(nextMode);
    setOpenId(null);
    window.dispatchEvent(
      new CustomEvent<PaletteChangeDetail>(PALETTE_CHANGE_EVENT, {
        detail: { id, mode: nextMode },
      }),
    );
  }

  return (
    <div
      className={`palette-control palette-control--${variant}`}
      role="group"
      aria-label="Palette color choices"
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpenId(null);
      }}
    >
      <div className="palette-dot-list" role="group" aria-label="Choose a color palette">
        {DOT_OPTIONS.map((option) => {
          const isOpen = openId === option.id;
          const isActive = selectedId === option.id;
          const popoverId = `palette-mode-${variant}-${option.id}`;
          return (
            <div className="palette-dot-wrap" key={option.id}>
              <button
                type="button"
                className={`palette-dot-button${isActive ? " is-active" : ""}`}
                aria-label={`${option.label}; choose light or dark mode`}
                aria-expanded={isOpen}
                aria-controls={popoverId}
                aria-pressed={isActive}
                title={option.label}
                onClick={() => setOpenId(isOpen ? null : option.id)}
                disabled={!ready}
              >
                <span className="palette-dot-swatch" style={{ backgroundColor: option.color }} aria-hidden="true" />
                <span className="palette-dot-tooltip" aria-hidden="true">{option.id === "0" ? "Original" : `Palette ${option.id}`}</span>
              </button>

              {isOpen ? (
                <div className="palette-mode-popover" id={popoverId} role="group" aria-label={`Choose ${option.label} background mode`}>
                  <span className="palette-mode-heading">PALETTE {option.id}</span>
                  <span className="palette-mode-prompt">Choose a background</span>
                  <div className="palette-mode-actions">
                    <button
                      type="button"
                      className={`palette-mode-choice${isActive && mode === "light" ? " is-current" : ""}`}
                      aria-pressed={isActive && mode === "light"}
                      onClick={() => choosePaletteMode(option.id, "light")}
                      disabled={!ready}
                    >Light</button>
                    <button
                      type="button"
                      className={`palette-mode-choice${isActive && mode === "dark" ? " is-current" : ""}`}
                      aria-pressed={isActive && mode === "dark"}
                      onClick={() => choosePaletteMode(option.id, "dark")}
                      disabled={!ready}
                    >Dark</button>
                  </div>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
}
