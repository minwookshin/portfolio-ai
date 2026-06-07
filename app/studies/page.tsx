import type { Metadata } from "next";
import HomePage from "@/components/HomePage";
import StructuredData from "@/components/StructuredData";
import { absoluteUrl, collectionPageJsonLd, studiesCollectionItems } from "@/lib/seo";
import { getWritingPosts } from "@/lib/writing";

const description = "Interaction studies, notes, and small prototypes by Minwook Shin.";
const url = absoluteUrl("/studies");

export const metadata: Metadata = {
  title: "studies",
  description,
  alternates: {
    canonical: url,
  },
  openGraph: {
    type: "website",
    url,
    title: "studies · minwook shin",
    description,
    siteName: "minwook shin",
  },
  twitter: {
    card: "summary_large_image",
    title: "studies · minwook shin",
    description,
  },
};

export default function StudiesPage() {
  const writingPosts = getWritingPosts();

  return (
    <>
      <StructuredData
        data={collectionPageJsonLd({
          description,
          items: studiesCollectionItems(writingPosts),
          name: "Studies by Minwook Shin",
          url,
        })}
      />
      <HomePage activeSection="studies" writingPosts={writingPosts} />
    </>
  );
}
