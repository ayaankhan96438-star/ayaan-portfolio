"use client";

import { useEffect, useState } from "react";

type Theme = "classic" | "dark" | "forest";
type ThemeSwitcherProps = { variant: "header" | "menu" };

const themes: Array<{ id: Theme; label: string }> = [
  { id: "classic", label: "Classic" },
  { id: "dark", label: "Dark" },
  { id: "forest", label: "Forest" },
];

const THEME_EVENT = "portfolio:themechange";

export function ThemeSwitcher({ variant }: ThemeSwitcherProps) {
  const [activeTheme, setActiveTheme] = useState<Theme>("dark");

  useEffect(() => {
    const current = document.documentElement.dataset.theme;
    if (current === "classic" || current === "dark" || current === "forest") {
      setActiveTheme(current);
    }

    const syncTheme = (event: Event) => {
      const nextTheme = (event as CustomEvent<Theme>).detail;
      if (nextTheme === "classic" || nextTheme === "dark" || nextTheme === "forest") {
        setActiveTheme(nextTheme);
      }
    };

    window.addEventListener(THEME_EVENT, syncTheme);
    return () => window.removeEventListener(THEME_EVENT, syncTheme);
  }, []);

  const selectTheme = (theme: Theme) => {
    document.documentElement.dataset.theme = theme;
    try {
      window.localStorage.setItem("theme", theme);
    } catch {
      // The theme still applies for this page view when storage is unavailable.
    }
    setActiveTheme(theme);
    window.dispatchEvent(new CustomEvent(THEME_EVENT, { detail: theme }));
  };

  return (
    <div className={`theme-switcher theme-switcher--${variant}`} role="group" aria-label="Choose color theme">
      {themes.map((theme) => (
        <button
          className="theme-switcher-button"
          data-theme-option={theme.id}
          type="button"
          key={theme.id}
          aria-label={`Use ${theme.label} theme`}
          aria-pressed={activeTheme === theme.id}
          title={theme.label}
          onClick={() => selectTheme(theme.id)}
        >
          <span className="theme-switcher-dot" aria-hidden="true" />
          <span className="theme-switcher-name" aria-hidden="true">{theme.label}</span>
        </button>
      ))}
    </div>
  );
}
