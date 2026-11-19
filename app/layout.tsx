import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Preloader } from "@/components/Preloader";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { CursorEffects } from "@/components/CursorEffects";
import { PaletteBar } from "@/components/PaletteBar";
import { ScrollAnimations } from "@/components/ScrollAnimations";
import { siteConfig, siteUrl } from "@/lib/site";
import { palettes } from "@/data/palettes";
import "./globals.css";
import "./preloader.css";
import "./palette.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const themeBootScript = `
(function () {
  var root = document.documentElement;
  var allowed = ["classic", "dark", "forest"];
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
  var keys = [
    "--paper", "--surface", "--ink", "--ink-rgb", "--muted", "--line",
    "--accent", "--accent-strong", "--accent-soft", "--accent-on-dark",
    "--dark", "--on-dark", "--warm", "--ok"
  ];
  try {
    var raw = window.localStorage.getItem("palette-vars");
    var stateRaw = window.localStorage.getItem("palette-state");
    if (!raw || !stateRaw) return;
    var saved = JSON.parse(raw);
    var state = JSON.parse(stateRaw);
    var allowedIds = ${JSON.stringify(palettes.map((palette) => palette.id))};
    if (!saved || typeof saved !== "object" || !saved.vars || typeof saved.vars !== "object") return;
    if (!state || typeof state !== "object" || allowedIds.indexOf(state.id) === -1) return;
    if ((state.mode !== "light" && state.mode !== "dark") || state.mode !== saved.mode) return;
    keys.forEach(function (key) {
      var value = saved.vars[key];
      if (typeof value === "string") root.style.setProperty(key, value);
    });
    if (saved.mode === "light" || saved.mode === "dark") root.style.colorScheme = saved.mode;
    var meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "theme-color");
      document.head.appendChild(meta);
    }
    var paper = root.style.getPropertyValue("--paper");
    if (paper) meta.setAttribute("content", paper);
  } catch {
    // Ignore malformed or unavailable palette storage and use the site defaults.
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
          <Preloader />
          <CursorEffects />
          <PaletteBar />
          <ScrollAnimations />
          <Navbar />
          {children}
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
