import type { ReactNode } from "react";
import Link from "next/link";

type DetailBreadcrumbProps = {
  className?: string;
  currentLabel: string;
  homeHref?: string;
  sectionHref: string;
  sectionLabel: string;
  trailing?: ReactNode;
};

export default function DetailBreadcrumb({
  className = "",
  currentLabel,
  homeHref = "/work",
  sectionHref,
  sectionLabel,
  trailing,
}: DetailBreadcrumbProps) {
  return (
    <nav
      aria-label="breadcrumb"
      className={`studio-detail-nav mb-[var(--space-5)] text-left text-[length:var(--type-0)] leading-[var(--leading-body)] text-[var(--text-primary)] ${className}`}
    >
      <span className="flex min-w-0 flex-wrap items-center justify-between gap-x-[var(--space-2)] gap-y-1">
        <span className="flex min-w-0 flex-wrap items-center gap-x-[var(--space-1)] gap-y-1">
          <Link
            href={homeHref}
            className="intro-contact-link micro-focus micro-pressable shrink-0 text-[length:var(--type-0)]"
          >
            minwook shin
          </Link>
          <span className="text-[var(--text-muted)]">/</span>
          <Link
            href={sectionHref}
            className="intro-contact-link micro-focus micro-pressable min-w-0 shrink-0 text-[length:var(--type-0)]"
          >
            {sectionLabel}
          </Link>
          <span className="text-[var(--text-muted)]">/</span>
          <span aria-current="page" className="min-w-0 text-[var(--text-primary)]">
            {currentLabel}
          </span>
        </span>
        {trailing ? <span className="shrink-0 text-[var(--text-muted)]">{trailing}</span> : null}
      </span>
    </nav>
  );
}
