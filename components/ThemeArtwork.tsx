import { useId } from "react";

const artwork1 = String.raw`<svg xmlns="http://www.w3.org/2000/svg" width="1400" height="520" viewBox="0 0 1400 520">
<defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="var(--art-bg)"/><stop offset="1" stop-color="var(--art-accent-soft)"/></linearGradient><linearGradient id="card" x2="1" y2="1"><stop stop-color="var(--art-text)"/><stop offset="1" stop-color="var(--art-accent-strong)"/></linearGradient></defs>
<rect width="1400" height="520" fill="url(#bg)"/><circle cx="1135" cy="112" r="245" fill="var(--art-accent)" opacity=".48"/><rect x="120" y="66" width="1160" height="388" rx="18" fill="var(--art-bg)" stroke="var(--art-surface)" stroke-opacity=".8"/>
<rect x="120" y="66" width="1160" height="42" rx="18" fill="var(--art-surface)"/><circle cx="148" cy="87" r="5" fill="var(--art-accent-light)"/><circle cx="167" cy="87" r="5" fill="var(--art-accent-light)"/><circle cx="186" cy="87" r="5" fill="var(--art-status)"/><rect x="228" y="80" width="370" height="14" rx="7" fill="var(--art-border)"/>
<rect x="165" y="140" width="480" height="270" rx="9" fill="url(#card)"/><text x="208" y="205" fill="var(--art-accent)" font-family="Arial,sans-serif" font-size="15" letter-spacing="4">BUILD / SHIP / REPEAT</text><text x="205" y="282" fill="var(--art-bg)" font-family="Arial,sans-serif" font-size="61" font-weight="700" letter-spacing="-4">Good ideas</text><text x="205" y="348" fill="var(--art-bg)" font-family="Arial,sans-serif" font-size="61" font-weight="700" letter-spacing="-4">need good code.</text><rect x="208" y="370" width="116" height="23" rx="11" fill="var(--art-accent)"/>
<rect x="700" y="145" width="520" height="116" rx="9" fill="var(--art-accent-soft)"/><rect x="730" y="176" width="110" height="9" rx="4" fill="var(--art-muted)"/><rect x="730" y="196" width="270" height="17" rx="8" fill="var(--art-border)"/><rect x="1032" y="174" width="150" height="58" rx="7" fill="var(--art-accent)"/><rect x="700" y="283" width="250" height="126" rx="9" fill="var(--art-border)"/><rect x="970" y="283" width="250" height="126" rx="9" fill="var(--art-text)"/><path d="M730 372l58-49 40 27 70-56" fill="none" stroke="var(--art-accent-strong)" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/><path d="M1000 372h174" stroke="var(--art-accent)" stroke-width="7" stroke-linecap="round"/><path d="M1000 346h130" stroke="var(--art-accent-light)" stroke-width="7" stroke-linecap="round"/>
</svg>
`;
const artworkByPath: Record<string, string> = {
  "/images/hero-interface.svg": artwork1,
};

type ThemeArtworkProps = {
  src: string;
  alt: string;
  className?: string;
};

export function ThemeArtwork({ src, alt, className = "" }: ThemeArtworkProps) {
  const markup = artworkByPath[src];
  const instanceId = useId().replace(/:/g, "");
  if (!markup) return null;

  // Scope SVG IDs because the hero artwork is repeated in both moving strips.
  const scopedMarkup = markup
    .replace(/\bid="([^"]+)"/g, (_match, id: string) => `id="${instanceId}-${id}"`)
    .replace(/url\(#([^)]+)\)/g, (_match, id: string) => `url(#${instanceId}-${id})`);

  return (
    <span
      className={`theme-artwork ${className}`.trim()}
      role="img"
      aria-label={alt}
      dangerouslySetInnerHTML={{ __html: scopedMarkup }}
    />
  );
}
