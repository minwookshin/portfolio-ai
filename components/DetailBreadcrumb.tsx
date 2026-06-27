import type { ReactNode } from "react";
import Link from "next/link";
import MaterialArrowForwardIcon from "@/components/MaterialArrowForwardIcon";

type DetailBreadcrumbProps = {
  className?: string;
  currentLabel: string;
  sectionHref: string;
  sectionLabel: string;
  trailing?: ReactNode;
};

export default function DetailBreadcrumb({
  className = "",
  currentLabel,
  sectionHref,
  sectionLabel,
  trailing,
}: DetailBreadcrumbProps) {
  return (
    <nav
      aria-label={`${currentLabel} navigation`}
      className={`studio-detail-nav mb-[var(--space-5)] text-left text-[length:var(--type-0)] leading-[var(--leading-body)] text-[var(--text-primary)] ${className}`}
    >
      <span className="flex min-w-0 flex-wrap items-center justify-between gap-x-[var(--space-2)] gap-y-1">
        <Link
          href={sectionHref}
          aria-label={`back to ${sectionLabel}`}
          className="archive-back-link micro-focus micro-pressable min-w-0 shrink-0"
        >
          <MaterialArrowForwardIcon className="site-back-icon" />
          {sectionLabel}
        </Link>
        {trailing ? <span className="shrink-0 text-[var(--text-muted)]">{trailing}</span> : null}
      </span>
    </nav>
  );
}
