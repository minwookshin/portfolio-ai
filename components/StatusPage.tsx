"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import BuildMeta from "@/components/BuildMeta";
import { PERSONAL_INFO } from "@/data/personal";

type StatusPageProps = {
  code: string;
  eyebrow: string;
  title: string;
  body: string;
  action?: ReactNode;
};

function StatusLink({
  children,
  href,
  external = false,
  uppercase = true,
}: {
  children: ReactNode;
  href: string;
  external?: boolean;
  uppercase?: boolean;
}) {
  const className = `intro-contact-link micro-focus micro-focus-tight ${uppercase ? "site-uppercase-label" : ""}`;

  if (external) {
    return (
      <a className={className} href={href} rel="noreferrer" target="_blank">
        {children}
      </a>
    );
  }

  return (
    <Link className={className} href={href}>
      {children}
    </Link>
  );
}

export default function StatusPage({ code, eyebrow, title, body, action }: StatusPageProps) {
  return (
    <main className="site-lowercase flex min-h-dvh flex-col overflow-x-hidden bg-[var(--bg-base)] text-[length:var(--type-0)] text-[var(--text-primary)]">
      <section className="mx-auto flex w-full max-w-[1180px] justify-center px-[var(--space-3)] pb-[var(--space-4)] pt-[92px] sm:px-[var(--space-5)] md:pt-[122px]">
        <div className="w-full max-w-[620px] text-left">
          <p className="text-[length:var(--type-0)] leading-[var(--leading-body)] text-[var(--text-primary)]">
            {code}
          </p>
          <p className="mt-[var(--space-1)] text-[length:var(--type-0)] leading-[var(--leading-body)] text-[var(--text-muted)]">
            {eyebrow}
          </p>
          <h1 className="mt-[var(--space-1)] max-w-[var(--measure)] text-[length:var(--type-0)] font-normal leading-[var(--leading-body)] text-[var(--text-primary)]">
            {title}
          </h1>
          <p className="mt-[var(--space-1)] max-w-[var(--measure)] leading-[var(--leading-body)] text-[var(--text-muted)]">
            {body}
          </p>
        </div>
      </section>

      <section className="mx-auto w-full max-w-[1180px] px-[var(--space-3)] pb-[var(--space-6)] pt-[var(--space-4)] sm:px-[var(--space-5)]">
        <div className="mx-auto w-full max-w-[620px] text-left">
          <nav aria-label="status navigation" className="flex flex-wrap items-baseline gap-x-0 gap-y-1 leading-[var(--leading-heading)]">
            <StatusLink href="/work">work</StatusLink>
            <span aria-hidden="true" className="mr-1.5 text-[var(--text-muted)]">
              ,
            </span>
            <StatusLink href="/writing">writing</StatusLink>
            <span aria-hidden="true" className="mr-1.5 text-[var(--text-muted)]">
              ,
            </span>
            <StatusLink href="/lab">lab</StatusLink>
            <span aria-hidden="true" className="mr-1.5 text-[var(--text-muted)]">
              ,
            </span>
            <StatusLink href={`mailto:${PERSONAL_INFO.email}`} uppercase={false}>{PERSONAL_INFO.email}</StatusLink>
            <span aria-hidden="true" className="mr-1.5 text-[var(--text-muted)]">
              ,
            </span>
            <StatusLink external href={PERSONAL_INFO.linkedin}>
              linkedin
            </StatusLink>
            <span aria-hidden="true" className="mr-1.5 text-[var(--text-muted)]">
              ,
            </span>
            <StatusLink external href={PERSONAL_INFO.github}>
              github
            </StatusLink>
            <span aria-hidden="true" className="mr-1.5 text-[var(--text-muted)]">
              ,
            </span>
            <StatusLink external href={PERSONAL_INFO.resume}>
              resume
            </StatusLink>
            {action && (
              <>
                <span aria-hidden="true" className="mr-1.5 text-[var(--text-muted)]">
                  ,
                </span>
                {action}
              </>
            )}
          </nav>
        </div>
      </section>

      <BuildMeta className="mx-auto mt-auto w-[calc(100%_-_(var(--space-3)*2))] max-w-[620px] pb-[var(--space-4)] pt-[var(--space-4)] text-[length:var(--type-0)] sm:w-[calc(100%_-_(var(--space-5)*2))]" />
    </main>
  );
}
