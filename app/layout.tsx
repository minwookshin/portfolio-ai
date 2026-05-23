import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Google Sans Flex (variable, OFL) — self-hosted from Google Fonts since it
// isn't in next/font/google's catalog yet. Used for the whole site.
const googleSans = localFont({
  src: "./fonts/GoogleSansFlex.woff2",
  variable: "--font-google-sans",
  display: "swap",
  weight: "1 1000",
});

export const metadata: Metadata = {
  title: {
    default: "minwook shin",
    template: "%s · minwook shin",
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
    title: "minwook shin",
    description:
      "A UX Engineer who designs and ships living products — from Figma to production code.",
    siteName: "minwook shin",
  },
  twitter: {
    card: "summary_large_image",
    title: "minwook shin",
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
