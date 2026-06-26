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
    <article className="article-readable studio-detail mx-auto w-full max-w-[620px]">
      <DetailBreadcrumb
        currentLabel={post.title}
        sectionHref="/notes"
        sectionLabel="notes"
        trailing={<time dateTime={post.date}>{formatWritingDate(post.date)}</time>}
      />

      <header className="article-readable-header">
        <h1 className="article-readable-title">
          {post.title}
        </h1>
        <p className="article-readable-description">
          {post.description}
        </p>
      </header>

      <div className="article-body micro-richtext article-readable-body">
        <MDXRemote source={post.content} components={mdxComponents} />
      </div>

      {relatedWork.length > 0 && (
        <aside className="article-readable-related">
          <p className="article-readable-related-label">
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
