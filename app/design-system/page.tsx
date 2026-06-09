import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import BuildMeta from "@/components/BuildMeta";
import StructuredData from "@/components/StructuredData";
import {
  DESIGN_SYSTEM_ACCESSIBILITY_RULES,
  DESIGN_SYSTEM_AI_CONTRACT,
  DESIGN_SYSTEM_COMPONENTS,
  DESIGN_SYSTEM_INTERACTION_RULES,
  DESIGN_SYSTEM_PATHS,
  DESIGN_SYSTEM_PROOF,
  DESIGN_SYSTEM_TOKENS,
} from "@/lib/designSystemProof";
import { PERSON_ID, absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Design System Proof",
  description: DESIGN_SYSTEM_PROOF.description,
  alternates: {
    canonical: DESIGN_SYSTEM_PATHS.page,
  },
  openGraph: {
    title: "Portfolio AI design system proof",
    description: DESIGN_SYSTEM_PROOF.description,
    url: absoluteUrl(DESIGN_SYSTEM_PATHS.page),
    type: "article",
  },
};

const sectionClass = "space-y-[var(--space-2)]";
const mutedText = "text-[length:var(--type-0)] leading-[var(--leading-body)] text-[var(--text-muted)]";
const primaryText = "text-[length:var(--type-0)] font-normal leading-[var(--leading-body)] text-[var(--text-primary)]";
const smallMuted = "text-[length:calc(var(--type-0)_-_2px)] leading-[1.2] text-[var(--text-muted)]";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-[var(--space-2)]">
      <h2 className={primaryText}>{title}</h2>
      {children}
    </section>
  );
}

function TokenList({
  items,
}: {
  items: ReadonlyArray<{ role: string; cssVariable?: string; value: string; usage?: string }>;
}) {
  return (
    <div className="space-y-[var(--space-2)]">
      {items.map((item) => (
        <div key={`${item.role}-${item.value}`} className="grid gap-[var(--space-1)] sm:grid-cols-[minmax(0,0.75fr)_minmax(0,1fr)]">
          <p className={primaryText}>{item.role}</p>
          <p className={mutedText}>
            {item.cssVariable ? `${item.cssVariable} / ` : ""}
            {item.value}
            {item.usage ? ` / ${item.usage}` : ""}
          </p>
        </div>
      ))}
    </div>
  );
}

function RuleList({ items }: { items: readonly string[] }) {
  return (
    <ul className="space-y-[var(--space-2)]">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-[var(--space-1)]">
          <span className="mt-[0.72em] h-1 w-1 shrink-0 rounded-full bg-[var(--text-muted)]" aria-hidden="true" />
          <span className={mutedText}>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function TextLink({ href, children }: { href: string; children: ReactNode }) {
  const isRouteHandlerLink = /\.(json|md|txt)$/.test(href);
  const className = "studio-lateral-link micro-focus micro-pressable inline-flex text-[length:var(--type-0)]";

  if (isRouteHandlerLink) {
    return (
      <a href={href} className={className}>
        {children}
      </a>
    );
  }

  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export default function DesignSystemPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: "Portfolio AI design system proof",
    description: DESIGN_SYSTEM_PROOF.description,
    url: absoluteUrl(DESIGN_SYSTEM_PATHS.page),
    author: { "@id": PERSON_ID },
    about: ["Design systems", "UX engineering", "AI-readable interfaces"],
    isPartOf: absoluteUrl(DESIGN_SYSTEM_PATHS.portfolioAi),
  };

  return (
    <main className="site-lowercase flex min-h-dvh flex-col bg-[var(--bg-base)] px-[var(--space-3)] pb-[calc(var(--space-8)*2)] pt-[92px] text-[length:var(--type-0)] text-[var(--text-primary)] sm:px-[var(--space-5)] md:pt-[122px]">
      <StructuredData data={jsonLd} />
      <article className="mx-auto flex w-full max-w-[620px] flex-1 flex-col gap-[var(--space-6)]">
        <nav aria-label="breadcrumb" className="flex flex-wrap items-center gap-x-[var(--space-1)] gap-y-1">
          <TextLink href="/work">work</TextLink>
          <span className="text-[var(--text-muted)]" aria-hidden="true">/</span>
          <TextLink href={DESIGN_SYSTEM_PATHS.portfolioAi}>portfolio ai</TextLink>
          <span className="text-[var(--text-muted)]" aria-hidden="true">/</span>
          <span className={mutedText}>design system proof</span>
        </nav>

        <header className={sectionClass}>
          <p className={smallMuted}>{DESIGN_SYSTEM_PROOF.audience}</p>
          <h1 className={primaryText}>{DESIGN_SYSTEM_PROOF.name}</h1>
          <p className={mutedText}>{DESIGN_SYSTEM_PROOF.description}</p>
        </header>

        <Section title="machine-readable routes">
          <div className="flex flex-wrap gap-x-[var(--space-2)] gap-y-[var(--space-1)]">
            <TextLink href={DESIGN_SYSTEM_PATHS.markdown}>design-system.md</TextLink>
            <TextLink href={DESIGN_SYSTEM_PATHS.tokens}>tokens.json</TextLink>
            <TextLink href="/portfolio.md">portfolio.md</TextLink>
            <TextLink href="/llms.txt">llms.txt</TextLink>
          </div>
        </Section>

        <Section title="tokens">
          <div className="space-y-[var(--space-4)]">
            <div>
              <p className={`${smallMuted} mb-[var(--space-2)]`}>color roles</p>
              <TokenList items={DESIGN_SYSTEM_TOKENS.colors} />
            </div>
            <div>
              <p className={`${smallMuted} mb-[var(--space-2)]`}>type and spacing</p>
              <TokenList
                items={[
                  ...DESIGN_SYSTEM_TOKENS.typography.families,
                  ...DESIGN_SYSTEM_TOKENS.typography.scale,
                  ...DESIGN_SYSTEM_TOKENS.spacing,
                ]}
              />
            </div>
            <div>
              <p className={`${smallMuted} mb-[var(--space-2)]`}>motion</p>
              <TokenList
                items={[
                  ...DESIGN_SYSTEM_TOKENS.motion.durations,
                  ...DESIGN_SYSTEM_TOKENS.motion.easing,
                ]}
              />
            </div>
          </div>
        </Section>

        <Section title="component primitives">
          <div className="space-y-[var(--space-3)]">
            {DESIGN_SYSTEM_COMPONENTS.map((component) => (
              <div key={component.name} className="space-y-[var(--space-1)]">
                <h3 className={primaryText}>{component.name}</h3>
                <p className={mutedText}>{component.description}</p>
                <p className={smallMuted}>{component.primitives.join(" / ")}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section title="interaction rules">
          <RuleList items={DESIGN_SYSTEM_INTERACTION_RULES} />
        </Section>

        <Section title="accessibility rules">
          <RuleList items={DESIGN_SYSTEM_ACCESSIBILITY_RULES} />
        </Section>

        <Section title="ai-readable contract">
          <div className="grid gap-[var(--space-4)] sm:grid-cols-2">
            <div>
              <p className={`${smallMuted} mb-[var(--space-2)]`}>use</p>
              <RuleList items={DESIGN_SYSTEM_AI_CONTRACT.use} />
            </div>
            <div>
              <p className={`${smallMuted} mb-[var(--space-2)]`}>avoid</p>
              <RuleList items={DESIGN_SYSTEM_AI_CONTRACT.avoid} />
            </div>
          </div>
        </Section>
      </article>

      <BuildMeta className="mx-auto mt-auto w-full max-w-[620px] pt-[var(--space-6)] text-[length:var(--type-0)]" />
    </main>
  );
}
