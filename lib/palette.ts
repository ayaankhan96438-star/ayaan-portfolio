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

/** Builds all palette variables from any list of two or more hex colors. */
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

/** Applies generated variables; passing null restores the original stylesheet values. */
export function applyTheme(vars: ThemeVariables | null, mode: Mode): void {
  if (typeof document === "undefined") return;

  const root = document.documentElement;
  for (const key of VAR_KEYS) {
    if (vars) root.style.setProperty(key, vars[key]);
    else root.style.removeProperty(key);
  }
  root.style.colorScheme = mode;
  root.dataset.paletteMode = mode;

  let meta = document.querySelector<HTMLMetaElement>('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement("meta");
    meta.name = "theme-color";
    document.head.appendChild(meta);
  }

  const computedPaper = window.getComputedStyle(root).getPropertyValue("--paper").trim();
  meta.content = vars?.["--paper"] ?? (computedPaper || (mode === "light" ? "#EDEBE3" : "#0E0F0C"));
}
