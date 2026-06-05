"use client";

import Link from "next/link";
import BuildMeta from "@/components/BuildMeta";
import LabArchiveGrid from "@/components/LabArchiveGrid";

export default function LabPage() {
  return (
    <main className="site-lowercase flex min-h-dvh flex-col bg-[var(--bg-base)] px-[var(--space-3)] pb-[calc(var(--space-8)*2)] pt-[92px] text-[length:var(--type-0)] text-[var(--text-primary)] sm:px-[var(--space-5)] md:pt-[122px]">
      <div className="mx-auto w-full max-w-[1180px]">
        <div className="mx-auto w-full max-w-[620px]">
          <nav className="mb-[var(--space-5)] flex items-center justify-between gap-[var(--space-2)] leading-[var(--leading-body)]">
            <Link href="/work" className="micro-link micro-focus text-[var(--text-muted)] hover:text-[var(--text-primary)] focus-visible:text-[var(--text-primary)]">
              minwook shin
            </Link>
            <span className="text-[var(--text-muted)]">lab / archive</span>
          </nav>

          <header>
            <h1 className="text-[length:var(--type-1)] font-normal leading-[var(--leading-heading)] text-[var(--text-primary)]">
              Lab / archive
            </h1>
            <p className="mt-[var(--space-1)] max-w-[var(--measure)] leading-[var(--leading-body)] text-[var(--text-muted)]">
              Smaller demos, experiments, and product sketches. This page is intentionally more interactive than the homepage.
            </p>
          </header>
        </div>

        <LabArchiveGrid className="mx-auto mt-[var(--space-5)] w-full max-w-[980px]" />
      </div>
      <BuildMeta className="mx-auto mt-auto w-full max-w-[620px] pt-[var(--space-6)] text-[length:var(--type-0)]" />
    </main>
  );
}
