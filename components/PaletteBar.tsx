"use client";

import { useEffect, useMemo, useState } from "react";
import { palettes, type Palette } from "@/data/palettes";
import { applyTheme, buildTheme, type Mode, type ThemeVariables } from "@/lib/palette";

type Swatch = { id: string; hex: string };
type PaletteOption = { id: string; swatches: Swatch[] };
type StoredState = { id: string; mode: Mode };

const ORIGINAL: PaletteOption = {
  id: "0",
  swatches: [
    { id: "01", hex: "#EDEBE3" },
    { id: "02", hex: "#F8F7F1" },
    { id: "03", hex: "#A7C96B" },
    { id: "04", hex: "#819E48" },
    { id: "05", hex: "#171D18" },
  ],
};

function toOption(palette: Palette): PaletteOption {
  return {
    id: palette.id,
    swatches: Object.entries(palette.colors).map(([id, hex]) => ({ id, hex })),
  };
}

const OPTIONS: PaletteOption[] = [ORIGINAL, ...palettes.map(toOption)];
const DEFAULT_STATE: StoredState = { id: "0", mode: "dark" };

function isMode(value: unknown): value is Mode {
  return value === "light" || value === "dark";
}

function isStoredState(value: unknown): value is StoredState {
  if (typeof value !== "object" || value === null) return false;
  const record = value as Record<string, unknown>;
  return typeof record.id === "string" && isMode(record.mode);
}

function paletteById(id: string): Palette | undefined {
  return palettes.find((palette) => palette.id === id);
}

function saveState(id: string, mode: Mode, vars: ThemeVariables | null): void {
  try {
    if (vars) window.localStorage.setItem("palette-vars", JSON.stringify({ vars, mode }));
    else window.localStorage.removeItem("palette-vars");
    window.localStorage.setItem("palette-state", JSON.stringify({ id, mode }));
  } catch {
    // The selector remains usable for this session when storage is unavailable.
  }
}

export function PaletteBar() {
  const [selectedId, setSelectedId] = useState("0");
  const [mode, setMode] = useState<Mode>(DEFAULT_STATE.mode);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  const selected = useMemo(
    () => OPTIONS.find((option) => option.id === selectedId) ?? ORIGINAL,
    [selectedId],
  );

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

    const knownId = restored.id === "0" || paletteById(restored.id) !== undefined;
    const safeId = knownId ? restored.id : "0";
    const activeMode = restored.mode;
    const palette = paletteById(safeId);

    if (palette) {
      const vars = buildTheme(Object.values(palette.colors), activeMode);
      applyTheme(vars, activeMode);
      saveState(safeId, activeMode, vars);
    } else {
      applyTheme(null, activeMode);
      saveState("0", activeMode, null);
    }

    setSelectedId(safeId);
    setMode(activeMode);
    setReady(true);
  }, []);

  function selectPalette(id: string): void {
    if (!ready) return;
    const palette = paletteById(id);
    if (!palette) {
      applyTheme(null, mode);
      setSelectedId("0");
      saveState("0", mode, null);
      return;
    }

    const vars = buildTheme(Object.values(palette.colors), mode);
    applyTheme(vars, mode);
    setSelectedId(id);
    saveState(id, mode, vars);
  }

  function selectMode(nextMode: Mode): void {
    if (!ready || nextMode === mode) return;
    const palette = paletteById(selectedId);
    const vars = palette ? buildTheme(Object.values(palette.colors), nextMode) : null;
    applyTheme(vars, nextMode);
    setMode(nextMode);
    saveState(selectedId, nextMode, vars);
  }

  return (
    <div className="palette-control" aria-label="Portfolio color selector">
      <button
        type="button"
        className="palette-trigger"
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={`Choose site colors. Current palette ${selectedId}`}
        title={`Color palette ${selectedId}`}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="palette-trigger__dot" style={{ backgroundColor: selected.swatches[2]?.hex ?? "#A7C96B" }} />
        <span className="palette-trigger__label">COLOR</span>
        <strong>{selectedId}</strong>
        <span className={`palette-trigger__chevron${open ? " is-open" : ""}`} aria-hidden="true">⌄</span>
      </button>

      {open && (
        <section className="palette-popover" role="dialog" aria-label="Choose a color palette">
          <header className="palette-popover__header">
            <span>CHOOSE PALETTE</span>
            <button type="button" className="palette-close" onClick={() => setOpen(false)} aria-label="Close color selector">×</button>
          </header>

          <div className="palette-options" aria-label="Available palettes">
            {OPTIONS.map((option) => (
              <button
                type="button"
                key={option.id}
                className={`palette-option${selectedId === option.id ? " is-selected" : ""}`}
                aria-label={`Apply palette ${option.id}`}
                aria-pressed={selectedId === option.id}
                title={`Palette ${option.id}`}
                onClick={() => selectPalette(option.id)}
                disabled={!ready}
              >
                <span className="palette-option__name">{option.id}</span>
                <span className="palette-option__swatches">
                  {option.swatches.map((swatch) => (
                    <span
                      className="palette-option__swatch"
                      key={swatch.id}
                      style={{ backgroundColor: swatch.hex }}
                      title={`${swatch.id} · ${swatch.hex}`}
                      aria-label={`${swatch.id} ${swatch.hex}`}
                    />
                  ))}
                </span>
              </button>
            ))}
          </div>

          <div className="palette-popover__footer">
            <span className="palette-current">PALETTE {selected.id}</span>
            <div className="palette-mode" role="group" aria-label="Palette background mode">
              <button
                type="button"
                className={`palette-mode__button${mode === "light" ? " is-active" : ""}`}
                aria-pressed={mode === "light"}
                onClick={() => selectMode("light")}
                disabled={!ready}
              >Light</button>
              <button
                type="button"
                className={`palette-mode__button${mode === "dark" ? " is-active" : ""}`}
                aria-pressed={mode === "dark"}
                onClick={() => selectMode("dark")}
                disabled={!ready}
              >Dark</button>
            </div>
          </div>
          <div className="palette-detail" aria-live="polite">
            {selected.swatches.map((swatch) => (
              <span className="palette-detail__item" key={swatch.id} title={`${swatch.id} · ${swatch.hex}`}>
                <i style={{ backgroundColor: swatch.hex }} />
                {swatch.id}
              </span>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
