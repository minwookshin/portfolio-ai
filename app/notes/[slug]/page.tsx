import type { Metadata } from "next";
import { notFound } from "next/navigation";
import StructuredData from "@/components/StructuredData";
import WritingPostDetail from "@/components/WritingPostDetail";
import { LIGHT_PROJECT_TOKENS } from "@/data/projects";
import { absoluteUrl, writingPostJsonLd } from "@/lib/seo";
import { getWritingPost, getWritingPosts } from "@/lib/writing";

type NotePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getWritingPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: NotePageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getWritingPost(slug);

  if (!post) {
    return {
      title: "notes",
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

export default async function NotePage({ params }: NotePageProps) {
  const { slug } = await params;
  const post = getWritingPost(slug);

  if (!post) notFound();

  return (
    <main
      style={LIGHT_PROJECT_TOKENS}
      className="site-lowercase detail-page-shell text-[length:var(--type-0)] text-[var(--text-primary)]"
    >
      <StructuredData data={writingPostJsonLd(post)} />
      <WritingPostDetail post={post} />
    </main>
  );
}
