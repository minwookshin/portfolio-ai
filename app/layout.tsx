import type { Metadata } from "next";
import { Geist } from "next/font/google";
import AnimatedCursor from "@/components/AnimatedCursor";
import "./globals.css";

// Geist Sans from Google Fonts. Used for the whole site.
const googleSans = Geist({
  subsets: ["latin"],
  variable: "--font-google-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.minwookshin.com"),
  title: {
    default: "minwook shin",
    template: "%s · minwook shin",
  },
  description:
    "design engineer building stuff: AI products, websites, prototypes, and fast-moving experiments from idea to working software.",
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
    title: "minwook shin",
    description:
      "design engineer building stuff: AI products, websites, prototypes, and fast-moving experiments from idea to working software.",
    siteName: "minwook shin",
  },
  twitter: {
    card: "summary_large_image",
    title: "minwook shin",
    description:
      "design engineer building stuff: AI products, websites, prototypes, and fast-moving experiments from idea to working software.",
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
      <body className={googleSans.variable}>
        {children}
        {modal}
        <AnimatedCursor />
      </body>
    </html>
  );
}
