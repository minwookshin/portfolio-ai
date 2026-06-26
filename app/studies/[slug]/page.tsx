import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
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
import { getWritingPost, getWritingPosts } from "@/lib/writing";

type StudyProjectPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  const slugs = new Set([
    ...getLabProjects()
      .filter((project) => getLabProjectPath(project).startsWith("/studies/"))
      .map((project) => project.slug),
    ...getWritingPosts().map((post) => post.slug),
  ]);

  return [...slugs].map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: StudyProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project || project.comingSoon || !isLabProject(project)) {
    const post = getWritingPost(slug);

    if (!post) {
      return {
        title: "studies",
      };
    }

    const url = absoluteUrl(`/notes/${post.slug}`);

    return {
      title: post.title,
      description: post.description,
      alternates: {
        canonical: url,
      },
      openGraph: {
        type: "article",
        url,
        title: `${post.title} · minwook shin`,
        description: post.description,
        siteName: "minwook shin",
        publishedTime: post.date,
      },
      twitter: {
        card: "summary_large_image",
        title: `${post.title} · minwook shin`,
        description: post.description,
      },
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

  if (!project || project.comingSoon || !isLabProject(project)) {
    const post = getWritingPost(slug);

    if (!post) notFound();

    permanentRedirect(`/notes/${post.slug}`);
  }

  const canonicalPath = getLabProjectPath(project);

  if (canonicalPath !== `/studies/${project.slug}`) {
    permanentRedirect(canonicalPath);
  }

  return (
    <main
      style={LIGHT_PROJECT_TOKENS}
      className="site-lowercase detail-page-shell text-[length:var(--type-0)] text-[var(--text-primary)]"
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
