import type { Metadata } from "next";
import HomePage from "@/components/HomePage";
import { getWritingPosts } from "@/lib/writing";

export const metadata: Metadata = {
  title: "writing",
  description: "Notes from Minwook Shin on design engineering, AI native interfaces, and building software.",
  alternates: {
    canonical: "https://www.minwookshin.com/writing",
  },
  openGraph: {
    type: "website",
    url: "https://www.minwookshin.com/writing",
    title: "writing · minwook shin",
    description: "Notes from Minwook Shin on design engineering, AI native interfaces, and building software.",
    siteName: "minwook shin",
  },
  twitter: {
    card: "summary_large_image",
    title: "writing · minwook shin",
    description: "Notes from Minwook Shin on design engineering, AI native interfaces, and building software.",
  },
};

export default function WritingPage() {
  const posts = getWritingPosts();

  return <HomePage activeSection="writing" writingPosts={posts} />;
}
