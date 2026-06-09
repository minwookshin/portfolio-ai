import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-base)",
        foreground: "var(--text-primary)",
        accent: "var(--accent-indigo)",
        "accent-hover": "var(--accent-indigo-hover)",
        muted: "var(--text-muted)",
        border: "var(--border-light)",
        light: "var(--bg-surface)",
        element: "var(--bg-element)",
        "dark-base": "var(--dark-bg-base)",
        "dark-surface": "var(--dark-bg-surface)",
        "dark-border": "var(--dark-border)",
        "dark-muted": "var(--dark-text-muted)",
        // Existing component color roles bridged to the design tokens.
        surface: "var(--md-surface)",
        "surface-container": "var(--md-surface-container)",
        "surface-container-high": "var(--md-surface-container-high)",
        "on-surface": "var(--md-on-surface)",
        "on-surface-variant": "var(--md-on-surface-variant)",
        outline: "var(--md-outline)",
        "outline-variant": "var(--md-outline-variant)",
        primary: "var(--md-primary)",
        "on-primary": "var(--md-on-primary)",
        "primary-container": "var(--md-primary-container)",
        "on-primary-container": "var(--md-on-primary-container)",
      },
      borderRadius: {
        "shape-xs": "var(--md-shape-xs)",
        "shape-sm": "var(--md-shape-sm)",
        "shape-md": "var(--md-shape-md)",
        "shape-lg": "var(--md-shape-lg)",
        "shape-xl": "var(--md-shape-xl)",
        "shape-full": "var(--md-shape-full)",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
        mono: ["var(--font-mono)"],
      },
      fontSize: {
        "step--2": ["var(--type--2)", { lineHeight: "var(--leading-body)" }],
        "step--1": ["var(--type--1)", { lineHeight: "var(--leading-body)" }],
        "step-0": ["var(--type-0)", { lineHeight: "var(--leading-body)" }],
        "step-1": ["var(--type-1)", { lineHeight: "var(--leading-heading)" }],
        "step-2": ["var(--type-2)", { lineHeight: "var(--leading-heading)" }],
        "step-3": ["var(--type-3)", { lineHeight: "var(--leading-heading)" }],
        "step-4": ["var(--type-4)", { lineHeight: "var(--leading-heading)" }],
      },
      spacing: {
        grid: "var(--space-1)",
        "grid-2": "var(--space-2)",
        "grid-3": "var(--space-3)",
        "grid-4": "var(--space-4)",
        "grid-5": "var(--space-5)",
        "grid-6": "var(--space-6)",
        "grid-7": "var(--space-7)",
        "grid-8": "var(--space-8)",
      },
      boxShadow: {
        glow: "0 0 30px rgba(255, 64, 0, 0.2)",
        "glow-blue": "0 0 30px rgba(1, 81, 254, 0.2)",
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
