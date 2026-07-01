import type { Metadata } from "next";
import type { ReactNode } from "react";
import Link from "next/link";
import DetailBreadcrumb from "@/components/DetailBreadcrumb";
import { DetailOutlineHeading, DetailOutlineRow } from "@/components/Outline";
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

const smallMuted = "text-[length:calc(var(--type-0)_-_2px)] leading-[1.2] text-[var(--text-muted)]";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="detail-outline-section">
      <DetailOutlineHeading heading={title} />
      <div className="detail-outline-list">
        {children}
      </div>
    </section>
  );
}

function TokenList({
  items,
}: {
  items: ReadonlyArray<{ role: string; cssVariable?: string; value: string; usage?: string }>;
}) {
  return (
    <div className="detail-outline-list">
      {items.map((item) => (
        <DetailOutlineRow
          key={`${item.role}-${item.value}`}
          title={item.role}
          meta={item.cssVariable}
          body={[item.value, item.usage].filter(Boolean).join(" · ")}
        />
      ))}
    </div>
  );
}

function RuleList({ items }: { items: readonly string[] }) {
  return (
    <div className="detail-outline-list">
      {items.map((item) => (
        <DetailOutlineRow key={item} body={item} />
      ))}
    </div>
  );
}

function TextLink({ href, children }: { href: string; children: ReactNode }) {
  const isRouteHandlerLink = /\.(json|md|txt)$/.test(href);
  const className = "home-mention micro-focus micro-focus-tight micro-pressable inline-flex w-fit text-[length:var(--type-0)] leading-[var(--leading-body)]";

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
    <main className="site-lowercase detail-page-shell text-[length:var(--type-0)] text-[var(--text-primary)]">
      <StructuredData data={jsonLd} />
      <article className="project-readable studio-detail w-full max-w-[720px]">
        <DetailBreadcrumb
          currentLabel="design system proof"
          sectionHref={DESIGN_SYSTEM_PATHS.portfolioAi}
          sectionLabel="portfolio ai"
        />

        <div className="detail-document-content document-content-boot">
          <header className="detail-outline-section">
            <DetailOutlineHeading
              eyebrow={DESIGN_SYSTEM_PROOF.audience}
              heading={DESIGN_SYSTEM_PROOF.name}
              headingAs="h1"
            />
            <div className="detail-outline-list">
              <DetailOutlineRow body={DESIGN_SYSTEM_PROOF.description} />
            </div>
          </header>

          <Section title="machine-readable routes">
            <div className="flex flex-wrap gap-x-[var(--space-1)] gap-y-[var(--space-1)]">
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
                <p className={`${smallMuted} mb-[var(--space-2)]`}>signals and motion</p>
                <TokenList
                  items={[
                    ...DESIGN_SYSTEM_TOKENS.signals,
                    ...DESIGN_SYSTEM_TOKENS.motion.durations,
                    ...DESIGN_SYSTEM_TOKENS.motion.easing,
                  ]}
                />
              </div>
            </div>
          </Section>

          <Section title="component primitives">
            {DESIGN_SYSTEM_COMPONENTS.map((component) => (
              <DetailOutlineRow
                key={component.name}
                title={component.name}
                meta={component.primitives.join(" · ")}
                body={component.description}
              />
            ))}
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
        </div>
      </article>
    </main>
  );
}
