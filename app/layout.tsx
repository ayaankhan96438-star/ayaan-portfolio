import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Preloader } from "@/components/Preloader";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";
import { siteConfig, siteUrl } from "@/lib/site";
import "./globals.css";
import "./preloader.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

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
  themeColor: "#EDEBE3",
  colorScheme: "light",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: introBootScript }} />
      </head>
      <body className={inter.variable}>
        <SmoothScrollProvider>
          <Preloader />
          <Navbar />
          {children}
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
