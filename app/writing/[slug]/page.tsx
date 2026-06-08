import type { Metadata } from "next";
import { notFound, permanentRedirect } from "next/navigation";
import { absoluteUrl } from "@/lib/seo";
import { getWritingPost, getWritingPosts } from "@/lib/writing";

type WritingPostPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getWritingPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: WritingPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getWritingPost(slug);

  if (!post) {
    return {
      title: "studies",
    };
  }

  const url = absoluteUrl(`/studies/${post.slug}`);

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

export default async function WritingPostPage({ params }: WritingPostPageProps) {
  const { slug } = await params;
  const post = getWritingPost(slug);

  if (!post) notFound();

  permanentRedirect(`/studies/${post.slug}`);
}
