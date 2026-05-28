import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

// Outfit (variable, OFL) from Google Fonts. Used for the whole site.
const googleSans = Outfit({
  subsets: ["latin"],
  variable: "--font-google-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "minwook studio",
    template: "%s · minwook studio",
  },
  description:
    "Minwook Studio designs and builds AI-native interfaces, product prototypes, websites, agents, and digital experiences from Figma to production code.",
  keywords: [
    "Minwook Shin",
    "UX Engineer",
    "Product Designer",
    "Design Engineer",
    "0 to 1 Builder",
    "AI Website",
    "AI Agent",
    "Next.js",
    "SwiftUI",
    "Product Studio",
  ],
  authors: [{ name: "Minwook Shin" }],
  creator: "Minwook Shin",
  openGraph: {
    type: "website",
    title: "minwook studio",
    description:
      "AI-native interfaces, product prototypes, websites, and agents from Figma to production code.",
    siteName: "minwook studio",
  },
  twitter: {
    card: "summary_large_image",
    title: "minwook studio",
    description:
      "AI-native interfaces, product prototypes, websites, and agents from Figma to production code.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={googleSans.variable}>{children}</body>
    </html>
  );
}
