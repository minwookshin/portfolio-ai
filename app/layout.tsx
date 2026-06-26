import type { Metadata } from "next";
import { Geist_Mono } from "next/font/google";
import StructuredData from "@/components/StructuredData";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, rootJsonLd } from "@/lib/seo";
import "@carrot-kpi/switzer-font/latin.css";
import "./globals.css";

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

const themeInitScript = `
(() => {
  try {
    const savedTheme = window.localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = savedTheme === "dark" || (!savedTheme && prefersDark) ? "dark" : "light";
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
  } catch {
    document.documentElement.dataset.theme = "light";
    document.documentElement.style.colorScheme = "light";
  }
})();
`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} · Design Engineer / UX Engineer`,
    template: "%s · Minwook Shin",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Minwook Shin",
    "Design Engineer",
    "Design Engineer Portfolio",
    "AI Product Designer",
    "UX Engineer",
    "UX Engineer Portfolio",
    "UI/UX Engineer",
    "Product Design Engineer",
    "Design Technologist",
    "Creative Technologist",
    "Frontend Engineer",
    "Product Designer",
    "Interaction Designer",
    "Prototyper",
    "AI-native Interfaces",
    "AI-assisted Workflows",
    "AI Product Design",
    "Working Prototypes",
    "Frontend Prototyping",
    "Design Systems",
    "Motion Design",
    "React",
    "Next.js",
    "TypeScript",
    "SwiftUI",
    "Framer Motion",
    "Gemini API",
  ],
  authors: [{ name: "Minwook Shin" }],
  creator: "Minwook Shin",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/icon.png", type: "image/png", sizes: "896x896" },
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-icon.png",
  },
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: `${SITE_NAME} · Design Engineer / UX Engineer`,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} · Design Engineer / UX Engineer`,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        <meta name="theme-color" content="#FAFAFA" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#0F0F10" media="(prefers-color-scheme: dark)" />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM-readable portfolio guide" />
        <link rel="alternate" type="text/markdown" href="/hiring.md" title="Recruiter and AI hiring brief" />
        <link rel="alternate" type="text/markdown" href="/portfolio.md" title="AI-readable portfolio summary" />
        <link rel="alternate" type="application/json" href="/resume.json" title="Machine-readable resume" />
        <link rel="alternate" type="text/markdown" href="/design-system.md" title="AI-readable design system proof" />
        <link rel="alternate" type="application/json" href="/design-system/tokens.json" title="Design system tokens" />
      </head>
      <body className={geistMono.variable}>
        <StructuredData data={rootJsonLd()} />
        {children}
      </body>
    </html>
  );
}
