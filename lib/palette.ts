export type Mode = "light" | "dark";

type Rgb = { r: number; g: number; b: number };

type ThemeVariable =
  | "--paper"
  | "--surface"
  | "--ink"
  | "--ink-rgb"
  | "--muted"
  | "--line"
  | "--accent"
  | "--accent-strong"
  | "--accent-soft"
  | "--accent-on-dark"
  | "--dark"
  | "--on-dark"
  | "--warm"
  | "--ok";

export const VAR_KEYS = [
  "--paper",
  "--surface",
  "--ink",
  "--ink-rgb",
  "--muted",
  "--line",
  "--accent",
  "--accent-strong",
  "--accent-soft",
  "--accent-on-dark",
  "--dark",
  "--on-dark",
  "--warm",
  "--ok",
] as const satisfies readonly ThemeVariable[];

export type ThemeVariables = Record<(typeof VAR_KEYS)[number], string>;

const BLACK: Rgb = { r: 0, g: 0, b: 0 };
const WHITE: Rgb = { r: 255, g: 255, b: 255 };
const clamp = (value: number): number => Math.min(255, Math.max(0, value));

function parseColor(value: string): Rgb {
  const normalized = value.trim().replace(/^#/, "");
  const expanded = normalized.length === 3
    ? normalized.split("").map((part) => part + part).join("")
    : normalized;

  if (!/^[\da-fA-F]{6}$/.test(expanded)) {
    throw new Error(`Invalid hex color: ${value}`);
  }

  return {
    r: Number.parseInt(expanded.slice(0, 2), 16),
    g: Number.parseInt(expanded.slice(2, 4), 16),
    b: Number.parseInt(expanded.slice(4, 6), 16),
  };
}

function toHex(color: Rgb): string {
  const channel = (value: number): string => Math.round(clamp(value)).toString(16).padStart(2, "0").toUpperCase();
  return `#${channel(color.r)}${channel(color.g)}${channel(color.b)}`;
}

function toRgbString(color: Rgb): string {
  return `${Math.round(clamp(color.r))} ${Math.round(clamp(color.g))} ${Math.round(clamp(color.b))}`;
}

function roundRgb(color: Rgb): Rgb {
  return { r: Math.round(clamp(color.r)), g: Math.round(clamp(color.g)), b: Math.round(clamp(color.b)) };
}

function mix(from: Rgb, toward: Rgb, amount: number): Rgb {
  const ratio = Math.min(1, Math.max(0, amount));
  return {
    r: from.r + (toward.r - from.r) * ratio,
    g: from.g + (toward.g - from.g) * ratio,
    b: from.b + (toward.b - from.b) * ratio,
  };
}

function linearize(channel: number): number {
  const value = channel / 255;
  return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
}

function luminance(color: Rgb): number {
  return 0.2126 * linearize(color.r) + 0.7152 * linearize(color.g) + 0.0722 * linearize(color.b);
}

function chroma(color: Rgb): number {
  return Math.max(color.r, color.g, color.b) - Math.min(color.r, color.g, color.b);
}

function contrastRgb(a: Rgb, b: Rgb): number {
  const first = luminance(a);
  const second = luminance(b);
  const lighter = Math.max(first, second);
  const darker = Math.min(first, second);
  return (lighter + 0.05) / (darker + 0.05);
}

/** Returns the WCAG 2.x contrast ratio for two hex colors. */
export function contrast(a: string, b: string): number {
  return contrastRgb(parseColor(a), parseColor(b));
}

function rgba(color: string, alpha: number): string {
  const parsed = parseColor(color);
  const opacity = Math.round(Math.min(1, Math.max(0, alpha)) * 100);
  return `rgb(${Math.round(parsed.r)} ${Math.round(parsed.g)} ${Math.round(parsed.b)} / ${opacity}%)`;
}

function pushToward(color: Rgb, background: Rgb, target: Rgb, minimum: number): Rgb {
  if (contrastRgb(color, background) >= minimum) return color;

  for (let step = 1; step <= 1000; step += 1) {
    const candidate = roundRgb(mix(color, target, step / 1000));
    if (contrastRgb(candidate, background) >= minimum) return candidate;
  }

  return target;
}

function pushForBestContrast(color: Rgb, background: Rgb, minimum: number): Rgb {
  if (contrastRgb(color, background) >= minimum) return color;
  const target = contrastRgb(BLACK, background) >= contrastRgb(WHITE, background) ? BLACK : WHITE;
  return pushToward(color, background, target, minimum);
}

function ensureColorList(colors: string[]): Rgb[] {
  if (colors.length < 2) {
    throw new Error("buildTheme requires at least two colors.");
  }
  return colors.map(parseColor);
}

/** Builds all core palette variables from any list of two or more hex colors. */
export function buildTheme(colors: string[], mode: Mode): ThemeVariables {
  const sorted = ensureColorList(colors).sort((a, b) => luminance(a) - luminance(b));
  const darkest = sorted[0];
  const lightest = sorted[sorted.length - 1];
  const accentCandidates = sorted.slice(1).sort((a, b) => chroma(b) - chroma(a));
  const accent = accentCandidates[0] ?? lightest;
  const warm = accentCandidates[1] ?? accent;
  const ok = accentCandidates[2] ?? accent;

  let paper: Rgb;
  let surface: Rgb;
  let ink: Rgb;
  let dark: Rgb;
  let onDark: Rgb;

  if (mode === "light") {
    paper = roundRgb(mix(lightest, WHITE, 0.82));
    surface = roundRgb(mix(lightest, WHITE, 0.92));
    ink = pushToward(roundRgb(mix(darkest, BLACK, 0.45)), paper, BLACK, 9);
    dark = roundRgb(mix(darkest, BLACK, 0.70));
    onDark = paper;
  } else {
    paper = roundRgb(mix(darkest, BLACK, 0.78));
    surface = roundRgb(mix(darkest, BLACK, 0.60));
    ink = pushToward(roundRgb(mix(lightest, WHITE, 0.80)), paper, WHITE, 9);
    dark = roundRgb(mix(darkest, BLACK, 0.90));
    onDark = ink;
  }

  const strong = pushForBestContrast(accent, paper, 3);
  const accentOnDark = pushForBestContrast(accent, dark, 4.5);
  const mutedStart = roundRgb(mix(ink, paper, 0.45));
  const muted = pushToward(mutedStart, paper, ink, 4.5);
  const line = mix(ink, paper, 0.82);

  return {
    "--paper": toHex(paper),
    "--surface": toHex(surface),
    "--ink": toHex(ink),
    "--ink-rgb": toRgbString(ink),
    "--muted": toHex(muted),
    "--line": toHex(line),
    "--accent": toHex(accent),
    "--accent-strong": toHex(strong),
    "--accent-soft": toHex(mix(accent, paper, 0.78)),
    "--accent-on-dark": toHex(accentOnDark),
    "--dark": toHex(dark),
    "--on-dark": toHex(onDark),
    "--warm": toHex(warm),
    "--ok": toHex(ok),
  };
}

/**
 * Maps the 14 palette outputs onto every visual token used by this portfolio.
 * This is what makes B, G and M distinct full-site themes instead of only
 * changing a few legacy color aliases.
 */
function getThemeAliases(vars: ThemeVariables, mode: Mode): Record<string, string> {
  const ink = vars["--ink"];
  const paper = vars["--paper"];
  const surface = vars["--surface"];
  const accent = vars["--accent"];
  const accentStrong = vars["--accent-strong"];
  const accentSoft = vars["--accent-soft"];
  const accentOnDark = vars["--accent-on-dark"];
  const dark = vars["--dark"];
  const onDark = vars["--on-dark"];
  const warm = vars["--warm"];
  const ok = vars["--ok"];
  const inverseBorder = rgba(onDark, 0.14);
  const inverseMuted = toHex(mix(parseColor(onDark), parseColor(dark), 0.34));
  const inverseSoft = toHex(mix(parseColor(onDark), parseColor(dark), 0.22));
  const darkAlt = toHex(mix(parseColor(dark), parseColor(onDark), 0.08));
  const darkPanel = toHex(mix(parseColor(dark), parseColor(onDark), 0.12));
  const darkPanelSoft = toHex(mix(parseColor(dark), parseColor(onDark), 0.18));
  const darkCode = toHex(mix(parseColor(dark), parseColor(onDark), 0.04));
  const accentLight = toHex(mix(parseColor(accent), parseColor(mode === "dark" ? onDark : paper), mode === "dark" ? 0.56 : 0.28));
  const accentText = contrast(accent, "#101411") >= contrast(accent, "#FFFFFF") ? "#101411" : "#FFFFFF";
  const shadowColor = mode === "dark" ? "#000000" : "#121712";

  return {
    // Tailwind v4 and legacy site tokens.
    "--bg": paper,
    "--card": surface,
    "--text": ink,
    "--text-rgb": vars["--ink-rgb"],
    "--border": vars["--line"],
    "--accent-text": accentText,
    "--accent-light": accentLight,
    "--dark-alt": darkAlt,
    "--dark-panel": darkPanel,
    "--dark-panel-soft": darkPanelSoft,
    "--dark-code": darkCode,
    "--inverse-muted": inverseMuted,
    "--inverse-soft": inverseSoft,
    "--inverse-border": inverseBorder,
    "--shadow-color": shadowColor,
    "--window-dot-close": warm,
    "--window-dot-warn": accentStrong,
    "--window-dot-ok": ok,
    "--syntax-muted": inverseMuted,
    "--syntax-line": inverseSoft,
    "--syntax-string": warm,
    "--syntax-function": onDark,
    "--syntax-bright": onDark,
    "--syntax-accent": accentOnDark,
    "--playground-glow": rgba(accent, 0.18),
    "--playground-label": vars["--muted"],
    "--image-glaze": rgba(ink, 0.12),
    "--syntax-dot": inverseSoft,
    "--syntax-tab": inverseMuted,
    "--syntax-filename": inverseMuted,
    "--syntax-button": onDark,
    "--syntax-browser-bg": darkCode,
    "--syntax-iframe-bg": darkCode,
    "--syntax-footnote": inverseMuted,
    // Code playground, browser mockups, and terminal accents.
    "--pl-bg": dark,
    "--pl-panel": darkPanel,
    "--pl-panel-soft": darkPanelSoft,
    "--pl-ivory": onDark,
    "--pl-sage": inverseSoft,
    "--pl-muted": inverseMuted,
    "--pl-line": inverseBorder,
    "--pl-lime": accentOnDark,
    "--pl-code-panel": darkPanelSoft,
    "--pl-terminal": onDark,
    "--pl-terminal-muted": inverseMuted,
    "--pl-terminal-success": accentOnDark,
    "--pl-code-string": warm,
    "--pl-code-function": onDark,
    "--pl-code-comment": inverseMuted,
    "--pl-preview-bg": paper,
    "--pl-preview-surface": surface,
    "--pl-preview-text": ink,
    "--pl-preview-muted": vars["--muted"],
    "--pl-preview-border": vars["--line"],
    "--pl-preview-accent": accent,
    "--pl-preview-strong": ink,
    "--pl-preview-soft": accentSoft,
    "--pl-preview-light": accentLight,
    "--pl-preview-status": ok,
    "--pl-atmosphere-one": rgba(accent, 0.13),
    "--pl-atmosphere-two": rgba(vars["--muted"], 0.11),
    "--pl-grid": rgba(onDark, 0.04),
    "--pl-panel-gradient-start": rgba(darkPanel, 0.95),
    "--pl-panel-gradient-end": rgba(darkAlt, 0.97),
    "--pl-tab-background": rgba(onDark, 0.03),
    "--pl-tab-muted": inverseMuted,
    "--pl-line-number": inverseSoft,
    "--pl-terminal-end": darkAlt,
    "--pl-browser-border": rgba(onDark, 0.20),
    "--pl-browser-background": surface,
    "--pl-browser-ink": ink,
    "--pl-browser-divider": vars["--line"],
    "--pl-window-dot-border": inverseMuted,
    "--pl-window-dot-middle": accentSoft,
    "--pl-window-dot-ready-border": ok,
    "--pl-window-dot-ready": accent,
    "--pl-address-background": paper,
    "--pl-address-ink": vars["--muted"],
    "--pl-browser-refresh": vars["--muted"],
    "--pl-preview-copy": vars["--muted"],
    "--pl-preview-dot": ok,
    "--pl-preview-card-border": vars["--line"],
    "--pl-preview-image": accentSoft,
    "--pl-preview-tag-border": vars["--line"],
    "--pl-preview-tag-ink": vars["--muted"],
    "--pl-success-glow": rgba(accent, 0.17),
    "--pl-shadow": shadowColor,
    "--stack-heading": mode === "dark" ? accentOnDark : ink,
  };
}

const ALIAS_KEYS = Object.keys(getThemeAliases({
  "--paper": "#FFFFFF",
  "--surface": "#FFFFFF",
  "--ink": "#000000",
  "--ink-rgb": "0 0 0",
  "--muted": "#555555",
  "--line": "#DDDDDD",
  "--accent": "#3366FF",
  "--accent-strong": "#2244AA",
  "--accent-soft": "#CCDDEE",
  "--accent-on-dark": "#99BBFF",
  "--dark": "#111111",
  "--on-dark": "#FFFFFF",
  "--warm": "#DD8844",
  "--ok": "#44AA66",
}, "dark"));

/** Applies a palette. Passing null restores the original theme from globals.css. */
export function applyTheme(vars: ThemeVariables | null, mode: Mode): void {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  root.dataset.theme = mode === "light" ? "classic" : "dark";
  root.dataset.paletteMode = mode;
  root.style.colorScheme = mode;

  if (vars) {
    for (const key of VAR_KEYS) root.style.setProperty(key, vars[key]);
    const aliases = getThemeAliases(vars, mode);
    for (const [key, value] of Object.entries(aliases)) root.style.setProperty(key, value);
  } else {
    for (const key of VAR_KEYS) root.style.removeProperty(key);
    for (const key of ALIAS_KEYS) root.style.removeProperty(key);
  }

  let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    document.head.appendChild(meta);
  }

  const computedPaper = window.getComputedStyle(root).getPropertyValue("--paper").trim();
  meta.content = vars?.["--paper"] ?? (computedPaper || (mode === "light" ? "#EDEBE3" : "#0E0F0C"));
}
