"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { springs } from "@/lib/material/motion";

// Sun = a center dot ringed by smaller dots (matches the site's dotted language).
function SunDots() {
  const rays = Array.from({ length: 8 }, (_, i) => {
    const a = (i / 8) * Math.PI * 2;
    return { cx: 9 + Math.cos(a) * 6, cy: 9 + Math.sin(a) * 6 };
  });
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden>
      <circle cx="9" cy="9" r="3" />
      {rays.map((r, i) => (
        <circle key={i} cx={r.cx} cy={r.cy} r="1" />
      ))}
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="currentColor" aria-hidden>
      <path d="M15.5 11.2A6.5 6.5 0 016.8 2.5a6.5 6.5 0 108.7 8.7z" />
    </svg>
  );
}

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggle = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("theme", next ? "dark" : "light");
    } catch {}
  };

  return (
    <motion.button
      type="button"
      onClick={toggle}
      whileTap={{ scale: 0.85 }}
      transition={springs.island}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="text-on-surface/70 hover:text-on-surface transition-colors"
    >
      <motion.span
        key={dark ? "moon" : "sun"}
        initial={{ opacity: 0, rotate: -90, scale: 0.6 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        transition={springs.island}
        className="inline-flex"
      >
        {dark ? <MoonIcon /> : <SunDots />}
      </motion.span>
    </motion.button>
  );
}
