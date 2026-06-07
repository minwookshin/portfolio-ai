import type { Metadata } from "next";
import HomePage from "@/components/HomePage";
import StructuredData from "@/components/StructuredData";
import { absoluteUrl, collectionPageJsonLd, workCollectionItems } from "@/lib/seo";
import { getWritingPosts } from "@/lib/writing";

const description = "Selected work by Minwook Shin across AI-native products, interfaces, and working software.";
const url = absoluteUrl("/work");

export const metadata: Metadata = {
  title: "work",
  description,
  alternates: {
    canonical: url,
  },
  openGraph: {
    type: "website",
    url,
    title: "work · minwook shin",
    description,
    siteName: "minwook shin",
  },
  twitter: {
    card: "summary_large_image",
    title: "work · minwook shin",
    description,
  },
};

export default function WorkPage() {
  const writingPosts = getWritingPosts();

  return (
    <>
      <StructuredData
        data={collectionPageJsonLd({
          description,
          items: workCollectionItems(),
          name: "Selected work by Minwook Shin",
          url,
        })}
      />
      <HomePage activeSection="work" writingPosts={writingPosts} />
    </>
  );
}
