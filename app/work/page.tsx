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

const description = "Work by Minwook Shin across AI-native products, interfaces, and working software.";
const url = absoluteUrl("/work");

const WORK_ARCHIVE_ORDER = [
  "atlas",
  "sentinel",
  "portfolio-ai",
  "flux",
  "caret",
  "mindline",
  "capexplorer",
  "tomo",
  "nameme",
] as const;

const WORK_ARCHIVE_ORDER_INDEX: ReadonlyMap<string, number> = new Map(
  WORK_ARCHIVE_ORDER.map((slug, index) => [slug, index]),
);

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
    .map((project, index) => ({ index, project }))
    .filter(({ project }) => !project.comingSoon && isWorkArchiveProject(project))
    .sort((projectA, projectB) => {
      const orderA = WORK_ARCHIVE_ORDER_INDEX.get(projectA.project.slug) ?? Number.MAX_SAFE_INTEGER;
      const orderB = WORK_ARCHIVE_ORDER_INDEX.get(projectB.project.slug) ?? Number.MAX_SAFE_INTEGER;

      return orderA - orderB || projectA.index - projectB.index;
    })
    .map(({ project }) => ({
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
          name: "Work by Minwook Shin",
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
