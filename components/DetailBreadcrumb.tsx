import type { ReactNode } from "react";
import Link from "next/link";
import { OutlineSignalCell } from "@/components/Outline";
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
      <div className="detail-path-outline" aria-label="current path">
        <Link
          href={sectionHref}
          aria-label={`back to ${sectionLabel}`}
          className="detail-path-outline-row detail-path-outline-row--link micro-focus micro-focus-tight micro-pressable"
        >
          <OutlineSignalCell
            arrow="right"
            arrowClassName="detail-path-signal"
            cellClassName="detail-path-bullet-cell"
            dotClassName="detail-path-bullet"
            rightArrowClassName="site-signal-icon"
          />
          <span className="detail-path-label">{sectionLabel}</span>
        </Link>
        <div className="detail-path-outline-row detail-path-outline-row--current" aria-current="page">
          <OutlineSignalCell
            cellClassName="detail-path-bullet-cell"
            dotClassName="detail-path-bullet detail-path-bullet--current"
          />
          <span className="detail-path-label">{currentLabel}</span>
          {trailing && <span className="detail-path-trailing">{trailing}</span>}
        </div>
      </div>
    </nav>
  );
}
