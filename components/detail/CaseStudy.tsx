"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Github, Linkedin } from "lucide-react";
import { springs } from "@/lib/material/motion";
import { isVisibleBuilderValue } from "@/data/projects";

/**
 * Data-driven case-study renderer. A project's detail page is described as an
 * ordered array of `DetailSection`s; each kind picks the layout that suits that
 * content. One shared spring drives every reveal, and the surfaces reuse the
 * chat's card language (rounded `surface-container`) so detail + chat feel like
 * one product. Rolling a project onto this system = authoring its sections.
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

// One reveal for every section so the whole page breathes consistently.
const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: springs.spatialDefault,
} as const;

// Translucent glass so components read as floating over the blurred backdrop
// rather than sitting on a solid panel.
const card = "glass-stroke rounded-[var(--md-shape-lg)] bg-surface-container/45 backdrop-blur-xl";
const eyebrowCls = "font-mono font-light text-[length:var(--type--2)] leading-[var(--leading-tight)] text-on-surface-variant";
const h2Cls = "text-[length:var(--type-1)] sm:text-[length:var(--type-2)] font-normal tracking-[-0.01em] leading-[var(--leading-heading)] text-on-surface";
const bodyCls = "text-[length:var(--type-0)] text-on-surface-variant leading-[var(--leading-body)]";

// Hero content staggers in after the panel has morphed into place (delayChildren),
// then each line settles one after another — like the Dynamic Island filling its
// expanded shape with content.
const heroContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06, delayChildren: 0.12 } },
};
const heroItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: springs.spatialFast },
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
  return <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-on-surface" />;
}

function Tags({ tags }: { tags: string[] }) {
  return (
    <div className="flex flex-wrap gap-x-[var(--space-2)] gap-y-[var(--space-1)] text-[length:var(--type--2)] font-normal text-on-surface-variant">
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
      <div className="mx-auto w-full max-w-[260px]">
        <img src={src} alt={alt} className="w-full h-auto" draggable={false} loading="lazy" decoding="async" />
      </div>
    );
  }
  return (
    <div className="overflow-hidden">
      <img src={src} alt={alt} className="w-full h-auto object-cover" draggable={false} loading="lazy" decoding="async" />
    </div>
  );
}

function renderSection(section: DetailSection, i: number) {
  switch (section.kind) {
    case "hero": {
      const bullets = section.bullets?.filter(isVisibleBuilderValue) ?? [];
      const tags = section.tags?.filter(isVisibleBuilderValue) ?? [];

      return (
        <motion.section
          key={i}
          variants={heroContainer}
          initial="hidden"
          animate="show"
          className="pt-2"
        >
          <motion.h1 variants={heroItem} className="text-[length:var(--type-3)] sm:text-[length:var(--type-4)] font-normal tracking-[-0.02em] leading-[var(--leading-heading)] text-on-surface">
            {section.title}
          </motion.h1>
          {section.subtitle && (
            <motion.p variants={heroItem} className="mt-[var(--space-2)] max-w-[var(--measure)] text-[length:var(--type-1)] text-on-surface-variant font-light leading-[var(--leading-body)]">
              {section.subtitle}
            </motion.p>
          )}
          {bullets.length > 0 && (
            <motion.div variants={heroItem} className="mt-[var(--space-4)] space-y-[var(--space-2)]">
              {bullets.map((b) => (
                <div key={b} className="flex items-start gap-3">
                  <Dot />
                  <p className="text-[length:var(--type-0)] text-on-surface-variant leading-[var(--leading-body)]">{b}</p>
                </div>
              ))}
            </motion.div>
          )}
          {tags.length > 0 && <motion.div variants={heroItem} className="mt-[var(--space-4)]"><Tags tags={tags} /></motion.div>}
          {section.image && (
            <motion.div variants={heroItem} className="mt-[var(--space-5)]">
              <ProjectImage src={section.image} alt={section.title} style={section.imageStyle} />
            </motion.div>
          )}
        </motion.section>
      );
    }

    case "lead":
      return (
        <motion.section key={i} {...reveal} className="max-w-2xl">
          {section.eyebrow && <p className={`${eyebrowCls} mb-3`}>{section.eyebrow}</p>}
          <h2 className={`${h2Cls} mb-[var(--space-3)]`}>{section.heading}</h2>
          <p className={bodyCls}>{section.body}</p>
        </motion.section>
      );

    case "stats": {
      const statsItems = section.items.filter((item) => isVisibleBuilderValue(item.value));

      if (statsItems.length === 0) return null;

      return (
        <motion.section key={i} {...reveal}>
          {(section.eyebrow || section.heading) && <SectionHead eyebrow={section.eyebrow} heading={section.heading ?? ""} />}
          <div className="grid grid-cols-2 gap-[var(--space-2)] sm:grid-cols-3">
            {statsItems.map((s) => (
              <div key={s.label} className={`${card} p-6`}>
                <p className="text-3xl sm:text-4xl font-normal tracking-tight text-on-surface">{s.value}</p>
                <p className="mt-[var(--space-1)] text-[length:var(--type--1)] text-on-surface-variant">{s.label}</p>
              </div>
            ))}
          </div>
        </motion.section>
      );
    }

    case "problem": {
      const problemStats = section.stats?.filter((stat) => isVisibleBuilderValue(stat.value)) ?? [];

      return (
        <motion.section key={i} {...reveal}>
          <SectionHead eyebrow={section.eyebrow} heading={section.heading} />
          <div className="grid gap-[var(--space-2)] md:grid-cols-5">
            <div className={`${card} p-6 sm:p-8 md:col-span-3`}>
              <p className={bodyCls}>{section.body}</p>
              {problemStats.length > 0 && (
                <div className="mt-[var(--space-3)] grid grid-cols-2 gap-[var(--space-3)] border-t border-outline-variant pt-[var(--space-3)]">
                  {problemStats.map((s) => (
                    <div key={s.label}>
                      <p className="text-2xl sm:text-3xl font-normal tracking-tight text-on-surface">{s.value}</p>
                      <p className="mt-[var(--space-1)] text-[length:var(--type--2)] text-on-surface-variant">{s.label}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {section.persona && (
              <div className={`${card} p-6 sm:p-8 md:col-span-2`}>
                <p className={`${eyebrowCls} mb-[var(--space-2)]`}>Target user</p>
                <h3 className="text-lg font-normal text-on-surface">{section.persona.name}</h3>
                <p className="mb-[var(--space-2)] text-[length:var(--type--1)] text-on-surface-variant">{section.persona.role}</p>
                <div className="space-y-[var(--space-2)] border-t border-outline-variant pt-[var(--space-2)]">
                  {section.persona.points.map((p) => (
                    <div key={p} className="flex items-start gap-3">
                      <Dot />
                      <p className="text-sm text-on-surface leading-snug">{p}</p>
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
        <motion.section key={i} {...reveal}>
          <SectionHead eyebrow={section.eyebrow} heading={section.heading} />
          <div className="grid gap-[var(--space-2)] sm:grid-cols-2">
            {section.columns.map((c) => (
              <div key={c.label} className={`${card} p-6 sm:p-8`}>
                <span className="mb-[var(--space-3)] inline-block rounded-[var(--md-shape-sm)] bg-on-surface px-[var(--space-2)] py-[var(--space-1)] text-[length:var(--type--2)] font-normal text-surface">
                  {c.label}
                </span>
                <h3 className="mb-[var(--space-1)] text-[length:var(--type-1)] font-normal leading-[var(--leading-heading)] text-on-surface">{c.title}</h3>
                <p className={bodyCls}>{c.body}</p>
              </div>
            ))}
          </div>
        </motion.section>
      );

    case "features":
      return (
        <motion.section key={i} {...reveal}>
          <SectionHead eyebrow={section.eyebrow} heading={section.heading} />
          <div className="space-y-10 sm:space-y-14">
            {section.items.map((f, fi) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={springs.spatialDefault}
                className="grid items-center gap-[var(--space-3)] sm:grid-cols-2"
              >
                {f.image && (
                  <div className={fi % 2 === 1 ? "sm:order-2" : ""}>
                    <ProjectImage src={f.image} alt={f.title} style="phone" />
                  </div>
                )}
                <div className={fi % 2 === 1 ? "sm:order-1" : ""}>
                  <p className={`${eyebrowCls} mb-[var(--space-1)]`}>{`Feature ${fi + 1}`}</p>
                  <h3 className="mb-[var(--space-1)] text-[length:var(--type-1)] font-normal leading-[var(--leading-heading)] text-on-surface">{f.title}</h3>
                  <p className={bodyCls}>{f.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.section>
      );

    case "flow":
      return (
        <motion.section key={i} {...reveal}>
          <SectionHead eyebrow={section.eyebrow} heading={section.heading} />
          <div className="relative pl-8">
            <div className="absolute left-[11px] top-2 bottom-2 w-px bg-outline-variant" />
            <div className="space-y-6">
              {section.steps.map((s, si) => (
                <div key={s.title} className="relative">
                  <span className="absolute -left-8 top-0 flex h-6 w-6 items-center justify-center rounded-[var(--md-shape-sm)] bg-on-surface text-xs font-normal text-surface">
                    {si + 1}
                  </span>
                  <div className={`${card} p-5 sm:p-6`}>
                    {s.tag && <p className={`${eyebrowCls} mb-[var(--space-1)]`}>{s.tag}</p>}
                    <h3 className="mb-[var(--space-1)] text-[length:var(--type-0)] font-normal leading-[var(--leading-heading)] text-on-surface">{s.title}</h3>
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
        <motion.section key={i} {...reveal}>
          <blockquote className="border-l-2 border-on-surface pl-6">
            <p className="text-xl sm:text-2xl font-light leading-relaxed text-on-surface">{section.text}</p>
            {section.attribution && <p className="mt-4 text-sm text-on-surface-variant">{section.attribution}</p>}
          </blockquote>
        </motion.section>
      );

    case "gallery":
      return (
        <motion.section key={i} {...reveal}>
          {(section.eyebrow || section.heading) && <SectionHead eyebrow={section.eyebrow} heading={section.heading ?? ""} />}
          <div className="grid items-start gap-[var(--space-2)] sm:grid-cols-2">
            {section.images.map((img, gi) => (
              <figure key={gi} className="overflow-hidden">
                <img src={img.src} alt={img.caption ?? ""} className="w-full h-auto object-cover" draggable={false} loading="lazy" decoding="async" />
                {img.caption && <figcaption className="px-[var(--space-2)] py-[var(--space-1)] text-[length:var(--type--2)] text-on-surface-variant">{img.caption}</figcaption>}
              </figure>
            ))}
          </div>
        </motion.section>
      );

    case "video":
      return (
        <motion.section key={i} {...reveal}>
          {(section.eyebrow || section.heading) && <SectionHead eyebrow={section.eyebrow} heading={section.heading ?? ""} />}
          <div className={`${card} overflow-hidden`}>
            <video controls poster={section.poster} className="block w-full h-auto">
              <source src={section.src} type="video/mp4" />
            </video>
          </div>
        </motion.section>
      );

    case "links":
      return (
        <motion.section key={i} {...reveal}>
          <div className="flex flex-wrap items-center gap-3">
            {section.items.map((l, li) => {
              const isGithub = /github\.com/i.test(l.href);
              const isLinkedin = /linkedin\.com/i.test(l.href);
              if (isGithub || isLinkedin) {
                const Icon = isGithub ? Github : Linkedin;
                return (
                  <a
                    key={l.href}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={isGithub ? "GitHub" : "LinkedIn"}
                    className="glass-stroke-sm inline-flex h-12 w-12 items-center justify-center rounded-[var(--md-shape-sm)] bg-surface-container/50 text-on-surface backdrop-blur-md transition-colors hover:bg-surface-container"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                );
              }
              return (
                <a
                  key={l.href}
                  href={l.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={
                    li === 0
                      ? "inline-flex items-center gap-2 rounded-[var(--md-shape-sm)] bg-on-surface px-6 py-3 text-sm font-normal text-surface transition-opacity hover:opacity-90"
                      : "glass-stroke-sm inline-flex items-center gap-2 rounded-[var(--md-shape-sm)] bg-surface-container/50 px-6 py-3 text-sm font-normal text-on-surface backdrop-blur-md transition-colors"
                  }
                >
                  {l.label}
                  <ArrowUpRight className="w-4 h-4" />
                </a>
              );
            })}
          </div>
        </motion.section>
      );

    case "outcome":
      return (
        <motion.section key={i} {...reveal}>
          <div className={`${card} p-8 sm:p-12`}>
          <h2 className={`${h2Cls} mb-[var(--space-3)]`}>{section.heading}</h2>
            <div className="space-y-4">
              {section.body.map((p, pi) => (
                <p key={pi} className="text-[length:var(--type-0)] leading-[var(--leading-body)] text-on-surface">
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
}: {
  prompts: string[];
  onAsk: (q: string) => void;
  label?: string;
  className?: string;
}) {
  return (
    <motion.div
      initial={reveal.initial}
      whileInView={reveal.whileInView}
      viewport={reveal.viewport}
      transition={reveal.transition}
      className={className}
    >
      {label && <p className={`${eyebrowCls} mb-[var(--space-1)]`}>{label}</p>}
      <div className="flex flex-wrap gap-[var(--space-1)]">
        {prompts.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => onAsk(q)}
            className="glass-stroke-sm group inline-flex items-center gap-[var(--space-1)] rounded-[var(--md-shape-sm)] bg-surface-container/50 px-[var(--space-2)] py-[var(--space-1)] text-[length:var(--type--1)] font-normal text-on-surface backdrop-blur-md transition-colors hover:bg-on-surface hover:text-surface"
          >
            {q}
            <ArrowUpRight className="w-3.5 h-3.5 text-on-surface-variant group-hover:text-surface transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        ))}
      </div>
    </motion.div>
  );
}

export function CaseStudy({ data, onAsk }: { data: CaseStudyData; onAsk?: (q: string) => void }) {
  return (
    <div className="space-y-[var(--space-5)] sm:space-y-[var(--space-7)]">
      {data.sections.map((s, i) => (
        <div key={i}>
          {renderSection(s, i)}
          {/* Questions woven in right where they make sense in the narrative */}
          {onAsk && s.ask && s.ask.length > 0 && <AskRow prompts={s.ask} onAsk={onAsk} className="mt-[var(--space-3)]" />}
        </div>
      ))}

      {/* Outro: loop back into the conversation */}
      {onAsk && data.ask && data.ask.length > 0 && (
        <AskRow prompts={data.ask} onAsk={onAsk} label="Keep exploring" className="border-t border-outline-variant pt-10" />
      )}
    </div>
  );
}
