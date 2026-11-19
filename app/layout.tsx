import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Preloader } from "@/components/Preloader";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { CursorEffects } from "@/components/CursorEffects";
import { ScrollAnimations } from "@/components/ScrollAnimations";
import { CommandPalette } from "@/components/CommandPalette";
import { ScrollProgress } from "@/components/ScrollProgress";
import { siteConfig, siteUrl } from "@/lib/site";
import { palettes } from "@/data/palettes";
import "./globals.css";
import "./preloader.css";
import "./palette.css";
import "./features.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const themeBootScript = `
(function () {
  var root = document.documentElement;
  var allowed = ["classic", "dark"];
  var theme = "dark";
  try {
    var saved = window.localStorage.getItem("theme");
    if (allowed.indexOf(saved) !== -1) theme = saved;
  } catch {
    theme = "dark";
  }
  root.dataset.theme = theme;
})();
`;

const introBootScript = `
(function () {
  var root = document.documentElement;
  try {
    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var alreadySeen = window.sessionStorage.getItem("intro-seen") === "1";
    root.dataset.intro = reducedMotion || alreadySeen ? "skip" : "playing";
  } catch {
    root.dataset.intro = "skip";
  }
})();
`;

const paletteBootScript = `
(function () {
  var root = document.documentElement;
  var coreKeys = [
    "--paper", "--surface", "--ink", "--ink-rgb", "--muted", "--line",
    "--accent", "--accent-strong", "--accent-soft", "--accent-on-dark",
    "--dark", "--on-dark", "--warm", "--ok"
  ];
  var aliasKeys = [
    "--bg", "--card", "--text", "--text-rgb", "--border", "--accent-text", "--accent-light",
    "--dark-alt", "--dark-panel", "--dark-panel-soft", "--dark-code", "--inverse-muted", "--inverse-soft",
    "--inverse-border", "--shadow-color", "--window-dot-close", "--window-dot-warn", "--window-dot-ok",
    "--syntax-muted", "--syntax-line", "--syntax-string", "--syntax-function", "--syntax-bright", "--syntax-accent",
    "--playground-glow", "--playground-label", "--image-glaze", "--syntax-dot", "--syntax-tab", "--syntax-filename",
    "--syntax-button", "--syntax-browser-bg", "--syntax-iframe-bg", "--syntax-footnote",
    "--pl-bg", "--pl-panel", "--pl-panel-soft", "--pl-ivory", "--pl-sage", "--pl-muted", "--pl-line", "--pl-lime",
    "--pl-code-panel", "--pl-terminal", "--pl-terminal-muted", "--pl-terminal-success", "--pl-code-string",
    "--pl-code-function", "--pl-code-comment", "--pl-preview-bg", "--pl-preview-surface", "--pl-preview-text",
    "--pl-preview-muted", "--pl-preview-border", "--pl-preview-accent", "--pl-preview-strong", "--pl-preview-soft",
    "--pl-preview-light", "--pl-preview-status", "--pl-atmosphere-one", "--pl-atmosphere-two", "--pl-grid",
    "--pl-panel-gradient-start", "--pl-panel-gradient-end", "--pl-tab-background", "--pl-tab-muted", "--pl-line-number",
    "--pl-terminal-end", "--pl-browser-border", "--pl-browser-background", "--pl-browser-ink", "--pl-browser-divider",
    "--pl-window-dot-border", "--pl-window-dot-middle", "--pl-window-dot-ready-border", "--pl-window-dot-ready",
    "--pl-address-background", "--pl-address-ink", "--pl-browser-refresh", "--pl-preview-copy", "--pl-preview-dot",
    "--pl-preview-card-border", "--pl-preview-image", "--pl-preview-tag-border", "--pl-preview-tag-ink", "--pl-success-glow",
    "--pl-shadow", "--stack-heading"
  ];
  function parseHex(value) {
    var hex = String(value || "").replace(/^#/, "");
    if (!/^[0-9a-fA-F]{6}$/.test(hex)) return [0, 0, 0];
    return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
  }
  function toHex(rgb) {
    return "#" + rgb.map(function (n) { return Math.max(0, Math.min(255, Math.round(n))).toString(16).padStart(2, "0"); }).join("").toUpperCase();
  }
  function mixHex(a, b, amount) {
    var x = parseHex(a), y = parseHex(b);
    return toHex(x.map(function (n, i) { return n + (y[i] - n) * amount; }));
  }
  function rgba(hex, alpha) {
    var c = parseHex(hex);
    return "rgb(" + c[0] + " " + c[1] + " " + c[2] + " / " + Math.round(alpha * 100) + "%)";
  }
  function linear(n) {
    var v = n / 255;
    return v <= 0.04045 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  }
  function luminance(hex) {
    var c = parseHex(hex);
    return 0.2126 * linear(c[0]) + 0.7152 * linear(c[1]) + 0.0722 * linear(c[2]);
  }
  function contrastRatio(a, b) {
    var x = luminance(a), y = luminance(b);
    return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
  }
  function applyAliases(v, mode) {
    var ink = v["--ink"], paper = v["--paper"], surface = v["--surface"];
    var accent = v["--accent"], accentStrong = v["--accent-strong"], accentSoft = v["--accent-soft"];
    var accentOnDark = v["--accent-on-dark"], dark = v["--dark"], onDark = v["--on-dark"];
    var warm = v["--warm"], ok = v["--ok"];
    var inverseBorder = rgba(onDark, 0.14);
    var inverseMuted = mixHex(onDark, dark, 0.34);
    var inverseSoft = mixHex(onDark, dark, 0.22);
    var darkAlt = mixHex(dark, onDark, 0.08);
    var darkPanel = mixHex(dark, onDark, 0.12);
    var darkPanelSoft = mixHex(dark, onDark, 0.18);
    var darkCode = mixHex(dark, onDark, 0.04);
    var accentLight = mixHex(accent, mode === "dark" ? onDark : paper, mode === "dark" ? 0.56 : 0.28);
    var accentText = contrastRatio(accent, "#101411") >= contrastRatio(accent, "#FFFFFF") ? "#101411" : "#FFFFFF";
    var shadowColor = mode === "dark" ? "#000000" : "#121712";
    var aliases = {
      "--bg": paper, "--card": surface, "--text": ink, "--text-rgb": v["--ink-rgb"], "--border": v["--line"],
      "--accent-text": accentText, "--accent-light": accentLight, "--dark-alt": darkAlt, "--dark-panel": darkPanel,
      "--dark-panel-soft": darkPanelSoft, "--dark-code": darkCode, "--inverse-muted": inverseMuted,
      "--inverse-soft": inverseSoft, "--inverse-border": inverseBorder, "--shadow-color": shadowColor,
      "--window-dot-close": warm, "--window-dot-warn": accentStrong, "--window-dot-ok": ok,
      "--syntax-muted": inverseMuted, "--syntax-line": inverseSoft, "--syntax-string": warm,
      "--syntax-function": onDark, "--syntax-bright": onDark, "--syntax-accent": accentOnDark,
      "--playground-glow": rgba(accent, 0.18), "--playground-label": v["--muted"], "--image-glaze": rgba(ink, 0.12),
      "--syntax-dot": inverseSoft, "--syntax-tab": inverseMuted, "--syntax-filename": inverseMuted,
      "--syntax-button": onDark, "--syntax-browser-bg": darkCode, "--syntax-iframe-bg": darkCode, "--syntax-footnote": inverseMuted,
      "--pl-bg": dark, "--pl-panel": darkPanel, "--pl-panel-soft": darkPanelSoft, "--pl-ivory": onDark,
      "--pl-sage": inverseSoft, "--pl-muted": inverseMuted, "--pl-line": inverseBorder, "--pl-lime": accentOnDark,
      "--pl-code-panel": darkPanelSoft, "--pl-terminal": onDark, "--pl-terminal-muted": inverseMuted,
      "--pl-terminal-success": accentOnDark, "--pl-code-string": warm, "--pl-code-function": onDark,
      "--pl-code-comment": inverseMuted, "--pl-preview-bg": paper, "--pl-preview-surface": surface,
      "--pl-preview-text": ink, "--pl-preview-muted": v["--muted"], "--pl-preview-border": v["--line"],
      "--pl-preview-accent": accent, "--pl-preview-strong": ink, "--pl-preview-soft": accentSoft,
      "--pl-preview-light": accentLight, "--pl-preview-status": ok, "--pl-atmosphere-one": rgba(accent, 0.13),
      "--pl-atmosphere-two": rgba(v["--muted"], 0.11), "--pl-grid": rgba(onDark, 0.04),
      "--pl-panel-gradient-start": rgba(darkPanel, 0.95), "--pl-panel-gradient-end": rgba(darkAlt, 0.97),
      "--pl-tab-background": rgba(onDark, 0.03), "--pl-tab-muted": inverseMuted, "--pl-line-number": inverseSoft,
      "--pl-terminal-end": darkAlt, "--pl-browser-border": rgba(onDark, 0.20), "--pl-browser-background": surface,
      "--pl-browser-ink": ink, "--pl-browser-divider": v["--line"], "--pl-window-dot-border": inverseMuted,
      "--pl-window-dot-middle": accentSoft, "--pl-window-dot-ready-border": ok, "--pl-window-dot-ready": accent,
      "--pl-address-background": paper, "--pl-address-ink": v["--muted"], "--pl-browser-refresh": v["--muted"],
      "--pl-preview-copy": v["--muted"], "--pl-preview-dot": ok, "--pl-preview-card-border": v["--line"],
      "--pl-preview-image": accentSoft, "--pl-preview-tag-border": v["--line"],
      "--pl-preview-tag-ink": v["--muted"], "--pl-success-glow": rgba(accent, 0.17),
      "--pl-shadow": shadowColor, "--stack-heading": mode === "dark" ? accentOnDark : ink
    };
    Object.keys(aliases).forEach(function (key) { root.style.setProperty(key, aliases[key]); });
  }
  try {
    var stateRaw = window.localStorage.getItem("palette-state");
    if (!stateRaw) return;
    var state = JSON.parse(stateRaw);
    var allowedIds = ["0"].concat(${JSON.stringify(palettes.map((palette) => palette.id))});
    if (!state || typeof state !== "object" || allowedIds.indexOf(state.id) === -1) return;
    if (state.mode !== "light" && state.mode !== "dark") return;

    root.dataset.theme = state.mode === "light" ? "classic" : "dark";
    root.dataset.paletteId = state.id;
    root.dataset.paletteMode = state.mode;
    root.style.colorScheme = state.mode;

    if (state.id === "0") {
      coreKeys.concat(aliasKeys).forEach(function (key) { root.style.removeProperty(key); });
    } else {
      var raw = window.localStorage.getItem("palette-vars");
      if (!raw) return;
      var saved = JSON.parse(raw);
      if (!saved || typeof saved !== "object" || !saved.vars || typeof saved.vars !== "object" || saved.mode !== state.mode) return;
      coreKeys.forEach(function (key) {
        var value = saved.vars[key];
        if (typeof value === "string") root.style.setProperty(key, value);
      });
      applyAliases(saved.vars, state.mode);
    }

    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "theme-color");
      document.head.appendChild(meta);
    }
    var paper = window.getComputedStyle(root).getPropertyValue("--paper").trim();
    meta.setAttribute("content", paper || (state.mode === "light" ? "#EDEBE3" : "#0E0F0C"));
  } catch {
    // Ignore malformed or unavailable palette storage and use the site's defaults.
  }
})();
`;

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: {
    default: siteConfig.title,
    template: "%s — Ayaan Khan",
  },
  description: siteConfig.description,
  applicationName: "Ayaan Khan",
  openGraph: {
    type: "website",
    title: siteConfig.title,
    description: siteConfig.description,
    siteName: "Ayaan Khan",
    images: [{ url: "/og-image.png", width: 1200, height: 630, alt: "Ayaan Khan — Software Developer" }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.title,
    description: siteConfig.description,
    images: ["/og-image.png"],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  colorScheme: "light dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
        <script dangerouslySetInnerHTML={{ __html: introBootScript }} />
        <script dangerouslySetInnerHTML={{ __html: paletteBootScript }} />
      </head>
      <body className={inter.variable}>
        <SmoothScrollProvider>
          <ScrollProgress />
          <Preloader />
          <CursorEffects />
          <CommandPalette />
          <ScrollAnimations />
          <Navbar />
          {children}
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
