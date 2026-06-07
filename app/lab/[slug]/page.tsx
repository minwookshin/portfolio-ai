import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BuildMeta from "@/components/BuildMeta";
import ProjectCaseStudyShell from "@/components/ProjectCaseStudyShell";
import {
  LIGHT_PROJECT_TOKENS,
  getLabProjects,
  getProjectBySlug,
  getProjectMetadataDescription,
  isLabProject,
} from "@/data/projects";

type LabProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getLabProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: LabProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project || project.comingSoon || !isLabProject(project)) {
    return {
      title: "lab",
    };
  }

  const description = getProjectMetadataDescription(project);
  const url = `https://www.minwookshin.com/lab/${project.slug}`;

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

export default async function LabProjectPage({ params }: LabProjectPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project || project.comingSoon || !isLabProject(project)) notFound();

  return (
    <main
      style={LIGHT_PROJECT_TOKENS}
      className="site-lowercase flex min-h-dvh flex-col bg-[var(--bg-base)] px-[var(--space-3)] pb-[calc(var(--space-8)*2)] pt-[92px] text-[length:var(--type-0)] text-[var(--text-primary)] sm:px-[var(--space-5)] md:pt-[122px]"
    >
      <div className="mx-auto w-full max-w-[760px]">
        <ProjectCaseStudyShell
          project={project}
          actionLabel="all lab"
          actionHref="/lab"
          baseHref="/lab"
        />
      </div>
      <BuildMeta className="mx-auto mt-auto w-full max-w-[760px] pt-[var(--space-6)] text-[length:var(--type-0)]" />
    </main>
  );
}
