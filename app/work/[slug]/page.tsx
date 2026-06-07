import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BuildMeta from "@/components/BuildMeta";
import ProjectCaseStudyShell from "@/components/ProjectCaseStudyShell";
import { LIGHT_PROJECT_TOKENS, getOpenableProjects, getProjectBySlug, getProjectMetadataDescription } from "@/data/projects";
import { getWritingPostsForWork } from "@/lib/writing";
import type { WritingPostMeta } from "@/lib/writingTypes";

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

function RelatedWriting({ posts }: { posts: WritingPostMeta[] }) {
  if (posts.length === 0) return null;

  return (
    <aside className="border-t border-[var(--border-light)] pt-[var(--space-3)]">
      <p className="text-[length:var(--type-0)] leading-[var(--leading-body)] text-[var(--text-muted)]">related studies</p>
      <div className="mt-[var(--space-1)] flex flex-col gap-[var(--space-1)]">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/writing/${post.slug}`}
            className="related-work-link micro-focus micro-pressable inline-flex w-fit text-[length:var(--type-0)] leading-[var(--leading-body)]"
          >
            {post.title}
          </Link>
        ))}
      </div>
    </aside>
  );
}

export default async function WorkProjectPage({ params }: WorkPageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project || project.comingSoon) notFound();

  const relatedWriting = getWritingPostsForWork(project.slug);

  return (
    <main
      style={LIGHT_PROJECT_TOKENS}
      className="site-lowercase flex min-h-dvh flex-col bg-[var(--bg-base)] px-[var(--space-3)] pb-[calc(var(--space-8)*2)] pt-[92px] text-[length:var(--type-0)] text-[var(--text-primary)] sm:px-[var(--space-5)] md:pt-[122px]"
    >
      <div className="mx-auto w-full max-w-[760px]">
        <ProjectCaseStudyShell
          project={project}
          actionLabel="all work"
          actionHref="/work"
        />
        <RelatedWriting posts={relatedWriting} />
      </div>
      <BuildMeta className="mx-auto mt-auto w-full max-w-[760px] pt-[var(--space-6)] text-[length:var(--type-0)]" />
    </main>
  );
}
