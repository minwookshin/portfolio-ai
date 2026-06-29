"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { InlineCopyButton } from "@/components/CopyFeedback";
import { tweens } from "@/lib/material/motion";
import { isVisibleBuilderValue } from "@/data/projects";
import { makeVideoPosterDataUrl } from "@/lib/mediaPlaceholders";
import { DetailOutlineHeading, DetailOutlineRow } from "@/components/Outline";
import StudioVideoPlayer from "@/components/StudioVideoPlayer";

/**
 * Data-driven case-study renderer. A project's detail page is described as an
 * ordered array of `DetailSection`s; each kind picks the layout that suits that
 * content. The visual language follows the homepage: tight type, monochrome
 * text, quiet spacing, and thin white surfaces only where structure needs them.
 */

export type DetailSection = ({
      kind: "hero";
      badge?: string;
      title: string;
      subtitle?: string;
      bullets?: string[];
      tags?: string[];
      image?: string;
      imageStyle?: "phone" | "cover";
      hideMedia?: boolean;
    }
  | { kind: "lead"; eyebrow?: string; heading: string; body: string }
  | { kind: "stats"; eyebrow?: string; heading?: string; items: { value: string; label: string }[] }
  | {
      kind: "problem";
      eyebrow?: string;
      heading: string;
      body: string;
      stats?: { value: string; label: string }[];
      persona?: { name: string; role: string; points: string[] };
    }
  | { kind: "split"; eyebrow?: string; heading: string; columns: { label: string; title: string; body: string }[] }
  | { kind: "features"; eyebrow?: string; heading: string; items: { title: string; description: string; image?: string }[] }
  | { kind: "flow"; eyebrow?: string; heading: string; steps: { title: string; body: string; tag?: string }[]; note?: string }
  | { kind: "quote"; text: string; attribution?: string }
  | { kind: "gallery"; eyebrow?: string; heading?: string; layout?: "grid" | "featured"; images: { src: string; caption?: string }[] }
  | { kind: "video"; eyebrow?: string; heading?: string; src: string; poster?: string; aspect?: string }
  | { kind: "links"; items: { label: string; href: string }[] }
  | {
      kind: "artifact";
      caption?: string;
      code?: string;
      eyebrow?: string;
      heading: string;
      meta?: string;
      rows?: { label: string; note?: string; value: string }[];
      title: string;
    }
  | { kind: "outcome"; badge?: string; heading: string; body: string[] }) & {
  // Optional question capsules woven in right after this section, placed where
  // they make sense in the narrative and wired to the chat.
  ask?: string[];
};

export interface CaseStudyData {
  sections: DetailSection[];
  ask?: string[]; // outro follow-up prompts, wired to chat
}

type ArtifactSection = Extract<DetailSection, { kind: "artifact" }>;

// Detail pages should feel closer to the homepage: quiet, fast, and mostly
// editorial. Section reveals are intentionally small so reading stays calm.
const reveal = {
  initial: { opacity: 0, y: 8 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: tweens.base,
} as const;

const h2Cls = "text-[length:var(--type-0)] font-normal leading-[var(--leading-body)] text-[var(--text-primary)]";
const sectionCls = "detail-outline-section";

// Hero content staggers gently so the detail page keeps the homepage's quiet
// cadence while still feeling responsive.
const heroContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.035, delayChildren: 0.04 } },
};
const heroItem = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0, transition: tweens.base },
};

function SectionHead({ eyebrow, heading }: { eyebrow?: string; heading: string }) {
  return <DetailOutlineHeading eyebrow={eyebrow} heading={heading} headingClassName={h2Cls} />;
}

function Dot() {
  return <span className="mt-[0.7em] h-1 w-1 shrink-0 rounded-full bg-[var(--text-muted)]" />;
}

function DetailRow({
  body,
  children,
  className = "",
  meta,
  title,
}: {
  body?: ReactNode;
  children?: ReactNode;
  className?: string;
  meta?: ReactNode;
  title?: ReactNode;
}) {
  return (
    <DetailOutlineRow body={body} className={className} meta={meta} title={title}>
      {children}
    </DetailOutlineRow>
  );
}

function isExternalHref(href: string) {
  return /^https?:\/\//.test(href) || href.startsWith("mailto:");
}

function isDocumentHref(href: string) {
  return /\.(json|md|txt)$/.test(href);
}

function getLinkMeta(label: string, href: string) {
  const value = `${label} ${href}`.toLowerCase();

  if (value.endsWith(".md") || value.includes(".md ")) return "markdown";
  if (value.endsWith(".json") || value.includes(".json ")) return "json";
  if (value.endsWith(".txt") || value.includes(".txt ")) return "text";
  if (value.includes("github")) return "source";
  if (value.includes("linkedin")) return "post";
  if (value.includes("figma")) return "design";
  if (value.includes("demo")) return "demo";
  if (value.includes("http")) return "site";
  if (href.startsWith("/")) return "page";

  return isExternalHref(href) ? "external" : "internal";
}

function getArtifactCopyValue(section: ArtifactSection) {
  if (section.code) return section.code;

  const rows = section.rows?.map((row) => {
    const note = row.note ? ` — ${row.note}` : "";
    return `${row.label}: ${row.value}${note}`;
  }) ?? [];

  return [
    section.title,
    section.meta,
    ...rows,
    section.caption,
  ].filter(Boolean).join("\n");
}

function DetailLink({ label, href }: { label: string; href: string }) {
  const external = isExternalHref(href);
  const document = isDocumentHref(href);
  const meta = getLinkMeta(label, href);
  const className = "studio-lateral-link studio-detail-link-row micro-focus micro-pressable text-[length:var(--type-0)]";
  const children = (
    <>
      <span>{label}</span>
      <span className="studio-detail-link-meta" aria-hidden="true">/ {meta}</span>
    </>
  );

  if (external || document) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={className}
      >
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

function Tags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-x-[var(--space-2)] gap-y-[var(--space-1)] text-[length:calc(var(--type-0)_-_2px)] font-normal leading-[1.2] text-[var(--text-muted)]">
      {tags.map((t) => (
        <span key={t}>
          {t}
        </span>
      ))}
    </div>
  );
}

function ProjectImage({ src, alt, style }: { src: string; alt: string; style?: "phone" | "cover" }) {
  if (style === "phone") {
    return (
      <div className="studio-detail-media studio-detail-phone-media detail-outline-media mx-auto w-full max-w-[260px]">
        <img src={src} alt={alt} className="w-full h-auto" draggable={false} loading="lazy" decoding="async" />
      </div>
    );
  }
  return (
    <div className="studio-detail-media detail-outline-media overflow-hidden">
      <img src={src} alt={alt} className="w-full h-auto object-cover" draggable={false} loading="lazy" decoding="async" />
    </div>
  );
}

function getSectionMotion(reduceMotion: boolean) {
  return reduceMotion
    ? { initial: false, animate: { opacity: 1, y: 0 }, transition: tweens.none }
    : reveal;
}

function renderSection(
  section: DetailSection,
  i: number,
  reduceMotion: boolean,
) {
  const sectionMotion = getSectionMotion(reduceMotion);

  switch (section.kind) {
    case "hero": {
      const bullets = section.bullets?.filter(isVisibleBuilderValue) ?? [];
      const tags = section.tags?.filter(isVisibleBuilderValue) ?? [];

      return (
        <motion.section
          key={i}
          {...(reduceMotion
            ? { initial: false }
            : { variants: heroContainer, initial: "hidden" as const, animate: "show" as const })}
          className="detail-outline-hero pt-0"
        >
          <motion.h1 {...(reduceMotion ? {} : { variants: heroItem })} className="max-w-[var(--measure)] text-[length:var(--type-0)] font-normal leading-[var(--leading-body)] text-[var(--text-primary)]">
            {section.title}
          </motion.h1>
          {section.subtitle && (
            <motion.p {...(reduceMotion ? {} : { variants: heroItem })} className="mt-[var(--space-1)] max-w-[var(--measure)] text-[length:var(--type-0)] leading-[var(--leading-body)] text-[var(--text-muted)]">
              {section.subtitle}
            </motion.p>
          )}
          {bullets.length > 0 && (
            <motion.div {...(reduceMotion ? {} : { variants: heroItem })} className="mt-[var(--space-3)] space-y-[var(--space-2)]">
              {bullets.map((b) => (
                <div key={b} className="flex items-start gap-[var(--space-1)]">
                  <Dot />
                  <p className="text-[length:var(--type-0)] leading-[var(--leading-body)] text-[var(--text-muted)]">{b}</p>
                </div>
              ))}
            </motion.div>
          )}
          {tags.length > 0 && <motion.div {...(reduceMotion ? {} : { variants: heroItem })} className="mt-[var(--space-3)]"><Tags tags={tags} /></motion.div>}
          {section.image && (
            <motion.div {...(reduceMotion ? {} : { variants: heroItem })} className="mt-[var(--space-4)]">
              <ProjectImage src={section.image} alt={section.title} style={section.imageStyle} />
            </motion.div>
          )}
        </motion.section>
      );
    }

    case "lead":
      return (
        <motion.section key={i} {...sectionMotion} className={sectionCls}>
          <SectionHead eyebrow={section.eyebrow} heading={section.heading} />
          <DetailRow body={section.body} />
        </motion.section>
      );

    case "stats": {
      const statsItems = section.items.filter((item) => isVisibleBuilderValue(item.value));

      if (statsItems.length === 0) return null;

      return (
        <motion.section key={i} {...sectionMotion} className={sectionCls}>
          {(section.eyebrow || section.heading) && <SectionHead eyebrow={section.eyebrow} heading={section.heading ?? ""} />}
          <div className="detail-outline-list detail-outline-list--grid">
            {statsItems.map((s) => (
              <DetailRow key={s.label} meta={s.label} title={s.value} />
            ))}
          </div>
        </motion.section>
      );
    }

    case "problem": {
      const problemStats = section.stats?.filter((stat) => isVisibleBuilderValue(stat.value)) ?? [];

      return (
        <motion.section key={i} {...sectionMotion} className={sectionCls}>
          <SectionHead eyebrow={section.eyebrow} heading={section.heading} />
          <div className="detail-outline-list">
            <DetailRow body={section.body}>
              {problemStats.length > 0 && (
                <div className="detail-outline-mini-grid">
                  {problemStats.map((s) => (
                    <div key={s.label}>
                      <p className="text-[length:var(--type-0)] font-normal leading-[var(--leading-body)] text-[var(--text-primary)]">{s.value}</p>
                      <p className="mt-[var(--space-1)] text-[length:calc(var(--type-0)_-_2px)] leading-[1.2] text-[var(--text-muted)]">{s.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </DetailRow>
            {section.persona && (
              <DetailRow meta={section.persona.role} title={section.persona.name}>
                <div className="detail-outline-nested-list">
                  {section.persona.points.map((p) => (
                    <div key={p} className="flex items-start gap-[var(--space-1)]">
                      <Dot />
                      <p className="text-[length:calc(var(--type-0)_-_2px)] leading-[var(--leading-body)] text-[var(--text-primary)]">{p}</p>
                    </div>
                  ))}
                </div>
              </DetailRow>
            )}
          </div>
        </motion.section>
      );
    }

    case "split":
      return (
        <motion.section key={i} {...sectionMotion} className={sectionCls}>
          <SectionHead eyebrow={section.eyebrow} heading={section.heading} />
          <div className="detail-outline-list">
            {section.columns.map((c) => (
              <DetailRow key={c.label} body={c.body} meta={c.label} title={c.title} />
            ))}
          </div>
        </motion.section>
      );

    case "features":
      return (
        <motion.section key={i} {...sectionMotion} className={sectionCls}>
          <SectionHead eyebrow={section.eyebrow} heading={section.heading} />
          <div className="space-y-[var(--space-5)]">
            {section.items.map((f, fi) => (
              <motion.div
                key={f.title}
                {...(reduceMotion
                  ? { initial: false, animate: { opacity: 1, y: 0 }, transition: tweens.none }
                  : {
                      initial: { opacity: 0, y: 8 },
                      whileInView: { opacity: 1, y: 0 },
                      viewport: { once: true, margin: "-60px" },
                      transition: tweens.base,
                    })}
                className="detail-outline-feature-row"
              >
                {f.image && (
                  <div className={fi % 2 === 1 ? "sm:order-2" : ""}>
                    <ProjectImage src={f.image} alt={f.title} style="phone" />
                  </div>
                )}
                <div className={fi % 2 === 1 ? "sm:order-1" : ""}>
                  <DetailRow body={f.description} meta={`feature ${fi + 1}`} title={f.title} />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      );

    case "flow":
      return (
        <motion.section key={i} {...sectionMotion} className={sectionCls}>
          <SectionHead eyebrow={section.eyebrow} heading={section.heading} />
          <div className="detail-outline-list">
            {section.steps.map((s, si) => (
              <DetailRow
                key={s.title}
                body={s.body}
                meta={[String(si + 1).padStart(2, "0"), s.tag].filter(Boolean).join(" / ")}
                title={s.title}
              />
            ))}
          </div>
          {section.note && <DetailRow body={section.note} className="detail-outline-row--note" />}
        </motion.section>
      );

    case "quote":
      return (
        <motion.section key={i} {...sectionMotion} className={sectionCls}>
          <blockquote className="detail-outline-quote">
            <p className="text-[length:var(--type-0)] font-normal leading-[var(--leading-body)] text-[var(--text-primary)]">{section.text}</p>
            {section.attribution && <p className="mt-[var(--space-1)] text-[length:calc(var(--type-0)_-_2px)] leading-[1.2] text-[var(--text-muted)]">{section.attribution}</p>}
          </blockquote>
        </motion.section>
      );

    case "gallery":
      return (
        <motion.section key={i} {...sectionMotion} className={sectionCls}>
          {(section.eyebrow || section.heading) && <SectionHead eyebrow={section.eyebrow} heading={section.heading ?? ""} />}
          <div className={`detail-outline-media-grid ${section.images.length > 1 ? "sm:grid-cols-2" : ""}`}>
            {section.images.map((img, gi) => (
              <figure
                key={gi}
                className={`detail-outline-figure overflow-hidden ${section.layout === "featured" && gi === 0 ? "sm:col-span-2" : ""}`}
              >
                <img src={img.src} alt={img.caption ?? ""} className="w-full h-auto object-cover" draggable={false} loading="lazy" decoding="async" />
                {img.caption && <figcaption className="py-[var(--space-1)] text-[length:calc(var(--type-0)_-_2px)] leading-[1.2] text-[var(--text-muted)]">{img.caption}</figcaption>}
              </figure>
            ))}
          </div>
        </motion.section>
      );

    case "video":
      return (
        <motion.section key={i} {...sectionMotion} className={sectionCls}>
          {(section.eyebrow || section.heading) && <SectionHead eyebrow={section.eyebrow} heading={section.heading ?? ""} />}
          <StudioVideoPlayer
            src={section.src}
            label={section.heading ?? "project demo"}
            muted={false}
            poster={section.poster ?? makeVideoPosterDataUrl(section.heading ?? "project demo")}
            className="studio-detail-media bg-[var(--bg-element)]"
            videoClassName="block h-auto w-full"
          />
        </motion.section>
      );

    case "links":
      return (
        <motion.section key={i} {...sectionMotion} className={sectionCls}>
          <SectionHead heading="links" />
          <div className="studio-detail-link-list">
            {section.items.map((l) => (
              <DetailLink key={l.href} label={l.label} href={l.href} />
            ))}
          </div>
        </motion.section>
      );

    case "artifact": {
      const artifactCopyValue = getArtifactCopyValue(section);

      return (
        <motion.section key={i} {...sectionMotion} className={sectionCls}>
          <SectionHead eyebrow={section.eyebrow} heading={section.heading} />
          <div className="detail-artifact-surface">
            <div className="detail-artifact-header">
              <span>{section.title}</span>
              <div className="detail-artifact-header-actions">
                {section.meta && <span className="detail-artifact-header-meta">{section.meta}</span>}
                {artifactCopyValue && (
                  <InlineCopyButton
                    value={artifactCopyValue}
                    label={`${section.title} artifact`}
                    ariaLabel={`copy ${section.title} artifact`}
                    className="detail-copy-action micro-focus micro-focus-tight micro-pressable"
                  >
                    copy
                  </InlineCopyButton>
                )}
              </div>
            </div>
            {section.rows && section.rows.length > 0 && (
              <div className="detail-artifact-list">
                {section.rows.map((row) => (
                  <div key={row.label} className="detail-artifact-row">
                    <span>{row.label}</span>
                    <span>{row.value}</span>
                    {row.note && <p>{row.note}</p>}
                  </div>
                ))}
              </div>
            )}
            {section.code && (
              <pre className="detail-artifact-code">
                <code>
                  {section.code.split("\n").map((line, lineIndex) => (
                    <span key={`${lineIndex}-${line}`} className="detail-artifact-code-line">
                      {line || "\u00a0"}
                    </span>
                  ))}
                </code>
              </pre>
            )}
          </div>
          {section.caption && <p className="detail-artifact-caption">{section.caption}</p>}
        </motion.section>
      );
    }

    case "outcome":
      return (
        <motion.section key={i} {...sectionMotion} className={sectionCls}>
          <SectionHead eyebrow={section.badge} heading={section.heading} />
          <div className="detail-outline-list">
            {section.body.map((p, pi) => (
              <DetailRow key={pi} body={p} />
            ))}
          </div>
        </motion.section>
      );

    default:
      return null;
  }
}

// A row of question capsules wired to the chat. Used both woven between
// sections (label omitted) and as the closing "Keep exploring" outro.
function AskRow({
  prompts,
  onAsk,
  label,
  className = "",
  reduceMotion,
}: {
  prompts: string[];
  onAsk: (q: string) => void;
  label?: string;
  className?: string;
  reduceMotion: boolean;
}) {
  return (
    <motion.div
      {...getSectionMotion(reduceMotion)}
      className={className}
    >
      {label && <p className="mb-[var(--space-1)] text-[length:calc(var(--type-0)_-_2px)] leading-[1.2] text-[var(--text-muted)]">{label}</p>}
      <div className="flex flex-wrap gap-[var(--space-1)]">
        {prompts.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => onAsk(q)}
            className="micro-focus micro-focus-tight micro-pressable group inline-flex items-center gap-[var(--space-1)] border border-[var(--border-light)] bg-[var(--bg-surface)] px-[var(--space-2)] py-[var(--space-1)] text-[length:calc(var(--type-0)_-_2px)] font-normal text-[var(--text-primary)] hover:bg-[var(--bg-element)]"
          >
            {q}
            <ArrowUpRight className={`w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] ${
              reduceMotion
                ? "transition-colors duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-standard)]"
                : "transition-[color,transform] duration-[var(--motion-duration-fast)] ease-[var(--motion-ease-standard)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            }`} />
          </button>
        ))}
      </div>
    </motion.div>
  );
}

export function CaseStudy({ data, onAsk }: { data: CaseStudyData; onAsk?: (q: string) => void }) {
  const reduceMotion = Boolean(useReducedMotion());

  return (
    <div className="case-study-sections detail-outline-stack">
      {data.sections.map((s, i) => (
        <div key={i}>
          {renderSection(s, i, reduceMotion)}
          {/* Questions woven in right where they make sense in the narrative */}
          {onAsk && s.ask && s.ask.length > 0 && <AskRow prompts={s.ask} onAsk={onAsk} className="mt-[var(--space-3)]" reduceMotion={reduceMotion} />}
        </div>
      ))}

      {/* Outro: loop back into the conversation */}
      {onAsk && data.ask && data.ask.length > 0 && (
        <AskRow prompts={data.ask} onAsk={onAsk} label="Keep exploring" className="pt-[var(--space-1)]" reduceMotion={reduceMotion} />
      )}
    </div>
  );
}
