import type { Metadata } from "next";
import ArchiveIndexPage from "@/components/ArchiveIndexPage";
import type { ArchiveEntry, ArchiveSection } from "@/components/ArchiveIndexPage";
import StructuredData from "@/components/StructuredData";
import { getLabProjectPath, getLabProjects, isLabStudyProject } from "@/data/projects";
import { absoluteUrl, collectionPageJsonLd, studiesCollectionItems } from "@/lib/seo";

const description = "Interaction systems, motion rules, and small prototypes by Minwook Shin.";
const url = absoluteUrl("/studies");

export const metadata: Metadata = {
  title: "interaction systems",
  description,
  alternates: {
    canonical: url,
  },
  openGraph: {
    type: "website",
    url,
    title: "interaction systems · minwook shin",
    description,
    siteName: "minwook shin",
  },
  twitter: {
    card: "summary_large_image",
    title: "interaction systems · minwook shin",
    description,
  },
};

export default function StudiesPage() {
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
  const sections: ArchiveSection[] = [
    {
      description: "small interface systems, motion rules, and AI loop studies.",
      entries: interactionEntries,
      id: "interaction-systems",
      title: "interaction systems",
    },
  ];

  return (
    <>
      <StructuredData
        data={collectionPageJsonLd({
          description,
          items: studiesCollectionItems(),
          name: "Interaction systems by Minwook Shin",
          url,
        })}
      />
      <ArchiveIndexPage
        description="small interface systems, motion rules, and AI loop studies. organized by year."
        itemLabel="systems"
        sections={sections}
        title="interaction systems"
      />
    </>
  );
}
