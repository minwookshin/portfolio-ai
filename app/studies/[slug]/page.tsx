import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BuildMeta from "@/components/BuildMeta";
import ProjectCaseStudyShell from "@/components/ProjectCaseStudyShell";
import StructuredData from "@/components/StructuredData";
import {
  LIGHT_PROJECT_TOKENS,
  getLabProjectPath,
  getLabProjects,
  getProjectBySlug,
  getProjectMetadataDescription,
  isLabProject,
} from "@/data/projects";
import { absoluteUrl, projectJsonLd } from "@/lib/seo";

type StudyProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getLabProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: StudyProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project || project.comingSoon || !isLabProject(project)) {
    return {
      title: "studies",
    };
  }

  const description = getProjectMetadataDescription(project);
  const url = absoluteUrl(getLabProjectPath(project));

  return {
    title: project.title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "article",
      url,
      title: `${project.title} · minwook shin`,
      description,
      siteName: "minwook shin",
      images: project.image ? [{ url: project.image, alt: project.title }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} · minwook shin`,
      description,
      images: project.image ? [project.image] : undefined,
    },
  };
}

export default async function StudyProjectPage({ params }: StudyProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project || project.comingSoon || !isLabProject(project)) notFound();

  return (
    <main
      style={LIGHT_PROJECT_TOKENS}
      className="site-lowercase flex min-h-dvh flex-col bg-[var(--bg-base)] px-[var(--space-3)] pb-[calc(var(--space-8)*2)] pt-[92px] text-[length:var(--type-0)] text-[var(--text-primary)] sm:px-[var(--space-5)] md:pt-[122px]"
    >
      <StructuredData data={projectJsonLd(project, getLabProjectPath(project))} />
      <div className="mx-auto w-full max-w-[620px]">
        <ProjectCaseStudyShell
          project={project}
          baseHref="/studies"
          variant="lab"
        />
      </div>
      <BuildMeta className="mx-auto mt-auto w-full max-w-[620px] pt-[var(--space-6)] text-[length:var(--type-0)]" />
    </main>
  );
}
