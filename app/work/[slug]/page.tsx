import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
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
    <aside className="border-t border-outline-variant pt-[var(--space-3)]">
      <p className="leading-[var(--leading-body)] text-on-surface-variant">related writing</p>
      <div className="mt-[var(--space-1)] flex flex-col gap-[var(--space-1)]">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/writing/${post.slug}`}
            className="micro-link micro-focus inline-flex w-fit items-center gap-1 leading-[var(--leading-body)] text-on-surface hover:text-on-surface focus-visible:text-on-surface"
          >
            {post.title}
            <ArrowUpRight className="h-3.5 w-3.5" />
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
      className="site-lowercase min-h-screen bg-surface px-[var(--space-3)] pb-[calc(var(--space-8)*2)] pt-[92px] text-on-surface sm:px-[var(--space-5)] md:pt-[122px]"
    >
      <div className="mx-auto w-full max-w-[620px]">
        <ProjectCaseStudyShell
          project={project}
          actionLabel="all work"
          actionHref="/#work"
        />
        <RelatedWriting posts={relatedWriting} />
      </div>
    </main>
  );
}
