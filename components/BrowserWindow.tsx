import Image from "next/image";
import { ThemeArtwork } from "@/components/ThemeArtwork";

type BrowserWindowProps = {
  src: string;
  alt: string;
  sizes: string;
  address?: string;
  priority?: boolean;
  compact?: boolean;
  className?: string;
};

function getAddressLabel(address: string): string {
  try {
    return new URL(address).hostname;
  } catch {
    return address;
  }
}

export function BrowserWindow({
  src,
  alt,
  sizes,
  address = "Selected project",
  priority = false,
  compact = false,
  className = "",
}: BrowserWindowProps) {
  return (
    <span className={`browser-window${compact ? " browser-window--compact" : ""} ${className}`.trim()}>
      <span className="browser-window-bar" aria-hidden="true">
        <span className="browser-window-dots"><i /><i /><i /></span>
        <span className="browser-window-address" title={address}>{getAddressLabel(address)}</span>
        <span className="browser-window-actions"><i /><i /><i /></span>
      </span>
      <span className="browser-window-viewport">
        {src.endsWith(".svg") ? (
          <ThemeArtwork src={src} alt={alt} />
        ) : (
          <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="project-image" />
        )}
      </span>
    </span>
  );
}
