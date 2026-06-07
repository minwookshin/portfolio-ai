"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { tweens } from "@/lib/material/motion";
import { isVisibleBuilderValue } from "@/data/projects";
import { makeVideoPosterDataUrl } from "@/lib/mediaPlaceholders";

/**
 * Data-driven case-study renderer. A project's detail page is described as an
 * ordered array of `DetailSection`s; each kind picks the layout that suits that
 * content. The visual language follows the homepage: tight type, monochrome
 * text, quiet rules, and thin white surfaces only where structure needs them.
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
  | { kind: "gallery"; eyebrow?: string; heading?: string; images: { src: string; caption?: string }[] }
  | { kind: "video"; eyebrow?: string; heading?: string; src: string; poster?: string; aspect?: string }
  | { kind: "links"; items: { label: string; href: string }[] }
  | { kind: "outcome"; badge?: string; heading: string; body: string[] }) & {
  // Optional question capsules woven in right after this section, placed where
  // they make sense in the narrative and wired to the chat.
  ask?: string[];
};

export interface CaseStudyData {
  sections: DetailSection[];
  ask?: string[]; // outro follow-up prompts, wired to chat
}

// Detail pages should feel closer to the homepage: quiet, fast, and mostly
// editorial. Section reveals are intentionally small so reading stays calm.
const reveal = {
  initial: { opacity: 0, y: 8 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: tweens.base,
} as const;

const card = "studio-detail-panel";
const eyebrowCls = "text-[length:calc(var(--type-0)_-_2px)] leading-[1.2] text-[var(--text-muted)]";
const h2Cls = "text-[length:var(--type-0)] font-normal leading-[var(--leading-body)] text-[var(--text-primary)]";
const bodyCls = "text-[length:var(--type-0)] leading-[var(--leading-body)] text-[var(--text-muted)]";

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
  return (
    <div className="mb-[var(--space-3)]">
      {eyebrow && <p className={`${eyebrowCls} mb-[var(--space-1)]`}>{eyebrow}</p>}
      <h2 className={h2Cls}>{heading}</h2>
    </div>
  );
}

function Dot() {
  return <span className="mt-[0.7em] h-1 w-1 shrink-0 rounded-full bg-[var(--text-muted)]" />;
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
      <div className="studio-detail-media studio-detail-phone-media mx-auto w-full max-w-[260px]">
        <img src={src} alt={alt} className="w-full h-auto" draggable={false} loading="lazy" decoding="async" />
      </div>
    );
  }
  return (
    <div className="studio-detail-media overflow-hidden">
      <img src={src} alt={alt} className="w-full h-auto object-cover" draggable={false} loading="lazy" decoding="async" />
    </div>
  );
}

function getSectionMotion(reduceMotion: boolean) {
  return reduceMotion
    ? { initial: false, animate: { opacity: 1, y: 0 }, transition: tweens.none }
    : reveal;
}

function renderSection(section: DetailSection, i: number, reduceMotion: boolean) {
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
          className="pt-0"
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
        <motion.section key={i} {...sectionMotion} className="max-w-2xl">
          {section.eyebrow && <p className={`${eyebrowCls} mb-3`}>{section.eyebrow}</p>}
          <h2 className={`${h2Cls} mb-[var(--space-3)]`}>{section.heading}</h2>
          <p className={bodyCls}>{section.body}</p>
        </motion.section>
      );

    case "stats": {
      const statsItems = section.items.filter((item) => isVisibleBuilderValue(item.value));

      if (statsItems.length === 0) return null;

      return (
        <motion.section key={i} {...sectionMotion}>
          {(section.eyebrow || section.heading) && <SectionHead eyebrow={section.eyebrow} heading={section.heading ?? ""} />}
          <div className="grid grid-cols-2 gap-[var(--space-2)] sm:grid-cols-3">
            {statsItems.map((s) => (
              <div key={s.label} className={`${card} px-[var(--space-2)] py-[var(--space-2)]`}>
                <p className="text-[length:var(--type-0)] font-normal leading-[var(--leading-body)] text-[var(--text-primary)]">{s.value}</p>
                <p className="mt-[var(--space-1)] text-[length:calc(var(--type-0)_-_2px)] leading-[1.2] text-[var(--text-muted)]">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.section>
      );
    }

    case "problem": {
      const problemStats = section.stats?.filter((stat) => isVisibleBuilderValue(stat.value)) ?? [];

      return (
        <motion.section key={i} {...sectionMotion}>
          <SectionHead eyebrow={section.eyebrow} heading={section.heading} />
          <div className="grid gap-[var(--space-2)] md:grid-cols-5">
            <div className={`${card} px-[var(--space-2)] py-[var(--space-2)] md:col-span-3`}>
              <p className={bodyCls}>{section.body}</p>
              {problemStats.length > 0 && (
                <div className="mt-[var(--space-3)] grid grid-cols-2 gap-[var(--space-3)] border-t border-[var(--border-light)] pt-[var(--space-3)]">
                  {problemStats.map((s) => (
                    <div key={s.label}>
                      <p className="text-[length:var(--type-0)] font-normal leading-[var(--leading-body)] text-[var(--text-primary)]">{s.value}</p>
                      <p className="mt-[var(--space-1)] text-[length:calc(var(--type-0)_-_2px)] leading-[1.2] text-[var(--text-muted)]">{s.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {section.persona && (
              <div className={`${card} px-[var(--space-2)] py-[var(--space-2)] md:col-span-2`}>
                <p className={`${eyebrowCls} mb-[var(--space-2)]`}>Target user</p>
                <h3 className="text-[length:var(--type-0)] font-normal leading-[var(--leading-body)] text-[var(--text-primary)]">{section.persona.name}</h3>
                <p className="mb-[var(--space-2)] text-[length:calc(var(--type-0)_-_2px)] leading-[1.2] text-[var(--text-muted)]">{section.persona.role}</p>
                <div className="space-y-[var(--space-2)] border-t border-[var(--border-light)] pt-[var(--space-2)]">
                  {section.persona.points.map((p) => (
                    <div key={p} className="flex items-start gap-[var(--space-1)]">
                      <Dot />
                      <p className="text-[length:calc(var(--type-0)_-_2px)] leading-[var(--leading-body)] text-[var(--text-primary)]">{p}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.section>
      );
    }

    case "split":
      return (
        <motion.section key={i} {...sectionMotion}>
          <SectionHead eyebrow={section.eyebrow} heading={section.heading} />
          <div className="grid gap-[var(--space-2)] sm:grid-cols-2">
            {section.columns.map((c) => (
              <div key={c.label} className={`${card} px-[var(--space-2)] py-[var(--space-2)]`}>
                <span className={`${eyebrowCls} mb-[var(--space-2)] inline-block`}>
                  {c.label}
                </span>
                <h3 className="mb-[var(--space-1)] text-[length:var(--type-0)] font-normal leading-[var(--leading-body)] text-[var(--text-primary)]">{c.title}</h3>
                <p className={bodyCls}>{c.body}</p>
              </div>
            ))}
          </div>
        </motion.section>
      );

    case "features":
      return (
        <motion.section key={i} {...sectionMotion}>
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
                className="grid items-center gap-[var(--space-3)] sm:grid-cols-2"
              >
                {f.image && (
                  <div className={fi % 2 === 1 ? "sm:order-2" : ""}>
                    <ProjectImage src={f.image} alt={f.title} style="phone" />
                  </div>
                )}
                <div className={fi % 2 === 1 ? "sm:order-1" : ""}>
                  <p className={`${eyebrowCls} mb-[var(--space-1)]`}>{`Feature ${fi + 1}`}</p>
                  <h3 className="mb-[var(--space-1)] text-[length:var(--type-0)] font-normal leading-[var(--leading-body)] text-[var(--text-primary)]">{f.title}</h3>
                  <p className={bodyCls}>{f.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      );

    case "flow":
      return (
        <motion.section key={i} {...sectionMotion}>
          <SectionHead eyebrow={section.eyebrow} heading={section.heading} />
          <div className="relative pl-8">
            <div className="absolute left-[11px] top-2 bottom-2 w-px bg-[var(--border-light)]" />
            <div className="space-y-[var(--space-2)]">
              {section.steps.map((s, si) => (
                <div key={s.title} className="relative">
                  <span className="absolute -left-8 top-0 flex h-6 w-6 items-center justify-center border border-[var(--border-light)] bg-[var(--bg-surface)] text-[length:calc(var(--type-0)_-_2px)] font-normal leading-none text-[var(--text-muted)]">
                    {si + 1}
                  </span>
                  <div className={`${card} px-[var(--space-2)] py-[var(--space-2)]`}>
                    {s.tag && <p className={`${eyebrowCls} mb-[var(--space-1)]`}>{s.tag}</p>}
                    <h3 className="mb-[var(--space-1)] text-[length:var(--type-0)] font-normal leading-[var(--leading-body)] text-[var(--text-primary)]">{s.title}</h3>
                    <p className={bodyCls}>{s.body}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {section.note && <p className={`${bodyCls} mt-[var(--space-3)]`}>{section.note}</p>}
        </motion.section>
      );

    case "quote":
      return (
        <motion.section key={i} {...sectionMotion}>
          <blockquote className="border-l border-[var(--border-light)] pl-[var(--space-2)]">
            <p className="text-[length:var(--type-0)] font-normal leading-[var(--leading-body)] text-[var(--text-primary)]">{section.text}</p>
            {section.attribution && <p className="mt-[var(--space-1)] text-[length:calc(var(--type-0)_-_2px)] leading-[1.2] text-[var(--text-muted)]">{section.attribution}</p>}
          </blockquote>
        </motion.section>
      );

    case "gallery":
      return (
        <motion.section key={i} {...sectionMotion}>
          {(section.eyebrow || section.heading) && <SectionHead eyebrow={section.eyebrow} heading={section.heading ?? ""} />}
          <div className="grid items-start gap-[var(--space-2)] sm:grid-cols-2">
            {section.images.map((img, gi) => (
              <figure key={gi} className="overflow-hidden">
                <img src={img.src} alt={img.caption ?? ""} className="w-full h-auto object-cover" draggable={false} loading="lazy" decoding="async" />
                {img.caption && <figcaption className="py-[var(--space-1)] text-[length:calc(var(--type-0)_-_2px)] leading-[1.2] text-[var(--text-muted)]">{img.caption}</figcaption>}
              </figure>
            ))}
          </div>
        </motion.section>
      );

    case "video":
      return (
        <motion.section key={i} {...sectionMotion}>
          {(section.eyebrow || section.heading) && <SectionHead eyebrow={section.eyebrow} heading={section.heading ?? ""} />}
          <div className="studio-detail-media overflow-hidden bg-[var(--bg-element)]">
            <video controls poster={section.poster ?? makeVideoPosterDataUrl(section.heading ?? "project demo")} className="block w-full h-auto">
              <source src={section.src} type="video/mp4" />
            </video>
          </div>
        </motion.section>
      );

    case "links":
      return (
        <motion.section key={i} {...sectionMotion}>
          <div className="flex flex-wrap items-center gap-x-[var(--space-2)] gap-y-[var(--space-1)]">
            {section.items.map((l) => (
              <a
                key={l.href}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="studio-lateral-link micro-focus micro-pressable inline-flex text-[length:var(--type-0)]"
              >
                {l.label}
              </a>
            ))}
          </div>
        </motion.section>
      );

    case "outcome":
      return (
        <motion.section key={i} {...sectionMotion}>
          <div className={`${card} px-[var(--space-2)] py-[var(--space-2)]`}>
            <h2 className={`${h2Cls} mb-[var(--space-3)]`}>{section.heading}</h2>
            <div className="space-y-[var(--space-2)]">
              {section.body.map((p, pi) => (
                <p key={pi} className="text-[length:var(--type-0)] leading-[var(--leading-body)] text-[var(--text-muted)]">
                  {p}
                </p>
              ))}
            </div>
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
      {label && <p className={`${eyebrowCls} mb-[var(--space-1)]`}>{label}</p>}
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
    <div className="space-y-[var(--space-5)]">
      {data.sections.map((s, i) => (
        <div key={i}>
          {renderSection(s, i, reduceMotion)}
          {/* Questions woven in right where they make sense in the narrative */}
          {onAsk && s.ask && s.ask.length > 0 && <AskRow prompts={s.ask} onAsk={onAsk} className="mt-[var(--space-3)]" reduceMotion={reduceMotion} />}
        </div>
      ))}

      {/* Outro: loop back into the conversation */}
      {onAsk && data.ask && data.ask.length > 0 && (
        <AskRow prompts={data.ask} onAsk={onAsk} label="Keep exploring" className="border-t border-[var(--border-light)] pt-[var(--space-4)]" reduceMotion={reduceMotion} />
      )}
    </div>
  );
}
