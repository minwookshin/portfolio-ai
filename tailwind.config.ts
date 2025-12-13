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
        foreground: "#0a0a0a",
        accent: "#0151fe", // Single modern blue accent
        muted: "#858585",
        border: "#e5e5e5",
        light: "#fafafa",
      },
      fontFamily: {
        sans: ["var(--font-dm-sans)"],
        mono: ["var(--font-jetbrains-mono)"],
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
