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
    default: "minwook",
    template: "%s · minwook",
  },
  description:
    "Minwook Shin is a UX Engineer who designs and ships living products — from Figma to production code. Native iOS, AI products, and research-led design.",
  keywords: [
    "Minwook Shin",
    "UX Engineer",
    "Product Designer",
    "Design Engineer",
    "0 to 1 Builder",
    "Next.js",
    "SwiftUI",
    "Portfolio",
  ],
  authors: [{ name: "Minwook Shin" }],
  creator: "Minwook Shin",
  openGraph: {
    type: "website",
    title: "minwook",
    description:
      "A UX Engineer who designs and ships living products — from Figma to production code.",
    siteName: "minwook",
  },
  twitter: {
    card: "summary_large_image",
    title: "minwook",
    description:
      "A UX Engineer who designs and ships living products — from Figma to production code.",
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
