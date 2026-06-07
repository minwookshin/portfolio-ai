import nextVitals from "eslint-config-next/core-web-vitals";

const config = [
  ...nextVitals,
  {
    ignores: [
      ".next/**",
      ".vercel/**",
      ".gstack/**",
      ".playwright-mcp/**",
      "node_modules/**",
      "screenshots/**",
      "store/**",
      "*.tsbuildinfo",
    ],
  },
  {
    rules: {
      "@next/next/no-img-element": "off",
      "react/no-unescaped-entities": "off",
    },
  },
];

export default config;
