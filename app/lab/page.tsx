import type { Metadata } from "next";
import HomePage from "@/components/HomePage";
import { getWritingPosts } from "@/lib/writing";

export const metadata: Metadata = {
  title: "lab / archive",
  description: "Small demos, experiments, and product sketches by Minwook Shin.",
  alternates: {
    canonical: "https://www.minwookshin.com/lab",
  },
  openGraph: {
    type: "website",
    url: "https://www.minwookshin.com/lab",
    title: "lab / archive · minwook shin",
    description: "Small demos, experiments, and product sketches by Minwook Shin.",
    siteName: "minwook shin",
  },
  twitter: {
    card: "summary_large_image",
    title: "lab / archive · minwook shin",
    description: "Small demos, experiments, and product sketches by Minwook Shin.",
  },
};

export default function LabRoutePage() {
  const writingPosts = getWritingPosts();

  return <HomePage activeSection="lab" writingPosts={writingPosts} />;
}
