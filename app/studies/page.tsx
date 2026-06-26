import type { Metadata } from "next";
import ArchiveIndexPage from "@/components/ArchiveIndexPage";
import type { ArchiveEntry, ArchiveSection } from "@/components/ArchiveIndexPage";
import StructuredData from "@/components/StructuredData";
import { getLabProjectPath, getLabProjects, isLabStudyProject } from "@/data/projects";
import { absoluteUrl, collectionPageJsonLd, studiesCollectionItems } from "@/lib/seo";
import { getWritingPosts } from "@/lib/writing";
import { formatWritingDate } from "@/lib/writingDisplay";

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

function getYearFromDate(date: string) {
  return date.slice(0, 4) || "undated";
}

export default function StudiesPage() {
  const writingPosts = getWritingPosts();
  const interactionEntries: ArchiveEntry[] = getLabProjects()
    .filter(isLabStudyProject)
    .map((project) => ({
      description: project.builder.oneLiner,
      href: getLabProjectPath(project),
      id: `system-${project.id}`,
      meta: project.studioLabel ?? project.tags.slice(0, 2).join(" / "),
      title: project.title,
      year: project.date,
    }));
  const noteEntries: ArchiveEntry[] = writingPosts.map((post) => ({
    description: post.description,
    href: `/studies/${post.slug}`,
    id: `note-${post.slug}`,
    meta: `note / ${formatWritingDate(post.date)}`,
    title: post.title,
    year: getYearFromDate(post.date),
  }));
  const sections: ArchiveSection[] = [
    {
      description: "small interface systems, motion rules, and AI loop studies.",
      entries: interactionEntries,
      id: "interaction-systems",
      title: "interaction systems",
    },
    {
      description: "casual notes on code, design, motion, and how the practice is changing.",
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
          items: studiesCollectionItems(writingPosts),
          name: "Studies by Minwook Shin",
          url,
        })}
      />
      <ArchiveIndexPage
        description="interaction systems, motion rules, AI loop studies, and notes from building this practice. organized by year."
        itemLabel="entries"
        sections={sections}
        title="studies"
      />
    </>
  );
}
