import type { ComponentPropsWithoutRef } from "react";
import Link from "next/link";
import { MDXRemote } from "next-mdx-remote/rsc";
import DetailBreadcrumb from "@/components/DetailBreadcrumb";
import { getRelatedWorkLinks } from "@/lib/writing";
import { formatWritingDate } from "@/lib/writingDisplay";
import type { WritingPost } from "@/lib/writingTypes";

const mdxComponents = {
  a: ({ className = "", ...props }: ComponentPropsWithoutRef<"a">) => (
    <a
      {...props}
      className={`micro-link micro-focus text-[var(--accent-indigo)] hover:text-[var(--accent-indigo-hover)] focus-visible:text-[var(--accent-indigo-hover)] ${className}`}
    />
  ),
};

export default function WritingPostDetail({ post }: { post: WritingPost }) {
  const relatedWork = getRelatedWorkLinks(post);

  return (
    <article className="mx-auto w-full max-w-[620px]">
      <DetailBreadcrumb
        currentLabel={post.title}
        sectionHref="/studies"
        sectionLabel="studies"
        trailing={<time dateTime={post.date}>{formatWritingDate(post.date)}</time>}
      />

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
  );
}
