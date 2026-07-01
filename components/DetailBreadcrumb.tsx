import type { ReactNode } from "react";
import Link from "next/link";
import SiteMasthead from "@/components/SiteMasthead";

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
      <SiteMasthead className="detail-root-row" />
      <div className="detail-path-row">
        <Link
          href={sectionHref}
          aria-label={`back to ${sectionLabel}`}
          className="detail-path-link micro-focus micro-focus-tight micro-pressable"
        >
          {sectionLabel}
        </Link>
        <span className="detail-path-dot" aria-hidden="true">·</span>
        <span className="detail-path-current" aria-current="page">{currentLabel}</span>
        {trailing ? (
          <>
            <span className="detail-path-dot" aria-hidden="true">·</span>
            <span className="detail-path-trailing">{trailing}</span>
          </>
        ) : null}
      </div>
    </nav>
  );
}
