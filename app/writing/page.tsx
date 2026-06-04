import type { Metadata } from "next";
import Link from "next/link";
import BuildMeta from "@/components/BuildMeta";
import { formatWritingDate } from "@/lib/writingDisplay";
import { getWritingPosts } from "@/lib/writing";

export const metadata: Metadata = {
  title: "writing",
  description: "Notes from Minwook Shin on design engineering, AI native interfaces, and building software.",
  alternates: {
    canonical: "https://www.minwookshin.com/writing",
  },
  openGraph: {
    type: "website",
    url: "https://www.minwookshin.com/writing",
    title: "writing · minwook shin",
    description: "Notes from Minwook Shin on design engineering, AI native interfaces, and building software.",
    siteName: "minwook shin",
  },
  twitter: {
    card: "summary_large_image",
    title: "writing · minwook shin",
    description: "Notes from Minwook Shin on design engineering, AI native interfaces, and building software.",
  },
};

export default function WritingPage() {
  const posts = getWritingPosts();

  return (
    <main className="site-lowercase flex min-h-dvh flex-col bg-[var(--bg-base)] px-[var(--space-3)] pb-[calc(var(--space-8)*2)] pt-[92px] text-[length:var(--type-0)] text-[var(--text-primary)] sm:px-[var(--space-5)] md:pt-[122px]">
      <div className="mx-auto w-full max-w-[620px]">
        <nav className="mb-[var(--space-5)] flex items-center justify-between gap-[var(--space-2)] leading-[var(--leading-body)]">
          <Link href="/" className="micro-link micro-focus text-[var(--text-muted)] hover:text-[var(--text-primary)] focus-visible:text-[var(--text-primary)]">
            minwook shin
          </Link>
          <span className="text-[var(--text-muted)]">writing</span>
        </nav>

        <header>
          <h1 className="text-[length:var(--type-1)] font-normal leading-[var(--leading-heading)] text-[var(--text-primary)]">
            Writing
          </h1>
          <p className="mt-[var(--space-1)] max-w-[var(--measure)] leading-[var(--leading-body)] text-[var(--text-muted)]">
            Notes on design engineering, AI native interfaces, and building working software.
          </p>
        </header>

        <ul className="mt-[var(--space-4)] border-t border-[var(--border-light)]">
          {posts.map((post) => (
            <li key={post.slug} className="list-none border-b border-[var(--border-light)]">
              <Link
                href={`/writing/${post.slug}`}
                className="micro-focus micro-pressable group flex min-h-12 w-full items-baseline justify-between gap-[var(--space-2)] py-[var(--space-1)] text-left"
              >
                <span className="project-row-title-line min-w-0 truncate font-normal leading-[var(--leading-body)] text-[var(--text-primary)]">
                  {post.title}
                </span>
                <span className="shrink-0 leading-[var(--leading-body)] text-[var(--text-muted)]">
                  {formatWritingDate(post.date)}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <BuildMeta className="mx-auto mt-auto w-full max-w-[620px] pt-[var(--space-6)] text-[length:var(--type-0)]" />
    </main>
  );
}
