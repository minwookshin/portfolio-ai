"use client";

import { useState } from "react";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

type ThemeToggleProps = {
  className?: string;
  glassHover?: boolean;
  placement?: "fixed" | "inline";
};

function getInitialTheme(): Theme {
  if (typeof document === "undefined") return "light";
  return document.documentElement.dataset.theme === "dark" ? "dark" : "light";
}

export default function ThemeToggle({
  className = "",
  glassHover = false,
  placement = "fixed",
}: ThemeToggleProps) {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);
  const isDark = theme === "dark";
  const label = isDark ? "Switch to light theme" : "Switch to dark theme";
  const buttonClassName = [
    "theme-toggle-button",
    `theme-toggle-button--${placement}`,
    "micro-focus",
    "micro-focus-tight",
    "micro-pressable",
    className,
  ].filter(Boolean).join(" ");

  const toggleTheme = () => {
    const nextTheme: Theme = isDark ? "light" : "dark";
    document.documentElement.dataset.theme = nextTheme;
    document.documentElement.style.colorScheme = nextTheme;
    window.localStorage.setItem("theme", nextTheme);
    setTheme(nextTheme);
  };

  return (
    <button
      aria-label={label}
      aria-pressed={isDark}
      className={buttonClassName}
      data-liquid-glass-row={glassHover ? "true" : undefined}
      onClick={toggleTheme}
      suppressHydrationWarning
      title={label}
      type="button"
    >
      <Sun aria-hidden="true" className="theme-toggle-button__icon theme-toggle-button__icon--sun" />
      <Moon aria-hidden="true" className="theme-toggle-button__icon theme-toggle-button__icon--moon" />
    </button>
  );
}
