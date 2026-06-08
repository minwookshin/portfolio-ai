import type { Metadata } from "next";
import AnimatedCursor from "@/components/AnimatedCursor";
import ModalSlot from "@/components/ModalSlot";
import StructuredData from "@/components/StructuredData";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL, rootJsonLd } from "@/lib/seo";
import "@carrot-kpi/switzer-font/latin.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} · Design Engineer`,
    template: "%s · Minwook Shin",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "Minwook Shin",
    "Design Engineer",
    "AI Product Designer",
    "UX Engineer",
    "UX Engineer Portfolio",
    "Frontend Engineer",
    "Product Designer",
    "Interaction Designer",
    "AI-native Interfaces",
    "AI Product Design",
    "Working Prototypes",
    "React",
    "Next.js",
    "TypeScript",
    "SwiftUI",
    "Framer Motion",
    "Gemini API",
  ],
  authors: [{ name: "Minwook Shin" }],
  creator: "Minwook Shin",
  alternates: {
    canonical: SITE_URL,
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: `${SITE_NAME} · Design Engineer`,
    description: SITE_DESCRIPTION,
    siteName: SITE_NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} · Design Engineer`,
    description: SITE_DESCRIPTION,
  },
};

export default function RootLayout({
  children,
  modal,
}: Readonly<{
  children: React.ReactNode;
  modal: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="alternate" type="text/plain" href="/llms.txt" title="LLM-readable portfolio guide" />
        <link rel="alternate" type="text/markdown" href="/portfolio.md" title="AI-readable portfolio summary" />
      </head>
      <body>
        <StructuredData data={rootJsonLd()} />
        {children}
        <ModalSlot>{modal}</ModalSlot>
        <AnimatedCursor />
      </body>
    </html>
  );
}
