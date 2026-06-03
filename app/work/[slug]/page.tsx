import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectCaseStudyShell from "@/components/ProjectCaseStudyShell";
import { LIGHT_PROJECT_TOKENS, getOpenableProjects, getProjectBySlug, getProjectMetadataDescription } from "@/data/projects";

type WorkPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getOpenableProjects().map((project) => ({ slug: project.slug }));
}

export async function generateMetadata({ params }: WorkPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project || project.comingSoon) {
    return {
      title: "work",
    };
  }

  const description = getProjectMetadataDescription(project);
  const url = `https://www.minwookshin.com/work/${project.slug}`;

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

export default async function WorkProjectPage({ params }: WorkPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project || project.comingSoon) notFound();

  return (
    <main
      style={LIGHT_PROJECT_TOKENS}
      className="site-lowercase min-h-screen bg-surface px-[var(--space-3)] pb-[calc(var(--space-8)*2)] pt-[92px] text-on-surface sm:px-[var(--space-5)] md:pt-[122px]"
    >
      <div className="mx-auto w-full max-w-[620px]">
        <ProjectCaseStudyShell
          project={project}
          actionLabel="all work"
          actionHref="/#work"
        />
      </div>
    </main>
  );
}
