import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import CustomCursor from "@/components/CustomCursor";
import GlobalCommandPalette from "@/components/GlobalCommandPalette";
import PageTransition from "@/components/PageTransition";
import StructuredData from "@/components/StructuredData";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, rootJsonLd } from "@/lib/seo";
import { getWritingPosts } from "@/lib/writing";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: "%s · minwook shin",
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
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const writingPosts = getWritingPosts();

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <meta name="theme-color" content="#FAFAFA" />
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM-readable portfolio guide" />
        <link rel="alternate" type="text/markdown" href="/hiring.md" title="Recruiter and AI hiring brief" />
        <link rel="alternate" type="text/markdown" href="/portfolio.md" title="AI-readable portfolio summary" />
        <link rel="alternate" type="application/json" href="/resume.json" title="Machine-readable resume" />
        <link rel="alternate" type="text/markdown" href="/design-system.md" title="AI-readable design system proof" />
        <link rel="alternate" type="application/json" href="/design-system/tokens.json" title="Design system tokens" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <StructuredData data={rootJsonLd()} />
        <CustomCursor />
        <GlobalCommandPalette writingPosts={writingPosts} />
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
