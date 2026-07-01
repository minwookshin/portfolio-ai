import type { ReactNode } from "react";
import Link from "next/link";
import CommandTriggerButton from "@/components/CommandTriggerButton";

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
      <div className="detail-root-row">
        <span className="root-link-group">
          <Link href="/" aria-label="home" title="home" className="archive-root-link micro-focus micro-focus-tight">
            minwook shin
          </Link>
          <span className="root-index-hint" aria-hidden="true">· index</span>
        </span>
        <span className="command-trigger-group">
          <CommandTriggerButton />
          <span className="command-hint" aria-hidden="true">· ⌘K</span>
        </span>
      </div>
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
