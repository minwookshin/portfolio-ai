import type { Metadata } from "next";
import AnimatedCursor from "@/components/AnimatedCursor";
import ModalSlot from "@/components/ModalSlot";
import "@carrot-kpi/switzer-font/latin.css";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.minwookshin.com"),
  title: {
    default: "Minwook Shin",
    template: "%s · Minwook Shin",
  },
  description:
    "I design and build interfaces for AI-native products, from early idea to working software.",
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
    title: "Minwook Shin",
    description:
      "I design and build interfaces for AI-native products, from early idea to working software.",
    siteName: "Minwook Shin",
  },
  twitter: {
    card: "summary_large_image",
    title: "Minwook Shin",
    description:
      "I design and build interfaces for AI-native products, from early idea to working software.",
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
      <body>
        {children}
        <ModalSlot>{modal}</ModalSlot>
        <AnimatedCursor />
      </body>
    </html>
  );
}
