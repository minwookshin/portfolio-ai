import type { Metadata } from "next";
import ArchiveIndexPage from "@/components/ArchiveIndexPage";
import type { ArchiveEntry, ArchiveSection } from "@/components/ArchiveIndexPage";
import StructuredData from "@/components/StructuredData";
import {
  MAIN_PROJECTS,
  PROJECT_PREVIEW_VIDEOS,
  getProjectPath,
  isVisibleBuilderValue,
  isWorkArchiveProject,
} from "@/data/projects";
import { absoluteUrl, collectionPageJsonLd, workCollectionItems } from "@/lib/seo";

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

function getProofMeta(project: (typeof MAIN_PROJECTS)[number]) {
  const hasVideoProof = Boolean(project.builder.demo?.video ?? PROJECT_PREVIEW_VIDEOS[project.title]);
  const proof = [
    project.github ? "github" : null,
    project.link || project.builder.demo?.href ? "live" : null,
    hasVideoProof ? "demo" : null,
  ].filter(isVisibleBuilderValue);

  return Array.from(new Set(proof.map((item) => item.toLowerCase()))).slice(0, 3).join(" / ");
}

function getWorkEntries(): ArchiveEntry[] {
  return MAIN_PROJECTS
    .filter((project) => !project.comingSoon && isWorkArchiveProject(project))
    .map((project) => ({
      description: project.studioLabel,
      href: getProjectPath(project),
      id: project.id,
      meta: getProofMeta(project),
      title: project.title,
      year: project.date,
    }));
}

export default function WorkPage() {
  const workEntries = getWorkEntries();
  const sections: ArchiveSection[] = [
    {
      description: "role, decisions, and working proof for selected product systems.",
      entries: workEntries,
      id: "case-studies",
      title: "case studies",
    },
  ];

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
      <ArchiveIndexPage
        description="selected product systems, AI-native interfaces, and working prototypes. organized by year."
        itemLabel="projects"
        sections={sections}
        title="work"
      />
    </>
  );
}
