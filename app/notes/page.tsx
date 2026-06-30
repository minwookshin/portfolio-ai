import type { Metadata } from "next";
import ArchiveIndexPage from "@/components/ArchiveIndexPage";
import type { ArchiveEntry, ArchiveSection } from "@/components/ArchiveIndexPage";
import StructuredData from "@/components/StructuredData";
import { absoluteUrl, collectionPageJsonLd, notesCollectionItems } from "@/lib/seo";
import { getWritingPosts } from "@/lib/writing";
import { formatWritingDate } from "@/lib/writingDisplay";

const description = "Casual notes on code, design, motion, and how the practice is changing.";
const url = absoluteUrl("/notes");

export const metadata: Metadata = {
  title: "notes",
  description,
  alternates: {
    canonical: url,
  },
  openGraph: {
    type: "website",
    url,
    title: "notes · minwook shin",
    description,
    siteName: "minwook shin",
  },
  twitter: {
    card: "summary_large_image",
    title: "notes · minwook shin",
    description,
  },
};

function getYearFromDate(date: string) {
  return date.slice(0, 4) || "undated";
}

export default function NotesPage() {
  const writingPosts = getWritingPosts();
  const noteEntries: ArchiveEntry[] = writingPosts.map((post) => ({
    description: post.description,
    href: `/notes/${post.slug}`,
    id: `note-${post.slug}`,
    meta: formatWritingDate(post.date),
    title: post.title,
    year: getYearFromDate(post.date),
  }));
  const sections: ArchiveSection[] = [
    {
      description,
      entries: noteEntries,
      id: "notes",
      title: "notes",
    },
  ];

  return (
    <>
      <StructuredData
        data={collectionPageJsonLd({
          description,
          items: notesCollectionItems(writingPosts),
          name: "Notes by Minwook Shin",
          url,
        })}
      />
      <ArchiveIndexPage
        description="notes from building this practice."
        itemLabel="notes"
        sections={sections}
        title="notes"
      />
    </>
  );
}
