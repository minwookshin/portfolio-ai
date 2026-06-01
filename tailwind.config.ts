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
        background: "#ffffff",
        foreground: "#090712",
        accent: "#0151fe", // Single modern blue accent
        muted: "#858585",
        border: "#e5e5e5",
        light: "#fafafa",
        // Material 3 Expressive color roles
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
        sans: ["var(--font-google-sans)", "sans-serif"],
        mono: ["var(--font-google-sans)", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 30px rgba(255, 64, 0, 0.2)",
        "glow-blue": "0 0 30px rgba(1, 81, 254, 0.2)",
      },
      animation: {
        "fade-in-up": "fadeInUp 0.5s ease-out",
      },
      keyframes: {
        fadeInUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};

export default config;
