import type { ComponentPropsWithoutRef } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import BuildMeta from "@/components/BuildMeta";
import { formatWritingDate } from "@/lib/writingDisplay";
import { getRelatedWorkLinks, getWritingPost, getWritingPosts } from "@/lib/writing";

type WritingPostPageProps = {
  params: Promise<{ slug: string }>;
};

const mdxComponents = {
  a: ({ className = "", ...props }: ComponentPropsWithoutRef<"a">) => (
    <a
      {...props}
      className={`micro-link micro-focus text-[var(--accent-indigo)] hover:text-[var(--accent-indigo-hover)] focus-visible:text-[var(--accent-indigo-hover)] ${className}`}
    />
  ),
};

export function generateStaticParams() {
  return getWritingPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: WritingPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getWritingPost(slug);

  if (!post) {
    return {
      title: "writing",
    };
  }

  const url = `https://www.minwookshin.com/writing/${post.slug}`;

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

  const relatedWork = getRelatedWorkLinks(post);

  return (
    <main className="site-lowercase flex min-h-dvh flex-col bg-[var(--bg-base)] px-[var(--space-3)] pb-[calc(var(--space-8)*2)] pt-[92px] text-[length:var(--type-0)] text-[var(--text-primary)] sm:px-[var(--space-5)] md:pt-[122px]">
      <article className="mx-auto w-full max-w-[620px]">
        <nav className="mb-[var(--space-5)] flex items-center justify-between gap-[var(--space-2)] leading-[var(--leading-body)]">
          <span className="flex min-w-0 items-center gap-[var(--space-1)]">
            <Link href="/work" className="intro-contact-link micro-focus micro-pressable shrink-0 text-[length:var(--type-0)]">
              minwook shin
            </Link>
            <span className="text-[var(--text-muted)]">/</span>
            <Link href="/writing" className="intro-contact-link micro-focus micro-pressable shrink-0 text-[length:var(--type-0)]">
              writing
            </Link>
          </span>
          <time dateTime={post.date} className="shrink-0 text-[var(--text-muted)]">
            {formatWritingDate(post.date)}
          </time>
        </nav>

        <header>
          <h1 className="text-[length:var(--type-3)] font-normal leading-[var(--leading-heading)] text-[var(--text-primary)] sm:text-[length:var(--type-4)]">
            {post.title}
          </h1>
          <p className="mt-[var(--space-2)] max-w-[var(--measure)] leading-[var(--leading-body)] text-[var(--text-muted)]">
            {post.description}
          </p>
        </header>

        <div className="article-body micro-richtext mt-[var(--space-5)]">
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>

        {relatedWork.length > 0 && (
          <aside className="mt-[var(--space-5)] border-t border-[var(--border-light)] pt-[var(--space-3)]">
            <p className="text-[length:var(--type-0)] leading-[var(--leading-body)] text-[var(--text-muted)]">
              related work
            </p>
            <div className="mt-[var(--space-1)] flex flex-col gap-[var(--space-1)]">
              {relatedWork.map((work) => (
                <Link
                  key={work.slug}
                  href={work.href}
                  className="related-work-link micro-focus micro-pressable inline-flex w-fit text-[length:var(--type-0)] leading-[var(--leading-body)]"
                >
                  {work.title}
                </Link>
              ))}
            </div>
          </aside>
        )}
      </article>
      <BuildMeta className="mx-auto mt-auto w-full max-w-[620px] pt-[var(--space-6)] text-[length:var(--type-0)]" />
    </main>
  );
}
