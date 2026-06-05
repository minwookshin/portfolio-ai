import type { Metadata } from "next";
import HomePage from "@/components/HomePage";
import { getWritingPosts } from "@/lib/writing";

export const metadata: Metadata = {
  title: "work",
  description: "Selected work by Minwook Shin across AI-native products, interfaces, and working software.",
  alternates: {
    canonical: "https://www.minwookshin.com/work",
  },
  openGraph: {
    type: "website",
    url: "https://www.minwookshin.com/work",
    title: "work · minwook shin",
    description: "Selected work by Minwook Shin across AI-native products, interfaces, and working software.",
    siteName: "minwook shin",
  },
  twitter: {
    card: "summary_large_image",
    title: "work · minwook shin",
    description: "Selected work by Minwook Shin across AI-native products, interfaces, and working software.",
  },
};

export default function WorkPage() {
  const writingPosts = getWritingPosts();

  return <HomePage activeSection="work" writingPosts={writingPosts} />;
}
