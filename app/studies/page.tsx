import type { Metadata } from "next";
import HomePage from "@/components/HomePage";
import { getWritingPosts } from "@/lib/writing";

export const metadata: Metadata = {
  title: "studies",
  description: "Interaction studies, notes, and small prototypes by Minwook Shin.",
  alternates: {
    canonical: "https://www.minwookshin.com/studies",
  },
  openGraph: {
    type: "website",
    url: "https://www.minwookshin.com/studies",
    title: "studies · minwook shin",
    description: "Interaction studies, notes, and small prototypes by Minwook Shin.",
    siteName: "minwook shin",
  },
  twitter: {
    card: "summary_large_image",
    title: "studies · minwook shin",
    description: "Interaction studies, notes, and small prototypes by Minwook Shin.",
  },
};

export default function StudiesPage() {
  const writingPosts = getWritingPosts();

  return <HomePage activeSection="studies" writingPosts={writingPosts} />;
}
